import React from 'react';
import { Edit2, Trash2, Calendar, CreditCard, Tag, Receipt } from 'lucide-react';

const ExpenseTable = ({ expenses, loading, onEdit, onDelete }) => {

  const cardStyle = {
    background: '#ffffff',
    border: '1px solid #d1fae5',
    borderRadius: '20px',
    boxShadow: '0 1px 6px rgba(13,148,136,0.07)',
    overflow: 'hidden',
  };

  if (loading) {
    return (
      <div style={{ ...cardStyle, padding: '64px', textAlign: 'center' }}>
        <div className="animate-spin rounded-full h-10 w-10 border-b-4 mx-auto" style={{ borderColor: 'var(--teal-600)' }} />
        <p className="mt-4 font-bold" style={{ color: 'var(--text-muted)' }}>Loading expenses...</p>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div style={{ ...cardStyle, padding: '64px', textAlign: 'center' }}>
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5" style={{ background: '#ecfdf5', border: '1px solid #d1fae5' }}>
          <Receipt size={30} style={{ color: 'var(--teal-500)' }} />
        </div>
        <h3 className="text-2xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>No expenses found</h3>
        <p className="font-medium max-w-sm mx-auto" style={{ color: 'var(--text-muted)' }}>
          Looks like you haven't added any expenses yet or none match your search criteria.
        </p>
      </div>
    );
  }

  const getCategoryStyle = (category) => {
    const styles = {
      Food:          { background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa' },
      Transport:     { background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe' },
      Education:     { background: '#faf5ff', color: '#7e22ce', border: '1px solid #e9d5ff' },
      Shopping:      { background: '#fdf2f8', color: '#be185d', border: '1px solid #fbcfe8' },
      Bills:         { background: '#fff1f2', color: '#be123c', border: '1px solid #fecdd3' },
      Entertainment: { background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' },
      Health:        { background: '#f0fdf4', color: 'var(--teal-700)', border: '1px solid #bbf7d0' },
      Other:         { background: '#f9fafb', color: '#4b5563', border: '1px solid #e5e7eb' },
    };
    return styles[category] || styles.Other;
  };

  return (
    <div style={cardStyle}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr style={{ background: '#f0fdf4', borderBottom: '1px solid #d1fae5' }}>
              {['Title', 'Amount', 'Category', 'Date', 'Actions'].map((h, i) => (
                <th
                  key={h}
                  className={`py-4 px-6 text-xs uppercase tracking-widest font-black${i === 3 ? ' hidden md:table-cell' : ''}${i === 4 ? ' text-right' : ''}`}
                  style={{ color: 'var(--text-faint)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr
                key={expense._id}
                className="transition-colors group cursor-default"
                style={{ borderBottom: '1px solid #f0fdf4' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <td className="py-4 px-6">
                  <p className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{expense.title}</p>
                  <p className="text-xs font-semibold mt-1 flex items-center gap-1.5 md:hidden" style={{ color: 'var(--text-faint)' }}>
                    <Calendar size={12} /> {new Date(expense.date).toLocaleDateString()}
                  </p>
                </td>
                <td className="py-4 px-6">
                  <span className="font-black text-lg" style={{ color: 'var(--text-primary)' }}>
                    ${expense.amount.toFixed(2)}
                  </span>
                  <p className="text-xs font-semibold mt-1 flex items-center gap-1.5" style={{ color: 'var(--text-faint)' }}>
                    <CreditCard size={12} /> {expense.paymentMethod}
                  </p>
                </td>
                <td className="py-4 px-6">
                  <span
                    className="px-3 py-1.5 rounded-full text-xs font-bold flex w-max items-center gap-1.5"
                    style={getCategoryStyle(expense.category)}
                  >
                    <Tag size={11} /> {expense.category}
                  </span>
                </td>
                <td className="py-4 px-6 hidden md:table-cell">
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    {new Date(expense.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(expense)}
                      className="p-2 rounded-xl transition-colors"
                      style={{ color: 'var(--teal-600)', background: '#ecfdf5', border: '1px solid #d1fae5' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#ccfbf1'}
                      onMouseLeave={e => e.currentTarget.style.background = '#ecfdf5'}
                      title="Edit"
                    >
                      <Edit2 size={17} />
                    </button>
                    <button
                      onClick={() => onDelete(expense._id)}
                      className="p-2 rounded-xl transition-colors"
                      style={{ color: '#dc2626', background: '#fee2e2', border: '1px solid #fecaca' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fecaca'}
                      onMouseLeave={e => e.currentTarget.style.background = '#fee2e2'}
                      title="Delete"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseTable;
