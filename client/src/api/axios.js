import axios from 'axios';

// Uses the deployed backend URL from Vite env, or localhost during development.
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Attaches the JWT token to every protected API request.
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handles common API errors in one place.
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check for network errors (e.g., server down, CORS issues)
    if (!error.response) {
      error.message = 'Network error: Cannot connect to server. Please try again.';
      return Promise.reject(error);
    }
    
    // Check for 401 Unauthorized (invalid, missing, or expired token)
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      // Only redirect if we are not already on auth pages
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default instance;
