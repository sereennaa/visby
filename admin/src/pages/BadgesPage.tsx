import { useState, useEffect } from 'react';
import { supabase, isConfigured } from '../lib/supabase';
import { useToast } from '../App';

interface Badge {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  color: string;
  rarity: string;
  requirement_type: string;
  requirement_target: number;
  requirement_description: string;
  aura_reward: number;
  is_secret: boolean;
}

const emptyBadge: Badge = {
  id: '', name: '', description: '', category: 'explorer', icon: '*',
  color: '#B794F4', rarity: 'common', requirement_type: 'stamp_count',
  requirement_target: 10, requirement_description: '', aura_reward: 50, is_secret: false,
};

const badgeCategories = ['explorer', 'foodie', 'collector', 'learner', 'social', 'special'];
const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
const requirementTypes = ['stamp_count', 'bite_count', 'badge_count', 'lesson_complete', 'country_visit', 'streak_days', 'level_reach', 'aura_total', 'custom'];

const rarityColors: Record<string, string> = {
  common: '#9B8FBB',
  uncommon: '#68D391',
  rare: '#63B3ED',
  epic: '#B794F4',
  legendary: '#FFD700',
};

const demoBadges: Badge[] = [
  { id: 'first_stamp', name: 'First Steps', description: 'Collect your first stamp', category: 'explorer', icon: '*', color: '#48BB78', rarity: 'common', requirement_type: 'stamp_count', requirement_target: 1, requirement_description: 'Collect 1 stamp', aura_reward: 25, is_secret: false },
  { id: 'globe_trotter', name: 'Globe Trotter', description: 'Visit 5 different countries', category: 'explorer', icon: '+', color: '#4299E1', rarity: 'rare', requirement_type: 'country_visit', requirement_target: 5, requirement_description: 'Visit 5 countries', aura_reward: 200, is_secret: false },
  { id: 'foodie_10', name: 'Taste Tester', description: 'Collect 10 bites', category: 'foodie', icon: '#', color: '#ED8936', rarity: 'uncommon', requirement_type: 'bite_count', requirement_target: 10, requirement_description: 'Collect 10 food bites', aura_reward: 100, is_secret: false },
  { id: 'bookworm', name: 'Bookworm', description: 'Complete 10 lessons', category: 'learner', icon: '=', color: '#9F7AEA', rarity: 'uncommon', requirement_type: 'lesson_complete', requirement_target: 10, requirement_description: 'Complete 10 lessons', aura_reward: 150, is_secret: false },
  { id: 'streak_7', name: 'Week Warrior', description: 'Maintain a 7-day streak', category: 'special', icon: '!', color: '#F56565', rarity: 'rare', requirement_type: 'streak_days', requirement_target: 7, requirement_description: '7-day login streak', aura_reward: 200, is_secret: false },
  { id: 'hidden_gem', name: 'Hidden Gem', description: '???', category: 'special', icon: '?', color: '#FFD700', rarity: 'legendary', requirement_type: 'custom', requirement_target: 1, requirement_description: 'Find the secret location', aura_reward: 500, is_secret: true },
];

