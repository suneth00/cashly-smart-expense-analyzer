import { useState, useContext, useEffect } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from '../api/axios';
import { useTheme } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';

const defaultDate = () => new Date().toISOString().split('T')[0];

const getInitialFormData = (initialData, voiceData) => ({
  title: voiceData?.title || initialData?.title || '',
  amount: voiceData?.amount || initialData?.amount || '',
  category: voiceData?.category || initialData?.category || '',
  paymentMethod: initialData?.paymentMethod || '',
  date: voiceData?.date || (initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : defaultDate()),
  notes: initialData?.notes || '',
});

const ExpenseForm = ({ initialData, voiceData, onSuccess, topContent }) => {
  const { isDark } = useTheme();
  const { user } = useContext(AuthContext);
  const currency = user?.currency || '$';
  const isEditing = !!initialData && !!initialData._id;

  const [formData, setFormData] = useState(() => getInitialFormData(initialData, voiceData));

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!voiceData) return;

    setFormData((current) => ({
      ...current,
      title: voiceData.title || current.title,
      amount: voiceData.amount || current.amount,
      category: voiceData.category || current.category,
      date: voiceData.date || current.date,
    }));
  }, [voiceData]);

  const categories = ['Food', 'Transport', 'Education', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'];
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
          title: '', amount: '', category: '', paymentMethod: '',
          date: defaultDate(), notes: ''
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

  const inputStyle = {
    width: '100%',
    padding: '13px 20px',
    borderRadius: '14px',
    border: '1.5px solid var(--border-card)',
    background: isDark ? '#0d1f1f' : '#f8fffe',
    color: 'var(--text-primary)',
    fontWeight: 600,
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 700,
    marginBottom: '8px',
    color: '#9ca3af',
    letterSpacing: '0.03em',
  };

  const focusClass = 'focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 placeholder-gray-500';

  const wrapperStyle = isEditing ? { padding: '8px' } : {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-card)',
    borderRadius: '22px',
    boxShadow: isDark ? '0 12px 30px rgba(0,0,0,0.18)' : '0 1px 6px rgba(13,148,136,0.07)',
    padding: '32px 32px',
  };

  return (
    <div style={wrapperStyle}>
      {topContent && (
        <div className="mb-6 pb-6" style={{ borderBottom: '1px solid var(--border-card)' }}>
          {topContent}
        </div>
      )}

      {success && (
        <div
          className="mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold"
          style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#15803d' }}
        >
          <CheckCircle2 size={18} style={{ color: '#22c55e' }} />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div
          className="mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold"
          style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#dc2626' }}
        >
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Title */}
          <div className="col-span-1 md:col-span-2">
            <label style={labelStyle}>Expense Title *</label>
            <input
              type="text" name="title" value={formData.title} onChange={handleChange} required
              style={inputStyle} className={`input-teal ${focusClass}`}
              placeholder="e.g., Grocery Shopping at Whole Foods"
            />
          </div>

          {/* Amount */}
          <div>
            <label style={labelStyle}>Amount ({currency}) *</label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold" style={{ color: 'var(--teal-500)' }}>{currency}</span>
              <input
                type="number" name="amount" value={formData.amount} onChange={handleChange}
                required step="0.01" min="0.01"
                style={{ ...inputStyle, paddingLeft: '36px' }} className={`input-teal ${focusClass}`}
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label style={labelStyle}>Date *</label>
            <input
              type="date" name="date" value={formData.date} onChange={handleChange} required
              style={inputStyle} className={`input-teal ${focusClass}`}
            />
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>Category *</label>
            <select
              name="category" value={formData.category} onChange={handleChange} required
              style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }} className={`input-teal ${focusClass}`}
            >
              <option value="" disabled>Select a category</option>
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          {/* Payment Method */}
          <div>
            <label style={labelStyle}>Payment Method *</label>
            <select
              name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} required
              style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }} className={`input-teal ${focusClass}`}
            >
              <option value="" disabled>Select payment method</option>
              {paymentMethods.map(method => <option key={method} value={method}>{method}</option>)}
            </select>
          </div>

          {/* Notes */}
          <div className="col-span-1 md:col-span-2">
            <label style={labelStyle}>Notes (Optional)</label>
            <textarea
              name="notes" value={formData.notes} onChange={handleChange} rows="3"
              style={{ ...inputStyle, resize: 'none' }} className={`input-teal ${focusClass}`}
              placeholder="Add any extra details here..."
            />
          </div>
        </div>

        <div className="pt-5 flex justify-end" style={{ borderTop: '1px solid var(--border-card)' }}>
          <button
            type="submit"
            disabled={loading}
            className="btn-teal px-10 py-4 flex items-center justify-center min-w-[200px] text-sm w-full md:w-auto font-black tracking-wide transition-all duration-200 hover:brightness-110"
            style={{
              borderRadius: '14px',
              fontSize: '15px',
              opacity: loading ? 0.72 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 8px 24px rgba(13,148,136,0.35)',
              transform: 'translateY(0)',
              transition: 'box-shadow 0.2s ease, transform 0.2s ease, filter 0.2s ease',
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.boxShadow = '0 12px 32px rgba(13,148,136,0.50)'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = loading ? 'none' : '0 8px 24px rgba(13,148,136,0.35)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {loading ? <Loader2 size={22} className="animate-spin" /> : isEditing ? 'Save Changes' : 'Save Expense'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
