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
    <div className="flex min-h-screen font-sans" style={{ background: 'var(--bg-main)' }}>
      {/* Sidebar: fixed 260px wide on desktop, slide-in drawer on mobile */}
      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

      {/* Mobile backdrop overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-30 lg:hidden"
          style={{ background: 'rgba(13,43,43,0.55)' }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main area: takes all remaining width to the right of the sidebar */}
      <div className="flex min-h-screen flex-1 min-w-0 flex-col">
        <Navbar toggleMenu={() => setIsMobileMenuOpen(true)} />

        {/* Page content */}
        <main className="min-w-0 flex-1 overflow-x-hidden custom-scrollbar" style={{ background: 'var(--bg-main)' }}>
          <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProtectedRoute;
