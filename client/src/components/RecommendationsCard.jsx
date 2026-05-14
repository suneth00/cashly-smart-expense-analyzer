import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Lightbulb, AlertCircle, ShieldAlert, Sparkles } from 'lucide-react';

const RecommendationsCard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await axios.get('/recommendations');
        setData(res.data);
      } catch (err) {
        setError('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
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
    position: 'relative',
    overflow: 'hidden',
    transition: 'background 0.3s ease, border-color 0.3s ease',
  };

  if (loading) {
    return (
      <div style={cardStyle} className="items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-4" style={{ borderColor: 'var(--teal-600)' }} />
      </div>
    );
  }

  if (error || data.length === 0) {
    return (
      <div style={cardStyle} className="items-center justify-center min-h-[400px] text-center">
        <Sparkles size={40} style={{ color: '#d1fae5', marginBottom: '16px' }} />
        <p className="font-bold text-lg mb-1" style={{ color: 'var(--text-secondary)' }}>
          {error || 'No advice yet'}
        </p>
        <p className="text-sm font-medium" style={{ color: 'var(--text-faint)' }}>
          Keep tracking your expenses to get insights.
        </p>
      </div>
    );
  }

  const getPriorityIcon = (priority) => {
    if (priority === 'high')   return <ShieldAlert size={22} style={{ color: '#ef4444' }} />;
    if (priority === 'medium') return <AlertCircle size={22} style={{ color: '#f59e0b' }} />;
    return <Lightbulb size={22} style={{ color: 'var(--teal-500)' }} />;
  };

  const getPriorityStyle = (priority) => {
    if (priority === 'high')   return { background: 'rgba(239,68,68,0.08)',   border: '1px solid rgba(239,68,68,0.2)' };
    if (priority === 'medium') return { background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' };
    return { background: 'rgba(13,148,136,0.08)', border: '1px solid rgba(13,148,136,0.2)' };
  };

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl" style={{ background: '#fef9c3', color: '#854d0e' }}>
            <Sparkles size={22} />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>Smart Advice</h3>
            <p className="text-sm font-semibold mt-0.5" style={{ color: 'var(--text-faint)' }}>AI-driven financial insights</p>
          </div>
        </div>
        {/* Live badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: '#ecfdf5', color: 'var(--teal-700)', border: '1px solid #99f6e4' }}>
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: 'var(--lime-400)' }} />
          Live
        </div>
      </div>

      {/* Recommendation list */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-1 custom-scrollbar relative z-10">
        {data.map((rec, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl flex gap-4 items-start transition-all duration-300 hover:-translate-y-0.5 cursor-default"
            style={{
              ...getPriorityStyle(rec.priority),
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.08)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'}
          >
            <div
              className="shrink-0 mt-0.5 p-2.5 rounded-xl"
              style={{ background: 'var(--bg-card)', border: '1px solid rgba(0,0,0,0.06)' }}
            >
              {getPriorityIcon(rec.priority)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-1.5">
                <h4 className="font-bold text-base tracking-tight leading-tight" style={{ color: 'var(--text-primary)' }}>
                  {rec.title}
                </h4>
                {rec.priority === 'high' && (
                  <span
                    className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                    style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' }}
                  >
                    Action Needed
                  </span>
                )}
              </div>
              <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {rec.message}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Decorative blob */}
      <div
        className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-[0.08] pointer-events-none"
        style={{ background: 'var(--teal-400)' }}
      />
    </div>
  );
};

export default RecommendationsCard;
