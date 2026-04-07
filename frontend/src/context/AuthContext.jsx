import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // 1. Initialize state directly from localStorage so it is instant on render
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifySession = async () => {
      // If we have a token, we can verify the session in the background
      if (token) {
        try {
          const res = await axiosInstance.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.data);
            localStorage.setItem('user', JSON.stringify(res.data.data));
          }
        } catch (error) {
          console.error('Session verification failed');
          // If 401 is received, the axios interceptor handles the auto-logout
        }
      }
      setIsLoading(false);
    };

    verifySession();
  }, [token]);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
