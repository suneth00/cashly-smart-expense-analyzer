import { useEffect, useState, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import CategoryBreakdownCard from '../components/CategoryBreakdownCard';
import MoneyHealthCard from '../components/MoneyHealthCard';
import RecommendationsCard from '../components/RecommendationsCard';
import {
  BarChart2, Wallet, TrendingDown, Target,
  ArrowUpRight, Sparkles,
} from 'lucide-react';
import { formatCurrency } from '../utils/currencyUtils';

const Analytics = () => {
  const { user } = useContext(AuthContext);
  const { isDark } = useTheme();
  const [summary, setSummary]             = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError]   = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        // Fetches analytics data used by quick stats and category charts.
        const res = await axios.get('/analytics/summary');
        setSummary(res.data);
      } catch {
        setSummaryError('Failed to load category data.');
      } finally {
        setSummaryLoading(false);
      }
    };
    fetchSummary();
  }, []);

  /* ── Quick-stat tiles derived from summary ── */
  // These values summarize spending, remaining budget, and savings progress.
  const totalExpenses  = summary?.totalExpenses   || 0;
  const monthlySpend   = summary?.monthlySpending  || 0;
  const income         = user?.monthlyIncome       || 0;
  const savingsGoal    = user?.savingsGoal         || 0;
  const remaining      = Math.max(0, income - monthlySpend);
  const savingsPct     = savingsGoal > 0
    ? Math.min(100, Math.round((remaining / savingsGoal) * 100))
    : null;

  const quickStats = [
    {
      id:      'total',
      icon:    <Wallet size={20} />,
      label:   'Total Expenses',
      value:   formatCurrency(totalExpenses, user?.currency),
      accent:  'var(--teal-600)',
      iconBg:  'rgba(13,148,136,0.12)',
    },
    {
      id:      'monthly',
      icon:    <TrendingDown size={20} />,
      label:   'This Month',
      value:   formatCurrency(monthlySpend, user?.currency),
      accent:  income > 0 && monthlySpend > income ? '#ef4444' : '#f59e0b',
      iconBg:  income > 0 && monthlySpend > income
                 ? 'rgba(239,68,68,0.12)'
                 : 'rgba(245,158,11,0.12)',
    },
    {
      id:      'remaining',
      icon:    <Target size={20} />,
      label:   'Remaining Budget',
      value:   income > 0 ? formatCurrency(remaining, user?.currency) : '—',
      accent:  '#10b981',
      iconBg:  'rgba(16,185,129,0.12)',
    },
    {
      id:      'savings',
      icon:    <ArrowUpRight size={20} />,
      label:   'Savings Progress',
      value:   savingsPct !== null ? `${savingsPct}%` : '—',
      accent:  '#84cc16',
      iconBg:  'rgba(132,204,22,0.12)',
    },
  ];

  return (
    <>
      <style>{`
        .analytics-stat:hover { transform: translateY(-3px); }
        .analytics-stat { transition: transform 0.18s ease, box-shadow 0.18s ease; }
      `}</style>

      <div style={{ width: '100%', paddingBottom: '48px' }}>

        {/* ── Page Header ── */}
        <div style={{
          display: 'flex', alignItems: 'flex-start',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px',
          marginBottom: '28px',
        }}>
          <div>
            <h1 style={{
              margin: 0, fontSize: '32px', fontWeight: 900,
              letterSpacing: '-0.02em', color: 'var(--text-primary)',
            }}>
              Financial AI Insights
            </h1>
            <p style={{
              marginTop: '6px', fontSize: '15px', fontWeight: 500,
              color: '#9ca3af',
            }}>
              Deep dive into your financial health and get personalized recommendations.
            </p>
          </div>

          {/* Live badge */}
          <div
            title="Insights are generated in real-time based on your latest transactions."
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '8px 16px', borderRadius: '999px',
              background: isDark ? '#122828' : '#ecfdf5',
              border: `1px solid ${isDark ? '#0d2626' : '#99f6e4'}`,
              color: isDark ? '#99f6e4' : 'var(--teal-700)',
              fontSize: '13px', fontWeight: 700,
              cursor: 'help',
            }}
          >
            <span style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: '#84cc16',
              boxShadow: '0 0 0 3px rgba(132,204,22,0.25)',
              display: 'inline-block',
            }} />
            <Sparkles size={14} />
            AI-Powered · Live Data
          </div>
        </div>

        {/* ── Quick Stats Row ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px', marginBottom: '24px',
        }}>
          {quickStats.map((s) => (
            <div
              key={s.id}
              className="analytics-stat cashly-card"
              style={{ borderRadius: '20px', padding: '20px' }}
            >
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: s.iconBg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: s.accent, marginBottom: '14px',
              }}>
                {s.icon}
              </div>
              <p style={{
                margin: '0 0 4px', fontSize: '22px', fontWeight: 900,
                color: 'var(--text-primary)', letterSpacing: '-0.02em',
              }}>
                {summaryLoading ? (
                  <span style={{
                    display: 'inline-block', width: '80px', height: '22px',
                    borderRadius: '8px', background: 'var(--bg-subtle)',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }} />
                ) : s.value}
              </p>
              <p style={{
                margin: 0, fontSize: '12px', fontWeight: 600,
                color: 'var(--text-muted)',
              }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Section label ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          marginBottom: '16px',
        }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '10px',
            background: 'rgba(13,148,136,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--teal-600)',
          }}>
            <BarChart2 size={16} />
          </div>
          <p style={{
            margin: 0, fontWeight: 800, fontSize: '15px',
            color: 'var(--text-primary)',
          }}>
            Health & Recommendations
          </p>
        </div>

        {/* ── Health + Recommendations ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 2fr',
          gap: '20px', marginBottom: '24px',
        }}>
          {/* Money Health Score and Smart Advice are fetched in these cards. */}
          <MoneyHealthCard />
          <RecommendationsCard />
        </div>

        {/* ── Category Breakdown ── */}
        <CategoryBreakdownCard
          categorySummary={summary?.categorySummary || []}
          periodLabel="All time"
          isLoading={summaryLoading}
          error={summaryError}
        />
      </div>
    </>
  );
};

export default Analytics;
