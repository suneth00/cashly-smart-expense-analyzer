import React, { useContext, useRef, useState, useEffect } from 'react';
import { Search, Menu, Sun, Moon, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import NotificationPanel from './NotificationPanel';
import { useTheme } from '../context/ThemeContext';
import { useSearch } from '../context/SearchContext';

const Navbar = ({ toggleMenu }) => {
  const { user }             = useContext(AuthContext);
  const { isDark, toggleTheme } = useTheme();
  const { query, setQuery, clearSearch } = useSearch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const inputRef  = useRef(null);
  const [localVal, setLocalVal] = useState('');
  const [focused,  setFocused]  = useState(false);

  /* Sync localVal ← global query when navigating to /expenses externally */
  useEffect(() => {
    if (location.pathname === '/expenses') {
      setLocalVal(query);
    } else {
      // Clear local input when leaving expenses page
      setLocalVal('');
    }
  }, [location.pathname]); // eslint-disable-line

  /* Keyboard shortcut: Ctrl/Cmd + K → focus search */
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape' && focused) {
        handleClear();
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [focused]);

  const handleChange = (e) => {
    const val = e.target.value;
    setLocalVal(val);
    setQuery(val);                     // update global instantly
    if (val && location.pathname !== '/expenses') {
      navigate('/expenses');           // jump to expenses page on first keystroke
    }
  };

  const handleClear = () => {
    setLocalVal('');
    clearSearch();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (localVal.trim()) {
        navigate('/expenses');
      }
      inputRef.current?.blur();
    }
  };

  const isOnExpenses = location.pathname === '/expenses';

  return (
    <header
      className="h-20 shrink-0 flex items-center justify-between px-6 md:px-8 sticky top-0 z-10 transition-all duration-300"
      style={{
        background:   isDark ? 'var(--bg-card)' : '#ffffff',
        borderBottom: isDark ? '1px solid #0d2020' : '1px solid #d1fae5',
        boxShadow:    isDark
          ? '0 1px 8px rgba(0,0,0,0.30)'
          : '0 1px 8px rgba(13,148,136,0.06)',
      }}
    >
      {/* ── Left: mobile menu + search ── */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button
          onClick={toggleMenu}
          className="lg:hidden p-2 rounded-xl transition-colors"
          style={{ color: 'var(--teal-600)', background: 'var(--teal-50)' }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--teal-100)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--teal-50)'; }}
        >
          <Menu size={22} />
        </button>

        {/* ── Search Bar ── */}
        <div
          className="relative hidden lg:flex items-center"
          style={{ width: focused || localVal ? '340px' : '280px', transition: 'width 0.25s ease' }}
        >
          {/* Search icon */}
          <Search
            size={17}
            style={{
              position: 'absolute', left: '14px',
              color: focused ? 'var(--teal-500)' : 'var(--text-faint)',
              transition: 'color 0.2s',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          />

          <input
            ref={inputRef}
            id="global-search-input"
            type="text"
            placeholder="Search transactions…"
            value={localVal}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              width: '100%',
              paddingLeft:  '42px',
              paddingRight: localVal ? '36px' : '40px',
              paddingTop:   '9px',
              paddingBottom:'9px',
              borderRadius: '12px',
              border: `1.5px solid ${focused ? 'var(--teal-500)' : isDark ? '#0d2626' : '#d1fae5'}`,
              background:   'var(--bg-subtle)',
              color:        'var(--text-primary)',
              fontSize:     '13px',
              fontWeight:   600,
              outline:      'none',
              transition:   'all 0.2s ease',
              boxShadow:    focused ? '0 0 0 4px rgba(13,148,136,0.10)' : 'none',
              fontFamily:   'Inter, sans-serif',
            }}
          />

          {/* Clear button */}
          {localVal && (
            <button
              onMouseDown={(e) => { e.preventDefault(); handleClear(); }}
              style={{
                position: 'absolute', right: '10px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '20px', height: '20px', borderRadius: '50%',
                background: 'var(--text-faint)',
                border: 'none', cursor: 'pointer',
                color: 'var(--bg-card)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#ef4444'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--text-faint)'; }}
              aria-label="Clear search"
            >
              <X size={11} strokeWidth={3} />
            </button>
          )}

          {/* Kbd shortcut hint (shown when empty + not focused) */}
          {!localVal && !focused && (
            <span style={{
              position: 'absolute', right: '12px',
              fontSize: '10px', fontWeight: 700,
              color: 'var(--text-faint)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-card)',
              borderRadius: '5px',
              padding: '1px 5px',
              letterSpacing: '0.02em',
              pointerEvents: 'none',
            }}>
              ⌘K
            </span>
          )}

          {/* "Press Enter" hint when typing and not on /expenses */}
          {localVal && !isOnExpenses && focused && (
            <span style={{
              position: 'absolute', right: '36px',
              fontSize: '10px', fontWeight: 700,
              color: 'var(--teal-600)',
              pointerEvents: 'none',
            }}>
              ↵
            </span>
          )}
        </div>
      </div>

      {/* ── Right: dark-mode toggle + notifications + avatar ── */}
      <div className="flex items-center gap-3 shrink-0 ml-4">

        {/* Dark Mode Toggle */}
        <button
          id="dark-mode-toggle"
          onClick={toggleTheme}
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className="relative flex items-center rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
          style={{
            width: '56px', height: '28px',
            background: isDark
              ? 'linear-gradient(135deg, #0d9488, #0f766e)'
              : 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
            boxShadow: isDark
              ? '0 0 12px rgba(13,148,136,0.5), inset 0 1px 3px rgba(0,0,0,0.2)'
              : 'inset 0 1px 3px rgba(0,0,0,0.15)',
            padding: '3px',
          }}
        >
          <Sun size={12} className="absolute left-2 transition-opacity duration-300"
            style={{ color: isDark ? 'transparent' : '#f59e0b', opacity: isDark ? 0 : 1 }}
          />
          <Moon size={12} className="absolute right-2 transition-opacity duration-300"
            style={{ color: isDark ? '#99f6e4' : 'transparent', opacity: isDark ? 1 : 0 }}
          />
          <span
            className="rounded-full flex items-center justify-center transition-all duration-300 shadow-md"
            style={{
              width: '22px', height: '22px',
              transform: isDark ? 'translateX(28px)' : 'translateX(0)',
              background: '#ffffff',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            }}
          >
            {isDark
              ? <Moon size={11} style={{ color: '#0d9488' }} />
              : <Sun  size={11} style={{ color: '#f59e0b' }} />
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
                background:  'linear-gradient(135deg, var(--teal-600), var(--teal-400))',
                boxShadow:   '0 4px 12px rgba(13,148,136,0.35)',
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
