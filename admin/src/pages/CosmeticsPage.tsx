import { useState, useEffect } from 'react';
import { supabase, isConfigured } from '../lib/supabase';
import { useToast } from '../App';

interface Cosmetic {
  id: string;
  name: string;
  description: string;
  type: string;
  rarity: string;
  price: number;
  country: string;
  icon: string;
  members_only: boolean;
}

const emptyCosmetic: Cosmetic = {
  id: '', name: '', description: '', type: 'hat', rarity: 'common',
  price: 100, country: '', icon: '*', members_only: false,
};

const cosmeticTypes = ['hat', 'outfit', 'accessory', 'backpack', 'shoes', 'companion'];
const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];

const rarityColors: Record<string, string> = {
  common: '#9B8FBB',
  uncommon: '#68D391',
  rare: '#63B3ED',
  epic: '#B794F4',
  legendary: '#FFD700',
};

const demoCosmetcs: Cosmetic[] = [
  { id: 'viking_helmet', name: 'Viking Helmet', description: 'A fearsome Norse helmet', type: 'hat', rarity: 'rare', price: 300, country: 'norway', icon: '^', members_only: false },
  { id: 'samurai_armor', name: 'Samurai Armor', description: 'Traditional Japanese warrior outfit', type: 'outfit', rarity: 'epic', price: 500, country: 'japan', icon: '#', members_only: false },
  { id: 'beret', name: 'French Beret', description: 'A classic Parisian beret', type: 'hat', rarity: 'common', price: 100, country: 'france', icon: 'o', members_only: false },
  { id: 'carnival_mask', name: 'Carnival Mask', description: 'Colorful Brazilian carnival mask', type: 'accessory', rarity: 'uncommon', price: 200, country: 'brazil', icon: '@', members_only: false },
  { id: 'golden_compass', name: 'Golden Compass', description: 'A legendary navigation tool', type: 'accessory', rarity: 'legendary', price: 1000, country: '', icon: '+', members_only: true },
  { id: 'travel_backpack', name: 'Explorer Pack', description: 'Sturdy leather backpack', type: 'backpack', rarity: 'common', price: 150, country: '', icon: 'B', members_only: false },
];

