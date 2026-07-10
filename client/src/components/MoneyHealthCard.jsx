import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Activity, CheckCircle, AlertTriangle } from 'lucide-react';

/* ── Status config ── */
const STATUS_CONFIG = {
  'Excellent':         { emoji: '🏆', label: 'Excellent!',        color: '#22c55e', bg: 'rgba(34,197,94,0.10)',  border: 'rgba(34,197,94,0.25)',  msg: 'Your finances are in great shape! Keep it up.' },
  'Good':              { emoji: '✅', label: 'Good',              color: '#0d9488', bg: 'rgba(13,148,136,0.10)', border: 'rgba(13,148,136,0.25)', msg: 'You\'re doing well. A few small tweaks could make it even better.' },
  'Needs Improvement': { emoji: '⚠️', label: 'Needs Improvement', color: '#f59e0b', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.25)', msg: 'There\'s room to improve. Check the tips below to get on track.' },
  'Risky':             { emoji: '🚨', label: 'Risky',             color: '#ef4444', bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.25)',  msg: 'Your spending needs attention. Act on the suggestions below.' },
};

const DEFAULT_CONFIG = { emoji: '📊', label: 'Unknown', color: 'var(--teal-500)', bg: 'rgba(13,148,136,0.08)', border: 'rgba(13,148,136,0.20)', msg: 'Add expenses and set your income to get a score.' };

