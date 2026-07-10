import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/* ── Category → emoji ── */
const categoryEmoji = (cat = '') => {
  const c = cat.toLowerCase();
  if (c.includes('budget'))        return '💰';
  if (c.includes('saving'))        return '🎯';
  if (c.includes('track'))        return '📊';
  if (c.includes('food'))         return '🍔';
  if (c.includes('transport'))    return '🚗';
  if (c.includes('health'))       return '💊';
  if (c.includes('entertainment'))return '🎬';
  if (c.includes('shopping'))     return '🛍️';
  if (c.includes('bill'))         return '🧾';
  if (c.includes('invest'))       return '📈';
  if (c.includes('habit'))        return '🔄';
  return '💡';
};

/* ── Priority config ── */
const PRIORITY = {
  high: {
    label:   'Action Needed',
    diff:    'Urgent',
    badge:   { bg: 'rgba(239,68,68,0.12)',  color: '#ef4444', border: 'rgba(239,68,68,0.25)'  },
    card:    { bg: 'rgba(239,68,68,0.06)',  border: 'rgba(239,68,68,0.18)'  },
    action:  { bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.20)', color: '#ef4444' },
  },
  medium: {
    label:   'Good to Know',
    diff:    'Medium',
    badge:   { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: 'rgba(245,158,11,0.25)' },
    card:    { bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.18)' },
    action:  { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.20)', color: '#f59e0b' },
  },
  low: {
    label:   'Nice to Do',
    diff:    'Easy',
    badge:   { bg: 'rgba(13,148,136,0.12)', color: 'var(--teal-600)', border: 'rgba(13,148,136,0.25)' },
    card:    { bg: 'rgba(13,148,136,0.06)', border: 'rgba(13,148,136,0.18)' },
    action:  { bg: 'rgba(13,148,136,0.08)', border: 'rgba(13,148,136,0.20)', color: 'var(--teal-600)' },
  },
};

