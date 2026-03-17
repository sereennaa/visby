import { useState, useEffect } from 'react';
import { supabase, isConfigured } from '../lib/supabase';
import { useToast } from '../App';
import { ImageUpload } from '../components/ImageUpload';
import { analyzeLocationImage, isAIConfigured, type LocationAnalysis } from '../lib/ai';

interface Location {
  id: string;
  name: string;
  type: string;
  description: string;
  distance_km: number;
  latitude: number;
  longitude: number;
  image_url: string;
  country_id: string;
  category: string;
  learning_points: number;
}

const emptyLocation: Location = {
  id: '', name: '', type: 'city', description: '', distance_km: 0,
  latitude: 0, longitude: 0, image_url: '', country_id: '', category: 'landmark', learning_points: 10,
};

const locationTypes = ['city', 'landmark', 'park', 'beach', 'museum', 'market', 'temple', 'mountain', 'restaurant'];
const locationCategories = ['landmark', 'food', 'nature', 'culture', 'hidden_gem'];

const COUNTRY_OPTIONS = [
  { id: '', label: 'No country' },
  { id: 'jp', label: 'Japan' },
  { id: 'fr', label: 'France' },
  { id: 'mx', label: 'Mexico' },
  { id: 'it', label: 'Italy' },
  { id: 'gb', label: 'United Kingdom' },
  { id: 'br', label: 'Brazil' },
  { id: 'kr', label: 'South Korea' },
  { id: 'th', label: 'Thailand' },
  { id: 'ma', label: 'Morocco' },
  { id: 'pe', label: 'Peru' },
  { id: 'ke', label: 'Kenya' },
  { id: 'no', label: 'Norway' },
  { id: 'tr', label: 'Turkey' },
  { id: 'gr', label: 'Greece' },
];

const demoLocations: Location[] = [
  { id: '1', name: 'Tokyo Tower', type: 'landmark', description: 'Iconic communications tower in Tokyo', distance_km: 0, latitude: 35.6586, longitude: 139.7454, image_url: '', country_id: 'jp', category: 'landmark', learning_points: 10 },
  { id: '2', name: 'Shibuya Crossing', type: 'landmark', description: 'Famous pedestrian scramble crossing', distance_km: 2.5, latitude: 35.6595, longitude: 139.7004, image_url: '', country_id: 'jp', category: 'culture', learning_points: 8 },
  { id: '3', name: 'Ueno Park', type: 'park', description: 'Large public park with museums and a zoo', distance_km: 5.1, latitude: 35.7146, longitude: 139.7734, image_url: '', country_id: 'jp', category: 'nature', learning_points: 8 },
  { id: '4', name: 'Eiffel Tower', type: 'landmark', description: 'Iron lattice tower on the Champ de Mars', distance_km: 0, latitude: 48.8584, longitude: 2.2945, image_url: '', country_id: 'fr', category: 'landmark', learning_points: 10 },
  { id: '5', name: 'Copacabana Beach', type: 'beach', description: 'Famous beach in Rio de Janeiro', distance_km: 0, latitude: -22.9711, longitude: -43.1863, image_url: '', country_id: 'br', category: 'nature', learning_points: 8 },
];

