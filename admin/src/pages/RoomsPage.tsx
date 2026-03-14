import { useState, useEffect } from 'react';
import { supabase, isConfigured } from '../lib/supabase';
import { useToast } from '../App';

interface RoomObject {
  id: string;
  label: string;
  icon: string;
  x: number;
  y: number;
  interactive: boolean;
  learn_content: string;
}

interface Room {
  id: string;
  country_id: string;
  name: string;
  icon: string;
  wall_color: string;
  floor_color: string;
  objects: RoomObject[];
}

interface Country {
  id: string;
  name: string;
}

const emptyRoom: Room = {
  id: '', country_id: '', name: '', icon: '*', wall_color: '#2D3748', floor_color: '#4A5568', objects: [],
};

const emptyObject: RoomObject = {
  id: '', label: '', icon: '*', x: 50, y: 50, interactive: false, learn_content: '',
};

const demoCountries: Country[] = [
  { id: 'japan', name: 'Japan' },
  { id: 'france', name: 'France' },
  { id: 'brazil', name: 'Brazil' },
];

const demoRooms: Room[] = [
  {
    id: '1', country_id: 'japan', name: 'Tea Room', icon: '#', wall_color: '#4A3728', floor_color: '#8B7355',
    objects: [
      { id: 'o1', label: 'Tea Set', icon: '#', x: 30, y: 60, interactive: true, learn_content: 'Japanese tea ceremony is called Chado.' },
      { id: 'o2', label: 'Scroll', icon: '|', x: 70, y: 20, interactive: true, learn_content: 'Calligraphy scrolls are called kakejiku.' },
      { id: 'o3', label: 'Cushion', icon: 'o', x: 50, y: 75, interactive: false, learn_content: '' },
    ],
  },
  {
    id: '2', country_id: 'france', name: 'Salon', icon: '*', wall_color: '#E8DCC8', floor_color: '#C4A882',
    objects: [
      { id: 'o4', label: 'Painting', icon: '[]', x: 50, y: 15, interactive: true, learn_content: 'French art includes Impressionism, started by Monet.' },
      { id: 'o5', label: 'Piano', icon: '=', x: 20, y: 50, interactive: true, learn_content: 'France has a rich classical music tradition.' },
    ],
  },
];

