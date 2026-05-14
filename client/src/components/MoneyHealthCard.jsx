import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Activity, CheckCircle, Info } from 'lucide-react';

const MoneyHealthCard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await axios.get('/analytics/money-health-score');
        setData(res.data);
      } catch (err) {
        setError('Failed to load health score');
      } finally {
        setLoading(false);
      }
    };
    fetchHealth();
  }, []);

  const cardStyle = {
    background: 'var(--bg-card)',
    border: '1px solid',
    borderColor: 'var(--border-card, #d1fae5)',
    borderRadius: '22px',
    boxShadow: '0 1px 6px rgba(13,148,136,0.07)',
    padding: '28px 24px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'background 0.3s ease, border-color 0.3s ease',
  };

  if (loading) {
    return (
      <div style={cardStyle} className="items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-4" style={{ borderColor: 'var(--teal-600)' }} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={cardStyle} className="items-center justify-center min-h-[400px]">
        <span className="font-bold" style={{ color: 'var(--text-muted)' }}>{error || 'No data available'}</span>
      </div>
    );
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Excellent':        return { color: '#065f46', bg: '#dcfce7', border: '#86efac', stroke: '#22c55e' };
      case 'Good':             return { color: 'var(--teal-700)', bg: '#ccfbf1', border: '#5eead4', stroke: 'var(--teal-500)' };
      case 'Needs Improvement':return { color: '#92400e', bg: '#fef3c7', border: '#fcd34d', stroke: '#f59e0b' };
      case 'Risky':            return { color: '#991b1b', bg: '#fee2e2', border: '#fca5a5', stroke: '#ef4444' };
      default:                 return { color: 'var(--text-muted)', bg: '#f9fafb', border: '#e5e7eb', stroke: '#9ca3af' };
    }
  };

  const s = getStatusStyle(data.status);

  return (
    <div style={cardStyle} className="relative overflow-hidden group">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <h3 className="text-xl font-bold flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
          <div className="p-2.5 rounded-2xl" style={{ background: '#ccfbf1', color: 'var(--teal-600)' }}>
            <Activity size={22} />
          </div>
          Health Score
        </h3>
        <span
          className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
          style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
        >
          {data.status}
        </span>
      </div>

      {/* Score Ring */}
      <div className="flex items-center justify-center mb-8 relative z-10">
        <div className="relative flex items-center justify-center group-hover:scale-105 transition-transform duration-500 drop-shadow-md">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle cx="96" cy="96" r="84" strokeWidth="14" fill="none" stroke="var(--bg-subtle)" />
            <circle
              cx="96" cy="96" r="84"
              strokeWidth="14" fill="none"
              stroke={s.stroke}
              strokeDasharray="527.7"
              strokeDashoffset={527.7 - (527.7 * data.score) / 100}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-6xl font-black tracking-tighter" style={{ color: s.stroke }}>{data.score}</span>
            <span className="text-xs font-black uppercase tracking-widest mt-1" style={{ color: 'var(--text-faint)' }}>/ 100</span>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <p className="text-sm font-semibold mb-8 text-center leading-relaxed px-2 relative z-10" style={{ color: 'var(--text-muted)' }}>
        {data.explanation}
      </p>

      {/* Breakdown */}
      <div
        className="flex-1 rounded-2xl p-5 relative z-10"
        style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-card, #d1fae5)' }}
      >
        <h4 className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: 'var(--text-faint)' }}>
          Score Breakdown
        </h4>
        <ul className="space-y-3">
          {data.suggestions.map((sug, i) => (
            <li key={i} className="flex items-start gap-3 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              {data.status === 'Excellent' ? (
                <CheckCircle size={17} className="shrink-0 mt-0.5" style={{ color: '#22c55e' }} />
              ) : (
                <Info size={17} className="shrink-0 mt-0.5" style={{ color: 'var(--teal-500)' }} />
              )}
              <span className="leading-relaxed">{sug}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Decorative corner blob */}
      <div
        className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: s.stroke }}
      />
    </div>
  );
};

export default MoneyHealthCard;
