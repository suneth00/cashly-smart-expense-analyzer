import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { SearchProvider } from './context/SearchContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import AddExpense from './pages/AddExpense';
import Analytics from './pages/Analytics';
import ReceiptScanner from './pages/ReceiptScanner';
import Profile from './pages/Profile';
import Subscription from './pages/Subscription';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <SearchProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes — all wrapped in the app shell */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/add-expense" element={<AddExpense />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/receipt-scanner" element={<ReceiptScanner />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/upgrade" element={<Subscription />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
      </SearchProvider>
    </ThemeProvider>
  );
}

export default App;
