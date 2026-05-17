import { useMemo, useState } from 'react';
import {
  Cell,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts';
import { Tag, TrendingUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const CATEGORY_COLORS = {
  food: '#84cc16',
  transport: '#14b8a6',
  education: '#0891b2',
  shopping: '#f59e0b',
  bills: '#0f766e',
  entertainment: '#f97316',
  health: '#22c55e',
  other: '#64748b',
};

const FALLBACK_COLORS = [
  '#0d9488',
  '#84cc16',
  '#f59e0b',
  '#0891b2',
  '#f97316',
  '#22c55e',
  '#64748b',
];

const formatCurrency = (value, { decimals = 'auto' } = {}) => {
  const amount = Number(value) || 0;
  const hasCents = Math.abs(amount % 1) > 0.005;
  const fractionDigits = decimals === 'auto' ? (hasCents ? 2 : 0) : decimals;

  return `Rs. ${amount.toLocaleString('en-LK', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}`;
};

const formatPercent = (value) => {
  if (!Number.isFinite(value)) return '0%';
  return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)}%`;
};

const getCategoryColor = (category, index) => {
  const key = String(category || 'Other').trim().toLowerCase();
  return CATEGORY_COLORS[key] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
};

const CenterLabel = ({ viewBox, value, isDark }) => {
  if (!viewBox) return null;

  const cx = viewBox.cx ?? viewBox.x + viewBox.width / 2;
  const cy = viewBox.cy ?? viewBox.y + viewBox.height / 2;
  const fontSize = value.length > 13 ? 16 : 20;

  return (
    <g>
      <text
        x={cx}
        y={cy - 7}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fill: isDark ? '#e2f8f4' : '#0f4f4a',
          fontFamily: 'Inter, sans-serif',
          fontSize,
          fontWeight: 900,
        }}
      >
        {value}
      </text>
      <text
        x={cx}
        y={cy + 17}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fill: isDark ? '#6b9e99' : '#64748b',
          fontFamily: 'Inter, sans-serif',
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: '0.08em',
        }}
      >
        Total
      </text>
    </g>
  );
};

const CategoryTooltip = ({ active, payload, isDark }) => {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;

  return (
    <div
      style={{
        background: isDark ? '#0f2323' : '#ffffff',
        border: `1px solid ${isDark ? '#1a3d3d' : '#ccfbf1'}`,
        borderRadius: 14,
        boxShadow: '0 16px 36px rgba(13, 148, 136, 0.16)',
        minWidth: 168,
        padding: '12px 14px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: item.color,
            display: 'inline-block',
            flexShrink: 0,
          }}
        />
        <span
          style={{
            color: isDark ? '#e2f8f4' : '#0f2624',
            fontSize: 13,
            fontWeight: 800,
          }}
        >
          {item.category}
        </span>
      </div>
      <div style={{ color: item.color, fontSize: 20, fontWeight: 900, lineHeight: 1 }}>
        {formatCurrency(item.total, { decimals: 'auto' })}
      </div>
      <div
        style={{
          color: isDark ? '#6b9e99' : '#64748b',
          fontSize: 12,
          fontWeight: 700,
          marginTop: 6,
        }}
      >
        {formatPercent(item.percentage)} of total spending
      </div>
    </div>
  );
};

const CardHeader = ({ categoryCount, isDark, periodLabel }) => (
  <div className="flex flex-wrap items-start justify-between gap-3">
    <div>
      <h3
        className="text-lg font-black tracking-tight"
        style={{ color: isDark ? '#e2f8f4' : '#0f4f4a' }}
      >
        Category Spending Breakdown
      </h3>
      <p className="mt-1 text-sm font-medium" style={{ color: 'var(--text-faint)' }}>
        Amount and percentage by spending category
      </p>
    </div>
    <div
      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-black"
      style={{
        background: isDark ? '#122828' : '#ecfdf5',
        border: `1px solid ${isDark ? '#0d2626' : '#99f6e4'}`,
        color: isDark ? '#99f6e4' : '#0f766e',
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: categoryCount > 0 ? '#84cc16' : '#94a3b8',
          display: 'inline-block',
        }}
      />
      {categoryCount > 0 ? `${categoryCount} categories` : periodLabel}
    </div>
  </div>
);

const EmptyState = ({ isDark, periodLabel }) => (
  <div
    className="mt-6 flex flex-col items-center justify-center rounded-2xl px-6 py-12 text-center"
    style={{
      background: isDark ? '#122828' : '#f8fffd',
      border: `1px dashed ${isDark ? '#1a3d3d' : '#99f6e4'}`,
    }}
  >
    <div
      className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
      style={{
        background: isDark ? '#0f2323' : '#ecfdf5',
        border: `1px solid ${isDark ? '#0d2626' : '#d1fae5'}`,
        color: '#84cc16',
      }}
    >
      <Tag size={24} />
    </div>
    <p className="text-base font-black" style={{ color: 'var(--text-primary)' }}>
      No category data yet
    </p>
    <p className="mt-1 max-w-sm text-sm font-medium" style={{ color: 'var(--text-faint)' }}>
      Add expenses to see your spending breakdown.
    </p>
    <p className="sr-only">{periodLabel}</p>
  </div>
);

const CategoryBreakdownCard = ({
  categorySummary = [],
  periodLabel = 'All time',
  isLoading = false,
  error = '',
}) => {
  const { isDark } = useTheme();
  const [activeIndex, setActiveIndex] = useState(null);

  const chartData = useMemo(() => {
    const normalized = categorySummary
      .map((item) => ({
        category: item.category || 'Other',
        total: Number(item.total) || 0,
      }))
      .filter((item) => item.total > 0)
      .sort((a, b) => b.total - a.total);

    const total = normalized.reduce((sum, item) => sum + item.total, 0);

    return normalized.map((item, index) => ({
      ...item,
      color: getCategoryColor(item.category, index),
      percentage: total > 0 ? (item.total / total) * 100 : 0,
    }));
  }, [categorySummary]);

  const total = chartData.reduce((sum, item) => sum + item.total, 0);
  const topCategory = chartData[0];
  const hasData = chartData.length > 0 && total > 0;
  const centerTotal = formatCurrency(total, { decimals: 'auto' });

  return (
    <section
      className="cashly-card overflow-hidden"
      style={{
        borderRadius: 24,
        boxShadow: isDark
          ? '0 14px 34px rgba(0, 0, 0, 0.20)'
          : '0 14px 34px rgba(13, 148, 136, 0.09)',
        padding: 24,
      }}
    >
      <CardHeader
        categoryCount={hasData ? chartData.length : 0}
        isDark={isDark}
        periodLabel={periodLabel}
      />

      {isLoading ? (
        <div className="flex min-h-[280px] items-center justify-center">
          <div
            className="h-10 w-10 animate-spin rounded-full border-b-4"
            style={{ borderColor: 'var(--teal-600)' }}
          />
        </div>
      ) : error ? (
        <div
          className="mt-6 rounded-2xl px-5 py-8 text-center text-sm font-bold"
          style={{
            background: '#fee2e2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
          }}
        >
          {error}
        </div>
      ) : !hasData ? (
        <EmptyState isDark={isDark} periodLabel={periodLabel} />
      ) : (
        <>
          <div className="category-breakdown-layout mt-6">
            <div className="category-breakdown-chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    dataKey="total"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius="61%"
                    outerRadius="84%"
                    paddingAngle={3}
                    stroke={isDark ? '#0f2323' : '#ffffff'}
                    strokeWidth={3}
                    onMouseEnter={(_, index) => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    {chartData.map((entry, index) => (
                      <Cell
                        key={entry.category}
                        fill={entry.color}
                        opacity={activeIndex === null || activeIndex === index ? 1 : 0.36}
                        style={{
                          cursor: 'pointer',
                          filter:
                            activeIndex === index
                              ? 'drop-shadow(0 7px 10px rgba(13, 148, 136, 0.18))'
                              : 'none',
                          transition: 'opacity 160ms ease, filter 160ms ease',
                        }}
                      />
                    ))}
                    <Label
                      position="center"
                      content={(props) => (
                        <CenterLabel {...props} value={centerTotal} isDark={isDark} />
                      )}
                    />
                  </Pie>
                  <RechartsTooltip
                    cursor={false}
                    content={(props) => <CategoryTooltip {...props} isDark={isDark} />}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="min-w-0 space-y-3">
              {chartData.map((entry, index) => {
                const isActive = activeIndex === index;

                return (
                  <div
                    key={entry.category}
                    className="rounded-2xl px-3.5 py-3 transition-all"
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                    style={{
                      background: isActive ? (isDark ? '#122828' : '#f8fffd') : 'transparent',
                      border: `1px solid ${isActive ? `${entry.color}55` : isDark ? '#123030' : '#eefbf7'}`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className="mt-1 h-3 w-3 shrink-0 rounded-full"
                          style={{
                            background: entry.color,
                            boxShadow: isActive ? `0 0 0 4px ${entry.color}22` : 'none',
                          }}
                        />
                        <div className="min-w-0">
                          <p
                            className="truncate text-sm font-black"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {entry.category}
                          </p>
                          <p
                            className="mt-0.5 text-xs font-bold"
                            style={{ color: 'var(--text-faint)' }}
                          >
                            {formatPercent(entry.percentage)} of spending
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-black" style={{ color: 'var(--text-primary)' }}>
                          {formatCurrency(entry.total, { decimals: 'auto' })}
                        </p>
                        <p className="text-xs font-black" style={{ color: entry.color }}>
                          {formatPercent(entry.percentage)}
                        </p>
                      </div>
                    </div>
                    <div
                      className="mt-3 h-2 overflow-hidden rounded-full"
                      style={{ background: isDark ? '#0f2323' : '#e6faf8' }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${entry.percentage}%`,
                          minWidth: entry.percentage > 0 ? 6 : 0,
                          maxWidth: '100%',
                          background: entry.color,
                          transition: 'width 420ms ease',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            className="mt-6 flex items-start gap-3 rounded-2xl p-4"
            style={{
              background: isDark ? '#122828' : '#f0fdf9',
              border: `1px solid ${isDark ? '#0d2626' : '#ccfbf1'}`,
            }}
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
              style={{
                background: `${topCategory.color}1f`,
                border: `1px solid ${topCategory.color}55`,
                color: topCategory.color,
              }}
            >
              <TrendingUp size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black" style={{ color: isDark ? '#e2f8f4' : '#0f4f4a' }}>
                Top spending category: {topCategory.category}
              </p>
              <p className="mt-1 text-sm font-medium leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                You spent most of your money on{' '}
                <span style={{ color: topCategory.color, fontWeight: 900 }}>
                  {topCategory.category}
                </span>{' '}
                in this breakdown: {formatCurrency(topCategory.total, { decimals: 'auto' })},{' '}
                {formatPercent(topCategory.percentage)} of total spending.
              </p>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default CategoryBreakdownCard;
