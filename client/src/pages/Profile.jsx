import { useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  User, Mail, Banknote, Target, Loader2,
  CheckCircle, Save, Shield, TrendingUp, Wallet, AlertCircle, Globe
} from 'lucide-react';
import { formatCurrency, availableCurrencies } from '../utils/currencyUtils';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const { isDark } = useTheme();
  const [formData, setFormData]   = useState({ name: '', monthlyIncome: '', savingsGoal: '', currency: '$' });
  const [loading, setLoading]     = useState(false);
  const [success, setSuccess]     = useState('');
  const [error, setError]         = useState('');
  const [focused, setFocused]     = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name:          user.name          || '',
        monthlyIncome: user.monthlyIncome || '',
        savingsGoal:   user.savingsGoal   || '',
        currency:      user.currency      || '$',
      });
    }
  }, [user]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
    try {
      const res = await axios.put('/auth/profile', {
        name:          formData.name,
        monthlyIncome: Number(formData.monthlyIncome),
        savingsGoal:   Number(formData.savingsGoal),
        currency:      formData.currency,
      });
      setUser(res.data);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  /* ── helpers ── */
  const fieldStyle = (name) => ({
    width:          '100%',
    paddingLeft:    '48px',
    paddingRight:   '16px',
    paddingTop:     '14px',
    paddingBottom:  '14px',
    borderRadius:   '14px',
    border:         `1.5px solid ${focused === name ? 'var(--teal-500)' : 'var(--border-card)'}`,
    background:     isDark ? '#0c1f1e' : '#f4fffe',
    color:          'var(--text-primary)',
    fontWeight:     600,
    fontSize:       '14px',
    outline:        'none',
    transition:     'all 0.2s ease',
    boxShadow:      focused === name ? '0 0 0 4px rgba(13,148,136,0.12)' : 'none',
    fontFamily:     'Inter, sans-serif',
  });

  const disabledFieldStyle = {
    ...fieldStyle(''),
    background:   isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
    color:        'var(--text-faint)',
    cursor:       'not-allowed',
    border:       `1.5px solid ${isDark ? '#1a3535' : '#e2e8f0'}`,
    boxShadow:    'none',
  };

  const statCards = [
    {
      icon:    <Banknote size={20} />,
      label:   'Monthly Income',
      value:   formatCurrency(formData.monthlyIncome, formData.currency),
      accent:  'var(--teal-600)',
      bgFrom:  'rgba(13,148,136,0.12)',
      bgTo:    'rgba(13,148,136,0.04)',
    },
    {
      icon:    <Target size={20} />,
      label:   'Savings Goal',
      value:   formatCurrency(formData.savingsGoal, formData.currency),
      accent:  '#84cc16',
      bgFrom:  'rgba(132,204,22,0.12)',
      bgTo:    'rgba(132,204,22,0.04)',
    },
    {
      icon:    <TrendingUp size={20} />,
      label:   'Save Rate',
      value:   formData.monthlyIncome
                 ? `${Math.min(100, Math.round((Number(formData.savingsGoal) / Number(formData.monthlyIncome)) * 100))}%`
                 : '—',
      accent:  '#f59e0b',
      bgFrom:  'rgba(245,158,11,0.12)',
      bgTo:    'rgba(245,158,11,0.04)',
    },
  ];

  return (
    <>
      <style>{`
        .profile-input:focus { outline: none; }
        .save-btn:hover:not(:disabled) { transform: translateY(-1px); }
        .save-btn:active:not(:disabled) { transform: translateY(0); }
        .stat-tile { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .stat-tile:hover { transform: translateY(-3px); }
      `}</style>

      <div style={{ width: '100%', maxWidth: '760px', paddingBottom: '48px' }}>

        {/* ── Page Header ── */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '32px', fontWeight: 900, letterSpacing: '-0.02em',
            color: 'var(--text-primary)', margin: 0,
          }}>
            Your Profile
          </h1>
          <p style={{ marginTop: '6px', fontWeight: 500, fontSize: '15px', color: '#9ca3af' }}>
            Manage your personal information and financial goals.
          </p>
        </div>

        {/* ── Avatar Hero Card ── */}
        <div
          style={{
            borderRadius: '24px',
            overflow: 'hidden',
            marginBottom: '20px',
            background:   'linear-gradient(135deg, #065f46 0%, #0d9488 60%, #0f766e 100%)',
            boxShadow:    '0 8px 32px rgba(13,148,136,0.30)',
            position:     'relative',
          }}
        >
          {/* Background decorations */}
          <div style={{
            position: 'absolute', top: '-40px', right: '-40px',
            width: '220px', height: '220px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)', pointerEvents: 'none',
          }} />
          <div style={{
            position: 'absolute', bottom: '-60px', left: '30%',
            width: '180px', height: '180px', borderRadius: '50%',
            background: 'rgba(163,230,53,0.10)', pointerEvents: 'none',
          }} />

          <div style={{
            position: 'relative', zIndex: 1,
            display: 'flex', alignItems: 'center', gap: '24px',
            padding: '28px 32px',
          }}>
            {/* Avatar */}
            <div style={{
              width: '80px', height: '80px', borderRadius: '22px', flexShrink: 0,
              background: 'rgba(255,255,255,0.18)',
              border:     '2px solid rgba(255,255,255,0.28)',
              backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '32px', fontWeight: 900, color: '#ffffff',
              boxShadow: '0 8px 24px rgba(0,0,0,0.20)',
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>

            {/* Name + email */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{
                margin: 0, fontSize: '24px', fontWeight: 900,
                color: '#ffffff', letterSpacing: '-0.01em',
              }}>
                {user.name}
              </h2>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                marginTop: '8px',
                background: 'rgba(255,255,255,0.14)',
                border:     '1px solid rgba(255,255,255,0.20)',
                borderRadius: '999px',
                padding:    '4px 14px',
                fontSize:   '13px', fontWeight: 600, color: '#ccfbf1',
              }}>
                <Mail size={13} /> {user.email}
              </div>
            </div>

            {/* Premium badge */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: 'rgba(255,255,255,0.12)',
              border:     '1px solid rgba(255,255,255,0.20)',
              borderRadius: '12px',
              padding:    '8px 14px',
              fontSize:   '12px', fontWeight: 800,
              color: '#ffffff', letterSpacing: '0.04em',
              flexShrink: 0,
            }}>
              <Shield size={14} style={{ color: '#a3e635' }} />
              PREMIUM ✦
            </div>
          </div>
        </div>

        {/* ── Stat tiles ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px', marginBottom: '20px',
        }}>
          {statCards.map((s) => (
            <div
              key={s.label}
              className="stat-tile cashly-card"
              style={{
                borderRadius: '18px', padding: '20px',
                background: `linear-gradient(135deg, ${s.bgFrom}, ${s.bgTo})`,
              }}
            >
              <div style={{
                width: '38px', height: '38px', borderRadius: '11px',
                background: `${s.accent}22`,
                border: `1px solid ${s.accent}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: s.accent, marginBottom: '12px',
              }}>
                {s.icon}
              </div>
              <p style={{ margin: 0, fontSize: '22px', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {s.value}
              </p>
              <p style={{ margin: '4px 0 0', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Main form card ── */}
        <div
          className="cashly-card"
          style={{ borderRadius: '24px', padding: '32px', position: 'relative', overflow: 'hidden' }}
        >
          {/* Subtle blob */}
          <div style={{
            position: 'absolute', top: '-60px', right: '-60px',
            width: '200px', height: '200px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(13,148,136,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 1 }}>

            {/* Section label */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              marginBottom: '24px',
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '10px',
                background: 'rgba(13,148,136,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--teal-600)',
              }}>
                <User size={16} />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: '15px', color: 'var(--text-primary)' }}>
                  Personal Info
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
                  Update your name and view your email
                </p>
              </div>
            </div>

            {/* Alerts */}
            {success && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '14px 18px', borderRadius: '14px', marginBottom: '20px',
                background: 'rgba(16,185,129,0.10)',
                border: '1px solid rgba(16,185,129,0.25)',
                color: '#10b981', fontSize: '14px', fontWeight: 700,
              }}>
                <CheckCircle size={18} /> {success}
              </div>
            )}
            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '14px 18px', borderRadius: '14px', marginBottom: '20px',
                background: 'rgba(239,68,68,0.10)',
                border: '1px solid rgba(239,68,68,0.25)',
                color: '#ef4444', fontSize: '14px', fontWeight: 700,
              }}>
                <AlertCircle size={18} /> {error}
              </div>
            )}

            {/* Row 1: Name + Email */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              {/* Full Name */}
              <div>
                <label style={{
                  display: 'block', marginBottom: '8px',
                  fontSize: '12px', fontWeight: 700,
                  color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                    color: focused === 'name' ? 'var(--teal-500)' : 'var(--text-faint)',
                    display: 'flex', pointerEvents: 'none', transition: 'color 0.2s',
                  }}>
                    <User size={18} />
                  </div>
                  <input
                    className="profile-input"
                    type="text" name="name"
                    value={formData.name}
                    onChange={handleChange}
                    onFocus={() => setFocused('name')}
                    onBlur={() => setFocused('')}
                    required
                    placeholder="John Doe"
                    style={fieldStyle('name')}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={{
                  display: 'block', marginBottom: '8px',
                  fontSize: '12px', fontWeight: 700,
                  color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                    color: 'var(--text-faint)', display: 'flex', pointerEvents: 'none',
                  }}>
                    <Mail size={18} />
                  </div>
                  <input
                    className="profile-input"
                    type="email" value={user.email} disabled
                    style={disabledFieldStyle}
                  />
                </div>
                <p style={{
                  margin: '6px 0 0', fontSize: '11px', fontWeight: 600,
                  color: '#9ca3af', letterSpacing: '0.04em',
                }}>
                  🔒 Email cannot be changed
                </p>
              </div>
            </div>

            {/* Divider + Financial section */}
            <div style={{
              borderTop: `1px solid var(--border-card)`,
              paddingTop: '24px', marginTop: '4px',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                marginBottom: '24px',
              }}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '10px',
                  background: 'rgba(132,204,22,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#84cc16',
                }}>
                  <Wallet size={16} />
                </div>
                <div>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: '15px', color: 'var(--text-primary)' }}>
                    Financial Goals
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>
                    Set your income and savings targets
                  </p>
                </div>
              </div>

              {/* Row 2: Income + Savings */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Monthly Income */}
                <div>
                  <label style={{
                    display: 'block', marginBottom: '8px',
                    fontSize: '12px', fontWeight: 700,
                    color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    Monthly Income
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                      color: focused === 'monthlyIncome' ? 'var(--teal-500)' : 'var(--text-faint)',
                      display: 'flex', pointerEvents: 'none', transition: 'color 0.2s',
                    }}>
                      <Banknote size={18} />
                    </div>
                    <input
                      className="profile-input"
                      type="number" name="monthlyIncome"
                      value={formData.monthlyIncome}
                      onChange={handleChange}
                      onFocus={() => setFocused('monthlyIncome')}
                      onBlur={() => setFocused('')}
                      min="0" step="0.01"
                      placeholder="5000"
                      style={fieldStyle('monthlyIncome')}
                    />
                  </div>
                  <p style={{
                    margin: '6px 0 0', fontSize: '11px', fontWeight: 600,
                    color: '#9ca3af', letterSpacing: '0.04em',
                  }}>
                    Used for Money Health Score
                  </p>
                </div>

                {/* Savings Goal */}
                <div>
                  <label style={{
                    display: 'block', marginBottom: '8px',
                    fontSize: '12px', fontWeight: 700,
                    color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em',
                  }}>
                    Monthly Savings Goal
                  </label>
                  <div style={{ position: 'relative' }}>
                    <div style={{
                      position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                      color: focused === 'savingsGoal' ? '#84cc16' : 'var(--text-faint)',
                      display: 'flex', pointerEvents: 'none', transition: 'color 0.2s',
                    }}>
                      <Target size={18} />
                    </div>
                    <input
                      className="profile-input"
                      type="number" name="savingsGoal"
                      value={formData.savingsGoal}
                      onChange={handleChange}
                      onFocus={() => setFocused('savingsGoal')}
                      onBlur={() => setFocused('')}
                      min="0" step="0.01"
                      placeholder="1000"
                      style={{
                        ...fieldStyle('savingsGoal'),
                        boxShadow: focused === 'savingsGoal' ? '0 0 0 4px rgba(132,204,22,0.10)' : 'none',
                        border: `1.5px solid ${focused === 'savingsGoal' ? '#84cc16' : 'var(--border-card)'}`,
                      }}
                    />
                  </div>
                  <p style={{
                    margin: '6px 0 0', fontSize: '11px', fontWeight: 600,
                    color: '#9ca3af', letterSpacing: '0.04em',
                  }}>
                    Target to keep spending in check
                  </p>
                </div>
              </div>
              
              {/* Row 3: Currency */}
              <div style={{ marginTop: '20px', width: 'calc(50% - 10px)' }}>
                <label style={{
                  display: 'block', marginBottom: '8px',
                  fontSize: '12px', fontWeight: 700,
                  color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                  Preferred Currency
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                    color: focused === 'currency' ? 'var(--teal-500)' : 'var(--text-faint)',
                    display: 'flex', pointerEvents: 'none', transition: 'color 0.2s',
                  }}>
                    <Globe size={18} />
                  </div>
                  <select
                    className="profile-input"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    onFocus={() => setFocused('currency')}
                    onBlur={() => setFocused('')}
                    style={{
                      ...fieldStyle('currency'),
                      appearance: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {availableCurrencies.map(c => (
                      <option key={c.symbol} value={c.symbol}>{c.label}</option>
                    ))}
                  </select>
                  <div style={{
                    position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)',
                    pointerEvents: 'none', color: 'var(--text-faint)'
                  }}>
                    ▼
                  </div>
                </div>
                <p style={{
                  margin: '6px 0 0', fontSize: '11px', fontWeight: 600,
                  color: '#9ca3af', letterSpacing: '0.04em',
                }}>
                  This symbol will be used everywhere in the app
                </p>
              </div>
            </div>

            {/* Save Button */}
            <div style={{
              borderTop: `1px solid var(--border-card)`,
              paddingTop: '24px', marginTop: '28px',
              display: 'flex', justifyContent: 'flex-end', gap: '12px',
              alignItems: 'center',
            }}>
              {success && (
                <span style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  fontSize: '13px', fontWeight: 700, color: '#10b981',
                }}>
                  <CheckCircle size={15} /> Saved!
                </span>
              )}
              <button
                type="submit"
                disabled={loading}
                className="save-btn"
                style={{
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  gap:            '8px',
                  padding:        '14px 32px',
                  borderRadius:   '14px',
                  border:         'none',
                  cursor:         loading ? 'not-allowed' : 'pointer',
                  fontWeight:     800,
                  fontSize:       '14px',
                  color:          '#ffffff',
                  minWidth:       '200px',
                  opacity:        loading ? 0.72 : 1,
                  fontFamily:     'Inter, sans-serif',
                  transition:     'all 0.2s ease',
                  background:     loading
                    ? 'var(--teal-600)'
                    : 'linear-gradient(135deg, var(--teal-600), var(--teal-500))',
                  boxShadow: loading ? 'none' : '0 6px 20px rgba(13,148,136,0.35)',
                }}
              >
                {loading
                  ? <><Loader2 size={18} style={{ animation: 'spin 0.7s linear infinite' }} /> Saving…</>
                  : <><Save size={18} /> Save Profile Changes</>
                }
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
};

export default Profile;