export default function RoomsPage() {
  const { showToast } = useToast();
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Room | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [editingObject, setEditingObject] = useState<RoomObject | null>(null);
  const [isNewObject, setIsNewObject] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => { loadCountries(); }, []);
  useEffect(() => { if (selectedCountry) loadRooms(); }, [selectedCountry]);

  async function loadCountries() {
    if (!isConfigured) {
      setCountries(demoCountries);
      setSelectedCountry(demoCountries[0]?.id || '');
      setLoading(false);
      return;
    }
    const { data } = await supabase.from('countries').select('id, name').order('name');
    const list = data || [];
    setCountries(list);
    if (list.length > 0) setSelectedCountry(list[0].id);
    setLoading(false);
  }

  async function loadRooms() {
    setLoading(true);
    if (!isConfigured) {
      setRooms(demoRooms.filter(r => r.country_id === selectedCountry));
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.from('rooms').select('*').eq('country_id', selectedCountry).order('name');
    if (error) {
      showToast('Failed to load rooms', 'error');
      setRooms(demoRooms.filter(r => r.country_id === selectedCountry));
    } else {
      setRooms((data || []).map((r: any) => ({
        ...r,
        objects: Array.isArray(r.objects) ? r.objects : [],
      })));
    }
    setLoading(false);
  }

  async function handleSaveRoom() {
    if (!editing) return;
    if (!editing.name) { showToast('Room name is required', 'error'); return; }

    const room = { ...editing, country_id: selectedCountry };

    if (!isConfigured) {
      if (isNew) {
        setRooms(prev => [...prev, { ...room, id: String(Date.now()) }]);
      } else {
        setRooms(prev => prev.map(r => r.id === room.id ? room : r));
      }
      showToast(isNew ? 'Room added (local)' : 'Room updated (local)', 'success');
      setEditing(null);
      return;
    }

    const payload = { name: room.name, icon: room.icon, wall_color: room.wall_color, floor_color: room.floor_color, country_id: room.country_id, objects: room.objects };
    if (isNew) {
      const { error } = await supabase.from('rooms').insert(payload);
      if (error) { showToast(error.message, 'error'); return; }
    } else {
      const { error } = await supabase.from('rooms').update(payload).eq('id', room.id);
      if (error) { showToast(error.message, 'error'); return; }
    }
    showToast(isNew ? 'Room created' : 'Room updated', 'success');
    setEditing(null);
    loadRooms();
  }

  async function handleDeleteRoom(id: string) {
    if (!isConfigured) {
      setRooms(prev => prev.filter(r => r.id !== id));
      showToast('Room deleted (local)', 'success');
      setConfirmDelete(null);
      return;
    }
    const { error } = await supabase.from('rooms').delete().eq('id', id);
    if (error) { showToast(error.message, 'error'); return; }
    showToast('Room deleted', 'success');
    setConfirmDelete(null);
    loadRooms();
  }

  function handleSaveObject() {
    if (!editing || !editingObject) return;
    if (!editingObject.label) { showToast('Object label is required', 'error'); return; }

    let objects: RoomObject[];
    if (isNewObject) {
      objects = [...editing.objects, { ...editingObject, id: String(Date.now()) }];
    } else {
      objects = editing.objects.map(o => o.id === editingObject.id ? editingObject : o);
    }
    setEditing({ ...editing, objects });
    setEditingObject(null);
    showToast(isNewObject ? 'Object added' : 'Object updated', 'success');
  }

  function handleDeleteObject(objId: string) {
    if (!editing) return;
    setEditing({ ...editing, objects: editing.objects.filter(o => o.id !== objId) });
    showToast('Object removed', 'success');
  }

  if (loading && countries.length === 0) {
    return <div className="loading-state"><span className="spinner" /> Loading...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Rooms</h2>
        <p>Manage rooms and interactive objects for each country</p>
      </div>

      <div className="toolbar">
        <select className="filter-select" value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)}>
          {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button className="btn btn-primary" onClick={() => { setEditing({ ...emptyRoom, country_id: selectedCountry }); setIsNew(true); }}>
          + Add Room
        </button>
      </div>

      {loading ? (
        <div className="loading-state"><span className="spinner" /> Loading rooms...</div>
      ) : rooms.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{'\u25A1'}</div>
          <h3>No rooms</h3>
          <p>No rooms for this country yet</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {rooms.map(room => (
            <div key={room.id} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 24 }}>{room.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 16 }}>{room.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', display: 'flex', gap: 12, marginTop: 4 }}>
                    <span>Wall: <span className="color-swatch" style={{ background: room.wall_color, width: 14, height: 14 }} /></span>
                    <span>Floor: <span className="color-swatch" style={{ background: room.floor_color, width: 14, height: 14 }} /></span>
                    <span>{room.objects.length} object{room.objects.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <div className="btn-group">
                  <button className="btn btn-secondary btn-small" onClick={() => { setEditing({ ...room, objects: [...room.objects] }); setIsNew(false); }}>Edit</button>
                  <button className="btn btn-danger btn-small" onClick={() => setConfirmDelete(room.id)}>Delete</button>
                </div>
              </div>

              {room.objects.length > 0 && (
                <div className="object-grid" style={{ background: room.floor_color, borderColor: room.wall_color }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '30%', background: room.wall_color }} />
                  {room.objects.map(obj => (
                    <div
                      key={obj.id}
                      className="object-dot"
                      style={{
                        left: `${obj.x}%`,
                        top: `${obj.y}%`,
                        background: obj.interactive ? 'var(--primary)' : 'var(--muted)',
                      }}
                      title={`${obj.label} (${obj.x}, ${obj.y})`}
                    >
                      {obj.icon}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {editing && !editingObject && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal modal-wide" onClick={e => e.stopPropagation()}>
            <h3>{isNew ? 'Add Room' : 'Edit Room'}</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input className="form-input" value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} placeholder="Room name" />
              </div>
              <div className="form-group">
                <label>Icon</label>
                <input className="form-input" value={editing.icon} onChange={e => setEditing({ ...editing, icon: e.target.value })} placeholder="*" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Wall Color</label>
                <input type="color" value={editing.wall_color} onChange={e => setEditing({ ...editing, wall_color: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Floor Color</label>
                <input type="color" value={editing.floor_color} onChange={e => setEditing({ ...editing, floor_color: e.target.value })} />
              </div>
            </div>

            <div className="section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Objects ({editing.objects.length})</span>
              <button className="btn btn-secondary btn-small" onClick={() => { setEditingObject({ ...emptyObject }); setIsNewObject(true); }}>+ Add Object</button>
            </div>

            {editing.objects.length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>No objects yet</div>
            ) : (
              <div className="table-container" style={{ marginBottom: 16 }}>
                <table>
                  <thead>
                    <tr>
                      <th>Icon</th>
                      <th>Label</th>
                      <th>Position</th>
                      <th>Interactive</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editing.objects.map(obj => (
                      <tr key={obj.id}>
                        <td style={{ fontSize: 18 }}>{obj.icon}</td>
                        <td style={{ fontWeight: 600 }}>{obj.label}</td>
                        <td style={{ color: 'var(--muted)' }}>({obj.x}, {obj.y})</td>
                        <td>{obj.interactive ? <span style={{ color: 'var(--success)' }}>Yes</span> : <span style={{ color: 'var(--muted)' }}>No</span>}</td>
                        <td>
                          <div className="btn-group">
                            <button className="btn btn-secondary btn-small" onClick={() => { setEditingObject({ ...obj }); setIsNewObject(false); }}>Edit</button>
                            <button className="btn btn-danger btn-small" onClick={() => handleDeleteObject(obj.id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {editing.objects.length > 0 && (
              <div className="object-grid" style={{ background: editing.floor_color, borderColor: editing.wall_color, marginBottom: 16 }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '30%', background: editing.wall_color }} />
                {editing.objects.map(obj => (
                  <div
                    key={obj.id}
                    className="object-dot"
                    style={{ left: `${obj.x}%`, top: `${obj.y}%`, background: obj.interactive ? 'var(--primary)' : 'var(--muted)' }}
                    title={obj.label}
                  >
                    {obj.icon}
                  </div>
                ))}
              </div>
            )}

            <div className="form-actions">
              <button className="btn btn-primary" onClick={handleSaveRoom}>{isNew ? 'Create Room' : 'Save Room'}</button>
              <button className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {editingObject && (
        <div className="modal-overlay" onClick={() => setEditingObject(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{isNewObject ? 'Add Object' : 'Edit Object'}</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Label</label>
                <input className="form-input" value={editingObject.label} onChange={e => setEditingObject({ ...editingObject, label: e.target.value })} placeholder="Object name" />
              </div>
              <div className="form-group">
                <label>Icon</label>
                <input className="form-input" value={editingObject.icon} onChange={e => setEditingObject({ ...editingObject, icon: e.target.value })} placeholder="*" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>X Position (0-100)</label>
                <input className="form-input" type="number" min={0} max={100} value={editingObject.x} onChange={e => setEditingObject({ ...editingObject, x: Number(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>Y Position (0-100)</label>
                <input className="form-input" type="number" min={0} max={100} value={editingObject.y} onChange={e => setEditingObject({ ...editingObject, y: Number(e.target.value) })} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-checkbox">
                <input type="checkbox" checked={editingObject.interactive} onChange={e => setEditingObject({ ...editingObject, interactive: e.target.checked })} />
                Interactive (triggers learning content)
              </label>
            </div>
            {editingObject.interactive && (
              <div className="form-group">
                <label>Learn Content</label>
                <textarea className="form-textarea" value={editingObject.learn_content} onChange={e => setEditingObject({ ...editingObject, learn_content: e.target.value })} placeholder="Content shown when player interacts..." />
              </div>
            )}
            <div className="form-actions">
              <button className="btn btn-primary" onClick={handleSaveObject}>{isNewObject ? 'Add' : 'Save'}</button>
              <button className="btn btn-secondary" onClick={() => setEditingObject(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="confirm-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="confirm-dialog" onClick={e => e.stopPropagation()}>
            <h4>Delete Room</h4>
            <p>Are you sure you want to delete this room and all its objects?</p>
            <div className="btn-group">
              <button className="btn btn-danger" onClick={() => handleDeleteRoom(confirmDelete)}>Delete</button>
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
