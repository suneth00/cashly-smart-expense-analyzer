import React from 'react';
import { Edit2, Trash2, Calendar, CreditCard, Tag, Receipt } from 'lucide-react';

const ExpenseTable = ({ expenses, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800/60 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/50 p-16 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-indigo-600 mx-auto"></div>
        <p className="text-slate-500 dark:text-slate-400 mt-4 font-bold">Loading expenses...</p>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800/60 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/50 p-16 text-center">
        <div className="bg-indigo-50 dark:bg-indigo-900/30 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-inner">
          <Receipt size={32} className="text-indigo-500" />
        </div>
        <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-2">No expenses found</h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">Looks like you haven't added any expenses yet or none match your search criteria.</p>
      </div>
    );
  }

  const getCategoryStyle = (category) => {
    const styles = {
      Food:          'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200/50 dark:border-orange-800/30',
      Transport:     'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/30',
      Education:     'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200/50 dark:border-purple-800/30',
      Shopping:      'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 border-pink-200/50 dark:border-pink-800/30',
      Bills:         'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-rose-200/50 dark:border-rose-800/30',
      Entertainment: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/30',
      Health:        'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 border-teal-200/50 dark:border-teal-800/30',
      Other:         'bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300 border-slate-200/50 dark:border-slate-600/30'
    };
    return styles[category] || styles.Other;
  };

  return (
    <div className="bg-white dark:bg-slate-800/60 rounded-3xl shadow-sm shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700/50 text-slate-400 dark:text-slate-500 text-xs uppercase tracking-widest font-black">
              <th className="py-5 px-6">Title</th>
              <th className="py-5 px-6">Amount</th>
              <th className="py-5 px-6">Category</th>
              <th className="py-5 px-6 hidden md:table-cell">Date</th>
              <th className="py-5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {expenses.map((expense) => (
              <tr key={expense._id} className="hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors group cursor-default">
                <td className="py-4 px-6">
                  <p className="font-bold text-slate-800 dark:text-slate-100 text-base">{expense.title}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1 flex items-center gap-1.5 md:hidden">
                    <Calendar size={12} /> {new Date(expense.date).toLocaleDateString()}
                  </p>
                </td>
                <td className="py-4 px-6">
                  <span className="font-black text-slate-800 dark:text-slate-100 text-lg">${expense.amount.toFixed(2)}</span>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-1 flex items-center gap-1.5">
                    <CreditCard size={12} /> {expense.paymentMethod}
                  </p>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getCategoryStyle(expense.category)} flex w-max items-center gap-1.5 shadow-sm`}>
                    <Tag size={12} /> {expense.category}
                  </span>
                </td>
                <td className="py-4 px-6 hidden md:table-cell">
                  <span className="text-sm text-slate-600 dark:text-slate-400 font-semibold">
                    {new Date(expense.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(expense)}
                      className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 rounded-xl transition-colors shadow-sm"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(expense._id)}
                      className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-xl transition-colors shadow-sm"
                      title="Delete"
                    >
                      <Trash2 size={18} />
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
