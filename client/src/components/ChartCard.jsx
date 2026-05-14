import React from 'react';

const ChartCard = ({ title, subtitle, children, rightAction }) => {
  return (
    <div
      className="flex flex-col transition-all duration-300 cashly-card"
      style={{
        padding: '24px',
      }}
    >
      <div className="flex items-start justify-between mb-6 shrink-0">
        <div>
          <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-faint)' }}>
              {subtitle}
            </p>
          )}
        </div>
        {rightAction && <div>{rightAction}</div>}
      </div>
      {/* Chart area: set explicit height so ResponsiveContainer has a measured parent */}
      <div className="w-full" style={{ height: 300 }}>
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
