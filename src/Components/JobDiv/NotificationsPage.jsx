import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationsContext';
import { FaCalendarCheck, FaCheckCircle, FaTools, FaTag, FaClock, FaTrash, FaCheck } from 'react-icons/fa';

const NotificationsPage = () => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearNotification, 
    clearAllNotifications 
  } = useNotifications();
  
  // State for filter
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  
  // Get icon component based on icon name
  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'calendar-check':
        return <FaCalendarCheck className="text-green-500" />;
      case 'check-circle':
        return <FaCheckCircle className="text-blue-500" />;
      case 'tools':
        return <FaTools className="text-gray-500" />;
      case 'tag':
        return <FaTag className="text-purple-500" />;
      case 'clock':
        return <FaClock className="text-orange-500" />;
      default:
        return <FaCheckCircle className="text-blue-500" />;
    }
  };
  
  // Filter notifications based on selected filter
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });
  
  // Group notifications by date (today, yesterday, earlier this week, etc.)
  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    const date = new Date(notification.date);
    const now = new Date();
    
    // Today
    if (date.toDateString() === now.toDateString()) {
      if (!groups.today) groups.today = [];
      groups.today.push(notification);
    } 
    // Yesterday
    else if (date.toDateString() === new Date(now.setDate(now.getDate() - 1)).toDateString()) {
      if (!groups.yesterday) groups.yesterday = [];
      groups.yesterday.push(notification);
    }
    // This week
    else if (date > new Date(now.setDate(now.getDate() - 6))) {
      if (!groups.thisWeek) groups.thisWeek = [];
      groups.thisWeek.push(notification);
    }
    // Earlier
    else {
      if (!groups.earlier) groups.earlier = [];
      groups.earlier.push(notification);
    }
    
    return groups;
  }, {});
  
  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="pageHeader flex flex-col items-center justify-center py-10 bg-greyIsh">
        <h1 className="text-[32px] text-textColor font-bold mb-4">Your Notifications</h1>
        <p className="text-[16px] text-[#959595] max-w-[600px] text-center">
          Stay up to date with your service appointments, provider updates, and special offers.
        </p>
      </div>

      <div className="py-12 px-4">
        <div className="max-w-[800px] mx-auto">
          <div className="bg-white rounded-lg shadow-md border border-[#e7e7e7] p-6">
            {/* Notifications Header with Actions */}
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <div className="flex gap-4">
                <button 
                  onClick={() => setFilter('all')} 
                  className={`px-4 py-2 rounded-md transition-all ${
                    filter === 'all' 
                      ? 'bg-blueColor text-white' 
                      : 'bg-[#f7f7f7] text-[#6f6f6f] hover:bg-[#eaeaea]'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button 
                  onClick={() => setFilter('unread')} 
                  className={`px-4 py-2 rounded-md transition-all ${
                    filter === 'unread' 
                      ? 'bg-blueColor text-white' 
                      : 'bg-[#f7f7f7] text-[#6f6f6f] hover:bg-[#eaeaea]'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
                <button 
                  onClick={() => setFilter('read')} 
                  className={`px-4 py-2 rounded-md transition-all ${
                    filter === 'read' 
                      ? 'bg-blueColor text-white' 
                      : 'bg-[#f7f7f7] text-[#6f6f6f] hover:bg-[#eaeaea]'
                  }`}
                >
                  Read ({notifications.length - unreadCount})
                </button>
              </div>
              
              <div className="flex gap-3">
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 px-3 py-2 bg-[#f7f7f7] text-[#6f6f6f] hover:bg-[#eaeaea] rounded-md transition-all"
                  >
                    <FaCheck size={14} />
                    <span>Mark all as read</span>
                  </button>
                )}
                {notifications.length > 0 && (
                  <button 
                    onClick={clearAllNotifications}
                    className="flex items-center gap-1 px-3 py-2 bg-[#f7f7f7] text-red-500 hover:bg-red-50 rounded-md transition-all"
                  >
                    <FaTrash size={14} />
                    <span>Clear all</span>
                  </button>
                )}
              </div>
            </div>
            
            {/* Notifications List */}
            <div className="space-y-6">
              {Object.keys(groupedNotifications).length > 0 ? (
                Object.entries(groupedNotifications).map(([timeframe, items]) => (
                  <div key={timeframe} className="space-y-2">
                    <h3 className="text-sm font-semibold text-[#959595] uppercase tracking-wider">
                      {timeframe === 'today' ? 'Today' : 
                       timeframe === 'yesterday' ? 'Yesterday' :
                       timeframe === 'thisWeek' ? 'Earlier This Week' : 'Earlier'}
                    </h3>
                    <div className="bg-white border border-[#e7e7e7] rounded-md overflow-hidden">
                      {items.map((notification, index) => (
                        <div 
                          key={notification.id}
                          className={`p-4 ${index !== items.length - 1 ? 'border-b border-[#e7e7e7]' : ''} ${!notification.read ? 'bg-blue-50' : ''}`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="text-lg mt-1">
                              {getIconComponent(notification.icon)}
                            </div>
                            <div className="flex-1">
                              <p className={`text-[#333] ${!notification.read ? 'font-semibold' : ''}`}>
                                {notification.message}
                              </p>
                              <p className="text-sm text-[#959595] mt-1">
                                {notification.time}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {!notification.read && (
                                <button 
                                  onClick={() => markAsRead(notification.id)}
                                  className="text-blueColor hover:text-blue-700 p-1"
                                  title="Mark as read"
                                >
                                  <FaCheck size={16} />
                                </button>
                              )}
                              <button 
                                onClick={() => clearNotification(notification.id)}
                                className="text-red-400 hover:text-red-600 p-1"
                                title="Delete notification"
                              >
                                <FaTrash size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 bg-[#f9f9f9] rounded-md">
                  <div className="w-16 h-16 mx-auto bg-[#f0f0f0] rounded-full flex items-center justify-center mb-4">
                    <FaCheckCircle className="text-[#d0d0d0]" size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-[#6f6f6f] mb-2">
                    {filter === 'all' 
                      ? 'No notifications' 
                      : filter === 'unread' 
                      ? 'No unread notifications'
                      : 'No read notifications'}
                  </h3>
                  <p className="text-[#959595]">
                    {filter === 'all' 
                      ? 'You don\'t have any notifications yet.' 
                      : filter === 'unread' 
                      ? 'You\'ve read all your notifications.'
                      : 'You haven\'t read any notifications yet.'}
                  </p>
                </div>
              )}
            </div>
            
            {/* Back Button */}
            <div className="mt-8 text-center">
              <Link 
                to="/dashboard" 
                className="text-blueColor hover:underline"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;