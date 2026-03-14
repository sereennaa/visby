import { useState, useEffect } from 'react';
import { supabase, isConfigured } from '../lib/supabase';
import { useToast } from '../App';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  icon: string;
  deck: string;
}

const emptyFlashcard: Flashcard = {
  id: '', front: '', back: '', icon: '*', deck: 'general',
};

const decks = ['general', 'greetings', 'food', 'travel', 'numbers', 'animals', 'colors', 'phrases'];

const demoFlashcards: Flashcard[] = [
  { id: '1', front: 'Konnichiwa', back: 'Hello (Japanese)', icon: '*', deck: 'greetings' },
  { id: '2', front: 'Merci', back: 'Thank you (French)', icon: '*', deck: 'greetings' },
  { id: '3', front: 'Sushi', back: 'Vinegared rice with seafood', icon: '#', deck: 'food' },
  { id: '4', front: 'Bonjour', back: 'Good morning (French)', icon: '*', deck: 'greetings' },
  { id: '5', front: 'Obrigado', back: 'Thank you (Portuguese)', icon: '*', deck: 'greetings' },
  { id: '6', front: 'Pao de queijo', back: 'Cheese bread (Brazilian)', icon: '#', deck: 'food' },
];

export default function FlashcardsPage() {
  const { showToast } = useToast();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Flashcard | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [filterDeck, setFilterDeck] = useState('all');
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [previewCard, setPreviewCard] = useState<Flashcard | null>(null);
  const [showBack, setShowBack] = useState(false);

  useEffect(() => { loadFlashcards(); }, []);

  async function loadFlashcards() {
    setLoading(true);
    if (!isConfigured) {
      setFlashcards(demoFlashcards);
      setLoading(false);
      return;
    }
    const { data, error } = await supabase.from('flashcards').select('*').order('deck');
    if (error) {
      showToast('Failed to load flashcards', 'error');
      setFlashcards(demoFlashcards);
    } else {
      setFlashcards(data || []);
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!editing) return;
    if (!editing.front || !editing.back) {
      showToast('Front and back text are required', 'error');
      return;
    }

    if (!isConfigured) {
      if (isNew) {
        setFlashcards(prev => [...prev, { ...editing, id: String(Date.now()) }]);
      } else {
        setFlashcards(prev => prev.map(f => f.id === editing.id ? editing : f));
      }
      showToast(isNew ? 'Flashcard added (local)' : 'Flashcard updated (local)', 'success');
      setEditing(null);
      return;
    }

    if (isNew) {
      const { id: _, ...rest } = editing;
      const { error } = await supabase.from('flashcards').insert(rest);
      if (error) { showToast(error.message, 'error'); return; }
      showToast('Flashcard created', 'success');
    } else {
      const { error } = await supabase.from('flashcards').update(editing).eq('id', editing.id);
      if (error) { showToast(error.message, 'error'); return; }
      showToast('Flashcard updated', 'success');
    }
    setEditing(null);
    loadFlashcards();
  }

  async function handleDelete(id: string) {
    if (!isConfigured) {
      setFlashcards(prev => prev.filter(f => f.id !== id));
      showToast('Flashcard deleted (local)', 'success');
      setConfirmDelete(null);
      return;
    }
    const { error } = await supabase.from('flashcards').delete().eq('id', id);
    if (error) { showToast(error.message, 'error'); return; }
    showToast('Flashcard deleted', 'success');
    setConfirmDelete(null);
    loadFlashcards();
  }

  const filtered = flashcards.filter(f => {
    const matchesDeck = filterDeck === 'all' || f.deck === filterDeck;
    const matchesSearch = f.front.toLowerCase().includes(search.toLowerCase()) || f.back.toLowerCase().includes(search.toLowerCase());
    return matchesDeck && matchesSearch;
  });

  const grouped = filtered.reduce<Record<string, Flashcard[]>>((acc, f) => {
    (acc[f.deck] = acc[f.deck] || []).push(f);
    return acc;
  }, {});

  if (loading) {
    return <div className="loading-state"><span className="spinner" /> Loading flashcards...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h2>Flashcards</h2>
        <p>Manage flashcard decks and cards</p>
      </div>

      <div className="toolbar">
        <input className="search-input" placeholder="Search flashcards..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="filter-select" value={filterDeck} onChange={e => setFilterDeck(e.target.value)}>
          <option value="all">All Decks</option>
          {decks.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
        </select>
        <button className="btn btn-primary" onClick={() => { setEditing({ ...emptyFlashcard }); setIsNew(true); }}>
          + Add Flashcard
        </button>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">{'\u2750'}</div>
          <h3>No flashcards found</h3>
          <p>Add your first flashcard to get started</p>
        </div>
      ) : Object.entries(grouped).map(([deck, cards]) => (
        <div key={deck} style={{ marginBottom: 28 }}>
          <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {deck.charAt(0).toUpperCase() + deck.slice(1)}
            <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 400 }}>({cards.length})</span>
          </div>
          <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
            {cards.map(card => (
              <div key={card.id} className="item-card" onClick={() => { setPreviewCard(card); setShowBack(false); }}>
                <div className="item-icon">{card.icon}</div>
                <div className="item-name">{card.front}</div>
                <div className="item-meta">{card.back}</div>
                <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                  <button className="btn btn-secondary btn-small" onClick={e => { e.stopPropagation(); setEditing({ ...card }); setIsNew(false); }}>Edit</button>
                  <button className="btn btn-danger btn-small" onClick={e => { e.stopPropagation(); setConfirmDelete(card.id); }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {previewCard && (
        <div className="modal-overlay" onClick={() => setPreviewCard(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400, textAlign: 'center' }}>
            <h3>Card Preview</h3>
            <div className="flashcard-preview" style={{ margin: '20px auto', cursor: 'pointer' }} onClick={() => setShowBack(!showBack)}>
              <div className={`flashcard-inner ${showBack ? 'flashcard-back' : ''}`}>
                {showBack ? previewCard.back : previewCard.front}
              </div>
            </div>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 12 }}>Click card to flip</p>
            <div className="form-actions" style={{ justifyContent: 'center' }}>
              <button className="btn btn-secondary" onClick={() => setPreviewCard(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>{isNew ? 'Add Flashcard' : 'Edit Flashcard'}</h3>
            <div className="form-group">
              <label>Front</label>
              <input className="form-input" value={editing.front} onChange={e => setEditing({ ...editing, front: e.target.value })} placeholder="Word or phrase..." />
            </div>
            <div className="form-group">
              <label>Back</label>
              <textarea className="form-textarea" value={editing.back} onChange={e => setEditing({ ...editing, back: e.target.value })} placeholder="Translation or definition..." />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Icon</label>
                <input className="form-input" value={editing.icon} onChange={e => setEditing({ ...editing, icon: e.target.value })} placeholder="*" />
              </div>
              <div className="form-group">
                <label>Deck</label>
                <select className="form-select" value={editing.deck} onChange={e => setEditing({ ...editing, deck: e.target.value })}>
                  {decks.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                </select>
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
            <h4>Delete Flashcard</h4>
            <p>Are you sure you want to delete this flashcard?</p>
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