const RecommendationsCard = () => {
  const { isDark }               = useTheme();
  const [data,    setData]       = useState([]);
  const [loading, setLoading]    = useState(true);
  const [error,   setError]      = useState(null);
  const [done,    setDone]       = useState({});   // tip id → boolean

  useEffect(() => {
    axios.get('/recommendations')
      .then(r => setData(Array.isArray(r.data) ? r.data : []))
      .catch(() => setError('Could not load tips.'))
      .finally(() => setLoading(false));
  }, []);

  const toggleDone = (i) => setDone(d => ({ ...d, [i]: !d[i] }));
  const doneCount  = Object.values(done).filter(Boolean).length;

  /* Loading */
  if (loading) return (
    <div className="cashly-card" style={{ borderRadius: '22px', padding: '28px', minHeight: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid var(--border-card)', borderTopColor: 'var(--teal-500)', animation: 'rc-spin 0.8s linear infinite' }} />
      <style>{`@keyframes rc-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  /* Empty / Error */
  if (error || data.length === 0) return (
    <div className="cashly-card" style={{ borderRadius: '22px', padding: '28px', minHeight: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <p style={{ fontSize: '40px', marginBottom: '12px' }}>💡</p>
      <p style={{ fontWeight: 800, fontSize: '16px', color: 'var(--text-primary)', margin: '0 0 6px' }}>
        {error || 'No tips yet!'}
      </p>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '260px', lineHeight: 1.6 }}>
        Keep tracking your expenses and set your monthly income — tips will appear based on your real spending.
      </p>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes rc-spin   { to { transform: rotate(360deg); } }
        @keyframes rc-fadeIn { from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)} }
        .rc-card { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .rc-card:hover { transform: translateY(-2px); }
        .rc-done-btn:hover { opacity: 0.85; }
      `}</style>

      <div className="cashly-card" style={{
        borderRadius: '22px', padding: '28px',
        display: 'flex', flexDirection: 'column', gap: '20px',
        animation: 'rc-fadeIn 0.3s ease',
      }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: 'rgba(245,158,11,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px',
            }}>
              💡
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 800, fontSize: '16px', color: 'var(--text-primary)' }}>
                Personalized Tips
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af', fontWeight: 500 }}>
                Your AI money coach · based on real spending
              </p>
            </div>
          </div>

          {/* Live badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '5px 12px', borderRadius: '999px',
            background: isDark ? '#122828' : '#ecfdf5',
            border: `1px solid ${isDark ? '#0d2626' : '#99f6e4'}`,
            color: isDark ? '#99f6e4' : 'var(--teal-700)',
            fontSize: '11px', fontWeight: 700,
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#84cc16', display: 'inline-block' }} />
            Live
          </div>
        </div>

        {/* ── Intro banner ── */}
        <div style={{
          padding: '12px 16px', borderRadius: '14px',
          background: 'rgba(13,148,136,0.08)', border: '1px solid rgba(13,148,136,0.18)',
        }}>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            🤖 These tips are generated from your actual spending patterns. Mark them done as you act on them!
          </p>
        </div>

        {/* ── Progress bar ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: '#9ca3af' }}>
              Tips acted on
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 900, color: 'var(--teal-600)' }}>
                {doneCount} / {data.length}
              </p>
              {doneCount === data.length && data.length > 0 && (
                <span style={{ fontSize: '12px' }}>🎉</span>
              )}
            </div>
          </div>
          <div style={{ height: '8px', borderRadius: '999px', background: 'var(--bg-subtle)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: '999px',
              width: `${data.length > 0 ? (doneCount / data.length) * 100 : 0}%`,
              background: doneCount === data.length && data.length > 0
                ? '#22c55e'
                : 'linear-gradient(90deg, var(--teal-600), #84cc16)',
              transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)',
              boxShadow: doneCount > 0 ? '0 0 8px rgba(13,148,136,0.40)' : 'none',
            }} />
          </div>
        </div>

        {/* ── Tip cards ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '480px', overflowY: 'auto', paddingRight: '4px' }}>
          {data.map((rec, i) => {
            const p    = PRIORITY[rec.priority] || PRIORITY.low;
            const isDn = done[i] || false;
            const emoji = categoryEmoji(rec.category || rec.title);

            return (
              <div key={i} className="rc-card" style={{
                borderRadius: '16px', padding: '16px',
                background: isDn ? 'rgba(34,197,94,0.06)' : p.card.bg,
                border: isDn ? '1px solid rgba(34,197,94,0.25)' : `1px solid ${p.card.border}`,
                opacity: isDn ? 0.55 : 1,
                transition: 'all 0.25s ease',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>

                  {/* Emoji icon */}
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                    background: 'var(--bg-card)', border: '1px solid var(--border-card)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '22px',
                  }}>
                    {isDn ? '✅' : emoji}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Title row */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                      <p style={{
                        margin: 0, fontWeight: 800, fontSize: '14px',
                        color: isDn ? 'var(--text-faint)' : 'var(--text-primary)',
                        textDecoration: isDn ? 'line-through' : 'none',
                        lineHeight: 1.3,
                      }}>
                        {rec.title}
                      </p>
                      <span style={{
                        flexShrink: 0, fontSize: '10px', fontWeight: 800,
                        padding: '3px 10px', borderRadius: '999px',
                        background: p.badge.bg, color: p.badge.color, border: `1px solid ${p.badge.border}`,
                        whiteSpace: 'nowrap',
                      }}>
                        {p.label}
                      </span>
                    </div>

                    {/* Description */}
                    <p style={{ margin: '0 0 10px', fontSize: '13px', fontWeight: 500, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                      {rec.message}
                    </p>

                    {/* Action CTA */}
                    {rec.action && !isDn && (
                      <div style={{
                        display: 'flex', alignItems: 'flex-start', gap: '8px',
                        padding: '10px 13px', borderRadius: '11px',
                        background: p.action.bg, border: `1px solid ${p.action.border}`,
                        marginBottom: '10px',
                      }}>
                        <ArrowRight size={14} style={{ color: p.action.color, flexShrink: 0, marginTop: '2px' }} />
                        <p style={{ margin: 0, fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          <span style={{ color: p.action.color }}>Do this: </span>{rec.action}
                        </p>
                      </div>
                    )}

                    {/* Footer: category + mark-done */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      {rec.category && (
                        <span style={{
                          fontSize: '11px', fontWeight: 700,
                          padding: '3px 10px', borderRadius: '999px',
                          background: 'var(--bg-subtle)', border: '1px solid var(--border-card)',
                          color: 'var(--text-faint)',
                        }}>
                          {emoji} {rec.category}
                        </span>
                      )}
                      <button
                        className="rc-done-btn"
                        onClick={() => toggleDone(i)}
                        title={isDn ? 'Click to mark as not done' : 'Click when you have acted on this tip'}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '6px',
                          fontSize: '12px', fontWeight: 800,
                          padding: '6px 14px', borderRadius: '8px',
                          border: `1px solid ${isDn ? 'rgba(34,197,94,0.40)' : 'var(--border-card)'}`,
                          background: isDn ? 'rgba(34,197,94,0.14)' : 'var(--bg-subtle)',
                          color: isDn ? '#22c55e' : '#9ca3af',
                          cursor: 'pointer',
                          transition: 'all 0.18s ease',
                          letterSpacing: '0.01em',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = isDn
                            ? 'rgba(34,197,94,0.22)'
                            : 'rgba(13,148,136,0.10)';
                          e.currentTarget.style.color = isDn ? '#22c55e' : 'var(--teal-500)';
                          e.currentTarget.style.borderColor = isDn
                            ? 'rgba(34,197,94,0.55)'
                            : 'rgba(13,148,136,0.35)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = isDn ? 'rgba(34,197,94,0.14)' : 'var(--bg-subtle)';
                          e.currentTarget.style.color = isDn ? '#22c55e' : '#9ca3af';
                          e.currentTarget.style.borderColor = isDn ? 'rgba(34,197,94,0.40)' : 'var(--border-card)';
                        }}
                      >
                        <CheckCircle size={13} />
                        {isDn ? 'Completed ✓' : 'Mark as done'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default RecommendationsCard;
