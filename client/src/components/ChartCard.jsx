import React from 'react';

const ChartCard = ({ title, subtitle, children, rightAction }) => {
  return (
    <div
      className="flex w-full min-w-0 flex-col overflow-hidden transition-all duration-300 cashly-card"
      style={{
        padding: '24px',
        boxSizing: 'border-box',
      }}
    >
      <div className="mb-6 flex shrink-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h3>
          {subtitle && (
            <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--text-faint)' }}>
              {subtitle}
            </p>
          )}
        </div>
        {rightAction && <div className="shrink-0">{rightAction}</div>}
      </div>
      {/* Chart area: set explicit height so ResponsiveContainer has a measured parent */}
      <div className="w-full min-w-0 overflow-hidden" style={{ height: 320 }}>
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
