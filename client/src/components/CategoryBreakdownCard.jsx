import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { Tag, TrendingDown } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

/* ── Per-category colour palette ── */
const CATEGORY_COLORS = {
  Food:          '#84cc16',   // lime
  Transport:     '#14b8a6',   // teal
  Education:     '#38bdf8',   // sky-blue
  Shopping:      '#f59e0b',   // amber
  Bills:         '#0f766e',   // dark teal
  Entertainment: '#f97316',   // orange
  Health:        '#22c55e',   // green
  Other:         '#94a3b8',   // slate
};
const FALLBACK_COLORS = [
  '#0d9488','#84cc16','#f59e0b','#38bdf8','#f97316','#a78bfa','#fb7185','#94a3b8',
];
const getColor = (name, idx) =>
  CATEGORY_COLORS[name] ?? FALLBACK_COLORS[idx % FALLBACK_COLORS.length];

/* ── Custom donut centre label ── */
const CenterLabel = ({ viewBox, total, isDark }) => {
  const { cx, cy } = viewBox;
  return (
    <g>
      <text
        x={cx} y={cy - 8}
        textAnchor="middle"
        style={{ fontSize: 22, fontWeight: 900, fill: isDark ? '#e2f8f4' : '#0f2624', fontFamily: 'Inter, sans-serif' }}
      >
        ${total.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
      </text>
      <text
        x={cx} y={cy + 14}
        textAnchor="middle"
        style={{ fontSize: 11, fontWeight: 700, fill: isDark ? '#4a7a76' : '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Inter, sans-serif' }}
      >
        TOTAL
      </text>
    </g>
  );
};

/* ── Custom tooltip ── */
const CustomTooltip = ({ active, payload, total, isDark }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const pct = ((d.total / total) * 100).toFixed(1);
  const color = getColor(d.category, 0);
  return (
    <div style={{
      background: isDark ? '#0f2323' : '#ffffff',
      border: `1px solid ${isDark ? '#1a3d3d' : '#ccfbf1'}`,
      borderRadius: '12px',
      padding: '10px 14px',
      boxShadow: '0 12px 32px rgba(13,148,136,0.18)',
      minWidth: '140px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
        <span style={{ fontSize: 12, fontWeight: 800, color: isDark ? '#e2f8f4' : '#0f2624' }}>{d.category}</span>
      </div>
      <p style={{ fontSize: 18, fontWeight: 900, color, lineHeight: 1, marginBottom: 3 }}>
        ${d.total.toFixed(2)}
      </p>
      <p style={{ fontSize: 11, fontWeight: 700, color: isDark ? '#4a7a76' : '#9ca3af' }}>{pct}% of total</p>
    </div>
  );
};

/* ── Main component ── */
const CategoryBreakdownCard = ({ categorySummary = [] }) => {
  const { isDark } = useTheme();
  const [activeIdx, setActiveIdx] = useState(null);

  const total = categorySummary.reduce((s, d) => s + d.total, 0);
  const sorted = [...categorySummary].sort((a, b) => b.total - a.total);
  const top = sorted[0];

  const cardBg   = isDark ? '#0f2323' : '#ffffff';
  const border   = isDark ? '#0d2626' : '#d1fae5';
  const subtleBg = isDark ? '#122828' : '#f0fdf9';
  const mutedTxt = isDark ? '#4a7a76' : '#9ca3af';
  const bodyTxt  = isDark ? '#e2f8f4' : '#0f2624';
  const secTxt   = isDark ? '#6b9e99' : '#374151';

  /* ── Empty state ── */
  if (!categorySummary.length) {
    return (
      <div className="cashly-card" style={{ padding: '32px 28px' }}>
        {/* header */}
        <CardHeader isDark={isDark} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', textAlign: 'center', gap: 12 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: subtleBg, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Tag size={24} style={{ color: '#84cc16' }} />
          </div>
          <p style={{ fontSize: 15, fontWeight: 800, color: bodyTxt, margin: 0 }}>No category data yet</p>
          <p style={{ fontSize: 13, fontWeight: 500, color: mutedTxt, margin: 0 }}>Add expenses to see your spending breakdown.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cashly-card" style={{ padding: '28px 24px' }}>

      {/* ── Header ── */}
      <CardHeader isDark={isDark} />

      {/* ── Two-column layout ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'min(220px, 45%) 1fr',
        gap: '24px',
        alignItems: 'center',
        marginBottom: 20,
      }}
        className="category-grid"
      >
        {/* Left – donut */}
        <div style={{ position: 'relative' }}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={sorted}
                dataKey="total"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={92}
                paddingAngle={3}
                stroke="none"
                onMouseEnter={(_, idx) => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
              >
                {sorted.map((entry, idx) => (
                  <Cell
                    key={entry.category}
                    fill={getColor(entry.category, idx)}
                    opacity={activeIdx === null || activeIdx === idx ? 1 : 0.35}
                    style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                  />
                ))}
                {/* Centre total label */}
                <text x="50%" y="42%" textAnchor="middle" dominantBaseline="middle"
                  style={{ fontSize: 18, fontWeight: 900, fill: bodyTxt, fontFamily: 'Inter,sans-serif' }}>
                  ${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </text>
                <text x="50%" y="58%" textAnchor="middle" dominantBaseline="middle"
                  style={{ fontSize: 10, fontWeight: 700, fill: mutedTxt, textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Inter,sans-serif' }}>
                  TOTAL
                </text>
              </Pie>
              <RechartsTooltip
                content={(props) => <CustomTooltip {...props} total={total} isDark={isDark} />}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Right – category rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sorted.map((entry, idx) => {
            const pct = (entry.total / total) * 100;
            const color = getColor(entry.category, idx);
            const isActive = activeIdx === idx;
            return (
              <div
                key={entry.category}
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 12,
                  background: isActive ? (isDark ? '#1a3535' : '#f0fdf9') : 'transparent',
                  border: `1px solid ${isActive ? color + '44' : 'transparent'}`,
                  transition: 'all 0.18s ease',
                  cursor: 'default',
                }}
              >
                {/* Row top: dot + name + amount */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <span style={{
                    width: 10, height: 10, borderRadius: '50%', background: color,
                    flexShrink: 0, boxShadow: isActive ? `0 0 6px ${color}88` : 'none',
                    transition: 'box-shadow 0.2s',
                  }} />
                  <span style={{ flex: 1, fontSize: 12, fontWeight: 700, color: bodyTxt, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {entry.category}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: color, flexShrink: 0 }}>
                    ${entry.total.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: mutedTxt, flexShrink: 0, minWidth: 34, textAlign: 'right' }}>
                    {pct.toFixed(0)}%
                  </span>
                </div>
                {/* Progress bar */}
                <div style={{ height: 4, borderRadius: 999, background: isDark ? '#1a3535' : '#e6faf8', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${color}, ${color}bb)`,
                    borderRadius: 999,
                    transition: 'width 0.6s cubic-bezier(0.34,1.56,0.64,1)',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Top category insight strip ── */}
      {top && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 16px',
          borderRadius: 14,
          background: subtleBg,
          border: `1px solid ${border}`,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: getColor(top.category, 0) + '22',
            border: `1px solid ${getColor(top.category, 0)}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <TrendingDown size={17} style={{ color: getColor(top.category, 0) }} />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: mutedTxt, margin: 0, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Top spending category
            </p>
            <p style={{ fontSize: 13, fontWeight: 700, color: secTxt, margin: '2px 0 0' }}>
              You spent most on <span style={{ color: getColor(top.category, 0), fontWeight: 900 }}>{top.category}</span> —{' '}
              ${top.total.toFixed(2)} ({((top.total / total) * 100).toFixed(0)}% of total)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Shared header ── */
const CardHeader = ({ isDark }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 800, color: isDark ? '#e2f8f4' : '#0f2624', margin: 0 }}>
        Category Spending
      </h3>
      <p style={{ fontSize: 12, fontWeight: 500, color: isDark ? '#4a7a76' : '#9ca3af', margin: '3px 0 0' }}>
        All time breakdown by category
      </p>
    </div>
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '5px 12px', borderRadius: 999,
      background: isDark ? '#122828' : '#ecfdf5',
      border: `1px solid ${isDark ? '#0d2626' : '#99f6e4'}`,
      fontSize: 11, fontWeight: 800,
      color: isDark ? '#2dd4bf' : '#0f766e',
    }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#84cc16', display: 'inline-block' }} />
      Live
    </div>
  </div>
);

export default CategoryBreakdownCard;
