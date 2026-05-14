import React from 'react';

const StatCard = ({ title, amount, icon, subtitle, trend, trendUp, accentColor }) => {
  // accentColor is a hex like '#0d9488'
  const bg = accentColor ? `${accentColor}14` : '#f0fdf4';
  const color = accentColor || 'var(--teal-600)';

  return (
    <div
      className="relative overflow-hidden group hover:-translate-y-0.5 transition-all duration-300 cursor-default cashly-card"
      style={{
        borderRadius: '18px',
        boxShadow: '0 1px 6px rgba(13,148,136,0.07)',
      }}
    >
      {/* Top row */}
      <div className="flex justify-between items-start p-5 pb-3">
        <div
          className="p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300"
          style={{ background: bg }}
        >
          <span style={{ color }}>{icon}</span>
        </div>

        {trend && (
          <span
            className="px-2.5 py-1 rounded-full text-xs font-bold"
            style={
              trendUp
                ? { background: '#ecfccb', color: 'var(--lime-600)' }
                : { background: '#fee2e2', color: '#dc2626' }
            }
          >
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="px-5 pb-5">
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
          {title}
        </p>
        <p className="text-2xl font-black tracking-tight truncate" style={{ color: 'var(--text-primary)' }}>
          {amount}
        </p>
        {subtitle && (
          <p className="text-xs font-medium mt-1.5" style={{ color: 'var(--text-faint)' }}>
            {subtitle}
          </p>
        )}
      </div>

      {/* Corner glow */}
      <div
        className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none"
        style={{ background: color }}
      />
    </div>
  );
};

export default StatCard;
