import { useState, useEffect } from 'react';
import { supabase, isConfigured } from '../lib/supabase';
import { useToast } from '../App';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  category: string;
}

const emptyQuestion: QuizQuestion = {
  id: '', question: '', options: ['', '', '', ''], correct_index: 0, category: 'general',
};

const categories = ['general', 'geography', 'history', 'culture', 'food', 'language', 'science', 'nature'];

const demoQuestions: QuizQuestion[] = [
  { id: '1', question: 'What is the capital of Japan?', options: ['Osaka', 'Tokyo', 'Kyoto', 'Nagoya'], correct_index: 1, category: 'geography' },
  { id: '2', question: 'Which country is known for the Eiffel Tower?', options: ['Italy', 'Spain', 'France', 'Germany'], correct_index: 2, category: 'geography' },
  { id: '3', question: 'What language is primarily spoken in Brazil?', options: ['Spanish', 'Portuguese', 'English', 'French'], correct_index: 1, category: 'language' },
  { id: '4', question: 'Sushi originated in which country?', options: ['China', 'Korea', 'Japan', 'Thailand'], correct_index: 2, category: 'food' },
];

export default function QuizzesPage() {
  const { showToast } = useToast();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<QuizQuestion | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => { loadQuestions(); }, []);

  async function loadQuestions() {
    setLoading(true);
    if (!isConfigured) {
      setQuestions(demoQuestions);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.from('quiz_questions').select('*').order('category');
    if (error) {
      showToast('Failed to load quizzes', 'error');
      setQuestions(demoQuestions);
    } else {
      setQuestions(data || []);
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!editing) return;
    if (!editing.question || editing.options.some(o => !o.trim())) {
      showToast('Question and all options are required', 'error');
      return;
    }

    if (!isConfigured) {
      if (isNew) {
        const newQ = { ...editing, id: String(Date.now()) };
        setQuestions(prev => [...prev, newQ]);
      } else {
        setQuestions(prev => prev.map(q => q.id === editing.id ? editing : q));
      }
      showToast(isNew ? 'Question added (local)' : 'Question updated (local)', 'success');
      setEditing(null);
      return;
    }

    if (isNew) {
      const { id: _, ...rest } = editing;
      const { error } = await supabase.from('quiz_questions').insert(rest);
      if (error) { showToast(error.message, 'error'); return; }
      showToast('Question created', 'success');
    } else {
      const { error } = await supabase.from('quiz_questions').update(editing).eq('id', editing.id);
      if (error) { showToast(error.message, 'error'); return; }
      showToast('Question updated', 'success');
    }
    setEditing(null);
    loadQuestions();
  }

  async function handleDelete(id: string) {
    if (!isConfigured) {
      setQuestions(prev => prev.filter(q => q.id !== id));
      showToast('Question deleted (local)', 'success');
      setConfirmDelete(null);
      return;
    }
    const { error } = await supabase.from('quiz_questions').delete().eq('id', id);
    if (error) { showToast(error.message, 'error'); return; }
    showToast('Question deleted', 'success');
    setConfirmDelete(null);
    loadQuestions();
  }

  const filtered = questions.filter(q => {
    const matchesCategory = filterCategory === 'all' || q.category === filterCategory;
    const matchesSearch = q.question.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <div className="loading-state"><span className="spinner" /> Loading quizzes...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Quiz Questions</h2>
        <p>Manage quiz content across all categories</p>
      </div>

      <div className="toolbar">
        <input className="search-input" placeholder="Search questions..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="filter-select" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
        <button className="btn btn-primary" onClick={() => { setEditing({ ...emptyQuestion }); setIsNew(true); }}>
          + Add Question
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">{'\u2726'}</div>
            <h3>No questions found</h3>
            <p>Add your first quiz question to get started</p>
          </div>
        ) : filtered.map(q => (
          <div key={q.id} className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span className={`pill pill-${q.category === 'geography' ? 'rare' : q.category === 'food' ? 'epic' : q.category === 'history' ? 'legendary' : 'common'}`}>
                  {q.category}
                </span>
              </div>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 10 }}>{q.question}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {q.options.map((opt, i) => (
                  <div key={i} style={{
                    padding: '6px 12px',
                    borderRadius: 6,
                    fontSize: 13,
                    background: i === q.correct_index ? 'rgba(72, 187, 120, 0.15)' : 'var(--bg)',
                    border: i === q.correct_index ? '1px solid rgba(72, 187, 120, 0.3)' : '1px solid var(--border)',
                    color: i === q.correct_index ? '#68D391' : 'var(--muted)',
                  }}>
                    {String.fromCharCode(65 + i)}. {opt}
                  </div>
                ))}
              </div>
            </div>
            <div className="btn-group" style={{ flexShrink: 0 }}>
              <button className="btn btn-secondary btn-small" onClick={() => { setEditing({ ...q }); setIsNew(false); }}>Edit</button>
              <button className="btn btn-danger btn-small" onClick={() => setConfirmDelete(q.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{isNew ? 'Add Question' : 'Edit Question'}</h3>
            <div className="form-group">
              <label>Question</label>
              <textarea className="form-textarea" value={editing.question} onChange={e => setEditing({ ...editing, question: e.target.value })} placeholder="Enter your question..." />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select className="form-select" value={editing.category} onChange={e => setEditing({ ...editing, category: e.target.value })}>
                {categories.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Options</label>
              {editing.options.map((opt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', minWidth: 60, margin: 0, textTransform: 'none', letterSpacing: 0 }}>
                    <input type="radio" name="correct" checked={editing.correct_index === i} onChange={() => setEditing({ ...editing, correct_index: i })} />
                    {String.fromCharCode(65 + i)}
                  </label>
                  <input
                    className="form-input"
                    value={opt}
                    onChange={e => {
                      const newOpts = [...editing.options];
                      newOpts[i] = e.target.value;
                      setEditing({ ...editing, options: newOpts });
                    }}
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                  />
                </div>
              ))}
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>Select the radio button next to the correct answer</p>
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
            <h4>Delete Question</h4>
            <p>Are you sure you want to delete this question?</p>
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
