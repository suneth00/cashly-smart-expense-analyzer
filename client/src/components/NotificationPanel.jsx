import React, { useEffect, useRef, useState, useContext, useCallback } from 'react';
import { createPortal } from 'react-dom';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import {
  Bell, TrendingUp, TrendingDown, AlertTriangle,
  CheckCircle, Wallet, X, Sparkles,
} from 'lucide-react';
import { formatCurrency, formatCurrencyNoCents } from '../utils/currencyUtils';

// ─── Build notifications from analytics data ──────────────────────────────
function buildNotifications(data, user) {
  const notes = [];
  const monthlyIncome = user?.monthlyIncome || 0;
  const savingsGoal   = user?.savingsGoal   || 0;
  const monthly       = data?.monthlySpending || 0;
  const total         = data?.totalExpenses   || 0;
  const topCategory   = data?.highestSpendingCategory;

  if (monthlyIncome > 0 && monthly > monthlyIncome) {
    notes.push({
      id: 'over-budget', type: 'danger', icon: <AlertTriangle size={16} />,
      title: 'Over Budget!',
      body: `You've spent ${formatCurrencyNoCents(monthly, user?.currency)} this month — ${formatCurrencyNoCents(monthly - monthlyIncome, user?.currency)} over your income.`,
      time: 'Just now',
    });
  }

  if (monthlyIncome > 0 && monthly >= monthlyIncome * 0.8 && monthly <= monthlyIncome) {
    notes.push({
      id: 'near-budget', type: 'warning', icon: <TrendingUp size={16} />,
      title: 'Approaching Limit',
      body: `You've used ${((monthly / monthlyIncome) * 100).toFixed(0)}% of your monthly income.`,
      time: 'This month',
    });
  }

  if (savingsGoal > 0) {
    const saved = monthlyIncome - monthly;
    if (saved >= savingsGoal) {
      notes.push({
        id: 'savings-hit', type: 'success', icon: <CheckCircle size={16} />,
        title: 'Savings Goal Reached! 🎉',
        body: `You're on track to save ${formatCurrencyNoCents(saved, user?.currency)} — goal is ${formatCurrencyNoCents(savingsGoal, user?.currency)}.`,
        time: 'This month',
      });
    } else if (saved > 0) {
      const pct = Math.min(100, (saved / savingsGoal) * 100).toFixed(0);
      notes.push({
        id: 'savings-progress', type: 'info', icon: <Wallet size={16} />,
        title: `Savings Progress: ${pct}%`,
        body: `${formatCurrencyNoCents(saved, user?.currency)} saved of your ${formatCurrencyNoCents(savingsGoal, user?.currency)} goal this month.`,
        time: 'This month',
      });
    }
  }

  if (topCategory) {
    const cat = data.categorySummary?.find((c) => c.category === topCategory);
    if (cat) {
      notes.push({
        id: 'top-category', type: 'info', icon: <TrendingDown size={16} />,
        title: `Top Spend: ${topCategory}`,
        body: `You've spent ${formatCurrency(cat.total, user?.currency)} on ${topCategory}. Consider reviewing this category.`,
        time: 'All time',
      });
    }
  }

  if (total === 0) {
    notes.push({
      id: 'welcome', type: 'info', icon: <Sparkles size={16} />,
      title: 'Welcome to CASHLY!',
      body: 'Add your first expense to start getting personalized insights.',
      time: 'Now',
    });
  }

  return notes;
}

const typeConfig = {
  danger:  { accent: '#ef4444', iconBg: 'rgba(239,68,68,0.15)'  },
  warning: { accent: '#f59e0b', iconBg: 'rgba(245,158,11,0.15)' },
  success: { accent: '#10b981', iconBg: 'rgba(16,185,129,0.15)' },
  info:    { accent: '#0d9488', iconBg: 'rgba(13,148,136,0.13)' },
};

