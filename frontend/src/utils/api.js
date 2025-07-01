// src/utils/api.js

// Base API URL
const API_BASE_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Get current user from localStorage
const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Make authenticated API calls
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Profile API functions
export const profileAPI = {
  // Get user profile
  getProfile: async (userId) => {
    return await apiRequest(`/auth/profile/${userId}`);
  },

  // Update user profile
  updateProfile: async (userId, profileData) => {
    return await apiRequest(`/auth/profile/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },

  // Get current user profile (using user from localStorage)
  getCurrentUserProfile: async () => {
    const user = getCurrentUser();
    if (!user || !user._id) {
      throw new Error('No authenticated user found');
    }
    return await apiRequest(`/auth/profile/${user._id}`);
  },

  // Update current user profile
  updateCurrentUserProfile: async (profileData) => {
    const user = getCurrentUser();
    if (!user || !user._id) {
      throw new Error('No authenticated user found');
    }
    return await apiRequest(`/auth/profile/${user._id}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};

// Export utility functions
export { getToken, getCurrentUser, apiRequest };