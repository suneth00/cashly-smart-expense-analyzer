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
    <div className="flex h-screen overflow-hidden font-sans" style={{ background: 'var(--bg-main)' }}>
      {/* Sidebar: fixed 260px wide on desktop, slide-in drawer on mobile */}
      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

      {/* Mobile backdrop overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 backdrop-blur-sm z-30 md:hidden"
          style={{ background: 'rgba(13,43,43,0.55)' }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main area: takes all remaining width to the right of the sidebar */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar toggleMenu={() => setIsMobileMenuOpen(true)} />

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar" style={{ background: 'var(--bg-main)' }}>
          <div className="w-full px-6 py-6 md:px-8 md:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProtectedRoute;
