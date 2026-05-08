import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Receipt, PlusCircle, BarChart3, Scan, User, LogOut, X } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

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
          bg-white border-r border-slate-100 shadow-xl md:shadow-none
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:flex md:shrink-0
        `}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white font-black text-base shadow-lg shadow-indigo-500/30">
              C
            </div>
            <span className="text-xl font-black tracking-tight text-slate-800">CASHLY</span>
          </div>
          <button
            className="md:hidden text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
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
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-slate-100 shrink-0">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-rose-600 hover:bg-rose-50 font-medium text-sm rounded-xl transition-all w-full group"
          >
            <LogOut size={20} className="text-slate-400 group-hover:text-rose-500 transition-colors" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
