import React, { useState, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AlertCircle, Loader2, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center font-sans bg-slate-900 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600 rounded-full mix-blend-screen filter blur-[150px] opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-500 rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none"></div>

      <div className="flex w-full max-w-6xl mx-auto z-10 bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden min-h-[700px] m-4">
        
        {/* Left Side: Branding / Marketing */}
        <div className="hidden lg:flex flex-col justify-between w-1/2 p-16 bg-gradient-to-br from-indigo-600 to-purple-900 relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <img
                src={cashlyLogo}
                alt="CASHLY Logo"
                className="h-14 w-14 object-contain rounded-2xl shadow-lg shadow-black/30"
              />
              <div>
                <p className="text-white font-black text-2xl tracking-tight leading-none">CASHLY</p>
                <p className="text-indigo-200 font-semibold text-xs tracking-widest uppercase mt-0.5">Smart Expense Analyzer</p>
              </div>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tight leading-tight mb-6">
              Smarter tools for your financial future.
            </h1>
            <p className="text-indigo-100 text-lg font-medium leading-relaxed max-w-md">
              Join thousands of users tracking their expenses, building their savings, and taking control of their money effortlessly.
            </p>
          </div>
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex -space-x-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-indigo-600 bg-slate-200 shadow-md"></div>
              ))}
            </div>
            <p className="text-indigo-100 font-medium text-sm">Join <span className="text-white font-bold">10,000+</span> users today.</p>
          </div>
          {/* Decorative shapes */}
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute top-24 -left-24 w-64 h-64 bg-indigo-400 mix-blend-overlay rounded-full blur-2xl"></div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-1/2 p-8 sm:p-16 flex flex-col justify-center bg-white relative">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-10 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                <img
                  src={cashlyLogo}
                  alt="CASHLY Logo"
                  className="h-11 w-11 object-contain rounded-xl"
                />
                <span className="text-2xl font-black text-slate-800 tracking-tight">CASHLY</span>
              </div>
              <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-3">Sign In</h2>
              <p className="text-slate-500 font-medium">Welcome back! Please enter your details.</p>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl flex items-center gap-3 text-sm font-bold shadow-sm">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-indigo-600 transition-colors">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-800 font-semibold placeholder-slate-400 bg-slate-50 focus:bg-white shadow-inner" 
                  placeholder="you@example.com" 
                  required 
                />
              </div>
              <div className="group">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-bold text-slate-700 group-focus-within:text-indigo-600 transition-colors">Password</label>
                  <a href="#" className="text-sm font-bold text-indigo-600 hover:text-indigo-700">Forgot password?</a>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-800 font-semibold placeholder-slate-400 bg-slate-50 focus:bg-white shadow-inner" 
                  placeholder="••••••••" 
                  required 
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/30 transition-all duration-300 flex justify-center items-center hover:-translate-y-0.5"
              >
                {isLoading ? <Loader2 size={24} className="animate-spin" /> : 'Sign In to Dashboard'}
              </button>
            </form>
            
            <p className="mt-10 text-center text-slate-600 font-medium">
              Don't have an account? <Link to="/register" className="text-indigo-600 font-black hover:text-indigo-700 transition-colors hover:underline">Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
