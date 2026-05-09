import React, { useContext } from 'react';
import { Search, Menu, Sun, Moon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Link } from 'react-router-dom';
import NotificationPanel from './NotificationPanel';

const Navbar = ({ toggleMenu }) => {
  const { user } = useContext(AuthContext);
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="h-20 shrink-0 flex items-center justify-between px-6 md:px-8 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 sticky top-0 z-10 transition-colors duration-300">
      {/* Left: mobile menu + search */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-colors shrink-0"
        >
          <Menu size={22} />
        </button>

        <div className="relative hidden lg:flex items-center w-80 group">
          <Search className="absolute left-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={17} />
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>
      </div>

      {/* Right: theme toggle + notifications + avatar */}
      <div className="flex items-center gap-3 shrink-0 ml-4">
        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          id="theme-toggle-btn"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2.5 rounded-full text-slate-400 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <NotificationPanel />

        <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-700">
          <div className="hidden md:block text-right leading-tight">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{user?.name || 'User'}</p>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">Premium</p>
          </div>
          <Link to="/profile">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-400 text-white flex items-center justify-center font-bold text-base shadow-md shadow-indigo-500/20 hover:scale-105 transition-transform ring-2 ring-white dark:ring-slate-800">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
