import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // 1. Freeze the screen! If AuthContext is still mounting, wait right here.
  // This completely stops the Navigate component from triggering accidentally.
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 2. Only AFTER loading is finished, if there is no user, kick them to Home.
  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 3. Role-based security check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/sales'} replace />;
  }

  // 4. Everything is secure, render the page!
  return children;
};

export default ProtectedRoute;
