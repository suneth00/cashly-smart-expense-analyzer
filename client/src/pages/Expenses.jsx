import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Search, Filter, ArrowUpDown, Plus } from 'lucide-react';
import ExpenseTable from '../components/ExpenseTable';
import ExpenseForm from '../components/ExpenseForm';
import { Link } from 'react-router-dom';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [editingExpense, setEditingExpense] = useState(null);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/expenses');
      setExpenses(res.data);
    } catch (error) {
      console.error('Failed to fetch expenses', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense? This action cannot be undone.')) {
      try {
        await axios.delete(`/expenses/${id}`);
        setExpenses(expenses.filter(exp => exp._id !== id));
      } catch (error) {
        alert('Failed to delete expense');
      }
    }
  };

  const handleEdit = (expense) => setEditingExpense(expense);
  const handleEditSuccess = () => { setEditingExpense(null); fetchExpenses(); };

  let filtered = [...expenses];
  if (search) filtered = filtered.filter(exp => exp.title.toLowerCase().includes(search.toLowerCase()));
  if (category) filtered = filtered.filter(exp => exp.category === category);
  filtered.sort((a, b) => {
    if (sort === 'newest') return new Date(b.date) - new Date(a.date);
    if (sort === 'oldest') return new Date(a.date) - new Date(b.date);
    if (sort === 'highest') return b.amount - a.amount;
    if (sort === 'lowest') return a.amount - b.amount;
    return 0;
  });

  const categories = ['Food', 'Transport', 'Education', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'];
  const controlClass = "w-full pl-12 pr-5 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 focus:bg-white dark:focus:bg-slate-900 appearance-none transition-all font-semibold shadow-inner cursor-pointer placeholder-slate-400 dark:placeholder-slate-600";

  return (
    <div className="w-full pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-slate-100 tracking-tight">All Expenses</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium text-lg">Manage and track your transaction history.</p>
        </div>
        <Link
          to="/add-expense"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5"
        >
          <Plus size={20} />
          <span>Add Expense</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800/60 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/50 p-6 md:p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={controlClass}
            />
          </div>
          {/* Filter */}
          <div className="relative group">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" size={20} />
            <select value={category} onChange={(e) => setCategory(e.target.value)} className={controlClass}>
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {/* Sort */}
          <div className="relative group">
            <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400 transition-colors" size={20} />
            <select value={sort} onChange={(e) => setSort(e.target.value)} className={controlClass}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      <ExpenseTable expenses={filtered} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />

      {/* Edit Modal Overlay */}
      {editingExpense && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto relative shadow-2xl border border-white/20 dark:border-slate-700">
            <button
              onClick={() => setEditingExpense(null)}
              className="absolute top-8 right-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 w-10 h-10 flex items-center justify-center rounded-full transition-colors z-10 font-black text-xl"
            >
              ✕
            </button>
            <div className="p-4">
              <h2 className="text-3xl font-black text-slate-800 dark:text-slate-100 p-8 pb-2 tracking-tight">Edit Expense</h2>
              <p className="px-8 text-slate-500 dark:text-slate-400 font-medium mb-4">Update the details of this transaction.</p>
              <ExpenseForm initialData={editingExpense} onSuccess={handleEditSuccess} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
