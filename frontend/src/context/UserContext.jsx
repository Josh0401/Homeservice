import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
const UserContext = createContext();

// Default user data
const defaultUserData = {
  personalInfo: {
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 555-123-4567',
    address: '123 Main Street, Cityville, Country',
    profileImage: null
  },
  preferences: {
    receiveNotifications: true,
    darkMode: false,
    newsletterSubscription: true,
    servicePreferences: ['Carpentry', 'Plumbing'],
    locationRadius: 15
  },
  securitySettings: {
    twoFactorAuth: false,
    passwordLastChanged: '2023-01-15'
  }
};

export const UserProvider = ({ children }) => {
  // Try to load user data from localStorage, or use default
  const [userData, setUserData] = useState(() => {
    const savedUserData = localStorage.getItem('userData');
    return savedUserData ? JSON.parse(savedUserData) : defaultUserData;
  });

  // Save to localStorage whenever userData changes
  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Apply dark mode globally
    if (userData.preferences.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    // Add dark mode styles to document head if they don't exist
    if (!document.getElementById('dark-mode-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'dark-mode-styles';
      styleElement.textContent = `
        body.dark-mode {
          background-color: #1a1a1a;
          color: #f0f0f0;
        }
        body.dark-mode .bg-white {
          background-color: #2d2d2d;
          color: #f0f0f0;
        }
        body.dark-mode .bg-greyIsh-50 {
          background-color: #383838;
          color: #f0f0f0;
        }
        body.dark-mode .text-greyIsh-500,
        body.dark-mode .text-greyIsh-600,
        body.dark-mode .text-[#6f6f6f] {
          color: #d0d0d0;
        }
        body.dark-mode .border {
          border-color: #444;
        }
        body.dark-mode .bg-greyIsh-100,
        body.dark-mode .bg-greyIsh-200 {
          background-color: #444;
        }
        body.dark-mode input,
        body.dark-mode textarea {
          background-color: #3a3a3a;
          color: #f0f0f0;
        }
        body.dark-mode .shadow-md,
        body.dark-mode .shadow-sm,
        body.dark-mode .shadow-lg {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        }
        body.dark-mode .singleJob {
          background-color: #2d2d2d;
        }
        body.dark-mode .logo,
        body.dark-mode .text-blueColor {
          color: #60a5fa;
        }
        body.dark-mode .hover\\:text-blueColor:hover {
          color: #93c5fd;
        }
      `;
      document.head.appendChild(styleElement);
    }
  }, [userData]);

  // Update user data function
  const updateUserData = (section, field, value) => {
    setUserData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value
      }
    }));
  };

  // Update entire section
  const updateUserSection = (section, newData) => {
    setUserData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        ...newData
      }
    }));
  };

  // Reset user data to defaults
  const resetUserData = () => {
    setUserData(defaultUserData);
    localStorage.removeItem('userData');
  };

  // Current user name for display purposes
  const userName = userData.personalInfo.fullName.split(' ')[0];

  // Check if user is logged in (in a real app, this would use authentication)
  const isLoggedIn = true; // Placeholder for actual auth check

  return (
    <UserContext.Provider value={{ 
      userData, 
      updateUserData, 
      updateUserSection,
      resetUserData,
      userName,
      isLoggedIn
    }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;