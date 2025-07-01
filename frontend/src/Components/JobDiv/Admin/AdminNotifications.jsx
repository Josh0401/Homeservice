import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaBell, 
  FaExclamationTriangle, 
  FaCheckCircle,
  FaInfoCircle,
  FaUserCircle,
  FaSearch,
  FaCog,
  FaUserShield,
  FaChevronLeft,
  FaFilter,
  FaEllipsisH,
  FaTrash,
  FaArchive,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const AdminNotifications = () => {
  const navigate = useNavigate();
  
  // State for mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // State for notifications
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'system',
      priority: 'high',
      title: 'Storage capacity approaching limit (82%)',
      message: 'Your storage system is reaching its capacity limit. Consider upgrading your storage plan or cleaning up unused data.',
      time: '2 hours ago',
      read: false,
      category: 'system'
    },
    {
      id: 2,
      type: 'system',
      priority: 'high',
      title: 'Payment gateway timeout issues detected',
      message: 'We\'ve detected intermittent timeout issues with your payment gateway. Our technical team is investigating the problem.',
      time: '5 hours ago',
      read: true,
      resolved: true,
      category: 'payment'
    },
    {
      id: 3,
      type: 'system',
      priority: 'medium',
      title: 'System update scheduled',
      message: 'A system update is scheduled for Mar 30, 2025 at 02:00 AM. The system may be unavailable for approximately 15 minutes during this time.',
      time: '1 day ago',
      read: false,
      category: 'system'
    },
    {
      id: 4,
      type: 'user',
      priority: 'medium',
      title: 'New provider registration requires approval',
      message: 'A new service provider "Johnson Plumbing LLC" has registered and is awaiting your approval to be listed on the platform.',
      time: '1 day ago',
      read: false,
      category: 'registration'
    },
    {
      id: 5,
      type: 'service',
      priority: 'low',
      title: 'Service category "Emergency Plumbing" trending',
      message: 'The "Emergency Plumbing" category has seen a 43% increase in search volume over the past 48 hours.',
      time: '2 days ago',
      read: true,
      category: 'analytics'
    },
    {
      id: 6,
      type: 'user',
      priority: 'high',
      title: 'Customer dispute requires attention',
      message: 'Customer #4592 has filed a dispute regarding service quality for booking #JB-78423. This requires immediate review.',
      time: '2 days ago',
      read: false,
      category: 'dispute'
    },
    {
      id: 7,
      type: 'system',
      priority: 'medium',
      title: 'Database backup completed successfully',
      message: 'The weekly database backup has completed successfully. Backup files are stored at the designated secure location.',
      time: '3 days ago',
      read: true,
      category: 'system'
    },
    {
      id: 8,
      type: 'service',
      priority: 'medium',
      title: 'New service trend detected',
      message: 'We\'ve detected an increasing demand for "Smart Home Water Systems" services in the Chicago area.',
      time: '4 days ago',
      read: true,
      category: 'analytics'
    },
    {
      id: 9,
      type: 'user',
      priority: 'low',
      title: 'Provider subscription renewal',
      message: 'Service provider "Ace Plumbing Co." has renewed their premium subscription for another year.',
      time: '5 days ago',
      read: true,
      category: 'subscription'
    },
    {
      id: 10,
      type: 'system',
      priority: 'low',
      title: 'New API key generated',
      message: 'A new API key has been generated for your account. Please update your integration settings accordingly.',
      time: '1 week ago',
      read: true,
      category: 'system'
    }
  ]);

  // State for notification filters
  const [filters, setFilters] = useState({
    type: 'all', // 'all', 'system', 'user', 'service'
    read: 'all', // 'all', 'read', 'unread'
    priority: 'all', // 'all', 'high', 'medium', 'low'
  });

  // State for showing filter panel on mobile
  const [showFilters, setShowFilters] = useState(false);
  
  // Selected notifications for batch actions
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  // Handle navigation back to dashboard
  const handleBackToDashboard = () => {
    navigate('/admin/dashboard');
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters({
      ...filters,
      [filterType]: value
    });
  };

  // Toggle notification selection
  const toggleNotificationSelection = (id) => {
    if (selectedNotifications.includes(id)) {
      setSelectedNotifications(selectedNotifications.filter(notifId => notifId !== id));
    } else {
      setSelectedNotifications([...selectedNotifications, id]);
    }
  };

  // Toggle all notifications selection
  const toggleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(notif => notif.id));
    }
  };

  // Mark notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  // Mark multiple notifications as read
  const markSelectedAsRead = () => {
    setNotifications(notifications.map(notif => 
      selectedNotifications.includes(notif.id) ? { ...notif, read: true } : notif
    ));
    setSelectedNotifications([]);
  };

  // Archive selected notifications
  const archiveSelected = () => {
    setNotifications(notifications.filter(notif => 
      !selectedNotifications.includes(notif.id)
    ));
    setSelectedNotifications([]);
  };

  // Filter notifications based on current filters
  const filteredNotifications = notifications.filter(notif => {
    // Filter by type
    if (filters.type !== 'all' && notif.type !== filters.type) {
      return false;
    }
    
    // Filter by read status
    if (filters.read === 'read' && !notif.read) {
      return false;
    }
    if (filters.read === 'unread' && notif.read) {
      return false;
    }
    
    // Filter by priority
    if (filters.priority !== 'all' && notif.priority !== filters.priority) {
      return false;
    }
    
    return true;
  });

  // Count unread notifications
  const unreadCount = notifications.filter(notif => !notif.read).length;

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu if screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
        setShowFilters(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen pb-8">
      {/* Header */}
      <header className="bg-indigo-700 shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-white">Admin Notifications</h1>
          
          {/* Mobile menu button */}
          <button 
            className="lg:hidden text-white hover:text-indigo-200 focus:outline-none" 
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          
          {/* Desktop nav */}
          <div className="hidden lg:flex items-center space-x-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search notifications..."
                className="pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
            </div>
            <button className="text-white hover:text-indigo-200">
              <FaBell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-18 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            <button className="text-white hover:text-indigo-200">
              <FaCog size={20} />
            </button>
            <Link to="/admin/profile" className="flex items-center text-white hover:text-indigo-200">
              <FaUserShield size={22} className="mr-2" />
              <span>Admin</span>
            </Link>
            <Link to="/admin/create-service" className="flex items-center text-white hover:text-indigo-200">
              <FaClipboardList size={22} className="mr-2" />
              <span>Services</span>
            </Link>
            <Link to="/admin/create-service-category" className="flex items-center text-white hover:text-indigo-200">
              <FaClipboardList size={22} className="mr-2" />
              <span>Service Category</span>
            </Link>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-indigo-800 px-4 py-3">
            <div className="relative mb-3">
              <input
                type="text"
                placeholder="Search notifications..."
                className="w-full pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <button className="flex flex-col items-center justify-center p-2 rounded-lg text-white hover:bg-indigo-700">
                <FaBell size={20} />
                <span className="text-xs mt-1">Notifications</span>
              </button>
              <button className="flex flex-col items-center justify-center p-2 rounded-lg text-white hover:bg-indigo-700">
                <FaCog size={20} />
                <span className="text-xs mt-1">Settings</span>
              </button>
              <Link 
                to="/admin/profile" 
                className="flex flex-col items-center justify-center p-2 rounded-lg text-white hover:bg-indigo-700"
              >
                <FaUserShield size={20} />
                <span className="text-xs mt-1">Profile</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      <div className="container mx-auto px-4 pt-4 md:pt-8">
        {/* Back to Dashboard Button */}
        <button 
          onClick={handleBackToDashboard}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4 md:mb-6"
        >
          <FaChevronLeft className="mr-1" /> 
          <span>Back to Dashboard</span>
        </button>
        
        {/* Page Title and Controls */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 space-y-4 md:space-y-0">
          <div className="flex items-center">
            <FaBell className="text-indigo-600 mr-2" size={24} />
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">Notifications</h2>
            <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {unreadCount} unread
            </span>
          </div>
          
          <div className="flex flex-wrap md:flex-nowrap gap-2">
            {/* Show/Hide Filters Button (Mobile Only) */}
            <button 
              className="md:hidden bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-2 rounded-md text-sm flex items-center"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter className="mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            {/* Batch Actions */}
            <div className="flex gap-2">
              <button 
                onClick={markSelectedAsRead}
                disabled={selectedNotifications.length === 0}
                className={`px-3 py-2 rounded-md text-sm flex items-center ${
                  selectedNotifications.length > 0 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FaCheckCircle className="mr-2" />
                Mark as Read
              </button>
              
              <button 
                onClick={archiveSelected}
                disabled={selectedNotifications.length === 0}
                className={`px-3 py-2 rounded-md text-sm flex items-center ${
                  selectedNotifications.length > 0 
                    ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                <FaArchive className="mr-2" />
                Archive
              </button>
            </div>
          </div>
        </div>
        
        {/* Notifications Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Filters Panel */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 sticky top-20">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>
              
              {/* Notification Type Filter */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Notification Type</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="type" 
                      checked={filters.type === 'all'} 
                      onChange={() => handleFilterChange('type', 'all')}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">All</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="type" 
                      checked={filters.type === 'system'} 
                      onChange={() => handleFilterChange('type', 'system')}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">System</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="type" 
                      checked={filters.type === 'user'} 
                      onChange={() => handleFilterChange('type', 'user')}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">User</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="type" 
                      checked={filters.type === 'service'} 
                      onChange={() => handleFilterChange('type', 'service')}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Service</span>
                  </label>
                </div>
              </div>
              
              {/* Read Status Filter */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Read Status</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="read" 
                      checked={filters.read === 'all'} 
                      onChange={() => handleFilterChange('read', 'all')}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">All</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="read" 
                      checked={filters.read === 'unread'} 
                      onChange={() => handleFilterChange('read', 'unread')}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Unread</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="read" 
                      checked={filters.read === 'read'} 
                      onChange={() => handleFilterChange('read', 'read')}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Read</span>
                  </label>
                </div>
              </div>
              
              {/* Priority Filter */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Priority</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="priority" 
                      checked={filters.priority === 'all'} 
                      onChange={() => handleFilterChange('priority', 'all')}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">All</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="priority" 
                      checked={filters.priority === 'high'} 
                      onChange={() => handleFilterChange('priority', 'high')}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">High</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="priority" 
                      checked={filters.priority === 'medium'} 
                      onChange={() => handleFilterChange('priority', 'medium')}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Medium</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="priority" 
                      checked={filters.priority === 'low'} 
                      onChange={() => handleFilterChange('priority', 'low')}
                      className="form-radio h-4 w-4 text-indigo-600"
                    />
                    <span className="ml-2 text-sm text-gray-700">Low</span>
                  </label>
                </div>
              </div>
              
              {/* Reset Filters Button */}
              <button 
                onClick={() => setFilters({ type: 'all', read: 'all', priority: 'all' })}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm"
              >
                Reset Filters
              </button>
            </div>
          </div>
          
          {/* Notifications List */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Notification Header */}
              <div className="flex items-center justify-between bg-gray-50 px-4 py-3 border-b">
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                    onChange={toggleSelectAll}
                    className="form-checkbox h-4 w-4 text-indigo-600 rounded"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {selectedNotifications.length > 0 ? `${selectedNotifications.length} selected` : 'Select all'}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {filteredNotifications.length} notifications
                </div>
              </div>
              
              {/* Notifications */}
              {filteredNotifications.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {filteredNotifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className={`px-4 py-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-indigo-50' : ''}`}
                    >
                      <div className="flex items-start">
                        {/* Checkbox */}
                        <div className="flex-shrink-0 pt-1">
                          <input 
                            type="checkbox" 
                            checked={selectedNotifications.includes(notification.id)} 
                            onChange={() => toggleNotificationSelection(notification.id)}
                            className="form-checkbox h-4 w-4 text-indigo-600 rounded"
                          />
                        </div>
                        
                        {/* Icon */}
                        <div className="flex-shrink-0 ml-3">
                          {notification.type === 'system' && (
                            <div className={`p-2 rounded-full ${
                              notification.priority === 'high' ? 'bg-red-100 text-red-600' : 
                              notification.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 
                              'bg-blue-100 text-blue-600'
                            }`}>
                              <FaExclamationTriangle size={16} />
                            </div>
                          )}
                          {notification.type === 'user' && (
                            <div className={`p-2 rounded-full ${
                              notification.priority === 'high' ? 'bg-red-100 text-red-600' : 
                              notification.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 
                              'bg-blue-100 text-blue-600'
                            }`}>
                              <FaUserCircle size={16} />
                            </div>
                          )}
                          {notification.type === 'service' && (
                            <div className={`p-2 rounded-full ${
                              notification.priority === 'high' ? 'bg-red-100 text-red-600' : 
                              notification.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 
                              'bg-blue-100 text-blue-600'
                            }`}>
                              <FaInfoCircle size={16} />
                            </div>
                          )}
                        </div>
                        
                        {/* Content */}
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900">
                              {notification.title}
                              {!notification.read && (
                                <span className="ml-2 bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                  New
                                </span>
                              )}
                              {notification.resolved && (
                                <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                  Resolved
                                </span>
                              )}
                            </h4>
                            <span className="text-xs text-gray-500">{notification.time}</span>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                          
                          {/* Action Buttons */}
                          <div className="mt-2 flex space-x-2">
                            {!notification.read && (
                              <button 
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-indigo-600 hover:text-indigo-800"
                              >
                                Mark as read
                              </button>
                            )}
                            
                            {notification.type === 'system' && notification.category === 'system' && (
                              <Link 
                                to="/admin/systems" 
                                className="text-xs text-indigo-600 hover:text-indigo-800"
                              >
                                View System Settings
                              </Link>
                            )}
                            
                            {notification.type === 'user' && notification.category === 'registration' && (
                              <Link 
                                to="/admin/users/approval" 
                                className="text-xs text-indigo-600 hover:text-indigo-800"
                              >
                                Review Provider
                              </Link>
                            )}
                            
                            {notification.type === 'user' && notification.category === 'dispute' && (
                              <Link 
                                to="/admin/disputes" 
                                className="text-xs text-indigo-600 hover:text-indigo-800"
                              >
                                Handle Dispute
                              </Link>
                            )}
                            
                            {notification.type === 'service' && notification.category === 'analytics' && (
                              <Link 
                                to="/admin/reports" 
                                className="text-xs text-indigo-600 hover:text-indigo-800"
                              >
                                View Analytics
                              </Link>
                            )}
                          </div>
                        </div>
                        
                        {/* Actions Menu */}
                        <div className="ml-3 flex-shrink-0 relative">
                          <div className="dropdown inline-block relative">
                            <button className="bg-white rounded-full p-1 hover:bg-gray-100">
                              <FaEllipsisH className="text-gray-500" size={14} />
                            </button>
                            {/* Dropdown content would go here */}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <FaBell className="mx-auto text-gray-300 mb-3" size={36} />
                  <h3 className="text-lg font-medium text-gray-700">No notifications found</h3>
                  <p className="text-sm text-gray-500 mt-1">Adjust your filters to see more results</p>
                </div>
              )}
              
              {/* Pagination */}
              <div className="bg-gray-50 px-4 py-3 border-t flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing <span className="font-medium">{filteredNotifications.length}</span> of <span className="font-medium">{notifications.length}</span> notifications
                </div>
                <div className="flex space-x-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;