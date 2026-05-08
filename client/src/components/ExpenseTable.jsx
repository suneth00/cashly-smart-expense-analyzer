import React from 'react';
import { Edit2, Trash2, Calendar, CreditCard, Tag, Receipt } from 'lucide-react';

const ExpenseTable = ({ expenses, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-16 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-indigo-600 mx-auto"></div>
        <p className="text-slate-500 mt-4 font-bold">Loading expenses...</p>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-16 text-center">
        <div className="bg-indigo-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-5 shadow-inner">
          <Receipt size={32} className="text-indigo-500" />
        </div>
        <h3 className="text-2xl font-black text-slate-800 mb-2">No expenses found</h3>
        <p className="text-slate-500 font-medium max-w-sm mx-auto">Looks like you haven't added any expenses yet or none match your search criteria.</p>
      </div>
    );
  }

  const getCategoryStyle = (category) => {
    const styles = {
      Food: 'bg-orange-100 text-orange-700 border-orange-200/50',
      Transport: 'bg-blue-100 text-blue-700 border-blue-200/50',
      Education: 'bg-purple-100 text-purple-700 border-purple-200/50',
      Shopping: 'bg-pink-100 text-pink-700 border-pink-200/50',
      Bills: 'bg-rose-100 text-rose-700 border-rose-200/50',
      Entertainment: 'bg-amber-100 text-amber-700 border-amber-200/50',
      Health: 'bg-teal-100 text-teal-700 border-teal-200/50',
      Other: 'bg-slate-100 text-slate-700 border-slate-200/50'
    };
    return styles[category] || styles.Other;
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm shadow-slate-200/50 border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-xs uppercase tracking-widest font-black">
              <th className="py-5 px-6">Title</th>
              <th className="py-5 px-6">Amount</th>
              <th className="py-5 px-6">Category</th>
              <th className="py-5 px-6 hidden md:table-cell">Date</th>
              <th className="py-5 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.map((expense) => (
              <tr key={expense._id} className="hover:bg-indigo-50/30 transition-colors group cursor-default">
                <td className="py-4 px-6">
                  <p className="font-bold text-slate-800 text-base">{expense.title}</p>
                  <p className="text-xs text-slate-400 font-semibold mt-1 flex items-center gap-1.5 md:hidden">
                    <Calendar size={12} /> {new Date(expense.date).toLocaleDateString()}
                  </p>
                </td>
                <td className="py-4 px-6">
                  <span className="font-black text-slate-800 text-lg">${expense.amount.toFixed(2)}</span>
                  <p className="text-xs text-slate-400 font-semibold mt-1 flex items-center gap-1.5">
                    <CreditCard size={12} /> {expense.paymentMethod}
                  </p>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getCategoryStyle(expense.category)} flex w-max items-center gap-1.5 shadow-sm`}>
                    <Tag size={12} /> {expense.category}
                  </span>
                </td>
                <td className="py-4 px-6 hidden md:table-cell">
                  <span className="text-sm text-slate-600 font-semibold">
                    {new Date(expense.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onEdit(expense)}
                      className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-xl transition-colors shadow-sm"
                      title="Edit"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(expense._id)}
                      className="p-2 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors shadow-sm"
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
