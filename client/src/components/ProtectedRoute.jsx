import React, { useContext, useState } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const ProtectedRoute = () => {
  const { token } = useContext(AuthContext);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar: fixed 260px wide on desktop, slide-in drawer on mobile */}
      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

      {/* Mobile backdrop overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main area: takes all remaining width to the right of the sidebar */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar toggleMenu={() => setIsMobileMenuOpen(true)} />

        {/* Scrollable page content — NO max-w constraint here, pages control their own layout */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-slate-50 custom-scrollbar">
          <div className="w-full px-6 py-6 md:px-8 md:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProtectedRoute;
