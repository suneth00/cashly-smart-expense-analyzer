import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { CheckCircle, XCircle, Sparkles, Zap, Crown } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ── Feature lists ── */
const basicFeatures = [
  { text: 'Unlimited manual expense entry',   included: true  },
  { text: '5 receipt scans / month',          included: true  },
  { text: '10 voice commands / month',        included: true  },
  { text: 'Basic analytics & dashboard',      included: true  },
  { text: 'Unlimited receipt scans',          included: false },
  { text: 'Advanced AI Insights',             included: false },
  { text: 'Data Export (CSV / PDF)',          included: false },
  { text: 'Priority support',                 included: false },
];

const proFeatures = [
  { text: 'Everything in Basic',              included: true  },
  { text: 'Unlimited receipt scans',          included: true  },
  { text: 'Unlimited voice commands',         included: true  },
  { text: 'Advanced AI Insights & Goals',     included: true  },
  { text: 'Data Export (CSV / PDF)',          included: true  },
  { text: 'Premium dark mode themes',         included: true  },
  { text: 'Priority support',                 included: true  },
  { text: 'Early access to new features',     included: true  },
];

const Subscription = () => {
  const { isDark } = useTheme();

  return (
    <>
      <style>{`
        @keyframes sub-fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sub-glow {
          0%, 100% { box-shadow: 0 0 24px rgba(13,148,136,0.25); }
          50%       { box-shadow: 0 0 40px rgba(13,148,136,0.45); }
        }
        .sub-pro-card {
          animation: sub-glow 3s ease-in-out infinite;
        }
        .sub-upgrade-btn:hover {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 14px 36px rgba(13,148,136,0.55) !important;
        }
        .sub-upgrade-btn:active { transform: translateY(0) scale(1); }
        .sub-basic-btn { opacity: 0.55; cursor: default; }
      `}</style>

      <div style={{ width: '100%', paddingBottom: '56px', animation: 'sub-fadeIn 0.35s ease' }}>

        {/* ── Page Header ── */}
        <div style={{ marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(13,148,136,0.20), rgba(132,204,22,0.12))',
              border: '1px solid rgba(13,148,136,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Crown size={20} style={{ color: '#a3e635' }} />
            </div>
            <h1 style={{
              margin: 0, fontSize: '32px', fontWeight: 900,
              letterSpacing: '-0.02em', color: 'var(--text-primary)',
            }}>
              Subscription Plans
            </h1>
          </div>
          <p style={{ margin: 0, fontSize: '15px', fontWeight: 500, color: '#9ca3af' }}>
            Choose the plan that fits your financial goals.
          </p>
        </div>

        {/* ── Usage banner for current free user ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '12px',
          padding: '14px 20px', borderRadius: '16px',
          background: isDark ? 'rgba(13,148,136,0.07)' : '#f0fdf9',
          border: '1px solid rgba(13,148,136,0.20)',
          marginBottom: '32px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Zap size={16} style={{ color: 'var(--teal-500)', flexShrink: 0 }} />
            <div>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Free tier: <span style={{ color: 'var(--teal-500)' }}>3 of 5 receipt scans used</span>
              </p>
              <p style={{ margin: 0, fontSize: '11px', fontWeight: 500, color: '#9ca3af' }}>
                Upgrade to Pro for unlimited scans and advanced features.
              </p>
            </div>
          </div>
          {/* Mini progress bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '120px', height: '6px', borderRadius: '999px',
              background: isDark ? 'rgba(255,255,255,0.08)' : '#e5e7eb', overflow: 'hidden',
            }}>
              <div style={{
                width: '60%', height: '100%', borderRadius: '999px',
                background: 'linear-gradient(90deg, #0d9488, #84cc16)',
                boxShadow: '0 0 6px rgba(13,148,136,0.40)',
              }} />
            </div>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#9ca3af' }}>3 / 5</span>
          </div>
        </div>

        {/* ── Pricing Cards ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          alignItems: 'start',
        }}>

          {/* ────────── BASIC (FREE) CARD ────────── */}
          <div
            className="cashly-card"
            style={{
              borderRadius: '24px',
              padding: '32px',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid var(--border-card)',
            }}
          >
            {/* Card top */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '13px',
                  background: 'rgba(100,116,139,0.12)',
                  border: '1px solid rgba(100,116,139,0.20)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px',
                }}>
                  🆓
                </div>
                {/* Current plan badge */}
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  padding: '4px 12px', borderRadius: '999px',
                  background: 'rgba(100,116,139,0.12)',
                  border: '1px solid rgba(100,116,139,0.22)',
                  color: '#94a3b8',
                  fontSize: '11px', fontWeight: 800, letterSpacing: '0.06em',
                }}>
                  ✓ CURRENT PLAN
                </span>
              </div>

              <h2 style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                CASHLY Basic
              </h2>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '38px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>$0</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#9ca3af' }}>&nbsp;/ forever</span>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: '13px', fontWeight: 500, color: '#9ca3af' }}>
                Perfect for getting started with personal finance tracking.
              </p>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'var(--border-card)', marginBottom: '24px' }} />

            {/* Features */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
              {basicFeatures.map(f => (
                <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {f.included
                    ? <CheckCircle size={16} style={{ color: '#64748b', flexShrink: 0 }} />
                    : <XCircle    size={16} style={{ color: '#374151', flexShrink: 0 }} />
                  }
                  <span style={{
                    fontSize: '13px', fontWeight: 600,
                    color: f.included ? 'var(--text-secondary)' : '#4b5563',
                    textDecoration: f.included ? 'none' : 'none',
                  }}>
                    {f.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Disabled CTA */}
            <button
              disabled
              className="sub-basic-btn"
              style={{
                width: '100%', padding: '13px',
                borderRadius: '14px', border: '1.5px solid var(--border-card)',
                background: 'transparent',
                color: '#64748b', fontWeight: 800, fontSize: '14px',
                fontFamily: 'Inter, sans-serif',
                cursor: 'not-allowed',
              }}
            >
              ✓ Active Plan
            </button>
          </div>

          {/* ────────── PRO CARD ────────── */}
          <div
            className="cashly-card sub-pro-card"
            style={{
              borderRadius: '24px',
              padding: '32px',
              position: 'relative',
              overflow: 'hidden',
              background: isDark
                ? 'linear-gradient(145deg, #0a1f1e 0%, #051514 100%)'
                : 'linear-gradient(145deg, #f0fdf9 0%, #ecfdf5 100%)',
              border: '2px solid rgba(13,148,136,0.55)',
            }}
          >
            {/* Corner decoration */}
            <div style={{
              position: 'absolute', top: '-40px', right: '-40px',
              width: '160px', height: '160px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(13,148,136,0.18) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', bottom: '-60px', left: '-20px',
              width: '140px', height: '140px', borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(132,204,22,0.10) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            {/* "Most Popular" floating badge */}
            <div style={{
              position: 'absolute', top: '20px', right: '20px',
              display: 'inline-flex', alignItems: 'center', gap: '5px',
              padding: '5px 14px', borderRadius: '999px',
              background: 'linear-gradient(90deg, #0d9488, #10b981)',
              color: '#ffffff', fontSize: '11px', fontWeight: 800,
              letterSpacing: '0.06em',
              boxShadow: '0 4px 14px rgba(13,148,136,0.40)',
            }}>
              <Sparkles size={11} /> MOST POPULAR
            </div>

            {/* Card top */}
            <div style={{ marginBottom: '24px', position: 'relative', zIndex: 1 }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '13px',
                  background: 'linear-gradient(135deg, rgba(13,148,136,0.25), rgba(132,204,22,0.15))',
                  border: '1px solid rgba(13,148,136,0.30)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px',
                  boxShadow: '0 4px 12px rgba(13,148,136,0.20)',
                }}>
                  ⚡
                </div>
              </div>

              <h2 style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                CASHLY Pro
              </h2>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '38px', fontWeight: 900, color: 'var(--teal-500, #14b8a6)', letterSpacing: '-0.03em' }}>$2.99</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#9ca3af' }}>&nbsp;/ month</span>
              </div>
              <p style={{ margin: '8px 0 0', fontSize: '13px', fontWeight: 500, color: '#9ca3af' }}>
                Unlock the full power of AI-driven financial management.
              </p>
            </div>

            {/* Divider */}
            <div style={{
              height: '1px',
              background: 'linear-gradient(90deg, rgba(13,148,136,0.40), rgba(132,204,22,0.20), transparent)',
              marginBottom: '24px', position: 'relative', zIndex: 1,
            }} />

            {/* Features */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px', position: 'relative', zIndex: 1 }}>
              {proFeatures.map(f => (
                <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {f.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Upgrade CTA */}
            <button
              type="button"
              className="sub-upgrade-btn"
              style={{
                width: '100%', padding: '15px',
                borderRadius: '14px', border: 'none',
                background: 'linear-gradient(135deg, #0d9488 0%, #10b981 50%, #059669 100%)',
                color: '#ffffff', fontWeight: 900, fontSize: '15px',
                cursor: 'pointer', letterSpacing: '0.02em',
                boxShadow: '0 8px 24px rgba(13,148,136,0.40)',
                transition: 'all 0.22s ease',
                fontFamily: 'Inter, sans-serif',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                position: 'relative', zIndex: 1,
              }}
            >
              <Sparkles size={17} /> Upgrade to Pro
            </button>

            <p style={{
              margin: '10px 0 0', textAlign: 'center',
              fontSize: '11px', fontWeight: 600, color: '#9ca3af',
              position: 'relative', zIndex: 1,
            }}>
              Cancel anytime · No hidden fees · Billed monthly
            </p>
          </div>
        </div>

        {/* ── Bottom reassurance strip ── */}
        <div style={{
          marginTop: '32px',
          display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '28px',
          padding: '18px 24px', borderRadius: '16px',
          background: 'var(--bg-subtle)',
          border: '1px solid var(--border-card)',
        }}>
          {[
            { icon: '🔒', label: 'Secure payments' },
            { icon: '↩️', label: 'Cancel anytime' },
            { icon: '🚀', label: 'Instant activation' },
            { icon: '💬', label: 'Priority support' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#9ca3af' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Subscription;
