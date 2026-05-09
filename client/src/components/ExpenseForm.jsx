import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from '../api/axios';

const ExpenseForm = ({ initialData, voiceData, onSuccess }) => {
  const isEditing = !!initialData && !!initialData._id;

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    paymentMethod: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount || '',
        category: initialData.category || '',
        paymentMethod: initialData.paymentMethod || '',
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        notes: initialData.notes || ''
      });
    }
  }, [initialData]);

  useEffect(() => {
    if (voiceData) {
      setFormData(prev => ({
        ...prev,
        title: voiceData.title || prev.title,
        amount: voiceData.amount || prev.amount,
        category: voiceData.category || prev.category,
        date: voiceData.date || prev.date,
      }));
    }
  }, [voiceData]);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const categories = [
    'Food', 'Transport', 'Education', 'Shopping',
    'Bills', 'Entertainment', 'Health', 'Other'
  ];

  const paymentMethods = ['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'UPI', 'Other'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (Number(formData.amount) <= 0) {
      setError('Amount must be greater than zero');
      setLoading(false);
      return;
    }

    try {
      if (isEditing) {
        await axios.put(`/expenses/${initialData._id}`, formData);
        setSuccess('Expense updated successfully!');
      } else {
        await axios.post('/expenses', formData);
        setSuccess('Expense added successfully!');
        setFormData({
          title: '',
          amount: '',
          category: '',
          paymentMethod: '',
          date: new Date().toISOString().split('T')[0],
          notes: ''
        });
      }

      if (onSuccess) {
        setTimeout(() => onSuccess(), 1000);
      } else {
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-700 dark:text-slate-200 font-semibold bg-slate-50 dark:bg-slate-900/50 focus:bg-white dark:focus:bg-slate-900 placeholder-slate-400 dark:placeholder-slate-600 shadow-inner";

  return (
    <div className={`bg-white dark:bg-slate-800/60 rounded-3xl ${!isEditing ? 'shadow-sm border border-slate-100 dark:border-slate-700/50 p-8 md:p-10' : 'p-6'}`}>
      {success && (
        <div className="mb-8 p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 rounded-2xl flex items-center gap-3 text-sm font-bold shadow-sm">
          <CheckCircle2 size={20} className="text-emerald-500" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="mb-8 p-4 bg-rose-50 dark:bg-rose-900/30 border border-rose-100 dark:border-rose-800/50 text-rose-700 dark:text-rose-400 rounded-2xl flex items-center gap-3 text-sm font-bold shadow-sm">
          <AlertCircle size={20} className="text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          <div className="col-span-1 md:col-span-2 group">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">Expense Title *</label>
            <input
              type="text" name="title" value={formData.title} onChange={handleChange} required
              className={inputClass}
              placeholder="e.g., Grocery Shopping at Whole Foods"
            />
          </div>

          <div className="group">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">Amount ($) *</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-bold">$</span>
              <input
                type="number" name="amount" value={formData.amount} onChange={handleChange} required step="0.01" min="0.01"
                className={`${inputClass} pl-10`}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">Date *</label>
            <input
              type="date" name="date" value={formData.date} onChange={handleChange} required
              className={inputClass}
            />
          </div>

          <div className="group">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">Category *</label>
            <select
              name="category" value={formData.category} onChange={handleChange} required
              className={`${inputClass} appearance-none cursor-pointer`}
            >
              <option value="" disabled>Select a category</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="group">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">Payment Method *</label>
            <select
              name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required
              className={`${inputClass} appearance-none cursor-pointer`}
            >
              <option value="" disabled>Select payment method</option>
              {paymentMethods.map(method => <option key={method} value={method}>{method}</option>)}
            </select>
          </div>

          <div className="col-span-1 md:col-span-2 group">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors">Notes (Optional)</label>
            <textarea
              name="notes" value={formData.notes} onChange={handleChange} rows="3"
              className={`${inputClass} resize-none`}
              placeholder="Add any extra details here..."
            ></textarea>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-700/50 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 transition-all duration-300 flex items-center justify-center min-w-[200px] hover:-translate-y-0.5"
          >
            {loading ? <Loader2 size={22} className="animate-spin" /> : isEditing ? 'Save Changes' : 'Save Expense'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
