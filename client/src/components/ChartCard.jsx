import React from 'react';

const ChartCard = ({ title, subtitle, children, rightAction }) => {
  return (
    <div className="bg-white dark:bg-slate-800/60 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col transition-colors duration-300">
      <div className="flex items-start justify-between mb-6 shrink-0">
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">{title}</h3>
          {subtitle && <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {rightAction && <div>{rightAction}</div>}
      </div>
      {/* Chart area: set explicit height so ResponsiveContainer has a measured parent */}
      <div className="w-full" style={{ height: 280 }}>
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