// ─── Portal dropdown ───────────────────────────────────────────────────────
const NotificationDropdown = ({ anchorRef, onClose, notifications, dismissed, onDismiss, onClearAll, loading }) => {
  const panelRef = useRef(null);
  const [pos, setPos] = useState({ top: 0, right: 0 });

  // Calculate position from anchor element
  const reposition = useCallback(() => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    setPos({
      top:   rect.bottom + 10,
      right: window.innerWidth - rect.right,
    });
  }, [anchorRef]);

  useEffect(() => {
    reposition();
    window.addEventListener('resize',   reposition);
    window.addEventListener('scroll',   reposition, true);
    return () => {
      window.removeEventListener('resize',  reposition);
      window.removeEventListener('scroll',  reposition, true);
    };
  }, [reposition]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        anchorRef.current && !anchorRef.current.contains(e.target)
      ) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose, anchorRef]);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const visible = notifications.filter((n) => !dismissed.includes(n.id));
  const unread  = visible.length;

  return createPortal(
    <>
      <style>{`
        @keyframes notifIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        #cashly-notif-panel {
          animation: notifIn 0.18s cubic-bezier(0.16,1,0.3,1);
        }
        #cashly-notif-panel .n-item:hover {
          background: rgba(13,148,136,0.06) !important;
        }
        #cashly-notif-panel .n-clear:hover {
          color: #ef4444 !important;
          background: rgba(239,68,68,0.08) !important;
        }
        #cashly-notif-panel .n-close:hover {
          background: var(--bg-subtle) !important;
          color: var(--text-primary) !important;
        }
        #cashly-notif-panel .n-dismiss:hover {
          background: rgba(239,68,68,0.12) !important;
          color: #ef4444 !important;
        }
        #cashly-notif-panel .n-scroll::-webkit-scrollbar { width: 4px; }
        #cashly-notif-panel .n-scroll::-webkit-scrollbar-thumb {
          background: var(--teal-200); border-radius: 10px;
        }
        @keyframes n-spin { to { transform: rotate(360deg); } }
      `}</style>

      <div
        id="cashly-notif-panel"
        ref={panelRef}
        style={{
          position:    'fixed',
          top:          pos.top,
          right:        pos.right,
          width:       '360px',
          maxWidth:    'calc(100vw - 16px)',
          background:  'var(--bg-card)',
          border:      '1px solid var(--border-card)',
          borderRadius:'20px',
          boxShadow:   '0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(13,148,136,0.10)',
          zIndex:       99999,
          overflow:    'hidden',
          fontFamily:  'Inter, sans-serif',
        }}
      >
        {/* ── Header ── */}
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '14px 18px',
          borderBottom:   '1px solid var(--border-card)',
        }}>
          <div>
            <p style={{ margin: 0, fontWeight: 800, fontSize: '14px', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              Notifications
            </p>
            {unread > 0 && (
              <p style={{ margin: '2px 0 0', fontSize: '11px', fontWeight: 600, color: 'var(--teal-600)' }}>
                {unread} unread alert{unread !== 1 ? 's' : ''}
              </p>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {unread > 0 && (
              <button
                className="n-clear"
                onClick={onClearAll}
                style={{
                  fontSize: '11px', fontWeight: 700,
                  color: 'var(--text-muted)',
                  background: 'none', border: 'none',
                  cursor: 'pointer',
                  padding: '4px 10px', borderRadius: '8px',
                  transition: 'all 0.15s ease',
                }}
              >
                Clear all
              </button>
            )}
            <button
              className="n-close"
              onClick={onClose}
              aria-label="Close notifications"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '28px', height: '28px', borderRadius: '8px',
                border: 'none', background: 'none',
                color: 'var(--text-muted)', cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="n-scroll" style={{ maxHeight: '340px', overflowY: 'auto' }}>
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 20px' }}>
              <div style={{
                width: '28px', height: '28px',
                border: '2.5px solid var(--border-card)',
                borderTopColor: 'var(--teal-500)',
                borderRadius: '50%',
                animation: 'n-spin 0.7s linear infinite',
              }} />
            </div>
          ) : visible.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '40px 20px', textAlign: 'center',
            }}>
              <div style={{
                width: '52px', height: '52px',
                background: 'rgba(16,185,129,0.1)',
                borderRadius: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '12px',
              }}>
                <CheckCircle size={24} style={{ color: '#10b981' }} />
              </div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)' }}>
                All caught up!
              </p>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                No new notifications right now.
              </p>
            </div>
          ) : (
            visible.map((n, idx) => {
              const cfg = typeConfig[n.type] || typeConfig.info;
              return (
                <div
                  key={n.id}
                  className="n-item"
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: '12px',
                    padding: '13px 16px',
                    borderBottom: idx < visible.length - 1 ? '1px solid var(--border-card)' : 'none',
                    transition: 'background 0.15s ease',
                  }}
                >
                  <div style={{
                    flexShrink: 0,
                    width: '34px', height: '34px', borderRadius: '10px',
                    background: cfg.iconBg, color: cfg.accent,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginTop: '1px',
                  }}>
                    {n.icon}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '13px', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                      {n.title}
                    </p>
                    <p style={{ margin: '3px 0 0', fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      {n.body}
                    </p>
                    <p style={{ margin: '5px 0 0', fontSize: '10px', fontWeight: 600, color: cfg.accent, opacity: 0.8 }}>
                      {n.time}
                    </p>
                  </div>

                  <button
                    className="n-dismiss"
                    onClick={() => onDismiss(n.id)}
                    aria-label="Dismiss notification"
                    style={{
                      flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: '24px', height: '24px', borderRadius: '6px',
                      border: 'none', background: 'none',
                      color: 'var(--text-faint)', cursor: 'pointer',
                      transition: 'all 0.15s ease', marginTop: '1px',
                    }}
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* ── Footer ── */}
        {!loading && visible.length > 0 && (
          <div style={{
            padding: '10px 18px',
            borderTop: '1px solid var(--border-card)',
            background: 'var(--bg-subtle)',
            textAlign: 'center',
          }}>
            <p style={{ margin: 0, fontSize: '10px', fontWeight: 600, color: 'var(--text-faint)', letterSpacing: '0.02em' }}>
              Alerts generated from your real spending data
            </p>
          </div>
        )}
      </div>
    </>,
    document.body
  );
};

// ─── Main component ────────────────────────────────────────────────────────
const NotificationPanel = () => {
  const { user } = useContext(AuthContext);
  const bellRef = useRef(null);

  const [open,          setOpen]          = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [dismissed,     setDismissed]     = useState(() => {
    try { return JSON.parse(localStorage.getItem('cashly_dismissed_notifs') || '[]'); }
    catch { return []; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get('/analytics/summary');
        setNotifications(buildNotifications(res.data, user));
      } catch { }
      finally { setLoading(false); }
    };
    if (user) load();
    else setLoading(false);
  }, [user]);

  const visible = notifications.filter((n) => !dismissed.includes(n.id));
  const unread  = visible.length;

  const dismiss = (id) => {
    const next = [...dismissed, id];
    setDismissed(next);
    localStorage.setItem('cashly_dismissed_notifs', JSON.stringify(next));
  };

  const clearAll = () => {
    const next = [...dismissed, ...visible.map((n) => n.id)];
    setDismissed(next);
    localStorage.setItem('cashly_dismissed_notifs', JSON.stringify(next));
  };

  return (
    <>
      <style>{`
        @keyframes badgePulse {
          0%, 100% { transform: scale(1);   opacity: 1; }
          50%       { transform: scale(1.2); opacity: 0.8; }
        }
        #notifications-bell-btn { position: relative; }
      `}</style>

      {/* Bell button — used as anchor for portal positioning */}
      <button
        id="notifications-bell-btn"
        ref={bellRef}
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((p) => !p)}
        style={{
          position:        'relative',
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          width:           '40px',
          height:          '40px',
          borderRadius:    '50%',
          border:          'none',
          cursor:          'pointer',
          background:      open ? 'rgba(13,148,136,0.15)' : 'transparent',
          color:           open ? 'var(--teal-600)' : 'var(--text-muted)',
          transition:      'all 0.2s ease',
        }}
        onMouseEnter={e => {
          if (!open) {
            e.currentTarget.style.background = 'rgba(13,148,136,0.10)';
            e.currentTarget.style.color      = 'var(--teal-600)';
          }
        }}
        onMouseLeave={e => {
          if (!open) {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color      = 'var(--text-muted)';
          }
        }}
      >
        <Bell size={20} />

        {unread > 0 && (
          <span style={{
            position:    'absolute',
            top:         '6px',
            right:       '6px',
            minWidth:    '16px',
            height:      '16px',
            background:  '#ef4444',
            color:       '#fff',
            fontSize:    '9px',
            fontWeight:  '800',
            borderRadius:'999px',
            display:     'flex',
            alignItems:  'center',
            justifyContent: 'center',
            padding:     '0 3px',
            border:      '2px solid var(--bg-card)',
            animation:   'badgePulse 2s ease-in-out infinite',
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Portal dropdown — renders on document.body, always on top */}
      {open && (
        <NotificationDropdown
          anchorRef={bellRef}
          onClose={() => setOpen(false)}
          notifications={notifications}
          dismissed={dismissed}
          onDismiss={dismiss}
          onClearAll={clearAll}
          loading={loading}
        />
      )}
    </>
  );
};

export default NotificationPanel;
