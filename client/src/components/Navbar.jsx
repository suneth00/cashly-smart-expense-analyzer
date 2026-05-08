import React, { useContext } from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = ({ toggleMenu }) => {
  const { user } = useContext(AuthContext);

  return (
    <header className="h-20 shrink-0 flex items-center justify-between px-6 md:px-8 bg-white border-b border-slate-100 sticky top-0 z-10">
      {/* Left: mobile menu + search */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors shrink-0"
        >
          <Menu size={22} />
        </button>

        <div className="relative hidden lg:flex items-center w-80 group">
          <Search className="absolute left-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={17} />
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-slate-700 placeholder-slate-400"
          />
        </div>
      </div>

      {/* Right: bell + avatar */}
      <div className="flex items-center gap-3 shrink-0 ml-4">
        <button className="relative p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="hidden md:block text-right leading-tight">
            <p className="text-sm font-bold text-slate-800">{user?.name || 'User'}</p>
            <p className="text-xs text-indigo-600 font-semibold">Premium</p>
          </div>
          <Link to="/profile">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center font-bold text-base shadow-md shadow-indigo-500/20 hover:scale-105 transition-transform ring-2 ring-white">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
