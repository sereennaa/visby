import { useState, useEffect } from 'react';
import { supabase, isConfigured } from '../lib/supabase';
import { useToast } from '../App';

interface Country {
  id: string;
  name: string;
  country_code: string;
  flag_emoji: string;
  visit_cost_aura: number;
  house_price_aura: number;
  description: string;
  room_theme: string;
  accent_color: string;
  image_url: string;
}

const emptyCountry: Country = {
  id: '', name: '', country_code: '', flag_emoji: '', visit_cost_aura: 100,
  house_price_aura: 500, description: '', room_theme: 'default',
  accent_color: '#B794F4', image_url: '',
};

const demoCountries: Country[] = [
  { id: 'japan', name: 'Japan', country_code: 'JP', flag_emoji: 'JP', visit_cost_aura: 100, house_price_aura: 500, description: 'Land of the rising sun', room_theme: 'zen', accent_color: '#E53E3E', image_url: '' },
  { id: 'france', name: 'France', country_code: 'FR', flag_emoji: 'FR', visit_cost_aura: 100, house_price_aura: 500, description: 'City of lights', room_theme: 'parisian', accent_color: '#3182CE', image_url: '' },
  { id: 'brazil', name: 'Brazil', country_code: 'BR', flag_emoji: 'BR', visit_cost_aura: 120, house_price_aura: 600, description: 'Tropical paradise', room_theme: 'tropical', accent_color: '#38A169', image_url: '' },
];

const roomThemes = ['default', 'zen', 'parisian', 'tropical', 'desert', 'arctic', 'medieval', 'futuristic', 'cozy', 'underwater'];

export default function CountriesPage() {
  const { showToast } = useToast();
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Country | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => { loadCountries(); }, []);

  async function loadCountries() {
    setLoading(true);
    if (!isConfigured) {
      setCountries(demoCountries);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.from('countries').select('*').order('name');
    if (error) {
      showToast('Failed to load countries', 'error');
      setCountries(demoCountries);
    } else {
      setCountries(data || []);
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!editing) return;
    if (!editing.id || !editing.name || !editing.country_code) {
      showToast('ID, Name, and Country Code are required', 'error');
      return;
    }

    if (!isConfigured) {
      if (isNew) {
        setCountries(prev => [...prev, editing]);
      } else {
        setCountries(prev => prev.map(c => c.id === editing.id ? editing : c));
      }
      showToast(isNew ? 'Country added (local)' : 'Country updated (local)', 'success');
      setEditing(null);
      return;
    }

    if (isNew) {
      const { error } = await supabase.from('countries').insert(editing);
      if (error) { showToast(error.message, 'error'); return; }
      showToast('Country created', 'success');
    } else {
      const { error } = await supabase.from('countries').update(editing).eq('id', editing.id);
      if (error) { showToast(error.message, 'error'); return; }
      showToast('Country updated', 'success');
    }
    setEditing(null);
    loadCountries();
  }

  async function handleDelete(id: string) {
    if (!isConfigured) {
      setCountries(prev => prev.filter(c => c.id !== id));
      showToast('Country deleted (local)', 'success');
      setConfirmDelete(null);
      return;
    }
    const { error } = await supabase.from('countries').delete().eq('id', id);
    if (error) { showToast(error.message, 'error'); return; }
    showToast('Country deleted', 'success');
    setConfirmDelete(null);
    loadCountries();
  }

  const filtered = countries.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.country_code.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="loading-state"><span className="spinner" /> Loading countries...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Countries</h2>
        <p>Manage countries that players can visit and buy houses in</p>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          placeholder="Search countries..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="btn btn-primary" onClick={() => { setEditing({ ...emptyCountry }); setIsNew(true); }}>
          + Add Country
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Code</th>
              <th>Flag</th>
              <th>Visit Cost</th>
              <th>House Price</th>
              <th>Theme</th>
              <th>Color</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={9} style={{ textAlign: 'center', color: 'var(--muted)', padding: 40 }}>No countries found</td></tr>
            ) : filtered.map(country => (
              <tr key={country.id}>
                <td><code style={{ fontSize: 12, color: 'var(--muted)' }}>{country.id}</code></td>
                <td style={{ fontWeight: 600 }}>{country.name}</td>
                <td>{country.country_code}</td>
                <td>{country.flag_emoji}</td>
                <td>{country.visit_cost_aura}</td>
                <td>{country.house_price_aura}</td>
                <td><span className="pill pill-common">{country.room_theme}</span></td>
                <td><span className="color-swatch" style={{ background: country.accent_color }} /></td>
                <td>
                  <div className="btn-group">
                    <button className="btn btn-secondary btn-small" onClick={() => { setEditing({ ...country }); setIsNew(false); }}>Edit</button>
                    <button className="btn btn-danger btn-small" onClick={() => setConfirmDelete(country.id)}>Delete</button>
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
            <h3>{isNew ? 'Add Country' : 'Edit Country'}</h3>
            <div className="form-row">
              <div className="form-group">
                <label>ID</label>
                <input className="form-input" value={editing.id} onChange={e => setEditing({ ...editing, id: e.target.value })} disabled={!isNew} placeholder="e.g. japan" />
              </div>
              <div className="form-group">
                <label>Name</label>
                <input className="form-input" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="e.g. Japan" />
              </div>
            </div>
            <div className="form-row-3">
              <div className="form-group">
                <label>Country Code</label>
                <input className="form-input" value={editing.country_code} onChange={e => setEditing({ ...editing, country_code: e.target.value.toUpperCase() })} placeholder="JP" maxLength={2} />
              </div>
              <div className="form-group">
                <label>Flag</label>
                <input className="form-input" value={editing.flag_emoji} onChange={e => setEditing({ ...editing, flag_emoji: e.target.value })} placeholder="JP" />
              </div>
              <div className="form-group">
                <label>Accent Color</label>
                <input type="color" value={editing.accent_color} onChange={e => setEditing({ ...editing, accent_color: e.target.value })} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Visit Cost (Aura)</label>
                <input className="form-input" type="number" value={editing.visit_cost_aura} onChange={e => setEditing({ ...editing, visit_cost_aura: Number(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>House Price (Aura)</label>
                <input className="form-input" type="number" value={editing.house_price_aura} onChange={e => setEditing({ ...editing, house_price_aura: Number(e.target.value) })} />
              </div>
            </div>
            <div className="form-group">
              <label>Room Theme</label>
              <select className="form-select" value={editing.room_theme} onChange={e => setEditing({ ...editing, room_theme: e.target.value })}>
                {roomThemes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="form-textarea" value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} placeholder="Brief description of this country..." />
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
            <h4>Delete Country</h4>
            <p>Are you sure you want to delete this country? This action cannot be undone.</p>
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