export default function CosmeticsPage() {
  const { showToast } = useToast();
  const [cosmetics, setCosmetics] = useState<Cosmetic[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Cosmetic | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => { loadCosmetics(); }, []);

  async function loadCosmetics() {
    setLoading(true);
    if (!isConfigured) {
      setCosmetics(demoCosmetcs);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.from('cosmetics').select('*').order('type, name');
    if (error) {
      showToast('Failed to load cosmetics', 'error');
      setCosmetics(demoCosmetcs);
    } else {
      const mapped = (data || []).map((d: any) => ({
        id: d.id,
        name: d.name,
        description: d.description || '',
        type: d.type,
        rarity: d.rarity || 'common',
        price: d.unlock_requirement ? parseInt(d.unlock_requirement) || 0 : 0,
        country: '',
        icon: d.image_url || '*',
        members_only: d.is_limited || false,
      }));
      setCosmetics(mapped);
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!editing) return;
    if (!editing.id || !editing.name) { showToast('ID and Name are required', 'error'); return; }

    if (!isConfigured) {
      if (isNew) {
        setCosmetics(prev => [...prev, editing]);
      } else {
        setCosmetics(prev => prev.map(c => c.id === editing.id ? editing : c));
      }
      showToast(isNew ? 'Cosmetic added (local)' : 'Cosmetic updated (local)', 'success');
      setEditing(null);
      return;
    }

    const dbPayload = {
      id: editing.id,
      name: editing.name,
      description: editing.description,
      type: editing.type,
      rarity: editing.rarity,
      unlock_type: 'purchase',
      unlock_requirement: String(editing.price),
      image_url: editing.icon,
      is_limited: editing.members_only,
    };

    if (isNew) {
      const { error } = await supabase.from('cosmetics').insert(dbPayload);
      if (error) { showToast(error.message, 'error'); return; }
      showToast('Cosmetic created', 'success');
    } else {
      const { error } = await supabase.from('cosmetics').update(dbPayload).eq('id', editing.id);
      if (error) { showToast(error.message, 'error'); return; }
      showToast('Cosmetic updated', 'success');
    }
    setEditing(null);
    loadCosmetics();
  }

  async function handleDelete(id: string) {
    if (!isConfigured) {
      setCosmetics(prev => prev.filter(c => c.id !== id));
      showToast('Cosmetic deleted (local)', 'success');
      setConfirmDelete(null);
      return;
    }
    const { error } = await supabase.from('cosmetics').delete().eq('id', id);
    if (error) { showToast(error.message, 'error'); return; }
    showToast('Cosmetic deleted', 'success');
    setConfirmDelete(null);
    loadCosmetics();
  }

  const filtered = cosmetics.filter(c => {
    const matchesType = filterType === 'all' || c.type === filterType;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const grouped = cosmeticTypes.reduce<Record<string, Cosmetic[]>>((acc, type) => {
    const items = filtered.filter(c => c.type === type);
    if (items.length > 0) acc[type] = items;
    return acc;
  }, {});

  if (loading) {
    return <div className="loading-state"><span className="spinner" /> Loading cosmetics...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Cosmetics</h2>
        <p>Manage avatar customization items</p>
      </div>

      <div className="toolbar">
        <input className="search-input" placeholder="Search cosmetics..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          {cosmeticTypes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </select>
        <button className="btn btn-primary" onClick={() => { setEditing({ ...emptyCosmetic }); setIsNew(true); }}>
          + Add Cosmetic
        </button>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{'\u2666'}</div>
          <h3>No cosmetics found</h3>
          <p>Add your first cosmetic item to get started</p>
        </div>
      ) : Object.entries(grouped).map(([type, items]) => (
        <div key={type} style={{ marginBottom: 28 }}>
          <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {type.charAt(0).toUpperCase() + type.slice(1)}s
            <span style={{ fontSize: 11, fontWeight: 400 }}>({items.length})</span>
          </div>
          <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))' }}>
            {items.map(item => (
              <div key={item.id} className="item-card" onClick={() => { setEditing({ ...item }); setIsNew(false); }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <span style={{ fontSize: 28 }}>{item.icon}</span>
                  <span className={`pill pill-${item.rarity}`} style={{ borderLeft: `3px solid ${rarityColors[item.rarity]}` }}>
                    {item.rarity}
                  </span>
                </div>
                <div className="item-name">{item.name}</div>
                <div className="item-meta">{item.description}</div>
                <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--secondary)' }}>{item.price} aura</span>
                  {item.members_only && <span style={{ fontSize: 10, color: 'var(--primary)', fontWeight: 600 }}>MEMBERS</span>}
                </div>
                <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                  <button className="btn btn-secondary btn-small" onClick={e => { e.stopPropagation(); setEditing({ ...item }); setIsNew(false); }}>Edit</button>
                  <button className="btn btn-danger btn-small" onClick={e => { e.stopPropagation(); setConfirmDelete(item.id); }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{isNew ? 'Add Cosmetic' : 'Edit Cosmetic'}</h3>
            <div className="form-row">
              <div className="form-group">
                <label>ID</label>
                <input className="form-input" value={editing.id} onChange={e => setEditing({ ...editing, id: e.target.value })} disabled={!isNew} placeholder="e.g. viking_helmet" />
              </div>
              <div className="form-group">
                <label>Name</label>
                <input className="form-input" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="Display name" />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="form-textarea" value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} placeholder="Item description..." />
            </div>
            <div className="form-row-3">
              <div className="form-group">
                <label>Type</label>
                <select className="form-select" value={editing.type} onChange={e => setEditing({ ...editing, type: e.target.value })}>
                  {cosmeticTypes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Rarity</label>
                <select className="form-select" value={editing.rarity} onChange={e => setEditing({ ...editing, rarity: e.target.value })}>
                  {rarities.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Price (Aura)</label>
                <input className="form-input" type="number" value={editing.price} onChange={e => setEditing({ ...editing, price: Number(e.target.value) })} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Icon</label>
                <input className="form-input" value={editing.icon} onChange={e => setEditing({ ...editing, icon: e.target.value })} placeholder="* or symbol" />
              </div>
              <div className="form-group">
                <label>Country</label>
                <input className="form-input" value={editing.country} onChange={e => setEditing({ ...editing, country: e.target.value })} placeholder="Country ID (optional)" />
              </div>
            </div>
            <div className="form-group">
              <label className="form-checkbox">
                <input type="checkbox" checked={editing.members_only} onChange={e => setEditing({ ...editing, members_only: e.target.checked })} />
                Members Only
              </label>
            </div>

            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center' }}>
              <div className="preview-card" style={{ width: 160, padding: 20 }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>{editing.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: rarityColors[editing.rarity] }}>{editing.name || 'Preview'}</div>
                <div className={`pill pill-${editing.rarity}`} style={{ marginTop: 6 }}>{editing.rarity}</div>
              </div>
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
            <h4>Delete Cosmetic</h4>
            <p>Are you sure you want to delete this cosmetic item?</p>
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
