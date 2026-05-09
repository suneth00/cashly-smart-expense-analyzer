import React, { useEffect, useState, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import StatCard from '../components/StatCard';
import ChartCard from '../components/ChartCard';
import MoneyHealthCard from '../components/MoneyHealthCard';
import RecommendationsCard from '../components/RecommendationsCard';
import { Wallet, TrendingUp, Tag, ArrowRight, Plus, Activity, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#4f46e5', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#14b8a6', '#64748b'];

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axios.get('/analytics/summary');
        setData(res.data);
      } catch (err) {
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
        <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 p-6 rounded-2xl text-center font-semibold border border-rose-100 dark:border-rose-800/50">
        {error}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="w-full space-y-6">

      {/* ── Hero Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Welcome card */}
        <div className="lg:col-span-2 bg-indigo-600 rounded-2xl p-6 md:p-8 relative overflow-hidden text-white shadow-lg shadow-indigo-600/20">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-white/10">
              <Sparkles size={12} className="text-indigo-200" /> Overview
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
              Welcome back, {user?.name?.split(' ')[0] || 'User'}! 👋
            </h1>
            <p className="text-indigo-100 text-sm md:text-base font-medium max-w-md mb-6">
              Track your spending, hit your savings goals, and improve your money habits today.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/add-expense"
                className="bg-white text-indigo-600 px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
              >
                <Plus size={16} /> Add Expense
              </Link>
              <Link
                to="/receipt-scanner"
                className="bg-indigo-500/50 hover:bg-indigo-500/80 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors border border-indigo-400/40"
              >
                Scan Receipt
              </Link>
            </div>
          </div>
          <div className="absolute -right-16 -top-16 w-56 h-56 bg-indigo-400 rounded-full mix-blend-screen blur-3xl opacity-60 pointer-events-none" />
          <div className="absolute right-8 -bottom-16 w-44 h-44 bg-purple-500 rounded-full mix-blend-screen blur-3xl opacity-40 pointer-events-none" />
        </div>

        {/* Savings Goal card */}
        <div className="lg:col-span-1 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl p-6 md:p-8 text-white shadow-lg shadow-emerald-500/20 relative overflow-hidden flex flex-col justify-between">
          <div className="relative z-10">
            <p className="text-emerald-50 text-xs font-bold uppercase tracking-widest mb-2">Savings Goal</p>
            <p className="text-4xl font-black tracking-tight">
              ${(user?.savingsGoal || 0).toLocaleString()}
            </p>
          </div>
          <div className="relative z-10 mt-6 bg-black/10 rounded-2xl p-4 border border-white/10">
            <div className="flex items-start gap-3">
              <div className="bg-white/20 p-2 rounded-xl shrink-0">
                <Activity size={18} />
              </div>
              <p className="text-sm font-medium text-emerald-50 leading-snug">
                Keep spending below your monthly income to hit this goal!
              </p>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-300 rounded-full mix-blend-overlay blur-2xl opacity-50 pointer-events-none" />
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Total Expenses"
          amount={`$${data.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<Wallet size={24} className="text-indigo-600" />}
          colorClass="bg-indigo-50 text-indigo-600"
          subtitle="All time"
        />
        <StatCard
          title="Monthly Spending"
          amount={`$${data.monthlySpending.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<TrendingUp size={24} className="text-purple-600" />}
          colorClass="bg-purple-50 text-purple-600"
          subtitle="This month"
          trend={user?.monthlyIncome ? `${((data.monthlySpending / user.monthlyIncome) * 100).toFixed(0)}% of income` : null}
          trendUp={data.monthlySpending <= (user?.monthlyIncome || Infinity)}
        />
        <StatCard
          title="Top Category"
          amount={data.highestSpendingCategory || 'N/A'}
          icon={<Tag size={24} className="text-pink-600" />}
          colorClass="bg-pink-50 text-pink-600"
          subtitle="Highest spending area"
        />
        <StatCard
          title="Monthly Income"
          amount={`$${(user?.monthlyIncome || 0).toLocaleString()}`}
          icon={<Activity size={24} className="text-emerald-600" />}
          colorClass="bg-emerald-50 text-emerald-600"
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
            {data.dailySpendingTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.dailySpendingTrend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    dy={8}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `$${val}`}
                    dx={-5}
                  />
                  <RechartsTooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.12)', padding: '10px 14px' }}
                    labelStyle={{ color: '#64748b', fontWeight: 700, marginBottom: '4px' }}
                    formatter={(value) => [`$${value.toFixed(2)}`, 'Spent']}
                  />
                  <Bar dataKey="total" fill="url(#indigoGrad)" radius={[5, 5, 0, 0]} maxBarSize={42} />
                  <defs>
                    <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart icon={<TrendingUp size={28} className="text-indigo-400" />} label="No spending trend yet" />
            )}
          </ChartCard>

          <ChartCard title="Category Breakdown" subtitle="All time by category">
            {data.categorySummary.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.categorySummary}
                    dataKey="total"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={110}
                    paddingAngle={4}
                  >
                    {data.categorySummary.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.12)', padding: '10px 14px' }}
                    formatter={(value) => [`$${value.toFixed(2)}`, 'Spent']}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px', fontWeight: 600, color: '#64748b', paddingTop: '20px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart icon={<Tag size={28} className="text-pink-400" />} label="No category data yet" />
            )}
          </ChartCard>
        </div>

        {/* Recent Transactions */}
        <div className="xl:col-span-1">
          <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700/50 shrink-0">
              <div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100">Recent Activity</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">Latest transactions</p>
              </div>
              <Link
                to="/expenses"
                className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              >
                View All <ArrowRight size={13} />
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-50 dark:divide-slate-700/30">
              {data.recentTransactions.length > 0 ? (
                data.recentTransactions.map((tx) => (
                  <div key={tx._id} className="flex items-center justify-between px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 flex items-center justify-center font-black text-sm border border-slate-200/60 dark:border-slate-600/50 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:border-indigo-200 dark:group-hover:border-indigo-800/50 transition-colors shrink-0">
                        {tx.category.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate">{tx.title}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                          {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {tx.category}
                        </p>
                      </div>
                    </div>
                    <p className="font-black text-slate-800 dark:text-slate-100 text-sm shrink-0 ml-3">-${tx.amount.toFixed(2)}</p>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                  <div className="w-14 h-14 bg-slate-50 dark:bg-slate-700/50 rounded-2xl flex items-center justify-center mb-4 border border-slate-100 dark:border-slate-600/50">
                    <Wallet size={24} className="text-slate-300 dark:text-slate-500" />
                  </div>
                  <p className="font-bold text-slate-600 dark:text-slate-400 mb-1">No transactions yet</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mb-5">Add your first expense to start tracking.</p>
                  <Link to="/add-expense" className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-indigo-500/20 hover:bg-indigo-700 transition-colors">
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
  <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 m-2 p-8">
    <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-3 shadow-sm border border-slate-100 dark:border-slate-700">
      {icon}
    </div>
    <p className="font-bold text-slate-500 dark:text-slate-400 mb-1">{label}</p>
    <p className="text-sm">Add expenses to see your chart.</p>
  </div>
);

export default Dashboard;
