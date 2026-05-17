import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { AlertCircle, CheckCircle2, Lightbulb, ShieldAlert, Sparkles, Tag } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const priorityLabels = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
};

const getPriorityMeta = (priority, isDark) => {
  if (priority === 'high') {
    return {
      icon: <ShieldAlert size={21} style={{ color: '#f43f5e' }} />,
      cardBg: isDark ? 'rgba(244,63,94,0.12)' : 'rgba(244,63,94,0.08)',
      border: '1px solid rgba(244,63,94,0.26)',
      badgeBg: isDark ? 'rgba(244,63,94,0.18)' : '#ffe4e6',
      badgeColor: isDark ? '#fda4af' : '#be123c',
      badgeBorder: isDark ? 'rgba(251,113,133,0.35)' : '#fecdd3',
    };
  }

  if (priority === 'medium') {
    return {
      icon: <AlertCircle size={21} style={{ color: '#f59e0b' }} />,
      cardBg: isDark ? 'rgba(245,158,11,0.12)' : 'rgba(245,158,11,0.08)',
      border: '1px solid rgba(245,158,11,0.27)',
      badgeBg: isDark ? 'rgba(245,158,11,0.18)' : '#fef3c7',
      badgeColor: isDark ? '#fbbf24' : '#92400e',
      badgeBorder: isDark ? 'rgba(251,191,36,0.35)' : '#fde68a',
    };
  }

  return {
    icon: <CheckCircle2 size={21} style={{ color: 'var(--teal-500)' }} />,
    cardBg: isDark ? 'rgba(13,148,136,0.13)' : 'rgba(13,148,136,0.08)',
    border: '1px solid rgba(13,148,136,0.24)',
    badgeBg: isDark ? 'rgba(20,184,166,0.18)' : '#ccfbf1',
    badgeColor: isDark ? '#5eead4' : '#0f766e',
    badgeBorder: isDark ? 'rgba(94,234,212,0.30)' : '#99f6e4',
  };
};

const RecommendationsCard = () => {
  const { isDark } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await axios.get('/recommendations');
        setData(Array.isArray(res.data) ? res.data : []);
      } catch {
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
    boxShadow: isDark ? '0 12px 30px rgba(0,0,0,0.18)' : '0 1px 6px rgba(13,148,136,0.07)',
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
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
          style={{
            background: isDark ? '#122828' : '#ecfdf5',
            color: isDark ? '#99f6e4' : 'var(--teal-700)',
            border: `1px solid ${isDark ? '#0d2626' : '#99f6e4'}`,
          }}
        >
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: 'var(--lime-400)' }} />
          Live
        </div>
      </div>

      {/* Recommendation list */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-1 custom-scrollbar relative z-10">
        {data.map((rec, i) => {
          const meta = getPriorityMeta(rec.priority, isDark);
          const priorityLabel = priorityLabels[rec.priority] || 'Low';

          return (
            <div
              key={`${rec.title}-${i}`}
              className="p-4 sm:p-5 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 cursor-default"
              style={{
                background: meta.cardBg,
                border: meta.border,
                boxShadow: isDark ? '0 1px 4px rgba(0,0,0,0.12)' : '0 1px 4px rgba(0,0,0,0.04)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = isDark
                  ? '0 8px 20px rgba(0,0,0,0.22)'
                  : '0 4px 14px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = isDark
                  ? '0 1px 4px rgba(0,0,0,0.12)'
                  : '0 1px 4px rgba(0,0,0,0.04)';
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div
                  className="shrink-0 mt-0.5 p-2.5 rounded-xl"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)' }}
                >
                  {meta.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                    <h4 className="font-black text-base tracking-tight leading-tight" style={{ color: 'var(--text-primary)' }}>
                      {rec.title}
                    </h4>
                    <span
                      className="shrink-0 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                      style={{
                        background: meta.badgeBg,
                        color: meta.badgeColor,
                        border: `1px solid ${meta.badgeBorder}`,
                      }}
                    >
                      {priorityLabel}
                    </span>
                  </div>

                  <p className="text-sm font-medium leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {rec.message}
                  </p>

                  {rec.action && (
                    <div
                      className="mt-4 rounded-xl px-3.5 py-3 text-sm font-semibold leading-relaxed flex gap-2"
                      style={{
                        background: isDark ? 'rgba(15,35,35,0.72)' : 'rgba(255,255,255,0.72)',
                        border: '1px solid var(--border-card)',
                        color: 'var(--text-secondary)',
                      }}
                    >
                      <Lightbulb size={16} className="shrink-0 mt-0.5" style={{ color: 'var(--teal-500)' }} />
                      <span><strong>Action:</strong> {rec.action}</span>
                    </div>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                      style={{
                        background: isDark ? 'rgba(18,40,40,0.86)' : '#ffffff',
                        border: '1px solid var(--border-card)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      <Tag size={12} style={{ color: 'var(--teal-500)' }} />
                      {rec.category || 'General'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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
