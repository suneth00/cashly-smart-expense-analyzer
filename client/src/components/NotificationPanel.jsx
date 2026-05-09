import React, { useEffect, useRef, useState, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Bell, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Wallet, X, Sparkles } from 'lucide-react';

// ─── Build notifications from analytics data ───────────────────────────────
function buildNotifications(data, user) {
  const notes = [];
  const monthlyIncome = user?.monthlyIncome || 0;
  const savingsGoal = user?.savingsGoal || 0;
  const monthly = data?.monthlySpending || 0;
  const total = data?.totalExpenses || 0;
  const topCategory = data?.highestSpendingCategory;

  if (monthlyIncome > 0 && monthly > monthlyIncome) {
    notes.push({
      id: 'over-budget', type: 'danger', icon: <AlertTriangle size={16} />,
      title: 'Over Budget!',
      body: `You've spent $${monthly.toFixed(0)} this month — $${(monthly - monthlyIncome).toFixed(0)} over your income.`,
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
        body: `You're on track to save $${saved.toFixed(0)} — goal is $${savingsGoal.toFixed(0)}.`,
        time: 'This month',
      });
    } else if (saved > 0) {
      const pct = Math.min(100, ((saved / savingsGoal) * 100)).toFixed(0);
      notes.push({
        id: 'savings-progress', type: 'info', icon: <Wallet size={16} />,
        title: `Savings Progress: ${pct}%`,
        body: `$${saved.toFixed(0)} saved of your $${savingsGoal.toFixed(0)} goal this month.`,
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
        body: `You've spent $${cat.total.toFixed(2)} on ${topCategory}. Consider reviewing this category.`,
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

const typeStyles = {
  danger:  { icon: 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400',    bg: 'hover:bg-rose-50/50 dark:hover:bg-rose-900/10' },
  warning: { icon: 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400', bg: 'hover:bg-amber-50/50 dark:hover:bg-amber-900/10' },
  success: { icon: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400', bg: 'hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10' },
  info:    { icon: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400',    bg: 'hover:bg-slate-50/70 dark:hover:bg-slate-700/30' },
};

const NotificationPanel = () => {
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [dismissed, setDismissed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cashly_dismissed_notifs') || '[]'); }
    catch { return []; }
  });
  const [loading, setLoading] = useState(true);
  const panelRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get('/analytics/summary');
        setNotifications(buildNotifications(res.data, user));
      } catch { } finally { setLoading(false); }
    };
    if (user) load();
  }, [user]);

  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const visible = notifications.filter((n) => !dismissed.includes(n.id));
  const unread = visible.length;

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
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen((p) => !p)}
        className={`relative p-2.5 rounded-full transition-colors ${
          open
            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
            : 'text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'
        }`}
        aria-label="Notifications"
        id="notifications-bell-btn"
      >
        <Bell size={20} />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 ring-2 ring-white dark:ring-slate-900 animate-pulse">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute right-0 top-[calc(100%+10px)] w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-2xl shadow-slate-200/60 dark:shadow-black/40 z-50 overflow-hidden"
          style={{ animation: 'slideDown 0.18s ease' }}
          id="notifications-panel"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-700/50">
            <div>
              <p className="font-black text-slate-800 dark:text-slate-100 text-sm">Notifications</p>
              {unread > 0 && (
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">{unread} unread alert{unread !== 1 ? 's' : ''}</p>
              )}
            </div>
            {unread > 0 && (
              <button
                onClick={clearAll}
                className="text-xs font-bold text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors px-2 py-1 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Body */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-50 dark:divide-slate-700/30">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-indigo-500" />
              </div>
            ) : visible.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-3">
                  <CheckCircle size={22} className="text-emerald-500" />
                </div>
                <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">All caught up!</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">No new notifications right now.</p>
              </div>
            ) : (
              visible.map((n) => {
                const s = typeStyles[n.type] || typeStyles.info;
                return (
                  <div key={n.id} className={`flex items-start gap-3 px-5 py-4 ${s.bg} transition-colors`}>
                    <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-0.5 ${s.icon}`}>
                      {n.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-snug">{n.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{n.body}</p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-1.5">{n.time}</p>
                    </div>
                    <button
                      onClick={() => dismiss(n.id)}
                      className="shrink-0 p-1 text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors mt-0.5"
                      aria-label="Dismiss notification"
                    >
                      <X size={13} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {!loading && visible.length > 0 && (
            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30">
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium text-center">
                Alerts are generated from your real spending data
              </p>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default NotificationPanel;
