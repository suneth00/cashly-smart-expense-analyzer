import { useEffect, useState, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import CategoryBreakdownCard from '../components/CategoryBreakdownCard';
import MoneyHealthCard from '../components/MoneyHealthCard';
import RecommendationsCard from '../components/RecommendationsCard';
import { Wallet, TrendingUp, Tag, ArrowRight, Plus, Activity, Sparkles, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  ReferenceLine
} from 'recharts';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { isDark } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('/analytics/summary');
        setData(res.data);
      } catch {
        setError('Failed to load dashboard data. Please make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div
          className="animate-spin rounded-full h-10 w-10 border-b-4"
          style={{ borderColor: 'var(--teal-600)' }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="p-6 rounded-2xl text-center font-semibold"
        style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca' }}
      >
        {error}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="w-full space-y-6">

      {/* ── Hero Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Welcome card — animated dark teal gradient */}
        <div
          className="lg:col-span-2 hero-gradient rounded-2xl p-6 md:p-8 relative overflow-hidden text-white"
          style={{ boxShadow: '0 8px 32px rgba(13,148,136,0.30)' }}
        >
          <div className="relative z-10">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)' }}
            >
              <Sparkles size={12} className="text-lime-300" /> Overview
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
              Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
            </h1>
            <p className="text-teal-100 text-sm md:text-base font-medium max-w-md mb-6 opacity-90">
              Track your spending, hit your savings goals, and improve your money habits today.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/add-expense"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm hover:-translate-y-0.5 transition-all"
                style={{
                  background: '#ffffff',
                  color: 'var(--teal-700)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                }}
              >
                <Plus size={16} /> Add Expense
              </Link>
              <Link
                to="/receipt-scanner"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors"
                style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.22)', color: '#fff' }}
              >
                <Leaf size={15} /> Scan Receipt
              </Link>
            </div>
          </div>
          {/* Decorative blobs */}
          <div className="absolute -right-16 -top-16 w-56 h-56 bg-teal-400 rounded-full mix-blend-screen blur-3xl opacity-25 pointer-events-none" />
          <div className="absolute right-8 -bottom-16 w-44 h-44 rounded-full mix-blend-screen blur-3xl opacity-20 pointer-events-none" style={{ background: '#84cc16' }} />
        </div>

        {/* Savings Goal card */}
        <div
          className="lg:col-span-1 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden flex flex-col justify-between"
          style={{
            background: 'linear-gradient(135deg, #065f46, #0d9488)',
            boxShadow: '0 8px 28px rgba(13,148,136,0.28)',
          }}
        >
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-widest mb-2 opacity-70">Savings Goal</p>
            <p className="text-4xl font-black tracking-tight">
              ${(user?.savingsGoal || 0).toLocaleString()}
            </p>
          </div>
          <div
            className="relative z-10 mt-6 rounded-2xl p-4"
            style={{ background: 'rgba(0,0,0,0.12)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl shrink-0" style={{ background: 'rgba(255,255,255,0.18)' }}>
                <Activity size={18} />
              </div>
              <p className="text-sm font-medium leading-snug opacity-90">
                Keep spending below your monthly income to hit this goal!
              </p>
            </div>
          </div>
          {/* Lime accent dot cluster */}
          <div className="absolute top-4 right-4 flex gap-1">
            {[1,2,3].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(163,230,53,0.6)' }} />
            ))}
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-2xl opacity-20 pointer-events-none" style={{ background: '#84cc16' }} />
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Expenses"
          amount={`$${data.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<Wallet size={22} />}
          accentColor="#0d9488"
          subtitle="All time"
        />
        <StatCard
          title="Monthly Spending"
          amount={`$${data.monthlySpending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<TrendingUp size={22} />}
          accentColor="#14b8a6"
          subtitle="This month"
          trend={user?.monthlyIncome ? `${((data.monthlySpending / user.monthlyIncome) * 100).toFixed(0)}% of income` : null}
          trendUp={data.monthlySpending <= (user?.monthlyIncome || Infinity)}
        />
        <StatCard
          title="Top Category"
          amount={data.highestSpendingCategory || 'N/A'}
          icon={<Tag size={22} />}
          accentColor="#84cc16"
          subtitle="Highest spending area"
        />
        <StatCard
          title="Monthly Income"
          amount={`$${(user?.monthlyIncome || 0).toLocaleString()}`}
          icon={<Activity size={22} />}
          accentColor="#0f766e"
          subtitle="Your set income"
        />
      </div>

      {/* ── Health Score + Recommendations ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <MoneyHealthCard />
        </div>
        <div className="xl:col-span-2">
          <RecommendationsCard />
        </div>
      </div>

      {/* ── Charts + Recent Transactions ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Charts */}
        <div className="xl:col-span-2 space-y-6">
          <ChartCard title="Daily Spending Trend" subtitle="Last 30 days">
            {data.dailySpendingTrend.length > 0 ? (() => {
              const avg = data.dailySpendingTrend.reduce((s, d) => s + d.total, 0) / data.dailySpendingTrend.length;
              const tickStep = Math.max(1, Math.ceil(data.dailySpendingTrend.length / 7));
              return (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data.dailySpendingTrend}
                    margin={{ top: 18, right: 16, left: -10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor="#0d9488" stopOpacity={0.35} />
                        <stop offset="60%"  stopColor="#0d9488" stopOpacity={0.08} />
                        <stop offset="100%" stopColor="#0d9488" stopOpacity={0} />
                      </linearGradient>
                      <filter id="lineShadow" x="-5%" y="-10%" width="110%" height="130%">
                        <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#0d9488" floodOpacity="0.35" />
                      </filter>
                    </defs>

                    <CartesianGrid
                      strokeDasharray="4 4"
                      vertical={false}
                      stroke={isDark ? '#1a3535' : '#e6faf8'}
                    />

                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: isDark ? '#4a7a76' : '#9ca3af', fontWeight: 600 }}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                      interval={tickStep - 1}
                      tickFormatter={(val) => {
                        const d = new Date(val);
                        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      }}
                    />

                    <YAxis
                      tick={{ fontSize: 11, fill: isDark ? '#4a7a76' : '#9ca3af', fontWeight: 600 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => val === 0 ? '' : `$${val}`}
                      width={52}
                    />

                    {/* Average reference line */}
                    <ReferenceLine
                      y={avg}
                      stroke={isDark ? '#2dd4bf' : '#0d9488'}
                      strokeDasharray="6 4"
                      strokeWidth={1.5}
                      strokeOpacity={0.6}
                      label={{
                        value: `Avg $${avg.toFixed(0)}`,
                        position: 'insideTopRight',
                        fontSize: 10,
                        fontWeight: 700,
                        fill: isDark ? '#2dd4bf' : '#0d9488',
                        dy: -6,
                      }}
                    />

                    <RechartsTooltip
                      cursor={{
                        stroke: isDark ? '#2dd4bf' : '#0d9488',
                        strokeWidth: 1.5,
                        strokeDasharray: '4 4',
                      }}
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null;
                        const d = new Date(label);
                        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
                        const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        const val = payload[0].value;
                        const diff = val - avg;
                        return (
                          <div style={{
                            background: isDark ? '#0f2323' : '#ffffff',
                            border: `1px solid ${isDark ? '#1a3d3d' : '#ccfbf1'}`,
                            borderRadius: '14px',
                            padding: '12px 16px',
                            boxShadow: '0 12px 32px rgba(13,148,136,0.18)',
                            minWidth: '150px',
                          }}>
                            <p style={{ fontSize: 11, fontWeight: 800, color: isDark ? '#4a7a76' : '#9ca3af', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                              {dayName} · {dateStr}
                            </p>
                            <p style={{ fontSize: 22, fontWeight: 900, color: '#0d9488', lineHeight: 1, marginBottom: 6 }}>
                              ${val.toFixed(2)}
                            </p>
                            <p style={{
                              fontSize: 11, fontWeight: 700,
                              color: diff > 0 ? '#f87171' : '#34d399',
                            }}>
                              {diff > 0 ? '▲' : '▼'} ${Math.abs(diff).toFixed(2)} vs avg
                            </p>
                          </div>
                        );
                      }}
                    />

                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="#0d9488"
                      strokeWidth={2.5}
                      fill="url(#areaGrad)"
                      filter="url(#lineShadow)"
                      dot={false}
                      activeDot={{
                        r: 6,
                        fill: '#0d9488',
                        stroke: isDark ? '#0f2323' : '#ffffff',
                        strokeWidth: 3,
                        filter: 'url(#lineShadow)',
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              );
            })() : (
              <EmptyChart icon={<TrendingUp size={28} style={{ color: 'var(--teal-400)' }} />} label="No spending trend yet" />
            )}
          </ChartCard>

          <CategoryBreakdownCard
            categorySummary={data.categorySummary}
            periodLabel="All time"
          />
        </div>

        {/* Recent Transactions */}
        <div className="xl:col-span-1">
          <div
            className="rounded-2xl h-full flex flex-col cashly-card"
            style={{ minHeight: '200px' }}
          >
            <div
              className="flex items-center justify-between p-6 shrink-0"
              style={{ borderBottom: `1px solid ${isDark ? '#0d2020' : '#ecfdf5'}` }}
            >
              <div>
                <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>Recent Activity</h3>
                <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-faint)' }}>Latest transactions</p>
              </div>
              <Link
                to="/expenses"
                className="text-xs font-bold flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors"
                style={{ color: 'var(--teal-600)', background: 'var(--teal-50)', border: '1px solid #99f6e4' }}
              >
                View All <ArrowRight size={13} />
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar" style={{ borderTop: 'none' }}>
              {data.recentTransactions.length > 0 ? (
                data.recentTransactions.map((tx) => (
                  <div
                    key={tx._id}
                    className="flex items-center justify-between px-5 py-4 transition-colors group cursor-default"
                    style={{ borderBottom: `1px solid ${isDark ? '#0d2020' : '#f0fdf4'}` }}
                    onMouseEnter={e => e.currentTarget.style.background = isDark ? 'var(--bg-subtle)' : '#f0fdf4'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-colors"
                        style={{ background: isDark ? 'var(--bg-subtle)' : '#ecfdf5', color: 'var(--teal-700)', border: `1px solid ${isDark ? '#0d2626' : '#d1fae5'}` }}
                      >
                        {tx.category.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{tx.title}</p>
                        <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-faint)' }}>
                          {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {tx.category}
                        </p>
                      </div>
                    </div>
                    <p className="font-black text-sm shrink-0 ml-3" style={{ color: 'var(--text-primary)' }}>
                      -${tx.amount.toFixed(2)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: 'var(--bg-subtle)', border: `1px solid ${isDark ? '#0d2626' : '#d1fae5'}` }}
                  >
                    <Wallet size={24} style={{ color: '#99f6e4' }} />
                  </div>
                  <p className="font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>No transactions yet</p>
                  <p className="text-sm font-medium mb-5" style={{ color: 'var(--text-faint)' }}>Add your first expense to start tracking.</p>
                  <Link
                    to="/add-expense"
                    className="btn-teal px-4 py-2.5 text-sm"
                  >
                    Add Expense
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/** Shared empty state for charts */
const EmptyChart = ({ icon, label }) => (
  <div
    className="h-full flex flex-col items-center justify-center rounded-2xl m-2 p-8"
    style={{
      background: 'var(--bg-subtle)',
      border: '1px dashed #99f6e4',
      color: 'var(--text-faint)',
    }}
  >
    <div
      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card, #d1fae5)' }}
    >
      {icon}
    </div>
    <p className="font-bold mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
    <p className="text-sm">Add expenses to see your chart.</p>
  </div>
);

export default Dashboard;
