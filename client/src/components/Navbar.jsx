import React, { useContext } from 'react';
import { Search, Menu, Sun, Moon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import NotificationPanel from './NotificationPanel';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ toggleMenu }) => {
  const { user } = useContext(AuthContext);
  const { isDark, toggleTheme } = useTheme();

  return (
    <header
      className="h-20 shrink-0 flex items-center justify-between px-6 md:px-8 sticky top-0 z-10 transition-all duration-300"
      style={{
        background: isDark ? 'var(--bg-card)' : '#ffffff',
        borderBottom: isDark ? '1px solid #0d2020' : '1px solid #d1fae5',
        boxShadow: isDark
          ? '0 1px 8px rgba(0,0,0,0.30)'
          : '0 1px 8px rgba(13,148,136,0.06)',
      }}
    >
      {/* Left: mobile menu + search */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button
          onClick={toggleMenu}
          className="md:hidden p-2 rounded-xl transition-colors"
          style={{ color: 'var(--teal-600)', background: 'var(--teal-50)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--teal-100)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--teal-50)'; }}
        >
          <Menu size={22} />
        </button>

        <div className="relative hidden lg:flex items-center w-80 group">
          <Search
            className="absolute left-4 transition-colors"
            size={17}
            style={{ color: 'var(--text-faint)' }}
          />
          <input
            type="text"
            placeholder="Search transactions..."
            className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm font-medium transition-all placeholder-gray-400 input-teal"
            style={{
              background: 'var(--bg-subtle)',
              border: `1.5px solid ${isDark ? '#0d2626' : '#d1fae5'}`,
              color: 'var(--text-primary)',
            }}
          />
        </div>
      </div>

      {/* Right: dark-mode toggle + notifications + avatar */}
      <div className="flex items-center gap-3 shrink-0 ml-4">

        {/* ── Dark Mode Toggle ── */}
        <button
          id="dark-mode-toggle"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="relative flex items-center rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          style={{
            width: '56px',
            height: '28px',
            background: isDark
              ? 'linear-gradient(135deg, #0d9488, #0f766e)'
              : 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
            boxShadow: isDark
              ? '0 0 12px rgba(13,148,136,0.5), inset 0 1px 3px rgba(0,0,0,0.2)'
              : 'inset 0 1px 3px rgba(0,0,0,0.15)',
            padding: '3px',
          }}
        >
          {/* Track icons */}
          <Sun
            size={12}
            className="absolute left-2 transition-opacity duration-300"
            style={{
              color: isDark ? 'transparent' : '#f59e0b',
              opacity: isDark ? 0 : 1,
            }}
          />
          <Moon
            size={12}
            className="absolute right-2 transition-opacity duration-300"
            style={{
              color: isDark ? '#99f6e4' : 'transparent',
              opacity: isDark ? 1 : 0,
            }}
          />
          {/* Thumb */}
          <span
            className="rounded-full flex items-center justify-center transition-all duration-300 shadow-md"
            style={{
              width: '22px',
              height: '22px',
              transform: isDark ? 'translateX(28px)' : 'translateX(0)',
              background: '#ffffff',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            }}
          >
            {isDark
              ? <Moon size={11} style={{ color: '#0d9488' }} />
              : <Sun size={11} style={{ color: '#f59e0b' }} />
            }
          </span>
        </button>

        <NotificationPanel />

        <div
          className="flex items-center gap-3 pl-3"
          style={{ borderLeft: isDark ? '1.5px solid #0d2626' : '1.5px solid #d1fae5' }}
        >
          <div className="hidden md:block text-right leading-tight">
            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              {user?.name || 'User'}
            </p>
            <p className="text-xs font-bold" style={{ color: 'var(--teal-600)' }}>
              Premium ✦
            </p>
          </div>
          <Link to="/profile">
            <div
              className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-base text-white hover:scale-105 transition-transform"
              style={{
                background: 'linear-gradient(135deg, var(--teal-600), var(--teal-400))',
                boxShadow: '0 4px 12px rgba(13,148,136,0.35)',
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
