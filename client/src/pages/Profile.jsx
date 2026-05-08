import React, { useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, DollarSign, Target, Loader2, CheckCircle, Save } from 'lucide-react';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: '',
    monthlyIncome: '',
    savingsGoal: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        monthlyIncome: user.monthlyIncome || '',
        savingsGoal: user.savingsGoal || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await axios.put('/auth/profile', {
        name: formData.name,
        monthlyIncome: Number(formData.monthlyIncome),
        savingsGoal: Number(formData.savingsGoal)
      });
      
      setUser(res.data);
      setSuccess('Profile updated successfully!');
      
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="w-full max-w-3xl pb-12">
      <div className="mb-10 text-center sm:text-left">
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">Your Profile</h1>
        <p className="text-slate-500 mt-2 font-medium text-lg">Manage your personal information and financial goals.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-100 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none opacity-40"></div>
        
        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          
          <div className="flex items-center gap-6 mb-10 pb-10 border-b border-slate-100">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-3xl flex shrink-0 items-center justify-center text-4xl font-black shadow-lg shadow-indigo-500/30 ring-4 ring-indigo-50">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden text-ellipsis">
              <h2 className="text-3xl font-black text-slate-800 truncate tracking-tight">{user.name}</h2>
              <p className="text-slate-500 font-bold flex items-center gap-2 mt-2 truncate bg-slate-100 w-max px-3 py-1 rounded-lg text-sm border border-slate-200/50">
                <Mail size={16} className="text-slate-400" /> {user.email}
              </p>
            </div>
          </div>

          {success && (
            <div className="p-5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-2xl flex items-center gap-3 font-bold animate-in fade-in zoom-in duration-300 shadow-sm">
              <CheckCircle size={22} className="text-emerald-500" /> {success}
            </div>
          )}

          {error && (
            <div className="p-5 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl font-bold flex items-center gap-3 shadow-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3 group">
              <label className="text-sm font-bold text-slate-700 ml-1 group-focus-within:text-indigo-600 transition-colors">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                  <User size={20} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold text-slate-800 shadow-inner"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full pl-12 pr-5 py-4 bg-slate-100 border border-slate-200 rounded-2xl text-slate-500 font-bold cursor-not-allowed shadow-inner"
                />
              </div>
              <p className="text-xs text-slate-400 ml-1 font-semibold uppercase tracking-wider">Email cannot be changed.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
            <div className="space-y-3 group">
              <label className="text-sm font-bold text-slate-700 ml-1 group-focus-within:text-indigo-600 transition-colors">Monthly Income ($)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-indigo-500">
                  <DollarSign size={20} />
                </div>
                <input
                  type="number"
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-black text-slate-800 shadow-inner text-lg tracking-wide"
                  placeholder="5000"
                />
              </div>
              <p className="text-xs text-slate-400 ml-1 font-semibold uppercase tracking-wider">Used for Money Health Score.</p>
            </div>

            <div className="space-y-3 group">
              <label className="text-sm font-bold text-slate-700 ml-1 group-focus-within:text-indigo-600 transition-colors">Monthly Savings Goal ($)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-emerald-500">
                  <Target size={20} />
                </div>
                <input
                  type="number"
                  name="savingsGoal"
                  value={formData.savingsGoal}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-black text-slate-800 shadow-inner text-lg tracking-wide"
                  placeholder="1000"
                />
              </div>
              <p className="text-xs text-slate-400 ml-1 font-semibold uppercase tracking-wider">Target to keep spending in check.</p>
            </div>
          </div>

          <div className="pt-8 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-10 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
            >
              {loading ? <Loader2 size={24} className="animate-spin" /> : <Save size={24} />}
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
