import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaBell, 
  FaCheck,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUserCircle,
  FaTools
} from 'react-icons/fa';

const NotificationPage = () => {
  // Sample notifications data - in a real app, this would come from an API
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'booking',
      title: 'New Booking Request',
      description: 'John Doe has requested a Pipe Installation service on March 28, 2025',
      time: '2 hours ago',
      read: false
    },
    {
      id: 2,
      type: 'payment',
      title: 'Payment Received',
      description: 'You received a payment of $120 for Leak Repair service',
      time: '1 day ago',
      read: false
    },
    {
      id: 3,
      type: 'system',
      title: 'Account Update',
      description: 'Your account verification has been completed successfully',
      time: '3 days ago',
      read: true
    },
    {
      id: 4,
      type: 'booking',
      title: 'Booking Reminder',
      description: 'Reminder: You have a scheduled Water Heater service tomorrow at 9:00 AM',
      time: '3 days ago',
      read: true
    },
    {
      id: 5,
      type: 'review',
      title: 'New Review',
      description: 'Alice Williams gave you a 5-star rating for Drain Cleaning service',
      time: '1 week ago',
      read: true
    }
  ]);

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className="bg-greyIsh-50 min-h-screen pb-8">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/provider/dashboard" className="text-gray-600 hover:text-blueColor mr-4">
              <FaArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-bold text-blueColor">Notifications</h1>
          </div>
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="text-sm text-blueColor hover:underline flex items-center"
            >
              <FaCheck className="mr-1" /> Mark all as read
            </button>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 pt-8">
        <div className="bg-white rounded-lg shadow-md">
          {/* Notification count summary */}
          <div className="border-b px-6 py-4">
            <div className="flex items-center text-gray-700">
              <FaBell className="text-blueColor mr-2" size={20} />
              <span className="font-medium">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Notifications list */}
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`px-6 py-4 hover:bg-gray-50 ${!notification.read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start">
                    <div className="mr-4 mt-1">
                      {notification.type === 'booking' && <FaCalendarAlt className="text-blue-500" size={18} />}
                      {notification.type === 'payment' && <FaMoneyBillWave className="text-green-500" size={18} />}
                      {notification.type === 'system' && <FaTools className="text-purple-500" size={18} />}
                      {notification.type === 'review' && <FaUserCircle className="text-orange-500" size={18} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className={`font-medium ${!notification.read ? 'text-blueColor' : 'text-gray-800'}`}>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                      <p className="text-gray-600 mt-1">{notification.description}</p>
                      
                      {!notification.read && (
                        <button 
                          onClick={() => markAsRead(notification.id)}
                          className="text-sm text-blueColor hover:underline mt-2"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FaBell className="mx-auto mb-4 text-gray-300" size={40} />
              <p>No notifications at this time</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;