import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/axios';

export const AuthContext = createContext();

// Stores authentication state so all pages can know who is logged in.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          // Loads the logged-in user's profile when a saved JWT exists.
          const res = await axios.get('/auth/profile');
          setUser(res.data);
        } catch (error) {
          console.error('Error fetching profile:', error);
          setToken(null);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  // Logs in with email/password and stores the returned JWT.
  const login = async (email, password) => {
    const res = await axios.post('/auth/login', { email, password });
    setToken(res.data.token);
    localStorage.setItem('token', res.data.token);
    setUser(res.data);
    return res.data;
  };

  // Registers a new user and starts the session immediately.
  const register = async (userData) => {
    const res = await axios.post('/auth/register', userData);
    setToken(res.data.token);
    localStorage.setItem('token', res.data.token);
    setUser(res.data);
    return res.data;
  };

  // Sends the Google credential to the backend and stores our app JWT.
  const loginWithGoogle = async (credential) => {
    const res = await axios.post('/auth/google', { credential });
    setToken(res.data.token);
    localStorage.setItem('token', res.data.token);
    setUser(res.data);
    return res.data;
  };

  // Clears user data and removes the JWT from localStorage.
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, loading, login, register, loginWithGoogle, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
