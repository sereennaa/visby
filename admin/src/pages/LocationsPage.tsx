import { useState, useEffect } from 'react';
import { supabase, isConfigured } from '../lib/supabase';
import { useToast } from '../App';

interface Location {
  id: string;
  name: string;
  type: string;
  description: string;
  distance_km: number;
  latitude: number;
  longitude: number;
  image_url: string;
}

const emptyLocation: Location = {
  id: '', name: '', type: 'city', description: '', distance_km: 0,
  latitude: 0, longitude: 0, image_url: '',
};

const locationTypes = ['city', 'landmark', 'park', 'beach', 'museum', 'market', 'temple', 'mountain', 'restaurant'];

const demoLocations: Location[] = [
  { id: '1', name: 'Tokyo Tower', type: 'landmark', description: 'Iconic communications tower in Tokyo', distance_km: 0, latitude: 35.6586, longitude: 139.7454, image_url: '' },
  { id: '2', name: 'Shibuya Crossing', type: 'landmark', description: 'Famous pedestrian scramble crossing', distance_km: 2.5, latitude: 35.6595, longitude: 139.7004, image_url: '' },
  { id: '3', name: 'Ueno Park', type: 'park', description: 'Large public park with museums and a zoo', distance_km: 5.1, latitude: 35.7146, longitude: 139.7734, image_url: '' },
  { id: '4', name: 'Eiffel Tower', type: 'landmark', description: 'Iron lattice tower on the Champ de Mars', distance_km: 0, latitude: 48.8584, longitude: 2.2945, image_url: '' },
  { id: '5', name: 'Copacabana Beach', type: 'beach', description: 'Famous beach in Rio de Janeiro', distance_km: 0, latitude: -22.9711, longitude: -43.1863, image_url: '' },
];

export default function LocationsPage() {
  const { showToast } = useToast();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Location | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

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

  const filtered = locations.filter(l => {
    const matchesType = filterType === 'all' || l.type === filterType;
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
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
        <select className="filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          {locationTypes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </select>
        <button className="btn btn-primary" onClick={() => { setEditing({ ...emptyLocation }); setIsNew(true); }}>
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
              <th>Type</th>
              <th>Description</th>
              <th>Distance</th>
              <th>Coordinates</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>No locations found</td></tr>
            ) : filtered.map(loc => (
              <tr key={loc.id}>
                <td style={{ fontWeight: 600 }}>{loc.name}</td>
                <td><span className={`pill ${loc.type === 'landmark' ? 'pill-legendary' : loc.type === 'park' ? 'pill-uncommon' : loc.type === 'beach' ? 'pill-rare' : 'pill-common'}`}>{loc.type}</span></td>
                <td style={{ color: 'var(--muted)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{loc.description}</td>
                <td>{loc.distance_km} km</td>
                <td style={{ fontSize: 12, color: 'var(--muted)' }}>{loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}</td>
                <td>
                  <div className="btn-group">
                    <button className="btn btn-secondary btn-small" onClick={() => { setEditing({ ...loc }); setIsNew(false); }}>Edit</button>
                    <button className="btn btn-danger btn-small" onClick={() => setConfirmDelete(loc.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{isNew ? 'Add Location' : 'Edit Location'}</h3>
            <div className="form-group">
              <label>Name</label>
              <input className="form-input" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="Location name" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Type</label>
                <select className="form-select" value={editing.type} onChange={e => setEditing({ ...editing, type: e.target.value })}>
                  {locationTypes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
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
            <div className="form-group">
              <label>Image URL</label>
              <input className="form-input" value={editing.image_url} onChange={e => setEditing({ ...editing, image_url: e.target.value })} placeholder="https://..." />
            </div>
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
