import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Wallet,
  PlusCircle,
  LineChart,
  ScanLine,
  Sparkles,
  User,
  LogOut,
  X,
  Leaf,
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import cashlyLogo from '../assets/cashly-logo.png';

/* ── Shared icon spec: every nav icon gets the same size & stroke weight ── */
const ICON_SIZE        = 20;
const ICON_STROKE      = 2;

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useContext(AuthContext);

  const navItems = [
    {
      name:  'Dashboard',
      path:  '/dashboard',
      icon:  <LayoutDashboard size={ICON_SIZE} strokeWidth={ICON_STROKE} />,
    },
    {
      name:  'Expenses',
      path:  '/expenses',
      icon:  <Wallet size={ICON_SIZE} strokeWidth={ICON_STROKE} />,
    },
    {
      name:  'Add Expense',
      path:  '/add-expense',
      icon:  <PlusCircle size={ICON_SIZE} strokeWidth={ICON_STROKE} />,
    },
    {
      name:  'Analytics',
      path:  '/analytics',
      icon:  <LineChart size={ICON_SIZE} strokeWidth={ICON_STROKE} />,
    },
    {
      name:  'Receipt Scanner',
      path:  '/receipt-scanner',
      icon:  <ScanLine size={ICON_SIZE} strokeWidth={ICON_STROKE} />,
    },
    {
      name:   'Upgrade Plan',
      path:   '/upgrade',
      icon:   <Sparkles size={ICON_SIZE} strokeWidth={ICON_STROKE} />,
      accent: true,
    },
    {
      name:  'Profile',
      path:  '/profile',
      icon:  <User size={ICON_SIZE} strokeWidth={ICON_STROKE} />,
    },
  ];

  return (
    <>
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex h-screen max-h-screen w-[260px] flex-col
          cashly-sidebar
          shadow-2xl
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:sticky lg:top-0 lg:translate-x-0 lg:shrink-0 lg:shadow-none
        `}
        style={{ background: 'var(--sidebar-bg)' }}
      >
        {/* ── Logo ── */}
        <div
          className="h-20 flex items-center justify-between px-5 shrink-0"
          style={{ borderBottom: '1px solid var(--sidebar-border)' }}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={cashlyLogo}
                alt="CASHLY Logo"
                className="h-10 w-10 object-contain rounded-xl"
              />
              {/* Live pulse indicator */}
              <span className="absolute -top-0.5 -right-0.5 pulse-dot" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">CASHLY</span>
              <div className="flex items-center gap-1 mt-0.5">
                <Leaf size={9} style={{ color: 'var(--lime-400)' }} />
                <span
                  className="text-[9px] font-bold uppercase tracking-widest"
                  style={{ color: 'var(--sidebar-muted)' }}
                >
                  Smart Finance
                </span>
              </div>
            </div>
          </div>

          {/* Mobile close button */}
          <button
            className="lg:hidden p-1.5 rounded-full transition-colors"
            style={{ color: 'var(--sidebar-muted)', background: 'var(--sidebar-hover)' }}
            onClick={() => setIsOpen(false)}
          >
            <X size={17} strokeWidth={ICON_STROKE} />
          </button>
        </div>

        {/* ── Section label ── */}
        <div className="px-5 pt-5 pb-2">
          <span
            className="text-[10px] font-black uppercase tracking-[0.18em]"
            style={{ color: 'var(--sidebar-muted)' }}
          >
            Navigation
          </span>
        </div>

        {/* ── Nav links ── */}
        <nav className="flex-1 px-3 pb-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `cashly-nav-item ${isActive ? 'active' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Icon — teal-400 when active, teal-400 for accent, slate-400 otherwise */}
                  <span
                    style={{
                      display: 'flex',
                      color: isActive
                        ? '#2dd4bf'          /* teal-400 — active */
                        : item.accent
                          ? '#2dd4bf'        /* teal-400 — upgrade accent */
                          : '#94a3b8',       /* slate-400 — inactive */
                      transition: 'color 0.15s ease',
                    }}
                  >
                    {item.icon}
                  </span>

                  {/* Label */}
                  <span
                    style={{
                      color: isActive
                        ? '#ffffff'
                        : item.accent
                          ? '#2dd4bf'
                          : undefined,
                      fontWeight: item.accent ? 700 : undefined,
                    }}
                  >
                    {item.name}

                    {/* "NEW" badge on the Upgrade Plan link */}
                    {item.accent && !isActive && (
                      <span
                        style={{
                          marginLeft:    '6px',
                          display:       'inline-block',
                          fontSize:      '9px',
                          fontWeight:    800,
                          padding:       '1px 6px',
                          borderRadius:  '999px',
                          background:    'rgba(13,148,136,0.18)',
                          border:        '1px solid rgba(13,148,136,0.30)',
                          color:         '#2dd4bf',
                          letterSpacing: '0.06em',
                          verticalAlign: 'middle',
                        }}
                      >
                        NEW
                      </span>
                    )}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── Divider + Sign Out ── */}
        <div
          className="px-3 py-4 shrink-0"
          style={{ borderTop: '1px solid var(--sidebar-border)' }}
        >
          {/* Mini tip */}
          <div
            className="mx-1 mb-3 px-3 py-2.5 rounded-xl text-[11px] font-semibold leading-snug"
            style={{ background: 'var(--sidebar-hover)', color: 'var(--sidebar-muted)' }}
          >
            <span style={{ color: 'var(--lime-400)' }}>💡 </span>Track daily to stay on target.
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 font-semibold text-sm rounded-xl transition-all w-full"
            style={{ color: '#94a3b8' /* slate-400 */ }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.10)';
              e.currentTarget.style.color      = '#f87171';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color      = '#94a3b8';
            }}
          >
            <LogOut size={ICON_SIZE} strokeWidth={ICON_STROKE} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
