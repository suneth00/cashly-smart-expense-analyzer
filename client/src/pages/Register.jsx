import React, { useState, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AlertCircle, Loader2, Target, Sparkles, Leaf } from 'lucide-react';
import cashlyLogo from '../assets/cashly-logo.png';

const Register = () => {
  const { token, register } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    monthlyIncome: '',
    savingsGoal: ''
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await register({
        ...formData,
        monthlyIncome: Number(formData.monthlyIncome) || 0,
        savingsGoal: Number(formData.savingsGoal) || 0
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 20px',
    borderRadius: '14px',
    border: '1.5px solid #d1fae5',
    background: 'var(--bg-subtle)',
    color: 'var(--text-primary)',
    fontWeight: 600,
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '13px',
    fontWeight: 700,
    marginBottom: '8px',
    color: 'var(--text-secondary)',
  };

  const features = [
    { icon: <Target size={15} />, text: 'Set dynamic savings goals' },
    { icon: <Sparkles size={15} />, text: 'Get AI-powered insights' },
    { icon: <Leaf size={15} />, text: 'Scan receipts effortlessly' },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center font-sans relative overflow-hidden py-10"
      style={{ background: 'var(--bg-main)' }}
    >
      {/* Subtle bg blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full mix-blend-multiply filter blur-[150px] opacity-15 pointer-events-none" style={{ background: 'var(--teal-400)' }} />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full mix-blend-multiply filter blur-[150px] opacity-12 pointer-events-none" style={{ background: 'var(--lime-400)' }} />

      <div
        className="flex w-full max-w-6xl mx-auto z-10 overflow-hidden min-h-[750px] m-4"
        style={{
          background: '#ffffff',
          borderRadius: '28px',
          border: '1px solid #d1fae5',
          boxShadow: '0 24px 80px rgba(13,148,136,0.14)',
        }}
      >
        {/* Left: dark teal branding */}
        <div
          className="hidden lg:flex flex-col justify-between w-[42%] p-14 relative overflow-hidden"
          style={{ background: 'linear-gradient(155deg, #0d2b2b 0%, #134e4a 55%, #0f766e 100%)' }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'radial-gradient(circle at 75% 25%, rgba(45,212,191,0.10) 0%, transparent 50%), radial-gradient(circle at 25% 80%, rgba(163,230,53,0.07) 0%, transparent 50%)',
          }} />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <img src={cashlyLogo} alt="CASHLY Logo" className="h-12 w-12 object-contain rounded-2xl" style={{ boxShadow: '0 8px 20px rgba(0,0,0,0.30)' }} />
              <div>
                <p className="text-white font-black text-2xl tracking-tight leading-none">CASHLY</p>
                <p className="font-semibold text-xs tracking-widest uppercase mt-0.5" style={{ color: '#4d8a85' }}>Smart Expense Analyzer</p>
              </div>
            </div>

            <h2 className="text-4xl font-black text-white leading-tight mb-5">
              Start your journey to financial freedom.
            </h2>
            <p className="font-medium mb-10 leading-relaxed" style={{ color: '#99f6e4', fontSize: '15px' }}>
              Set up your profile in seconds and start gaining clarity on your spending.
            </p>

            <ul className="space-y-4">
              {features.map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg" style={{ background: 'rgba(45,212,191,0.18)', color: '#2dd4bf' }}>
                    {f.icon}
                  </div>
                  <span className="text-sm font-semibold" style={{ color: '#ccfbf1' }}>{f.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Lime accent strip */}
          <div className="relative z-10 flex gap-1 mt-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-1 flex-1 rounded-full" style={{ background: i < 4 ? 'var(--lime-400)' : 'rgba(163,230,53,0.2)' }} />
            ))}
          </div>
        </div>

        {/* Right: form */}
        <div className="w-full lg:w-[58%] p-8 sm:p-12 lg:p-14 flex flex-col justify-center" style={{ background: '#ffffff' }}>
          <div className="max-w-md w-full mx-auto">
            {/* Mobile logo */}
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-8 lg:hidden">
              <img src={cashlyLogo} alt="CASHLY Logo" className="h-10 w-10 object-contain rounded-xl" />
              <span className="text-xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>CASHLY</span>
            </div>

            <div className="mb-10">
              <h2 className="text-4xl font-black tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>Create Account</h2>
              <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Enter your details to get started.</p>
            </div>

            {error && (
              <div
                className="mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold"
                style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#dc2626' }}
              >
                <AlertCircle size={18} /> <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text" name="name" value={formData.name} onChange={handleChange} required
                  style={inputStyle} placeholder="John Doe" className="input-teal"
                />
              </div>
              <div>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email" name="email" value={formData.email} onChange={handleChange} required
                  style={inputStyle} placeholder="you@example.com" className="input-teal"
                />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input
                  type="password" name="password" value={formData.password} onChange={handleChange} required minLength="6"
                  style={inputStyle} placeholder="••••••••" className="input-teal"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={labelStyle}>Monthly Income</label>
                  <input
                    type="number" name="monthlyIncome" value={formData.monthlyIncome} onChange={handleChange}
                    style={inputStyle} placeholder="$0" className="input-teal"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Savings Goal</label>
                  <input
                    type="number" name="savingsGoal" value={formData.savingsGoal} onChange={handleChange}
                    style={inputStyle} placeholder="$0" className="input-teal"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-teal w-full py-4 mt-3 flex justify-center items-center text-sm"
                style={{
                  borderRadius: '16px',
                  fontSize: '15px',
                  marginTop: '12px',
                  opacity: isLoading ? 0.72 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                }}
              >
                {isLoading ? <Loader2 size={22} className="animate-spin" /> : 'Create Account →'}
              </button>
            </form>

            <p className="mt-8 text-center font-medium" style={{ color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <Link to="/login" className="font-black hover:underline" style={{ color: 'var(--teal-600)' }}>
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
