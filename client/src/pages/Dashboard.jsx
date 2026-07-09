import { useEffect, useState, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ChartCard from '../components/ChartCard';
import CategoryBreakdownCard from '../components/CategoryBreakdownCard';
import {
  Wallet, TrendingUp, Tag, ArrowRight, Plus, Activity,
  Sparkles, ScanLine, CheckCircle, AlertTriangle, Info,
  CreditCard, Target, BookOpen, ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { formatCurrency } from '../utils/currencyUtils';

/* ── helpers ── */
const fmt = (n, currency, decimals = 2) => formatCurrency(n, currency, { decimals });
const fmtAxis = (n, currency = '$') => {
  const value = Number(n) || 0;
  if (Math.abs(value) >= 1000000) return `${currency}${(value / 1000000).toFixed(1)}M`;
  if (Math.abs(value) >= 1000) return `${currency}${(value / 1000).toFixed(value >= 10000 ? 0 : 1)}k`;
  return `${currency}${value}`;
};

const Dashboard = () => {
  const { user }   = useContext(AuthContext);
  const { isDark } = useTheme();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    axios.get('/analytics/summary')
      .then(r => setData(r.data))
      .catch(() => setError('Failed to load dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
      <div style={{
        width: '40px', height: '40px', borderRadius: '50%',
        border: '4px solid var(--border-card)',
        borderTopColor: 'var(--teal-600)',
        animation: 'db-spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes db-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{
      padding: '20px 24px', borderRadius: '16px',
      background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.25)',
      color: '#ef4444', fontWeight: 600,
    }}>{error}</div>
  );

  if (!data) return null;

  /* derived values */
  const income       = user?.monthlyIncome || 0;
  const savingsGoal  = user?.savingsGoal   || 0;
  const monthly      = data.monthlySpending || 0;
  const total        = data.totalExpenses   || 0;
  const budgetUsed   = income > 0 ? Math.min(100, (monthly / income) * 100) : 0;
  const budgetLeft   = Math.max(0, income - monthly);
  const savedAmt     = Math.max(0, income - monthly);
  const savingsPct   = savingsGoal > 0 ? Math.min(100, (savedAmt / savingsGoal) * 100) : 0;
  const overBudget   = income > 0 && monthly > income;
  const nearBudget   = income > 0 && monthly >= income * 0.8 && !overBudget;
  const firstName    = user?.name?.split(' ')[0] || 'there';

  /* greeting */
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  /* budget bar color */
  const budgetColor = overBudget ? '#ef4444' : nearBudget ? '#f59e0b' : '#10b981';

  /* "What to do next" steps */
  const steps = [];
  if (!income)      steps.push({ icon: '💰', text: 'Set your monthly income in Profile', to: '/profile', done: false });
  if (!savingsGoal) steps.push({ icon: '🎯', text: 'Set a savings goal in Profile',       to: '/profile', done: false });
  if (total === 0)  steps.push({ icon: '📝', text: 'Add your first expense',              to: '/add-expense', done: false });
  else              steps.push({ icon: '✅', text: 'You\'re tracking expenses — great!',  to: '/expenses', done: true });
  if (income && total > 0) steps.push({ icon: '📊', text: 'Check your AI insights in Analytics', to: '/analytics', done: false });

  return (
    <>
      <style>{`
        @keyframes db-spin    { to { transform: rotate(360deg); } }
        @keyframes db-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        @keyframes db-fadeIn  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes db-grow    { from{width:0} to{width:var(--target-w)} }
        @keyframes gradientShift {
          0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%}
        }
        .db-card  { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .db-card:hover { transform: translateY(-2px); }
        .db-action { transition: all 0.18s ease; }
        .db-action:hover { transform: translateY(-2px); filter: brightness(1.08); }
        .db-tx:hover { background: var(--bg-subtle) !important; }
        .db-step:hover { border-color: var(--teal-500) !important; background: rgba(13,148,136,0.05) !important; }
        .db-chart-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 16px;
          margin-bottom: 20px;
          width: 100%;
        }
        .db-chart-pane,
        .db-recent-pane {
          min-width: 0;
          width: 100%;
          overflow: hidden;
        }
        @media (min-width: 1280px) {
          .db-chart-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
            align-items: stretch;
          }
          .db-chart-pane {
            grid-column: span 2 / span 2;
          }
          .db-recent-pane {
            grid-column: span 1 / span 1;
          }
        }
      `}</style>

      <div style={{ width: '100%', paddingBottom: '48px', animation: 'db-fadeIn 0.3s ease' }}>

        {/* ════════════════════════════════════════
            SECTION 1 — WELCOME HERO
        ════════════════════════════════════════ */}
        <div style={{
          background: 'linear-gradient(135deg, #0d4f4f, #0d9488, #0f766e, #134e4a)',
          backgroundSize: '300% 300%',
          animation: 'gradientShift 8s ease infinite',
          borderRadius: '24px',
          padding: '32px',
          color: '#fff',
          marginBottom: '20px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(13,148,136,0.30)',
        }}>
          {/* Blobs */}
          <div style={{
            position:'absolute',top:'-60px',right:'-60px',
            width:'220px',height:'220px',borderRadius:'50%',
            background:'rgba(255,255,255,0.06)',pointerEvents:'none',
          }}/>
          <div style={{
            position:'absolute',bottom:'-40px',left:'40%',
            width:'160px',height:'160px',borderRadius:'50%',
            background:'rgba(163,230,53,0.10)',pointerEvents:'none',
          }}/>

          <div style={{ position:'relative', zIndex:1 }}>
            {/* Greeting */}
            <p style={{ margin:'0 0 4px', fontSize:'13px', fontWeight:700, opacity:0.75, letterSpacing:'0.04em' }}>
              {greeting} ☀️
            </p>
            <h1 style={{ margin:'0 0 8px', fontSize:'28px', fontWeight:900, letterSpacing:'-0.02em' }}>
              Welcome back, {firstName}! 👋
            </h1>
            <p style={{ margin:'0 0 24px', fontSize:'14px', fontWeight:500, opacity:0.85, maxWidth:'460px', lineHeight:1.6 }}>
              Here's a snapshot of your finances today. Track spending, stay on budget, and reach your goals.
            </p>

            {/* Quick Actions */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:'10px' }}>
              {[
                { to:'/add-expense',      icon:<Plus size={15}/>,    label:'Add Expense',    primary:true  },
                { to:'/receipt-scanner',  icon:<ScanLine size={15}/>, label:'Scan Receipt',   primary:false },
                { to:'/expenses',         icon:<CreditCard size={15}/>,label:'View Expenses', primary:false },
              ].map(a => (
                <Link key={a.to} to={a.to} className="db-action" style={{
                  display:'inline-flex', alignItems:'center', gap:'7px',
                  padding:'10px 20px', borderRadius:'12px',
                  fontWeight:700, fontSize:'13px', textDecoration:'none',
                  background: a.primary ? '#ffffff' : 'rgba(255,255,255,0.14)',
                  color:      a.primary ? 'var(--teal-700)' : '#ffffff',
                  border:     a.primary ? 'none' : '1px solid rgba(255,255,255,0.22)',
                  boxShadow:  a.primary ? '0 4px 12px rgba(0,0,0,0.18)' : 'none',
                }}>
                  {a.icon} {a.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════
            SECTION 2 — BUDGET OVERVIEW (most important for beginners)
        ════════════════════════════════════════ */}
        <div style={{
          display:'grid', gridTemplateColumns:'1fr 1fr',
          gap:'16px', marginBottom:'20px',
        }}>

          {/* Monthly Budget Card */}
          <div className="db-card cashly-card" style={{ borderRadius:'20px', padding:'24px' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'6px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                <div style={{
                  width:'32px',height:'32px',borderRadius:'10px',
                  background:'rgba(13,148,136,0.12)',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  color:'var(--teal-600)',
                }}>
                  <Activity size={16}/>
                </div>
                <div>
                  <p style={{ margin:0, fontWeight:800, fontSize:'14px', color:'var(--text-primary)' }}>
                    Monthly Budget
                  </p>
                  <p style={{ margin:0, fontSize:'11px', color:'#9ca3af', fontWeight:600 }}>
                    How much you've spent this month
                  </p>
                </div>
              </div>
              {overBudget && (
                <span style={{
                  display:'flex',alignItems:'center',gap:'4px',
                  padding:'3px 10px',borderRadius:'999px',
                  background:'rgba(239,68,68,0.12)',border:'1px solid rgba(239,68,68,0.25)',
                  color:'#ef4444',fontSize:'11px',fontWeight:700,
                }}>
                  <AlertTriangle size={11}/> Over budget
                </span>
              )}
            </div>

            {/* Big numbers */}
            <div style={{ display:'flex', alignItems:'baseline', gap:'8px', margin:'16px 0 4px' }}>
              <span style={{ fontSize:'32px', fontWeight:900, color:'var(--text-primary)', letterSpacing:'-0.02em' }}>
                {fmt(monthly, user?.currency)}
              </span>
              {income > 0 && (
                <span style={{ fontSize:'14px', fontWeight:600, color:'var(--text-muted)' }}>
                  of {fmt(income, user?.currency, 0)} income
                </span>
              )}
            </div>

            {/* Progress bar */}
            {income > 0 ? (
              <>
                <div style={{
                  height:'10px',borderRadius:'999px',
                  background:'var(--bg-subtle)',
                  marginBottom:'8px',overflow:'hidden',
                }}>
                  <div style={{
                    height:'100%',borderRadius:'999px',
                    width:`${budgetUsed}%`,
                    background: budgetColor,
                    transition:'width 0.8s ease',
                    boxShadow:`0 0 8px ${budgetColor}66`,
                  }}/>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <p style={{ margin:0, fontSize:'12px', fontWeight:600, color: budgetColor }}>
                    {budgetUsed.toFixed(0)}% used
                  </p>
                  <p style={{ margin:0, fontSize:'12px', fontWeight:600, color:'var(--text-muted)' }}>
                    {fmt(budgetLeft, user?.currency, 0)} left
                  </p>
                </div>
              </>
            ) : (
              <Link to="/profile" style={{
                display:'inline-flex',alignItems:'center',gap:'5px',
                marginTop:'8px',fontSize:'12px',fontWeight:700,
                color:'var(--teal-600)',textDecoration:'none',
              }}>
                <Info size={13}/> Set your income in Profile to track budget
              </Link>
            )}
          </div>

          {/* Savings Goal Card */}
          <div className="db-card cashly-card" style={{ borderRadius:'20px', padding:'24px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px' }}>
              <div style={{
                width:'32px',height:'32px',borderRadius:'10px',
                background:'rgba(132,204,22,0.12)',
                display:'flex',alignItems:'center',justifyContent:'center',
                color:'#84cc16',
              }}>
                <Target size={16}/>
              </div>
              <div>
                <p style={{ margin:0, fontWeight:800, fontSize:'14px', color:'var(--text-primary)' }}>
                  Savings Goal
                </p>
                <p style={{ margin:0, fontSize:'11px', color:'#9ca3af', fontWeight:600 }}>
                  How close you are to your savings target
                </p>
              </div>
            </div>

            <div style={{ display:'flex', alignItems:'baseline', gap:'8px', margin:'16px 0 4px' }}>
              <span style={{ fontSize:'32px', fontWeight:900, color:'var(--text-primary)', letterSpacing:'-0.02em' }}>
                {fmt(savedAmt, user?.currency, 0)}
              </span>
              {savingsGoal > 0 && (
                <span style={{ fontSize:'14px', fontWeight:600, color:'var(--text-muted)' }}>
                  of {fmt(savingsGoal, user?.currency, 0)} goal
                </span>
              )}
            </div>

            {savingsGoal > 0 ? (
              <>
                <div style={{
                  height:'10px',borderRadius:'999px',
                  background:'var(--bg-subtle)',
                  marginBottom:'8px',overflow:'hidden',
                }}>
                  <div style={{
                    height:'100%',borderRadius:'999px',
                    width:`${savingsPct}%`,
                    background:'linear-gradient(90deg, #84cc16, #a3e635)',
                    transition:'width 0.8s ease',
                    boxShadow:'0 0 8px rgba(132,204,22,0.4)',
                  }}/>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between' }}>
                  <p style={{ margin:0, fontSize:'12px', fontWeight:600, color:'#84cc16' }}>
                    {savingsPct.toFixed(0)}% achieved
                  </p>
                  {savedAmt >= savingsGoal && (
                    <p style={{ margin:0, fontSize:'12px', fontWeight:700, color:'#10b981', display:'flex',alignItems:'center',gap:'4px' }}>
                      <CheckCircle size={12}/> Goal reached! 🎉
                    </p>
                  )}
                </div>
              </>
            ) : (
              <Link to="/profile" style={{
                display:'inline-flex',alignItems:'center',gap:'5px',
                marginTop:'8px',fontSize:'12px',fontWeight:700,
                color:'#84cc16',textDecoration:'none',
              }}>
                <Info size={13}/> Set a savings goal in Profile
              </Link>
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════
            SECTION 3 — SIMPLE STAT CARDS
        ════════════════════════════════════════ */}
        <div style={{
          display:'grid',gridTemplateColumns:'repeat(4,1fr)',
          gap:'14px', marginBottom:'20px',
        }}>
          {[
            {
              icon:<Wallet size={18}/>,
              label:'Total Spent (Ever)',
              value: fmt(total, user?.currency),
              sub:'All your recorded expenses',
              accent:'var(--teal-600)',
              bg:'rgba(13,148,136,0.10)',
            },
            {
              icon:<TrendingUp size={18}/>,
              label:'Spent This Month',
              value: fmt(monthly, user?.currency),
              sub: income > 0 ? `${((monthly/income)*100).toFixed(0)}% of your income` : 'No income set',
              accent: overBudget ? '#ef4444' : 'var(--teal-500)',
              bg: overBudget ? 'rgba(239,68,68,0.10)' : 'rgba(13,148,136,0.10)',
            },
            {
              icon:<Tag size={18}/>,
              label:'Biggest Spending Area',
              value: data.highestSpendingCategory || 'None yet',
              sub:'Your most frequent category',
              accent:'#f59e0b',
              bg:'rgba(245,158,11,0.10)',
            },
            {
              icon:<Activity size={18}/>,
              label:'Monthly Income',
              value: income > 0 ? fmt(income, user?.currency, 0) : 'Not set',
              sub: income > 0 ? 'Your set monthly income' : 'Go to Profile → set income',
              accent:'#10b981',
              bg:'rgba(16,185,129,0.10)',
            },
          ].map((s,i) => (
            <div key={i} className="db-card cashly-card" style={{ borderRadius:'18px', padding:'18px' }}>
              <div style={{
                width:'34px',height:'34px',borderRadius:'10px',
                background:s.bg,color:s.accent,
                display:'flex',alignItems:'center',justifyContent:'center',
                marginBottom:'12px',
              }}>
                {s.icon}
              </div>
              <p style={{ margin:'0 0 4px', fontSize:'11px', fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.06em' }}>
                {s.label}
              </p>
              <p style={{ margin:'0 0 6px', fontSize:'24px', fontWeight:900, color:'var(--text-primary)', letterSpacing:'-0.02em', lineHeight:1.1 }}>
                {s.value}
              </p>
              <p style={{ margin:0, fontSize:'11px', fontWeight:600, color:'#9ca3af', lineHeight:1.4 }}>
                {s.sub}
              </p>
            </div>
          ))}
        </div>

        {/* ════════════════════════════════════════
            SECTION 4 — WHAT TO DO NEXT (beginner guide)
        ════════════════════════════════════════ */}
        {steps.length > 0 && (
          <div className="cashly-card" style={{
            borderRadius:'20px', padding:'20px 24px', marginBottom:'20px',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'14px' }}>
              <div style={{
                width:'30px',height:'30px',borderRadius:'9px',
                background:'rgba(245,158,11,0.12)',
                display:'flex',alignItems:'center',justifyContent:'center',
                color:'#f59e0b',
              }}>
                <BookOpen size={15}/>
              </div>
              <div>
                <p style={{ margin:0, fontWeight:800, fontSize:'14px', color:'var(--text-primary)' }}>
                  Your Next Steps
                </p>
                <p style={{ margin:0, fontSize:'11px', color:'var(--text-muted)', fontWeight:500 }}>
                  Follow these to get the most out of CASHLY
                </p>
              </div>
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:'10px' }}>
              {steps.map((step, i) => (
                <Link key={i} to={step.to} className="db-step" style={{
                  display:'flex', alignItems:'center', gap:'10px',
                  padding:'10px 16px', borderRadius:'12px',
                  border:`1px solid var(--border-card)`,
                  background:'var(--bg-subtle)',
                  textDecoration:'none', flex:'1', minWidth:'200px',
                  transition:'all 0.18s ease',
                  opacity: step.done ? 0.6 : 1,
                }}>
                  <span style={{ fontSize:'18px', flexShrink:0 }}>{step.icon}</span>
                  <span style={{ fontSize:'13px', fontWeight:600, color:'var(--text-primary)', flex:1 }}>
                    {step.text}
                  </span>
                  {!step.done && <ChevronRight size={14} style={{ color:'var(--text-faint)', flexShrink:0 }}/>}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════
            SECTION 5 — CHART + RECENT TRANSACTIONS
        ════════════════════════════════════════ */}
        <div className="db-chart-grid">

          {/* Spending Chart */}
          <div className="db-chart-pane">
          <ChartCard
            title="Daily Spending — Last 30 Days"
            subtitle="Each bar = how much you spent on that day"
          >
            {data.dailySpendingTrend.length > 0 ? (() => {
              const avg = data.dailySpendingTrend.reduce((s,d) => s + d.total, 0) / data.dailySpendingTrend.length;
              const tickStep = Math.max(1, Math.ceil(data.dailySpendingTrend.length / 7));
              return (
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={data.dailySpendingTrend} margin={{ top:20, right:30, left:10, bottom:20 }}>
                    <defs>
                      <linearGradient id="dbGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stopColor="#0d9488" stopOpacity={0.35}/>
                        <stop offset="100%" stopColor="#0d9488" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke={isDark ? '#1a3535' : '#e6faf8'}/>
                    <XAxis
                      dataKey="date" tickLine={false} axisLine={false} dy={8}
                      interval={tickStep-1}
                      minTickGap={20}
                      padding={{ left: 8, right: 18 }}
                      height={42}
                      tickMargin={10}
                      tick={{ fontSize:11, fill:'#9ca3af', fontWeight:700 }}
                      tickFormatter={v => {
                        const d = new Date(v);
                        return d.toLocaleDateString('en-US', { month:'short', day:'numeric' });
                      }}
                    />
                    <YAxis
                      tickLine={false} axisLine={false} width={64}
                      tickMargin={8}
                      tick={{ fontSize:11, fill:'#9ca3af', fontWeight:700 }}
                      tickFormatter={v => v === 0 ? '' : fmtAxis(v, user?.currency)}
                    />
                    <ReferenceLine
                      y={avg} stroke={isDark ? '#2dd4bf' : '#0d9488'}
                      strokeDasharray="6 3" strokeWidth={1.5} strokeOpacity={0.6}
                      label={{ value:`Daily avg ${user?.currency || '$'}${avg.toFixed(0)}`, position:'insideTopRight',
                               fontSize:10, fontWeight:700, fill: isDark ? '#2dd4bf' : '#0d9488', dx:-4, dy:-5 }}
                    />
                    <RechartsTooltip
                      allowEscapeViewBox={{ x: false, y: false }}
                      cursor={{ stroke: isDark ? '#2dd4bf' : '#0d9488', strokeWidth:1.5, strokeDasharray:'4 4' }}
                      wrapperStyle={{ maxWidth: 220, pointerEvents: 'none', zIndex: 5 }}
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length) return null;
                        const val  = payload[0].value;
                        const diff = val - avg;
                        const d    = new Date(label);
                        return (
                          <div style={{
                            background: isDark ? '#0f2323' : '#fff',
                            border:`1px solid ${isDark ? '#1a3d3d' : '#ccfbf1'}`,
                            borderRadius:'14px', padding:'10px 12px',
                            boxShadow:'0 12px 32px rgba(13,148,136,0.18)',
                            boxSizing:'border-box',
                            maxWidth:'220px',
                            whiteSpace:'normal',
                          }}>
                            <p style={{ margin:'0 0 4px', fontSize:11, fontWeight:800, color:isDark?'#4a7a76':'#9ca3af', textTransform:'uppercase', letterSpacing:'0.06em' }}>
                              {d.toLocaleDateString('en-US',{weekday:'short'})} · {d.toLocaleDateString('en-US',{month:'short',day:'numeric'})}
                            </p>
                            <p style={{ margin:'0 0 4px', fontSize:20, fontWeight:900, color:'#0d9488', lineHeight:1 }}>
                              {fmt(val, user?.currency)}
                            </p>
                            <p style={{ margin:0, fontSize:11, fontWeight:700, color: diff>0?'#f87171':'#34d399' }}>
                              {diff>0?'▲':'▼'} {fmt(Math.abs(diff), user?.currency)} vs daily average
                            </p>
                          </div>
                        );
                      }}
                    />
                    <Area type="monotone" dataKey="total" stroke="#0d9488" strokeWidth={3}
                      fill="url(#dbGrad)" dot={false}
                      activeDot={{ r:6, fill:'#0d9488', stroke: isDark?'#0f2323':'#fff', strokeWidth:3 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              );
            })() : (
              <EmptyChart label="No spending days recorded yet" sub="Add some expenses to see your spending trend" />
            )}
          </ChartCard>
          </div>

          {/* Recent Transactions */}
          <div className="cashly-card db-recent-pane" style={{
            borderRadius:'20px', display:'flex', flexDirection:'column', overflow:'hidden',
          }}>
            <div style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              padding:'18px 20px',
              borderBottom:`1px solid ${isDark?'#0d2020':'#ecfdf5'}`,
            }}>
              <div>
                <p style={{ margin:0, fontWeight:800, fontSize:'14px', color:'var(--text-primary)' }}>
                  Recent Transactions
                </p>
                <p style={{ margin:0, fontSize:'11px', color:'#9ca3af', fontWeight:600, marginTop:'2px' }}>
                  Your latest expenses
                </p>
              </div>
              <Link to="/expenses" style={{
                display:'inline-flex',alignItems:'center',gap:'4px',
                fontSize:'12px',fontWeight:700,color:'var(--teal-600)',
                padding:'5px 12px',borderRadius:'999px',
                background:'var(--bg-subtle)',border:'1px solid var(--border-card)',
                textDecoration:'none',
              }}>
                All <ArrowRight size={12}/>
              </Link>
            </div>

            <div style={{ flex:1, overflowY:'auto' }}>
              {data.recentTransactions.length > 0 ? data.recentTransactions.map(tx => (
                <div key={tx._id} className="db-tx" style={{
                  display:'flex',alignItems:'center',justifyContent:'space-between',
                  width:'100%',
                  padding:'12px 20px',
                  borderBottom:`1px solid ${isDark?'#0d2020':'#f0fdf4'}`,
                  transition:'background 0.15s ease',
                  cursor:'default',
                  boxSizing:'border-box',
                }}>
                  <div style={{ display:'flex',alignItems:'center',gap:'10px', flex:1, minWidth:0 }}>
                    <div style={{
                      width:'36px',height:'36px',borderRadius:'10px',flexShrink:0,
                      background: isDark?'var(--bg-subtle)':'#ecfdf5',
                      color:'var(--teal-700)',
                      border:`1px solid ${isDark?'#0d2626':'#d1fae5'}`,
                      display:'flex',alignItems:'center',justifyContent:'center',
                      fontWeight:900,fontSize:'13px',
                    }}>
                      {tx.category.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ minWidth:0, flex:1 }}>
                      <p style={{ margin:0, fontWeight:700, fontSize:'13px', color:'var(--text-primary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                        {tx.title}
                      </p>
                      <p style={{ margin:0, fontSize:'11px', color:'#9ca3af', fontWeight:600, marginTop:'2px' }}>
                        {new Date(tx.date).toLocaleDateString('en-US',{month:'short',day:'numeric'})} · {tx.category}
                      </p>
                    </div>
                  </div>
                  <p style={{ margin:0, fontWeight:900, fontSize:'14px', color: overBudget ? '#f87171' : 'var(--text-primary)', flexShrink:0, paddingLeft:'12px' }}>
                    -{fmt(tx.amount, user?.currency)}
                  </p>
                </div>
              )) : (
                <div style={{
                  display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
                  padding:'40px 20px',textAlign:'center',
                }}>
                  <div style={{
                    width:'48px',height:'48px',borderRadius:'14px',
                    background:'var(--bg-subtle)',border:`1px solid ${isDark?'#0d2626':'#d1fae5'}`,
                    display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'12px',
                  }}>
                    <Wallet size={22} style={{ color:'#99f6e4' }}/>
                  </div>
                  <p style={{ margin:'0 0 4px', fontWeight:700, fontSize:'14px', color:'var(--text-secondary)' }}>
                    No expenses yet
                  </p>
                  <p style={{ margin:'0 0 16px', fontSize:'12px', color:'var(--text-faint)' }}>
                    Start by adding your first expense
                  </p>
                  <Link to="/add-expense" style={{
                    display:'inline-flex',alignItems:'center',gap:'6px',
                    padding:'10px 18px',borderRadius:'12px',
                    background:'linear-gradient(135deg,var(--teal-600),var(--teal-500))',
                    color:'#fff',fontWeight:700,fontSize:'13px',textDecoration:'none',
                    boxShadow:'0 4px 14px rgba(13,148,136,0.30)',
                  }}>
                    <Plus size={15}/> Add Expense
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════
            SECTION 6 — CATEGORY BREAKDOWN
        ════════════════════════════════════════ */}
        <CategoryBreakdownCard
          categorySummary={data.categorySummary}
          periodLabel="All time"
        />

        {/* ════════════════════════════════════════
            SECTION 7 — QUICK TIPS (beginners)
        ════════════════════════════════════════ */}
        <div style={{ marginTop:'20px' }}>
          <p style={{
            margin:'0 0 12px', fontSize:'13px', fontWeight:700,
            color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em',
            display:'flex',alignItems:'center',gap:'6px',
          }}>
            <Sparkles size={13} style={{ color:'var(--teal-500)' }}/> Quick Tips
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'12px' }}>
            {[
              { emoji:'🏷️', title:'Categorise expenses',   body:'Add a category when logging expenses — it helps you see where your money goes.' },
              { emoji:'📅', title:'Track weekly',           body:'Check your dashboard every week to spot spending spikes before they grow.' },
              { emoji:'🎯', title:'Start with a small goal', body:`Set a savings goal of even ${user?.currency || '$'}50/month — small wins build great habits.` },
            ].map(t => (
              <div key={t.title} className="cashly-card" style={{ borderRadius:'16px', padding:'18px' }}>
                <p style={{ margin:'0 0 6px', fontSize:'22px' }}>{t.emoji}</p>
                <p style={{ margin:'0 0 4px', fontWeight:800, fontSize:'13px', color:'var(--text-primary)' }}>
                  {t.title}
                </p>
                <p style={{ margin:0, fontSize:'12px', fontWeight:500, color:'#9ca3af', lineHeight:1.5 }}>
                  {t.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const EmptyChart = ({ label, sub }) => (
  <div style={{
    height:'100%', display:'flex', flexDirection:'column',
    alignItems:'center', justifyContent:'center',
    background:'var(--bg-subtle)', borderRadius:'16px',
    border:'1px dashed #99f6e4', textAlign:'center', padding:'32px',
  }}>
    <TrendingUp size={32} style={{ color:'var(--teal-400)', marginBottom:'12px' }}/>
    <p style={{ margin:'0 0 4px', fontWeight:700, color:'var(--text-muted)', fontSize:'14px' }}>{label}</p>
    {sub && <p style={{ margin:0, fontSize:'12px', color:'var(--text-faint)' }}>{sub}</p>}
  </div>
);

export default Dashboard;
