import React, { useState, useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { AlertCircle, Loader2, Sparkles } from 'lucide-react';
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

  return (
    <div className="min-h-screen flex items-center justify-center font-sans bg-slate-900 relative overflow-hidden py-10">
      {/* Decorative Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full mix-blend-screen filter blur-[150px] opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500 rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none"></div>

      <div className="flex w-full max-w-6xl mx-auto z-10 bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden min-h-[750px] m-4">
        
        {/* Left Side: Branding */}
        <div className="hidden lg:flex flex-col justify-between w-[45%] p-16 bg-gradient-to-br from-indigo-900 to-slate-900 relative overflow-hidden border-r border-white/10">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
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
            
            <h2 className="text-4xl font-black text-white leading-tight mb-6">
              Start your journey to financial freedom.
            </h2>
            <ul className="space-y-4 text-indigo-100 font-medium">
              <li className="flex items-center gap-3"><CheckCircleIcon /> Set dynamic savings goals</li>
              <li className="flex items-center gap-3"><CheckCircleIcon /> Get AI-powered insights</li>
              <li className="flex items-center gap-3"><CheckCircleIcon /> Scan receipts effortlessly</li>
            </ul>
          </div>
          
          {/* Decorative shapes */}
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-600 opacity-20 rounded-full blur-3xl"></div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full lg:w-[55%] p-8 sm:p-12 md:p-16 flex flex-col justify-center bg-white relative">
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
              <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-3">Create Account</h2>
              <p className="text-slate-500 font-medium">Enter your details to get started.</p>
            </div>
            
            {error && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl flex items-center gap-3 text-sm font-bold shadow-sm">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-indigo-600 transition-colors">Full Name</label>
                <input 
                  type="text" name="name" value={formData.name} onChange={handleChange} required
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-800 font-semibold placeholder-slate-400 bg-slate-50 focus:bg-white shadow-inner" 
                  placeholder="John Doe" 
                />
              </div>
              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-indigo-600 transition-colors">Email Address</label>
                <input 
                  type="email" name="email" value={formData.email} onChange={handleChange} required
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-800 font-semibold placeholder-slate-400 bg-slate-50 focus:bg-white shadow-inner" 
                  placeholder="you@example.com" 
                />
              </div>
              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-indigo-600 transition-colors">Password</label>
                <input 
                  type="password" name="password" value={formData.password} onChange={handleChange} required minLength="6"
                  className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-800 font-semibold placeholder-slate-400 bg-slate-50 focus:bg-white shadow-inner" 
                  placeholder="••••••••" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-indigo-600 transition-colors">Monthly Income</label>
                  <input 
                    type="number" name="monthlyIncome" value={formData.monthlyIncome} onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-800 font-semibold placeholder-slate-400 bg-slate-50 focus:bg-white shadow-inner" 
                    placeholder="$0" 
                  />
                </div>
                <div className="group">
                  <label className="block text-sm font-bold text-slate-700 mb-2 group-focus-within:text-indigo-600 transition-colors">Savings Goal</label>
                  <input 
                    type="number" name="savingsGoal" value={formData.savingsGoal} onChange={handleChange}
                    className="w-full px-5 py-3.5 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-slate-800 font-semibold placeholder-slate-400 bg-slate-50 focus:bg-white shadow-inner" 
                    placeholder="$0" 
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 mt-6 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/30 transition-all duration-300 flex justify-center items-center hover:-translate-y-0.5"
              >
                {isLoading ? <Loader2 size={24} className="animate-spin" /> : 'Create Account'}
              </button>
            </form>
            
            <p className="mt-8 text-center text-slate-600 font-medium">
              Already have an account? <Link to="/login" className="text-indigo-600 font-black hover:text-indigo-700 transition-colors hover:underline">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
);

export default Register;