const MoneyHealthCard = () => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    axios.get('/analytics/money-health-score')
      .then(r => setData(r.data))
      .catch(() => setError('Could not load your health score.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="cashly-card" style={{ borderRadius: '22px', padding: '28px', minHeight: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid var(--border-card)', borderTopColor: 'var(--teal-500)', animation: 'mh-spin 0.8s linear infinite' }} />
      <style>{`@keyframes mh-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error || !data) return (
    <div className="cashly-card" style={{ borderRadius: '22px', padding: '28px', minHeight: '420px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div>
        <p style={{ fontSize: '32px', marginBottom: '8px' }}>😕</p>
        <p style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '14px' }}>{error || 'No score yet'}</p>
        <p style={{ fontSize: '12px', color: 'var(--text-faint)', marginTop: '4px' }}>Add expenses and set your income in Profile to generate a score.</p>
      </div>
    </div>
  );

  const cfg   = STATUS_CONFIG[data.status] || DEFAULT_CONFIG;
  const score = Math.min(100, Math.max(0, data.score || 0));

  return (
    <>
      <style>{`
        @keyframes mh-spin    { to { transform: rotate(360deg); } }
        @keyframes mh-grow    { from { stroke-dashoffset: 527.7; } }
        @keyframes mh-slideIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .mh-sug:hover { background: rgba(13,148,136,0.06) !important; }
      `}</style>

      <div className="cashly-card" style={{
        borderRadius: '22px', padding: '28px',
        display: 'flex', flexDirection: 'column', gap: '16px',
        animation: 'mh-slideIn 0.3s ease',
      }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '11px',
              background: 'rgba(13,148,136,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--teal-600)',
            }}>
              <Activity size={18} />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 800, fontSize: '15px', color: 'var(--text-primary)' }}>
                Financial Health Score
              </p>
              <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500 }}>
                Your finances rated out of 100
              </p>
            </div>
          </div>
          <span style={{
            padding: '5px 12px', borderRadius: '999px', fontSize: '11px', fontWeight: 800,
            background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
          }}>
            {cfg.emoji} {cfg.label}
          </span>
        </div>

        {/* ── Score Ring ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="160" height="160" style={{ transform: 'rotate(-90deg)' }}>
              {/* Track */}
              <circle cx="80" cy="80" r="68" strokeWidth="12" fill="none" stroke="var(--bg-subtle)" />
              {/* Progress */}
              <circle
                cx="80" cy="80" r="68"
                strokeWidth="12" fill="none"
                stroke={cfg.color}
                strokeDasharray="427.3"
                strokeDashoffset={427.3 - (427.3 * score) / 100}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)', animation: 'mh-grow 1.4s ease' }}
              />
            </svg>
            <div style={{
              position: 'absolute', textAlign: 'center',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
            }}>
              <span style={{ fontSize: '40px', fontWeight: 900, color: cfg.color, letterSpacing: '-0.03em', lineHeight: 1 }}>
                {score}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-faint)', letterSpacing: '0.06em' }}>
                / 100
              </span>
            </div>
          </div>

        {/* Status message */}
          <p style={{
            margin: 0, textAlign: 'center', fontSize: '13px', fontWeight: 600,
            color: 'var(--text-muted)', lineHeight: 1.5, maxWidth: '240px',
          }}>
            {cfg.msg}
          </p>
        </div>

        {/* ── Colour-zone score bar — grouped tight below the dial ── */}
        <div style={{ marginTop: '-4px' }}>
          <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 700, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Where you sit on the scale
          </p>
          <div style={{ position: 'relative', height: '12px', borderRadius: '999px', overflow: 'visible', display: 'flex' }}>
            <div style={{ width: '40%', background: '#ef4444', borderRadius: '999px 0 0 999px' }} />
            <div style={{ width: '30%', background: '#f59e0b' }} />
            <div style={{ width: '30%', background: '#22c55e', borderRadius: '0 999px 999px 0' }} />
            {/* Marker */}
            <div style={{
              position: 'absolute',
              left: `calc(${score}% - 8px)`,
              top: '-4px',
              width: '20px', height: '20px',
              borderRadius: '50%',
              background: cfg.color,
              border: '3px solid var(--bg-card)',
              boxShadow: `0 0 0 2px ${cfg.color}`,
              transition: 'left 1.4s cubic-bezier(0.4,0,0.2,1)',
              zIndex: 2,
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
            {[
              { label: '0 — Risky',   color: '#ef4444' },
              { label: '40 — Fair',   color: '#f59e0b' },
              { label: '70+ — Great', color: '#22c55e' },
            ].map(z => (
              <span key={z.label} style={{ fontSize: '10px', fontWeight: 700, color: z.color }}>{z.label}</span>
            ))}
          </div>
        </div>

        {/* ── What this means ── */}
        <div style={{
          padding: '14px 16px', borderRadius: '14px',
          background: cfg.bg, border: `1px solid ${cfg.border}`,
        }}>
          <p style={{ margin: '0 0 4px', fontSize: '11px', fontWeight: 800, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            💡 What this score means
          </p>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {score >= 80 && 'You\'re spending within your income, saving consistently, and your habits are solid. Nothing urgent to fix!'}
            {score >= 60 && score < 80 && 'You\'re generally on track, but there are some areas to watch — like your monthly spending vs income ratio.'}
            {score >= 40 && score < 60 && 'Your spending is getting close to your income limits. Try to cut back in your top spending categories.'}
            {score < 40 && 'Your spending is outpacing your income or you haven\'t set up your budget yet. Start by setting your monthly income in Profile.'}
          </p>
        </div>

        {/* ── Breakdown checklist ── */}
        {data.suggestions?.length > 0 && (
          <div style={{
            borderRadius: '16px', padding: '16px',
            background: 'var(--bg-subtle)', border: '1px solid var(--border-card)',
          }}>
            <p style={{ margin: '0 0 12px', fontSize: '11px', fontWeight: 800, color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Score Breakdown
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data.suggestions.map((sug, i) => (
                <div key={i} className="mh-sug" style={{
                  display: 'flex', alignItems: 'flex-start', gap: '10px',
                  padding: '8px 10px', borderRadius: '10px',
                  background: 'transparent', transition: 'background 0.15s ease',
                }}>
                  {data.status === 'Excellent' || data.status === 'Good'
                    ? <CheckCircle size={16} style={{ color: '#22c55e', flexShrink: 0, marginTop: '2px' }} />
                    : <AlertTriangle size={16} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
                  }
                  <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {sug}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MoneyHealthCard;
