import { useEffect, useState } from 'react';
import axios from '../api/axios';
import CategoryBreakdownCard from '../components/CategoryBreakdownCard';
import MoneyHealthCard from '../components/MoneyHealthCard';
import RecommendationsCard from '../components/RecommendationsCard';

const Analytics = () => {
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [summaryError, setSummaryError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get('/analytics/summary');
        setSummary(res.data);
      } catch {
        setSummaryError('Failed to load category data.');
      } finally {
        setSummaryLoading(false);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Financial AI Insights</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Deep dive into your financial health and get personalized recommendations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <MoneyHealthCard />
        </div>
        <div className="lg:col-span-2">
          <RecommendationsCard />
        </div>
      </div>

      <CategoryBreakdownCard
        categorySummary={summary?.categorySummary || []}
        periodLabel="All time"
        isLoading={summaryLoading}
        error={summaryError}
      />
    </div>
  );
};

export default Analytics;
