import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the notifications context
const NotificationsContext = createContext();

// Custom hook to use the notifications context
export const useNotifications = () => useContext(NotificationsContext);

// Provider component
export const NotificationsProvider = ({ children }) => {
  // Initial notifications data
  const initialNotifications = [
    { 
      id: 1, 
      type: 'booking_confirmed', 
      message: 'Your cleaning service appointment has been confirmed for tomorrow at 10:00 AM.', 
      time: '2 hours ago',
      read: false,
      icon: 'calendar-check',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
    },
    { 
      id: 2, 
      type: 'service_completed', 
      message: 'Plumbing repair service has been completed. Please leave a review.', 
      time: '1 day ago',
      read: false,
      icon: 'check-circle',
      date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    },
    { 
      id: 3, 
      type: 'new_provider', 
      message: 'A new HVAC service provider is now available in your area.', 
      time: '3 days ago',
      read: true,
      icon: 'tools',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
    },
    { 
      id: 4, 
      type: 'discount', 
      message: 'Special discount: Get 15% off on all electrical services this week!', 
      time: '5 days ago',
      read: true,
      icon: 'tag',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
    },
    { 
      id: 5, 
      type: 'booking_reminder', 
      message: 'Reminder: Your landscaping appointment is scheduled for tomorrow at 2:00 PM.', 
      time: '6 days ago',
      read: true,
      icon: 'clock',
      date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() // 6 days ago
    }
  ];

  // Initialize state from localStorage if available, otherwise use initialNotifications
  const [notifications, setNotifications] = useState(() => {
    const savedNotifications = localStorage.getItem('notifications');
    return savedNotifications ? JSON.parse(savedNotifications) : initialNotifications;
  });

  // Update localStorage when notifications change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length;

  // Mark a single notification as read
  const markAsRead = (id) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({ ...notification, read: true }))
    );
  };

  // Add a new notification
  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(), // Simple way to generate unique IDs
      read: false,
      time: 'Just now',
      date: new Date().toISOString(),
      ...notification
    };
    
    setNotifications([newNotification, ...notifications]);
  };

  // Clear a notification
  const clearNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Context value
  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    clearNotification,
    clearAllNotifications
  };

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};

export default NotificationsContext;