export default function BadgesPage() {
  const { showToast } = useToast();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Badge | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => { loadBadges(); }, []);

  async function loadBadges() {
    setLoading(true);
    if (!isConfigured) {
      setBadges(demoBadges);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.from('badges').select('*').order('category, name');
    if (error) {
      showToast('Failed to load badges', 'error');
      setBadges(demoBadges);
    } else {
      const mapped = (data || []).map((d: any) => ({
        id: d.id,
        name: d.name,
        description: d.description,
        category: d.category,
        icon: d.icon_emoji || '*',
        color: d.color || '#B794F4',
        rarity: d.rarity || 'common',
        requirement_type: d.requirement?.type || 'custom',
        requirement_target: d.requirement?.target || 0,
        requirement_description: d.requirement?.description || '',
        aura_reward: d.aura_reward || 0,
        is_secret: d.is_secret || false,
      }));
      setBadges(mapped);
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!editing) return;
    if (!editing.id || !editing.name) { showToast('ID and Name are required', 'error'); return; }

    if (!isConfigured) {
      if (isNew) {
        setBadges(prev => [...prev, editing]);
      } else {
        setBadges(prev => prev.map(b => b.id === editing.id ? editing : b));
      }
      showToast(isNew ? 'Badge added (local)' : 'Badge updated (local)', 'success');
      setEditing(null);
      return;
    }

    const dbPayload = {
      id: editing.id,
      name: editing.name,
      description: editing.description,
      category: editing.category,
      icon_emoji: editing.icon,
      color: editing.color,
      rarity: editing.rarity,
      requirement: {
        type: editing.requirement_type,
        target: editing.requirement_target,
        description: editing.requirement_description,
      },
      aura_reward: editing.aura_reward,
      is_secret: editing.is_secret,
    };

    if (isNew) {
      const { error } = await supabase.from('badges').insert(dbPayload);
      if (error) { showToast(error.message, 'error'); return; }
      showToast('Badge created', 'success');
    } else {
      const { error } = await supabase.from('badges').update(dbPayload).eq('id', editing.id);
      if (error) { showToast(error.message, 'error'); return; }
      showToast('Badge updated', 'success');
    }
    setEditing(null);
    loadBadges();
  }

  async function handleDelete(id: string) {
    if (!isConfigured) {
      setBadges(prev => prev.filter(b => b.id !== id));
      showToast('Badge deleted (local)', 'success');
      setConfirmDelete(null);
      return;
    }
    const { error } = await supabase.from('badges').delete().eq('id', id);
    if (error) { showToast(error.message, 'error'); return; }
    showToast('Badge deleted', 'success');
    setConfirmDelete(null);
    loadBadges();
  }

  const filtered = badges.filter(b => {
    const matchesCategory = filterCategory === 'all' || b.category === filterCategory;
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase()) || b.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <div className="loading-state"><span className="spinner" /> Loading badges...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Badges</h2>
        <p>Manage achievement badges and their unlock requirements</p>
      </div>

      <div className="toolbar">
        <input className="search-input" placeholder="Search badges..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="filter-select" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {badgeCategories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
        <button className="btn btn-primary" onClick={() => { setEditing({ ...emptyBadge }); setIsNew(true); }}>
          + Add Badge
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{'\u2605'}</div>
          <h3>No badges found</h3>
          <p>Create your first badge to get started</p>
        </div>
      ) : (
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {filtered.map(badge => (
            <div key={badge.id} className="item-card" onClick={() => { setEditing({ ...badge }); setIsNew(false); }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: `${badge.color}22`,
                  border: `2px solid ${badge.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 22,
                  flexShrink: 0,
                }}>
                  {badge.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <span className="item-name" style={{ margin: 0 }}>{badge.name}</span>
                    {badge.is_secret && <span style={{ fontSize: 10, color: 'var(--secondary)', fontWeight: 700 }}>SECRET</span>}
                  </div>
                  <div className="item-meta" style={{ lineHeight: 1.4 }}>{badge.is_secret ? '???' : badge.description}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                <span className={`pill pill-${badge.rarity}`}>{badge.rarity}</span>
                <span className="pill pill-common">{badge.category}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>
                <span>{badge.requirement_description || `${badge.requirement_type}: ${badge.requirement_target}`}</span>
                <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>+{badge.aura_reward} aura</span>
              </div>

              <div style={{ display: 'flex', gap: 6 }}>
                <button className="btn btn-secondary btn-small" onClick={e => { e.stopPropagation(); setEditing({ ...badge }); setIsNew(false); }}>Edit</button>
                <button className="btn btn-danger btn-small" onClick={e => { e.stopPropagation(); setConfirmDelete(badge.id); }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal modal-wide" onClick={e => e.stopPropagation()}>
            <h3>{isNew ? 'Add Badge' : 'Edit Badge'}</h3>

            <div style={{ display: 'flex', gap: 24 }}>
              <div style={{ flex: 1 }}>
                <div className="form-row">
                  <div className="form-group">
                    <label>ID</label>
                    <input className="form-input" value={editing.id} onChange={e => setEditing({ ...editing, id: e.target.value })} disabled={!isNew} placeholder="e.g. first_stamp" />
                  </div>
                  <div className="form-group">
                    <label>Name</label>
                    <input className="form-input" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="Badge name" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea className="form-textarea" value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} placeholder="What the player achieves..." />
                </div>
                <div className="form-row-3">
                  <div className="form-group">
                    <label>Category</label>
                    <select className="form-select" value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })}>
                      {badgeCategories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Rarity</label>
                    <select className="form-select" value={editing.rarity} onChange={e => setEditing({ ...editing, rarity: e.target.value })}>
                      {rarities.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Aura Reward</label>
                    <input className="form-input" type="number" value={editing.aura_reward} onChange={e => setEditing({ ...editing, aura_reward: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="form-row-3">
                  <div className="form-group">
                    <label>Icon</label>
                    <input className="form-input" value={editing.icon} onChange={e => setEditing({ ...editing, icon: e.target.value })} placeholder="* or symbol" />
                  </div>
                  <div className="form-group">
                    <label>Color</label>
                    <input type="color" value={editing.color} onChange={e => setEditing({ ...editing, color: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-checkbox" style={{ marginTop: 22 }}>
                      <input type="checkbox" checked={editing.is_secret} onChange={e => setEditing({ ...editing, is_secret: e.target.checked })} />
                      Secret Badge
                    </label>
                  </div>
                </div>

                <div className="section-title">Requirement</div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Type</label>
                    <select className="form-select" value={editing.requirement_type} onChange={e => setEditing({ ...editing, requirement_type: e.target.value })}>
                      {requirementTypes.map(r => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Target</label>
                    <input className="form-input" type="number" value={editing.requirement_target} onChange={e => setEditing({ ...editing, requirement_target: Number(e.target.value) })} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Requirement Description</label>
                  <input className="form-input" value={editing.requirement_description} onChange={e => setEditing({ ...editing, requirement_description: e.target.value })} placeholder="e.g. Collect 10 stamps" />
                </div>
              </div>

              <div style={{ width: 180, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 20 }}>
                <div className="section-title" style={{ marginTop: 0 }}>Preview</div>
                <div className="preview-card" style={{ width: '100%', padding: 20 }}>
                  <div style={{
                    width: 64,
                    height: 64,
                    borderRadius: 16,
                    background: `${editing.color}22`,
                    border: `3px solid ${editing.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    margin: '0 auto 12px',
                  }}>
                    {editing.icon}
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{editing.name || 'Badge Name'}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>
                    {editing.is_secret ? '???' : (editing.description || 'Description')}
                  </div>
                  <span className={`pill pill-${editing.rarity}`}>{editing.rarity}</span>
                  <div style={{ marginTop: 8, fontSize: 12, color: 'var(--secondary)', fontWeight: 600 }}>+{editing.aura_reward} aura</div>
                </div>
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
            <h4>Delete Badge</h4>
            <p>Are you sure you want to delete this badge?</p>
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
