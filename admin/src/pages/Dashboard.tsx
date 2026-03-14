import { useState, useEffect } from 'react';
import { supabase, isConfigured } from '../lib/supabase';

interface StatCard {
  label: string;
  icon: string;
  table: string;
  count: number | null;
  loading: boolean;
}

export default function Dashboard() {
  const [stats, setStats] = useState<StatCard[]>([
    { label: 'Countries', icon: '\u25CB', table: 'countries', count: null, loading: true },
    { label: 'Quizzes', icon: '\u2726', table: 'lessons', count: null, loading: true },
    { label: 'Flashcards', icon: '\u2750', table: 'lessons', count: null, loading: true },
    { label: 'Lessons', icon: '\u2709', table: 'lessons', count: null, loading: true },
    { label: 'Locations', icon: '\u2316', table: 'locations', count: null, loading: true },
    { label: 'Cosmetics', icon: '\u2666', table: 'cosmetics', count: null, loading: true },
    { label: 'Badges', icon: '\u2605', table: 'badges', count: null, loading: true },
  ]);

  useEffect(() => {
    if (!isConfigured) {
      setStats(prev => prev.map(s => ({ ...s, loading: false, count: 0 })));
      return;
    }

    const tables = ['countries', 'lessons', 'lessons', 'lessons', 'locations', 'cosmetics', 'badges'];
    tables.forEach((table, i) => {
      supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
        .then(({ count, error }) => {
          setStats(prev => {
            const next = [...prev];
            next[i] = { ...next[i], count: error ? null : (count ?? 0), loading: false };
            return next;
          });
        });
    });
  }, []);

  return (
    <div>
      <div className="page-header">
        <h2>Dashboard</h2>
        <p>Overview of all content in the Visby platform</p>
      </div>

      {!isConfigured && (
        <div className="setup-prompt">
          <h3>Supabase Not Configured</h3>
          <p>Create a <code>.env</code> file in the admin directory with:</p>
          <p style={{ marginTop: 8 }}>
            <code>VITE_SUPABASE_URL=your-project-url</code>
          </p>
          <p>
            <code>VITE_SUPABASE_ANON_KEY=your-anon-key</code>
          </p>
          <p style={{ marginTop: 12, fontSize: 13 }}>
            The admin panel works with local demo data in the meantime.
          </p>
        </div>
      )}

      <div className="card-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-label">Total {stat.label}</div>
            <div className="stat-value">
              {stat.loading ? <span className="spinner" /> : (stat.count ?? '--')}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 32 }}>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, marginBottom: 12 }}>Quick Actions</h3>
          <div className="btn-group">
            <a href="/countries" className="btn btn-secondary">Manage Countries</a>
            <a href="/quizzes" className="btn btn-secondary">Manage Quizzes</a>
            <a href="/lessons" className="btn btn-secondary">Manage Lessons</a>
            <a href="/badges" className="btn btn-secondary">Manage Badges</a>
          </div>
        </div>
      </div>
    </div>
  );
}
