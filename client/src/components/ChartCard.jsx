import React from 'react';

const ChartCard = ({ title, subtitle, children, rightAction }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
      <div className="flex items-start justify-between mb-6 shrink-0">
        <div>
          <h3 className="font-bold text-slate-800 text-base">{title}</h3>
          {subtitle && <p className="text-xs font-medium text-slate-400 mt-0.5">{subtitle}</p>}
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
