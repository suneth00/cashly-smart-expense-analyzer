import React from 'react';

const StatCard = ({ title, amount, icon, subtitle, trend, trendUp, colorClass }) => {
  return (
    <div className="bg-white dark:bg-slate-800/60 dark:border-slate-700/50 rounded-2xl p-5 shadow-sm border border-slate-100 relative overflow-hidden group hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl ${colorClass || 'bg-slate-50'} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        {trend && (
          <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${trendUp ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{title}</p>
      <p className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100 truncate">{amount}</p>
      {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1.5">{subtitle}</p>}

      {/* Corner glow */}
      <div className={`absolute -bottom-6 -right-6 w-28 h-28 ${colorClass?.split(' ')[0] || 'bg-slate-50'} rounded-full blur-2xl opacity-30 dark:opacity-10 pointer-events-none`} />
    </div>
  );
};

export default StatCard;
