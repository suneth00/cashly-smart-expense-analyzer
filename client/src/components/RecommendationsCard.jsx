import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Lightbulb, AlertCircle, ShieldAlert, Sparkles } from 'lucide-react';

const RecommendationsCard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await axios.get('/recommendations');
        setData(res.data);
      } catch (err) {
        setError('Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };
    fetchRecs();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (error || data.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center justify-center h-full min-h-[400px] text-slate-500">
        <Sparkles size={40} className="text-slate-300 mb-4" />
        <p className="font-bold text-lg text-slate-600 mb-1">{error || 'No advice yet'}</p>
        <p className="text-sm font-medium">Keep tracking your expenses to get insights.</p>
      </div>
    );
  }

  const getPriorityIcon = (priority) => {
    if (priority === 'high') return <ShieldAlert size={24} className="text-rose-500" />;
    if (priority === 'medium') return <AlertCircle size={24} className="text-amber-500" />;
    return <Lightbulb size={24} className="text-indigo-500" />;
  };

  const getPriorityClass = (priority) => {
    if (priority === 'high') return 'bg-rose-50 border-rose-100/50 shadow-sm shadow-rose-100/50';
    if (priority === 'medium') return 'bg-amber-50 border-amber-100/50 shadow-sm shadow-amber-100/50';
    return 'bg-indigo-50 border-indigo-100/50 shadow-sm shadow-indigo-100/50';
  };

  return (
    <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm shadow-slate-200/50 border border-slate-100 h-full flex flex-col transition-all duration-300 hover:shadow-md relative overflow-hidden group">
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-amber-100 rounded-2xl text-amber-600 shadow-inner">
            <Sparkles size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-800 tracking-tight">Smart Advice</h3>
            <p className="text-sm text-slate-500 font-semibold mt-0.5">AI-driven financial insights</p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar relative z-10">
        {data.map((rec, i) => (
          <div key={i} className={`p-6 rounded-3xl border ${getPriorityClass(rec.priority)} flex gap-5 items-start transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-default`}>
            <div className="shrink-0 mt-0.5 bg-white p-2.5 rounded-2xl shadow-sm border border-slate-100/50">
              {getPriorityIcon(rec.priority)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h4 className="font-bold text-slate-800 text-lg tracking-tight leading-tight">{rec.title}</h4>
                {rec.priority === 'high' && (
                  <span className="text-[10px] font-black uppercase tracking-widest bg-rose-200/50 text-rose-700 px-2.5 py-1 rounded-full ring-1 ring-rose-200 shadow-sm">
                    Action Needed
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">{rec.message}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Decorative Blob */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-amber-100 rounded-full blur-3xl opacity-30 pointer-events-none"></div>
    </div>
  );
};

export default RecommendationsCard;
