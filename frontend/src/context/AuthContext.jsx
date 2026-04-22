import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. Grab data synchronously from localStorage
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  
  // 2. CRITICAL: Force isLoading to be TRUE on the very first render cycle
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 3. Immediately turn off loading after the component successfully mounts.
    // This creates a micro-delay that prevents the Router from panic-redirecting.
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      // Intelligently import axiosInstance so it isn't circularly loaded
      const { default: axiosInstance } = await import('../api/axiosConfig');
      await axiosInstance.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token'); // Just in case a legacy token exists
      window.location.href = '/';
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