export default function LocationsPage() {
  const { showToast } = useToast();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Location | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [filterCountry, setFilterCountry] = useState('all');
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<LocationAnalysis | null>(null);

  useEffect(() => { loadLocations(); }, []);

  async function loadLocations() {
    setLoading(true);
    if (!isConfigured) {
      setLocations(demoLocations);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.from('locations').select('*').order('name');
    if (error) {
      showToast('Failed to load locations', 'error');
      setLocations(demoLocations);
    } else {
      setLocations(data || []);
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!editing) return;
    if (!editing.name) { showToast('Name is required', 'error'); return; }

    if (!isConfigured) {
      if (isNew) {
        setLocations(prev => [...prev, { ...editing, id: String(Date.now()) }]);
      } else {
        setLocations(prev => prev.map(l => l.id === editing.id ? editing : l));
      }
      showToast(isNew ? 'Location added (local)' : 'Location updated (local)', 'success');
      setEditing(null);
      return;
    }

    if (isNew) {
      const { id: _, ...rest } = editing;
      const { error } = await supabase.from('locations').insert(rest);
      if (error) { showToast(error.message, 'error'); return; }
      showToast('Location created', 'success');
    } else {
      const { error } = await supabase.from('locations').update(editing).eq('id', editing.id);
      if (error) { showToast(error.message, 'error'); return; }
      showToast('Location updated', 'success');
    }
    setEditing(null);
    loadLocations();
  }

  async function handleDelete(id: string) {
    if (!isConfigured) {
      setLocations(prev => prev.filter(l => l.id !== id));
      showToast('Location deleted (local)', 'success');
      setConfirmDelete(null);
      return;
    }
    const { error } = await supabase.from('locations').delete().eq('id', id);
    if (error) { showToast(error.message, 'error'); return; }
    showToast('Location deleted', 'success');
    setConfirmDelete(null);
    loadLocations();
  }

  async function handleAnalyze() {
    if (!editing?.image_url) return;
    setAnalyzing(true);
    setAiResult(null);
    try {
      const result = await analyzeLocationImage(editing.image_url);
      setAiResult(result);
      showToast('AI analysis complete', 'success');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'AI analysis failed';
      showToast(message, 'error');
    } finally {
      setAnalyzing(false);
    }
  }

  const ALL_AI_FIELDS: (keyof LocationAnalysis)[] = ['name', 'description', 'latitude', 'longitude', 'country_id', 'category', 'type', 'learning_points'];

  function applyAiResult(fields?: (keyof LocationAnalysis)[], onlyEmpty = false) {
    if (!editing || !aiResult) return;
    const applyFields = fields || ALL_AI_FIELDS;
    const updates: Partial<Location> = {};
    for (const field of applyFields) {
      if (field === 'confidence' || field === 'country_name') continue;
      if (onlyEmpty) {
        const current = editing[field as keyof Location];
        const isEmpty = current === '' || current === 0 || current === emptyLocation[field as keyof Location];
        if (!isEmpty) continue;
      }
      (updates as Record<string, unknown>)[field] = aiResult[field];
    }
    if (Object.keys(updates).length === 0) {
      showToast('All fields already have values', 'success');
      return;
    }
    setEditing({ ...editing, ...updates });
    setAiResult(null);
    showToast('AI suggestions applied', 'success');
  }

  const filtered = locations.filter(l => {
    const matchesType = filterType === 'all' || l.type === filterType;
    const matchesCountry = filterCountry === 'all' || l.country_id === filterCountry;
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesCountry && matchesSearch;
  });

  const mapBounds = {
    minLat: Math.min(...filtered.map(l => l.latitude), 0),
    maxLat: Math.max(...filtered.map(l => l.latitude), 0),
    minLng: Math.min(...filtered.map(l => l.longitude), 0),
    maxLng: Math.max(...filtered.map(l => l.longitude), 0),
  };
  const latRange = mapBounds.maxLat - mapBounds.minLat || 1;
  const lngRange = mapBounds.maxLng - mapBounds.minLng || 1;

  if (loading) {
    return <div className="loading-state"><span className="spinner" /> Loading locations...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Locations</h2>
        <p>Manage real-world locations for stamps and exploration</p>
      </div>

      <div className="toolbar">
        <input className="search-input" placeholder="Search locations..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="filter-select" value={filterCountry} onChange={e => setFilterCountry(e.target.value)}>
          <option value="all">All Countries</option>
          {COUNTRY_OPTIONS.filter(c => c.id).map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <select className="filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          {locationTypes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </select>
        <button className="btn btn-primary" onClick={() => { setEditing({ ...emptyLocation }); setIsNew(true); setAiResult(null); }}>
          + Add Location
        </button>
      </div>

      {filtered.length > 0 && (
        <div className="card" style={{ marginBottom: 20, padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontSize: 13, color: 'var(--muted)', fontWeight: 600 }}>
            Map Preview ({filtered.length} locations)
          </div>
          <div style={{ position: 'relative', height: 250, background: 'var(--bg)' }}>
            {filtered.map(loc => {
              const x = ((loc.longitude - mapBounds.minLng) / lngRange) * 80 + 10;
              const y = 90 - ((loc.latitude - mapBounds.minLat) / latRange) * 80;
              return (
                <div
                  key={loc.id}
                  style={{
                    position: 'absolute',
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                  }}
                  title={`${loc.name} (${loc.latitude}, ${loc.longitude})`}
                >
                  <div style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: loc.type === 'landmark' ? 'var(--secondary)' : loc.type === 'park' ? 'var(--success)' : loc.type === 'beach' ? '#63B3ED' : 'var(--primary)',
                    border: '2px solid var(--text)',
                  }} />
                  <span style={{ fontSize: 9, color: 'var(--muted)', whiteSpace: 'nowrap' }}>{loc.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Country</th>
              <th>Category</th>
              <th>Type</th>
              <th>LP</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>No locations found</td></tr>
            ) : filtered.map(loc => (
              <tr key={loc.id}>
                <td style={{ fontWeight: 600 }}>{loc.name}</td>
                <td>{COUNTRY_OPTIONS.find(c => c.id === loc.country_id)?.label || '-'}</td>
                <td><span className="pill pill-rare">{loc.category || loc.type}</span></td>
                <td><span className={`pill ${loc.type === 'landmark' ? 'pill-legendary' : loc.type === 'park' ? 'pill-uncommon' : loc.type === 'beach' ? 'pill-rare' : 'pill-common'}`}>{loc.type}</span></td>
                <td style={{ textAlign: 'center' }}>{loc.learning_points || 0}</td>
                <td style={{ color: 'var(--muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{loc.description}</td>
                <td>
                  <div className="btn-group">
                    <button className="btn btn-secondary btn-small" onClick={() => { setEditing({ ...loc }); setIsNew(false); setAiResult(null); }}>Edit</button>
                    <button className="btn btn-danger btn-small" onClick={() => setConfirmDelete(loc.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="modal-overlay" onClick={() => { setEditing(null); setAiResult(null); }}>
          <div className="modal modal-wide" onClick={e => e.stopPropagation()}>
            <h3>{isNew ? 'Add Location' : 'Edit Location'}</h3>
            <div className="form-group">
              <label>Name</label>
              <input className="form-input" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="Location name" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Country</label>
                <select className="form-select" value={editing.country_id} onChange={e => setEditing({ ...editing, country_id: e.target.value })}>
                  {COUNTRY_OPTIONS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Category (for learning)</label>
                <select className="form-select" value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })}>
                  {locationCategories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1).replace('_', ' ')}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Type</label>
                <select className="form-select" value={editing.type} onChange={e => setEditing({ ...editing, type: e.target.value })}>
                  {locationTypes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Learning Points</label>
                <input className="form-input" type="number" value={editing.learning_points} onChange={e => setEditing({ ...editing, learning_points: Number(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>Distance (km)</label>
                <input className="form-input" type="number" step="0.1" value={editing.distance_km} onChange={e => setEditing({ ...editing, distance_km: Number(e.target.value) })} />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="form-textarea" value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} placeholder="Brief description..." />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Latitude</label>
                <input className="form-input" type="number" step="0.0001" value={editing.latitude} onChange={e => setEditing({ ...editing, latitude: Number(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>Longitude</label>
                <input className="form-input" type="number" step="0.0001" value={editing.longitude} onChange={e => setEditing({ ...editing, longitude: Number(e.target.value) })} />
              </div>
            </div>
            <ImageUpload
              value={editing.image_url || ''}
              onChange={(url) => { setEditing({ ...editing, image_url: url }); setAiResult(null); }}
              label="Location Photo"
            />
            {editing.image_url && isAIConfigured && (
              <button
                className="btn btn-ai"
                onClick={handleAnalyze}
                disabled={analyzing}
                style={{ marginBottom: 16, width: '100%' }}
              >
                {analyzing ? (
                  <><span className="spinner spinner-small" /> Analyzing image...</>
                ) : (
                  <><span className="ai-sparkle">&#10024;</span> Analyze with AI</>
                )}
              </button>
            )}
            {editing.image_url && !isAIConfigured && (
              <div className="ai-unconfigured">
                Add <code>VITE_OPENAI_API_KEY</code> to your .env to enable AI image analysis
              </div>
            )}
            {aiResult && (
              <div className="ai-result-card">
                <div className="ai-result-header">
                  <span className="ai-result-title">AI Analysis</span>
                  <span className={`ai-confidence ai-confidence-${aiResult.confidence}`}>
                    {aiResult.confidence} confidence
                  </span>
                </div>
                {aiResult.confidence === 'low' && (
                  <div className="ai-warning">
                    Low confidence -- please verify the details below before applying.
                  </div>
                )}
                <div className="ai-result-fields">
                  <div className="ai-field">
                    <span className="ai-field-label">Name</span>
                    <span className="ai-field-value">{aiResult.name}</span>
                    <button className="btn btn-secondary btn-small" onClick={() => applyAiResult(['name'])}>Use</button>
                  </div>
                  <div className="ai-field">
                    <span className="ai-field-label">Country</span>
                    <span className="ai-field-value">{aiResult.country_name}{aiResult.country_id ? ` (${aiResult.country_id})` : ''}</span>
                    <button className="btn btn-secondary btn-small" onClick={() => applyAiResult(['country_id'])}>Use</button>
                  </div>
                  <div className="ai-field">
                    <span className="ai-field-label">Coords</span>
                    <span className="ai-field-value">{aiResult.latitude.toFixed(4)}, {aiResult.longitude.toFixed(4)}</span>
                    <button className="btn btn-secondary btn-small" onClick={() => applyAiResult(['latitude', 'longitude'])}>Use</button>
                  </div>
                  <div className="ai-field">
                    <span className="ai-field-label">Category</span>
                    <span className="ai-field-value"><span className="pill pill-rare">{aiResult.category}</span></span>
                    <button className="btn btn-secondary btn-small" onClick={() => applyAiResult(['category'])}>Use</button>
                  </div>
                  <div className="ai-field">
                    <span className="ai-field-label">Type</span>
                    <span className="ai-field-value"><span className="pill pill-common">{aiResult.type}</span></span>
                    <button className="btn btn-secondary btn-small" onClick={() => applyAiResult(['type'])}>Use</button>
                  </div>
                  <div className="ai-field">
                    <span className="ai-field-label">LP</span>
                    <span className="ai-field-value">{aiResult.learning_points} pts</span>
                    <button className="btn btn-secondary btn-small" onClick={() => applyAiResult(['learning_points'])}>Use</button>
                  </div>
                  <div className="ai-field ai-field-description">
                    <span className="ai-field-label">Caption</span>
                    <span className="ai-field-value">{aiResult.description}</span>
                    <button className="btn btn-secondary btn-small" onClick={() => applyAiResult(['description'])}>Use</button>
                  </div>
                </div>
                <div className="ai-result-actions">
                  <button className="btn btn-primary" onClick={() => applyAiResult()}>Apply All</button>
                  <button className="btn btn-secondary" onClick={() => applyAiResult(undefined, true)}>Apply Empty Fields</button>
                  <button className="btn btn-secondary" onClick={() => setAiResult(null)}>Dismiss</button>
                </div>
              </div>
            )}
            <div className="form-actions">
              <button className="btn btn-primary" onClick={handleSave}>{isNew ? 'Create' : 'Save Changes'}</button>
              <button className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="confirm-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="confirm-dialog" onClick={e => e.stopPropagation()}>
            <h4>Delete Location</h4>
            <p>Are you sure you want to delete this location?</p>
            <div className="btn-group">
              <button className="btn btn-danger" onClick={() => handleDelete(confirmDelete)}>Delete</button>
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
