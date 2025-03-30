import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// This component wraps routes that should only be accessible to authenticated users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // Redirect to login page if user is not authenticated
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated, render the protected component
  return children;
};

export default ProtectedRoute;