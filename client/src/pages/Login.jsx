import React, { useState, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AlertCircle, Loader2, Leaf, TrendingUp, ShieldCheck } from 'lucide-react';
import cashlyLogo from '../assets/cashly-logo.png';

const Login = () => {
  const { token, login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center font-sans relative overflow-hidden"
      style={{ background: 'var(--bg-main)' }}
    >
      {/* Subtle bg blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full mix-blend-multiply filter blur-[150px] opacity-20 pointer-events-none" style={{ background: 'var(--teal-400)' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full mix-blend-multiply filter blur-[150px] opacity-15 pointer-events-none" style={{ background: 'var(--lime-400)' }} />

      <div
        className="flex w-full max-w-6xl mx-auto z-10 overflow-hidden min-h-[700px] m-4"
        style={{
          background: '#ffffff',
          borderRadius: '28px',
          border: '1px solid #d1fae5',
          boxShadow: '0 24px 80px rgba(13,148,136,0.14)',
        }}
      >
        {/* Left: dark teal branding panel */}
        <div
          className="hidden lg:flex flex-col justify-between w-1/2 p-14 relative overflow-hidden"
          style={{ background: 'linear-gradient(155deg, #0d2b2b 0%, #0d4f4f 50%, #0f766e 100%)' }}
        >
          {/* Decorative mesh */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(45,212,191,0.12) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(163,230,53,0.08) 0%, transparent 50%)',
          }} />

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-14">
              <img src={cashlyLogo} alt="CASHLY Logo" className="h-12 w-12 object-contain rounded-2xl" style={{ boxShadow: '0 8px 20px rgba(0,0,0,0.30)' }} />
              <div>
                <p className="text-white font-black text-2xl tracking-tight leading-none">CASHLY</p>
                <p className="font-semibold text-xs tracking-widest uppercase mt-0.5" style={{ color: '#4d8a85' }}>Smart Expense Analyzer</p>
              </div>
            </div>

            <h1 className="text-4xl font-black text-white tracking-tight leading-tight mb-5">
              Smarter tools for<br />your financial future.
            </h1>
            <p className="font-medium leading-relaxed max-w-sm" style={{ color: '#99f6e4', fontSize: '15px' }}>
              Join thousands of students tracking their expenses, building savings, and taking control of their money.
            </p>

            {/* Feature pills */}
            <div className="flex flex-col gap-3 mt-10">
              {[
                { icon: <TrendingUp size={15} />, label: 'Real-time spending analytics' },
                { icon: <ShieldCheck size={15} />, label: 'AI-powered financial insights' },
                { icon: <Leaf size={15} />, label: 'Scan receipts instantly' },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg" style={{ background: 'rgba(45,212,191,0.18)', color: '#2dd4bf' }}>
                    {f.icon}
                  </div>
                  <span className="text-sm font-semibold" style={{ color: '#ccfbf1' }}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social proof */}
          <div className="relative z-10 flex items-center gap-4 mt-10">
            <div className="flex -space-x-3">
              {['#14b8a6', '#0d9488', '#2dd4bf', '#84cc16'].map((c, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-white text-xs font-black" style={{ background: c, borderColor: '#0d2b2b' }}>
                  {['A','B','C','D'][i]}
                </div>
              ))}
            </div>
            <p className="text-sm font-medium" style={{ color: '#4d8a85' }}>
              Join <span className="text-white font-bold">10,000+</span> users today.
            </p>
          </div>
        </div>

        {/* Right: form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-14 flex flex-col justify-center" style={{ background: '#ffffff' }}>
          <div className="max-w-md w-full mx-auto">
            {/* Mobile logo */}
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-8 lg:hidden">
              <img src={cashlyLogo} alt="CASHLY Logo" className="h-10 w-10 object-contain rounded-xl" />
              <span className="text-xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>CASHLY</span>
            </div>

            <div className="mb-10">
              <h2 className="text-4xl font-black tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>Sign In</h2>
              <p className="font-medium" style={{ color: 'var(--text-muted)' }}>Welcome back! Please enter your details.</p>
            </div>

            {error && (
              <div
                className="mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold"
                style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#dc2626' }}
              >
                <AlertCircle size={18} /> <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-semibold transition-all placeholder-gray-400 input-teal"
                  style={{
                    border: '1.5px solid #d1fae5',
                    background: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                  }}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>Password</label>
                  <a href="#" className="text-xs font-bold hover:underline" style={{ color: 'var(--teal-600)' }}>Forgot password?</a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl text-sm font-semibold transition-all placeholder-gray-400 input-teal"
                  style={{
                    border: '1.5px solid #d1fae5',
                    background: 'var(--bg-subtle)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                  }}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-teal w-full py-4 mt-2 flex justify-center items-center text-sm"
                style={{
                  borderRadius: '16px',
                  fontSize: '15px',
                  opacity: isLoading ? 0.72 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                }}
              >
                {isLoading ? <Loader2 size={22} className="animate-spin" /> : 'Sign In to Dashboard →'}
              </button>
            </form>

            <p className="mt-10 text-center font-medium" style={{ color: 'var(--text-muted)' }}>
              Don't have an account?{' '}
              <Link to="/register" className="font-black hover:underline" style={{ color: 'var(--teal-600)' }}>
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
