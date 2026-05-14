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
  if (search)   filtered = filtered.filter(exp => exp.title.toLowerCase().includes(search.toLowerCase()));
  if (category) filtered = filtered.filter(exp => exp.category === category);
  filtered.sort((a, b) => {
    if (sort === 'newest')  return new Date(b.date) - new Date(a.date);
    if (sort === 'oldest')  return new Date(a.date) - new Date(b.date);
    if (sort === 'highest') return b.amount - a.amount;
    if (sort === 'lowest')  return a.amount - b.amount;
    return 0;
  });

  const categories = ['Food', 'Transport', 'Education', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'];

  const inputStyle = {
    width: '100%',
    paddingLeft: '48px',
    paddingRight: '20px',
    paddingTop: '14px',
    paddingBottom: '14px',
    borderRadius: '14px',
    border: '1.5px solid #d1fae5',
    background: 'var(--bg-subtle)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    fontWeight: 600,
    outline: 'none',
    appearance: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  return (
    <div className="w-full pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>All Expenses</h1>
          <p className="mt-2 font-medium text-lg" style={{ color: 'var(--text-muted)' }}>
            Manage and track your transaction history.
          </p>
        </div>
        <Link
          to="/add-expense"
          className="btn-teal flex items-center gap-2 px-6 py-3.5 text-sm"
        >
          <Plus size={19} />
          <span>Add Expense</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div
        className="rounded-2xl p-6 md:p-8 mb-8"
        style={{ background: '#ffffff', border: '1px solid #d1fae5', boxShadow: '0 1px 6px rgba(13,148,136,0.07)' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={18} style={{ color: 'var(--teal-500)' }} />
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={inputStyle}
              className="input-teal"
            />
          </div>
          {/* Filter */}
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" size={18} style={{ color: 'var(--teal-500)' }} />
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={inputStyle} className="input-teal">
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {/* Sort */}
          <div className="relative">
            <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" size={18} style={{ color: 'var(--teal-500)' }} />
            <select value={sort} onChange={(e) => setSort(e.target.value)} style={inputStyle} className="input-teal">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      <ExpenseTable expenses={filtered} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />

      {/* Edit Modal */}
      {editingExpense && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(13,43,43,0.55)' }}
        >
          <div
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto relative"
            style={{
              background: '#ffffff',
              borderRadius: '28px',
              border: '1px solid #d1fae5',
              boxShadow: '0 32px 80px rgba(13,148,136,0.20)',
            }}
          >
            <button
              onClick={() => setEditingExpense(null)}
              className="absolute top-7 right-7 w-9 h-9 flex items-center justify-center rounded-full font-black text-lg transition-colors z-10"
              style={{ background: '#ecfdf5', color: 'var(--teal-600)', border: '1px solid #d1fae5' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#ccfbf1'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#ecfdf5'; }}
            >
              ✕
            </button>
            <div className="p-6">
              <h2 className="text-3xl font-black tracking-tight px-6 pt-4 pb-1" style={{ color: 'var(--text-primary)' }}>
                Edit Expense
              </h2>
              <p className="px-6 font-medium mb-4" style={{ color: 'var(--text-muted)' }}>
                Update the details of this transaction.
              </p>
              <ExpenseForm initialData={editingExpense} onSuccess={handleEditSuccess} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
