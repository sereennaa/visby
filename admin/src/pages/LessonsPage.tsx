import { useState, useEffect } from 'react';
import { supabase, isConfigured } from '../lib/supabase';
import { useToast } from '../App';

interface Slide {
  text: string;
  icon: string;
}

interface Lesson {
  id: string;
  title: string;
  category: string;
  description: string;
  difficulty: string;
  aura_reward: number;
  slides: Slide[];
}

const emptyLesson: Lesson = {
  id: '', title: '', category: 'culture', description: '', difficulty: 'beginner',
  aura_reward: 50, slides: [{ text: '', icon: '*' }],
};

const lessonCategories = ['language', 'slang', 'culture', 'history', 'geography', 'food', 'nature', 'science'];
const difficulties = ['beginner', 'intermediate', 'advanced'];

const demoLessons: Lesson[] = [
  {
    id: '1', title: 'Japanese Greetings', category: 'language', description: 'Learn basic Japanese greetings',
    difficulty: 'beginner', aura_reward: 50,
    slides: [
      { text: 'Konnichiwa means "Hello" and is used during the daytime.', icon: '*' },
      { text: 'Ohayou gozaimasu means "Good morning" and is used before noon.', icon: '+' },
      { text: 'Konbanwa means "Good evening" and is used after sunset.', icon: '-' },
    ],
  },
  {
    id: '2', title: 'French Cuisine Basics', category: 'food', description: 'Discover the foundations of French cooking',
    difficulty: 'beginner', aura_reward: 60,
    slides: [
      { text: 'French cuisine is known for its emphasis on fresh, quality ingredients.', icon: '#' },
      { text: 'A classic French meal has multiple courses: appetizer, main, cheese, dessert.', icon: '*' },
    ],
  },
];

