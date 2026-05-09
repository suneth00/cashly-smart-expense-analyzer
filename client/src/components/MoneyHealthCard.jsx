import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Activity, CheckCircle, Info } from 'lucide-react';

const MoneyHealthCard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await axios.get('/analytics/money-health-score');
        setData(res.data);
      } catch (err) {
        setError('Failed to load health score');
      } finally {
        setLoading(false);
      }
    };
    fetchHealth();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800/60 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white dark:bg-slate-800/60 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 flex items-center justify-center h-full min-h-[400px] text-slate-500 dark:text-slate-400 font-bold">
        {error || 'No data available'}
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Excellent': return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800';
      case 'Good': return 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800';
      case 'Needs Improvement': return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800';
      case 'Risky': return 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 border-rose-200 dark:border-rose-800';
      default: return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  const getStatusTextColor = (status) => {
    switch(status) {
      case 'Excellent': return 'text-emerald-500';
      case 'Good': return 'text-indigo-500';
      case 'Needs Improvement': return 'text-amber-500';
      case 'Risky': return 'text-rose-500';
      default: return 'text-slate-500';
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800/60 rounded-3xl p-6 lg:p-8 shadow-sm shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700/50 h-full flex flex-col transition-all duration-300 hover:shadow-md relative overflow-hidden group">
      <div className="flex items-center justify-between mb-8 relative z-10">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-2xl shadow-inner">
            <Activity size={24} />
          </div>
          Health Score
        </h3>
        <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusColor(data.status)} uppercase tracking-widest shadow-sm`}>
          {data.status}
        </span>
      </div>

      <div className="flex items-center justify-center mb-8 relative z-10">
        <div className="relative flex items-center justify-center drop-shadow-lg group-hover:scale-105 transition-transform duration-500">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle cx="96" cy="96" r="84" className="text-slate-100 dark:text-slate-700" strokeWidth="16" fill="none" stroke="currentColor" />
            <circle
              cx="96" cy="96" r="84"
              className={getStatusTextColor(data.status)}
              strokeWidth="16" fill="none" stroke="currentColor"
              strokeDasharray="527.7"
              strokeDashoffset={527.7 - (527.7 * data.score) / 100}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className={`text-6xl font-black ${getStatusTextColor(data.status)} tracking-tighter`}>{data.score}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mt-1">/ 100</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 text-center leading-relaxed font-semibold px-2 relative z-10">
        {data.explanation}
      </p>

      <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/50 shadow-inner relative z-10">
        <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 mb-4 uppercase tracking-widest">Score Breakdown</h4>
        <ul className="space-y-4">
          {data.suggestions.map((sug, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 font-medium">
              {data.status === 'Excellent' ? (
                <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={18} />
              ) : (
                <Info className="text-indigo-500 shrink-0 mt-0.5" size={18} />
              )}
              <span className="leading-relaxed">{sug}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Decorative Blob */}
      <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-10 dark:opacity-5 pointer-events-none ${getStatusColor(data.status).split(' ')[0].replace('text', 'bg')}`}></div>
    </div>
  );
};

export default MoneyHealthCard;
