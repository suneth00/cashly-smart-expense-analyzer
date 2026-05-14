import React, { useState, useEffect, useContext } from 'react';
import axios from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, DollarSign, Target, Loader2, CheckCircle, Save } from 'lucide-react';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', monthlyIncome: '', savingsGoal: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name || '', monthlyIncome: user.monthlyIncome || '', savingsGoal: user.savingsGoal || '' });
    }
  }, [user]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(''); setSuccess('');
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
    fontWeight: 700,
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s',
  };

  return (
    <div className="w-full max-w-3xl pb-12">
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>Your Profile</h1>
        <p className="mt-2 font-medium text-lg" style={{ color: 'var(--text-muted)' }}>Manage your personal information and financial goals.</p>
      </div>

      <div
        className="relative overflow-hidden"
        style={{ background: '#ffffff', border: '1px solid #d1fae5', borderRadius: '22px', boxShadow: '0 1px 6px rgba(13,148,136,0.07)', padding: '36px 32px' }}
      >
        {/* Decorative blob */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none opacity-20" style={{ background: 'var(--teal-400)' }} />

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          {/* Avatar row */}
          <div className="flex items-center gap-6 mb-8 pb-8" style={{ borderBottom: '1px solid #d1fae5' }}>
            <div
              className="w-24 h-24 text-white rounded-3xl flex shrink-0 items-center justify-center text-4xl font-black"
              style={{ background: 'linear-gradient(135deg, var(--teal-600), var(--teal-400))', boxShadow: '0 8px 24px rgba(13,148,136,0.30)' }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <h2 className="text-3xl font-black truncate tracking-tight" style={{ color: 'var(--text-primary)' }}>{user.name}</h2>
              <p className="font-bold flex items-center gap-2 mt-2 w-max px-3 py-1 rounded-lg text-sm" style={{ background: '#ecfdf5', color: 'var(--teal-700)', border: '1px solid #d1fae5' }}>
                <Mail size={15} /> {user.email}
              </p>
            </div>
          </div>

          {success && (
            <div className="p-4 rounded-2xl flex items-center gap-3 font-bold text-sm" style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#15803d' }}>
              <CheckCircle size={20} style={{ color: '#22c55e' }} /> {success}
            </div>
          )}
          {error && (
            <div className="p-4 rounded-2xl font-bold text-sm flex items-center gap-3" style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#dc2626' }}>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            <div className="space-y-2">
              <label className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" style={{ color: 'var(--teal-500)' }}><User size={19} /></div>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} className="input-teal" placeholder="John Doe" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" style={{ color: 'var(--text-faint)' }}><Mail size={19} /></div>
                <input type="email" value={user.email} disabled
                  style={{ ...inputStyle, background: '#f9fafb', color: 'var(--text-faint)', cursor: 'not-allowed', border: '1.5px solid #e5e7eb' }}
                />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>Email cannot be changed.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 pt-6" style={{ borderTop: '1px solid #d1fae5' }}>
            <div className="space-y-2">
              <label className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>Monthly Income ($)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" style={{ color: 'var(--teal-500)' }}><DollarSign size={19} /></div>
                <input type="number" name="monthlyIncome" value={formData.monthlyIncome} onChange={handleChange} min="0" step="0.01"
                  style={{ ...inputStyle, fontSize: '15px' }} className="input-teal" placeholder="5000" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>Used for Money Health Score.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>Monthly Savings Goal ($)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none" style={{ color: 'var(--lime-500)' }}><Target size={19} /></div>
                <input type="number" name="savingsGoal" value={formData.savingsGoal} onChange={handleChange} min="0" step="0.01"
                  style={{ ...inputStyle, fontSize: '15px' }} className="input-teal" placeholder="1000" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>Target to keep spending in check.</p>
            </div>
          </div>

          <div className="pt-7 flex justify-end" style={{ borderTop: '1px solid #d1fae5' }}>
            <button
              type="submit"
              disabled={loading}
              className="btn-teal w-full md:w-auto px-10 py-4 flex items-center justify-center gap-2 text-sm"
              style={{ borderRadius: '14px', fontSize: '15px', minWidth: '200px', opacity: loading ? 0.72 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? <Loader2 size={22} className="animate-spin" /> : <Save size={20} />}
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
