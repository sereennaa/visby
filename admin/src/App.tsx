import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { supabase, isConfigured } from './lib/supabase';
import Dashboard from './pages/Dashboard';
import CountriesPage from './pages/CountriesPage';
import RoomsPage from './pages/RoomsPage';
import QuizzesPage from './pages/QuizzesPage';
import FlashcardsPage from './pages/FlashcardsPage';
import LessonsPage from './pages/LessonsPage';
import LocationsPage from './pages/LocationsPage';
import CosmeticsPage from './pages/CosmeticsPage';
import BadgesPage from './pages/BadgesPage';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

interface ToastContextType {
  showToast: (message: string, type: 'success' | 'error') => void;
}

export const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '\u25A0' },
  { path: '/countries', label: 'Countries', icon: '\u25CB' },
  { path: '/rooms', label: 'Rooms', icon: '\u25A1' },
  { path: '/quizzes', label: 'Quizzes', icon: '\u2726' },
  { path: '/flashcards', label: 'Flashcards', icon: '\u2750' },
  { path: '/lessons', label: 'Lessons', icon: '\u2709' },
  { path: '/locations', label: 'Locations', icon: '\u2316' },
  { path: '/cosmetics', label: 'Cosmetics', icon: '\u2666' },
  { path: '/badges', label: 'Badges', icon: '\u2605' },
];

export default function App() {
  const [dbConnected, setDbConnected] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  let toastId = 0;

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  useEffect(() => {
    if (!isConfigured) return;
    supabase.from('countries').select('id', { count: 'exact', head: true }).then(({ error }) => {
      setDbConnected(!error);
    });
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      <div className="admin-layout">
        <aside className="sidebar">
          <div className="sidebar-header">
            <span className="logo-icon">{'\u2728'}</span>
            <h1 className="logo-text">Visby Admin</h1>
          </div>
          <nav className="sidebar-nav">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="connection-status">
              <span
                className="status-dot"
                style={{ background: isConfigured && dbConnected ? '#48BB78' : isConfigured ? '#ECC94B' : '#FC8181' }}
              />
              <span className="status-text">
                {isConfigured && dbConnected ? 'Connected' : isConfigured ? 'Checking...' : 'No Supabase'}
              </span>
            </div>
          </div>
        </aside>

        <main className="main-content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/countries" element={<CountriesPage />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/quizzes" element={<QuizzesPage />} />
            <Route path="/flashcards" element={<FlashcardsPage />} />
            <Route path="/lessons" element={<LessonsPage />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/cosmetics" element={<CosmeticsPage />} />
            <Route path="/badges" element={<BadgesPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>

        <div className="toast-container">
          {toasts.map(toast => (
            <div key={toast.id} className={`toast toast-${toast.type}`}>
              {toast.message}
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}
