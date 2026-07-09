import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { Search, Filter, ArrowUpDown, Plus, X } from 'lucide-react';
import ExpenseTable from '../components/ExpenseTable';
import ExpenseForm from '../components/ExpenseForm';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useSearch } from '../context/SearchContext';

const Expenses = () => {
  const { isDark } = useTheme();
  const { query, setQuery, clearSearch } = useSearch();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  // local search mirrors the global query from Navbar
  const [search, setSearch] = useState(query || '');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [editingExpense, setEditingExpense] = useState(null);

  // Keep local search in sync whenever Navbar updates the global query
  useEffect(() => {
    setSearch(query || '');
  }, [query]);

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

  useEffect(() => {
    let isMounted = true;

    const loadExpenses = async () => {
      try {
        const res = await axios.get('/expenses');
        if (isMounted) setExpenses(res.data);
      } catch (error) {
        console.error('Failed to fetch expenses', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadExpenses();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense? This action cannot be undone.')) {
      try {
        await axios.delete(`/expenses/${id}`);
        setExpenses(expenses.filter(exp => exp._id !== id));
      } catch {
        alert('Failed to delete expense');
      }
    }
  };

  const handleEdit = (expense) => setEditingExpense(expense);
  const handleEditSuccess = () => { setEditingExpense(null); fetchExpenses(); };

  const handleSearchChange = (val) => {
    setSearch(val);
    setQuery(val); // keep Navbar bar in sync too
  };

  const handleClearSearch = () => {
    clearSearch();
    setSearch('');
  };

  let filtered = [...expenses];
  if (search)   filtered = filtered.filter(exp =>
    exp.title.toLowerCase().includes(search.toLowerCase()) ||
    exp.category.toLowerCase().includes(search.toLowerCase())
  );
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
    border: '1.5px solid var(--border-card)',
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
          <p className="mt-2 font-medium text-lg" style={{ color: '#9ca3af' }}>
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
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-card)',
          boxShadow: isDark ? '0 12px 30px rgba(0,0,0,0.18)' : '0 1px 6px rgba(13,148,136,0.07)',
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2" size={18} style={{ color: search ? 'var(--teal-500)' : 'var(--text-faint)' }} />
            <input
              type="text"
              placeholder="Search by title or category…"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              style={{
                ...inputStyle,
                border: search ? '1.5px solid var(--teal-500)' : '1.5px solid var(--border-card)',
                boxShadow: search ? '0 0 0 4px rgba(13,148,136,0.08)' : 'none',
                paddingRight: search ? '44px' : '16px',
              }}
              className="input-teal"
            />
            {search && (
              <button
                onClick={handleClearSearch}
                style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '20px', height: '20px', borderRadius: '50%',
                  background: 'var(--text-faint)', border: 'none', cursor: 'pointer',
                  color: 'var(--bg-card)', transition: 'background 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#ef4444'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--text-faint)'}
                aria-label="Clear search"
              >
                <X size={11} strokeWidth={3} />
              </button>
            )}
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

      {/* Search result count */}
      {search && !loading && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 16px', borderRadius: '12px', marginBottom: '12px',
          background: 'rgba(13,148,136,0.08)',
          border: '1px solid rgba(13,148,136,0.20)',
        }}>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: 'var(--teal-600)' }}>
            {filtered.length === 0
              ? `No results for "${search}"`
              : `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${search}"`
            }
          </p>
          <button
            onClick={handleClearSearch}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px',
              fontSize: '12px', fontWeight: 700,
              color: 'var(--text-muted)', background: 'none',
              border: 'none', cursor: 'pointer', padding: '4px 8px',
              borderRadius: '8px', transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <X size={13}/> Clear
          </button>
        </div>
      )}

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
              background: 'var(--bg-card)',
              borderRadius: '28px',
              border: '1px solid var(--border-card)',
              boxShadow: isDark ? '0 32px 80px rgba(0,0,0,0.45)' : '0 32px 80px rgba(13,148,136,0.20)',
            }}
          >
            <button
              onClick={() => setEditingExpense(null)}
              className="absolute top-7 right-7 w-9 h-9 flex items-center justify-center rounded-full font-black text-lg transition-colors z-10"
              style={{ background: 'var(--bg-subtle)', color: 'var(--teal-500)', border: '1px solid var(--border-card)' }}
              onMouseEnter={e => { e.currentTarget.style.background = isDark ? '#183838' : '#ccfbf1'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-subtle)'; }}
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
              <ExpenseForm key={editingExpense._id} initialData={editingExpense} onSuccess={handleEditSuccess} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
