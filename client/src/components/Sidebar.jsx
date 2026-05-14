import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, PlusCircle, BarChart3, Scan, User, LogOut, X, Leaf } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import cashlyLogo from '../assets/cashly-logo.png';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard',       path: '/dashboard',       icon: <LayoutDashboard size={19} /> },
    { name: 'Expenses',        path: '/expenses',        icon: <Receipt size={19} /> },
    { name: 'Add Expense',     path: '/add-expense',     icon: <PlusCircle size={19} /> },
    { name: 'Analytics',       path: '/analytics',       icon: <BarChart3 size={19} /> },
    { name: 'Receipt Scanner', path: '/receipt-scanner', icon: <Scan size={19} /> },
    { name: 'Profile',         path: '/profile',         icon: <User size={19} /> },
  ];

  return (
    <>
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-[260px] flex flex-col
          cashly-sidebar
          shadow-2xl md:shadow-none
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:flex md:shrink-0
        `}
        style={{ background: 'var(--sidebar-bg)' }}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-5 shrink-0" style={{ borderBottom: '1px solid var(--sidebar-border)' }}>
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
                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'var(--sidebar-muted)' }}>
                  Smart Finance
                </span>
              </div>
            </div>
          </div>
          <button
            className="md:hidden p-1.5 rounded-full transition-colors"
            style={{ color: 'var(--sidebar-muted)', background: 'var(--sidebar-hover)' }}
            onClick={() => setIsOpen(false)}
          >
            <X size={17} />
          </button>
        </div>

        {/* Section label */}
        <div className="px-5 pt-5 pb-2">
          <span className="text-[10px] font-black uppercase tracking-[0.18em]" style={{ color: 'var(--sidebar-muted)' }}>
            Navigation
          </span>
        </div>

        {/* Nav links */}
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
                  <span style={{ color: isActive ? '#ffffff' : 'var(--sidebar-muted)', display: 'flex' }}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Divider + Logout */}
        <div className="px-3 py-4 shrink-0" style={{ borderTop: '1px solid var(--sidebar-border)' }}>
          {/* Mini financial tip */}
          <div className="mx-1 mb-3 px-3 py-2.5 rounded-xl text-[11px] font-semibold leading-snug" style={{ background: 'var(--sidebar-hover)', color: 'var(--sidebar-muted)' }}>
            <span style={{ color: 'var(--lime-400)' }}>💡 </span>Track daily to stay on target.
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 font-semibold text-sm rounded-xl transition-all w-full group"
            style={{ color: 'var(--sidebar-muted)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--sidebar-muted)'; }}
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
