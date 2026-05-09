import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, PlusCircle, BarChart3, Scan, User, LogOut, X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import cashlyLogo from '../assets/cashly-logo.png';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useContext(AuthContext);

  const navItems = [
    { name: 'Dashboard',       path: '/dashboard',       icon: <LayoutDashboard size={20} /> },
    { name: 'Expenses',        path: '/expenses',        icon: <Receipt size={20} /> },
    { name: 'Add Expense',     path: '/add-expense',     icon: <PlusCircle size={20} /> },
    { name: 'Analytics',       path: '/analytics',       icon: <BarChart3 size={20} /> },
    { name: 'Receipt Scanner', path: '/receipt-scanner', icon: <Scan size={20} /> },
    { name: 'Profile',         path: '/profile',         icon: <User size={20} /> },
  ];

  return (
    <>
      {/* Sidebar: 260px fixed on md+, slide-in drawer on mobile */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-[260px] flex flex-col
          bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800
          shadow-xl md:shadow-none
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:flex md:shrink-0
        `}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={cashlyLogo}
              alt="CASHLY Logo"
              className="h-10 w-10 object-contain rounded-xl"
            />
            <span className="text-xl font-black tracking-tight text-slate-800 dark:text-slate-100">CASHLY</span>
          </div>
          <button
            className="md:hidden text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 p-1.5 rounded-full transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 font-medium text-sm ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}>{item.icon}</span>
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 font-medium text-sm rounded-xl transition-all w-full group"
          >
            <LogOut size={20} className="text-slate-400 dark:text-slate-500 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