export default function LessonsPage() {
  const { showToast } = useToast();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Lesson | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [previewLesson, setPreviewLesson] = useState<Lesson | null>(null);
  const [previewSlide, setPreviewSlide] = useState(0);

  useEffect(() => { loadLessons(); }, []);

  async function loadLessons() {
    setLoading(true);
    if (!isConfigured) {
      setLessons(demoLessons);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.from('lessons').select('*').order('title');
    if (error) {
      showToast('Failed to load lessons', 'error');
      setLessons(demoLessons);
    } else {
      const mapped = (data || []).map((d: any) => ({
        id: d.id,
        title: d.title,
        category: d.category,
        description: d.description || '',
        difficulty: d.difficulty || 'beginner',
        aura_reward: d.aura_reward || 50,
        slides: Array.isArray(d.content) ? d.content.map((c: any) => ({ text: c.content || c.text || '', icon: c.icon || '*' })) : [],
      }));
      setLessons(mapped);
    }
    setLoading(false);
  }

  function addSlide() {
    if (!editing) return;
    setEditing({ ...editing, slides: [...editing.slides, { text: '', icon: '*' }] });
  }

  function removeSlide(index: number) {
    if (!editing || editing.slides.length <= 1) return;
    setEditing({ ...editing, slides: editing.slides.filter((_, i) => i !== index) });
  }

  function moveSlide(index: number, dir: -1 | 1) {
    if (!editing) return;
    const newIndex = index + dir;
    if (newIndex < 0 || newIndex >= editing.slides.length) return;
    const slides = [...editing.slides];
    [slides[index], slides[newIndex]] = [slides[newIndex], slides[index]];
    setEditing({ ...editing, slides });
  }

  function updateSlide(index: number, field: keyof Slide, value: string) {
    if (!editing) return;
    const slides = [...editing.slides];
    slides[index] = { ...slides[index], [field]: value };
    setEditing({ ...editing, slides });
  }

  async function handleSave() {
    if (!editing) return;
    if (!editing.title) {
      showToast('Title is required', 'error');
      return;
    }

    if (!isConfigured) {
      if (isNew) {
        setLessons(prev => [...prev, { ...editing, id: String(Date.now()) }]);
      } else {
        setLessons(prev => prev.map(l => l.id === editing.id ? editing : l));
      }
      showToast(isNew ? 'Lesson added (local)' : 'Lesson updated (local)', 'success');
      setEditing(null);
      return;
    }

    const dbPayload = {
      title: editing.title,
      category: editing.category,
      description: editing.description,
      difficulty: editing.difficulty,
      aura_reward: editing.aura_reward,
      content: editing.slides.map(s => ({ type: 'text', content: s.text, icon: s.icon })),
      quiz: {},
    };

    if (isNew) {
      const { error } = await supabase.from('lessons').insert(dbPayload);
      if (error) { showToast(error.message, 'error'); return; }
      showToast('Lesson created', 'success');
    } else {
      const { error } = await supabase.from('lessons').update(dbPayload).eq('id', editing.id);
      if (error) { showToast(error.message, 'error'); return; }
      showToast('Lesson updated', 'success');
    }
    setEditing(null);
    loadLessons();
  }

  async function handleDelete(id: string) {
    if (!isConfigured) {
      setLessons(prev => prev.filter(l => l.id !== id));
      showToast('Lesson deleted (local)', 'success');
      setConfirmDelete(null);
      return;
    }
    const { error } = await supabase.from('lessons').delete().eq('id', id);
    if (error) { showToast(error.message, 'error'); return; }
    showToast('Lesson deleted', 'success');
    setConfirmDelete(null);
    loadLessons();
  }

  const filtered = lessons.filter(l => {
    const matchesCategory = filterCategory === 'all' || l.category === filterCategory;
    const matchesSearch = l.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <div className="loading-state"><span className="spinner" /> Loading lessons...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Lessons</h2>
        <p>Create and manage learning content with slides</p>
      </div>

      <div className="toolbar">
        <input className="search-input" placeholder="Search lessons..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="filter-select" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {lessonCategories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
        <button className="btn btn-primary" onClick={() => { setEditing({ ...emptyLesson }); setIsNew(true); }}>
          + Add Lesson
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{'\u2709'}</div>
          <h3>No lessons found</h3>
          <p>Create your first lesson to get started</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(lesson => (
            <div key={lesson.id} className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span className={`pill pill-${lesson.difficulty === 'advanced' ? 'epic' : lesson.difficulty === 'intermediate' ? 'rare' : 'common'}`}>
                    {lesson.difficulty}
                  </span>
                  <span className="pill pill-uncommon">{lesson.category}</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{lesson.title}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>{lesson.description}</div>
                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--muted)' }}>
                  <span>{lesson.slides.length} slide{lesson.slides.length !== 1 ? 's' : ''}</span>
                  <span>{lesson.aura_reward} aura reward</span>
                </div>
              </div>
              <div className="btn-group" style={{ flexShrink: 0 }}>
                <button className="btn btn-secondary btn-small" onClick={() => { setPreviewLesson(lesson); setPreviewSlide(0); }}>Preview</button>
                <button className="btn btn-secondary btn-small" onClick={() => { setEditing({ ...lesson, slides: [...lesson.slides] }); setIsNew(false); }}>Edit</button>
                <button className="btn btn-danger btn-small" onClick={() => setConfirmDelete(lesson.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {previewLesson && (
        <div className="modal-overlay" onClick={() => setPreviewLesson(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 500 }}>
            <h3>{previewLesson.title}</h3>
            <div className="preview-card" style={{ marginBottom: 16, minHeight: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <div style={{ fontSize: 32 }}>{previewLesson.slides[previewSlide]?.icon}</div>
              <div style={{ fontSize: 15, lineHeight: 1.6 }}>{previewLesson.slides[previewSlide]?.text}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
              <button className="btn btn-secondary btn-small" disabled={previewSlide === 0} onClick={() => setPreviewSlide(previewSlide - 1)}>Prev</button>
              <span style={{ fontSize: 13, color: 'var(--muted)' }}>{previewSlide + 1} / {previewLesson.slides.length}</span>
              <button className="btn btn-secondary btn-small" disabled={previewSlide >= previewLesson.slides.length - 1} onClick={() => setPreviewSlide(previewSlide + 1)}>Next</button>
            </div>
            <div className="form-actions" style={{ justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setPreviewLesson(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal modal-wide" onClick={e => e.stopPropagation()}>
            <h3>{isNew ? 'Add Lesson' : 'Edit Lesson'}</h3>
            <div className="form-group">
              <label>Title</label>
              <input className="form-input" value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder="Lesson title" />
            </div>
            <div className="form-row-3">
              <div className="form-group">
                <label>Category</label>
                <select className="form-select" value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })}>
                  {lessonCategories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Difficulty</label>
                <select className="form-select" value={editing.difficulty} onChange={e => setEditing({ ...editing, difficulty: e.target.value })}>
                  {difficulties.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Aura Reward</label>
                <input className="form-input" type="number" value={editing.aura_reward} onChange={e => setEditing({ ...editing, aura_reward: Number(e.target.value) })} />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="form-textarea" value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} placeholder="Brief description..." />
            </div>

            <div className="section-title">Slides ({editing.slides.length})</div>
            <div className="slide-list">
              {editing.slides.map((slide, i) => (
                <div key={i} className="slide-item">
                  <span className="slide-number">{i + 1}</span>
                  <input
                    style={{ width: 40, background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 4, padding: '4px 8px', color: 'var(--text)', textAlign: 'center', fontSize: 16 }}
                    value={slide.icon}
                    onChange={e => updateSlide(i, 'icon', e.target.value)}
                  />
                  <input
                    className="form-input"
                    style={{ flex: 1 }}
                    value={slide.text}
                    onChange={e => updateSlide(i, 'text', e.target.value)}
                    placeholder="Slide content..."
                  />
                  <button className="btn btn-secondary btn-small" onClick={() => moveSlide(i, -1)} disabled={i === 0} title="Move up">{'\u2191'}</button>
                  <button className="btn btn-secondary btn-small" onClick={() => moveSlide(i, 1)} disabled={i === editing.slides.length - 1} title="Move down">{'\u2193'}</button>
                  <button className="btn btn-danger btn-small" onClick={() => removeSlide(i)} disabled={editing.slides.length <= 1} title="Remove">{'\u00D7'}</button>
                </div>
              ))}
            </div>
            <button className="btn btn-secondary btn-small" onClick={addSlide}>+ Add Slide</button>

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
            <h4>Delete Lesson</h4>
            <p>Are you sure you want to delete this lesson and all its slides?</p>
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
