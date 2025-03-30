import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider = ({ children }) => {
  // Initialize state from localStorage if available
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  // Update localStorage when auth state changes
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
    }
  }, [isAuthenticated, user]);

  // Login function
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  // Context value
  const value = {
    user,
    isAuthenticated,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;