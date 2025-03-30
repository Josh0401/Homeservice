import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationsContext'
import { FaUser, FaSignOutAlt, FaBell, FaCheckCircle, FaCalendarCheck, FaTools, FaTag, FaClock, FaBars, FaTimes } from "react-icons/fa";

const NavBar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // State for notification dropdown
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  
  // State for mobile menu
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const mobileMenuRef = useRef(null);
  
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
  
  // Toggle notification dropdown
  const toggleNotifications = (e) => {
    e.stopPropagation();
    setShowNotifications(!showNotifications);
  };
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };
  
  // Close mobile menu when clicking a link
  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };
  
  // Handle clicks outside of the notification dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    };

    // Add event listener when dropdown or mobile menu is shown
    if (showNotifications || showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Clean up event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, showMobileMenu]);
  
  // Handle marking all as read
  const handleMarkAllAsRead = (e) => {
    e.stopPropagation();
    markAllAsRead();
  };
  
  // Handle notification click
  const handleNotificationClick = (id) => {
    markAsRead(id);
    // In a real app, you might navigate to a specific page based on notification type
    setShowNotifications(false);
  };
  
  // Navigate to all notifications page
  const goToAllNotifications = () => {
    setShowNotifications(false);
    navigate('/notifications');
  };
  
  return (
    <div className='navBar flex flex-wrap justify-between items-center p-4 md:p-6 lg:p-[3rem] relative'>
        <div className="logoDiv flex items-center justify-between w-full md:w-auto">
            <Link to="/" className="logo text-xl md:text-[25px] text-blueColor no-underline">
                <strong>Home</strong>Services
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-500 hover:text-blueColor focus:outline-none" 
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {showMobileMenu ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
        </div>

        {/* Mobile Menu */}
        <div 
          ref={mobileMenuRef}
          className={`${
            showMobileMenu ? 'flex' : 'hidden'
          } md:flex flex-col md:flex-row w-full md:w-auto mt-4 md:mt-0 transition-all duration-300`}
        >
          <ul className="menu flex flex-col md:flex-row md:gap-4 lg:gap-8 w-full md:w-auto list-none p-0 m-0">
            {/* Conditional rendering based on login state */}
            {isAuthenticated ? (
              <>
                {/* User is logged in - show links in specified order */}
                <li className={`menuList py-2 md:py-0 ${currentPath === '/dashboard' ? 'active' : ''}`}>
                    <Link 
                      to="/dashboard" 
                      className={`${currentPath === '/dashboard' ? 'text-blueColor font-bold' : 'text-[#6f6f6f]'} hover:text-blueColor no-underline flex items-center gap-1`}
                      onClick={closeMobileMenu}
                    >
                     Dashboard
                    </Link>
                </li>
                
                <li className={`menuList py-2 md:py-0 ${currentPath === '/booking' ? 'active' : ''}`}>
                    <Link 
                      to="/booking" 
                      className={`${currentPath === '/booking' ? 'text-blueColor font-bold' : 'text-[#6f6f6f]'} hover:text-blueColor no-underline flex items-center gap-1`}
                      onClick={closeMobileMenu}
                    >
                     Bookings
                    </Link>
                </li>
                
                <li className={`menuList py-2 md:py-0 ${currentPath === '/' ? 'active' : ''}`}>
                    <Link 
                      to="/" 
                      className={`${currentPath === '/' ? 'text-blueColor font-bold' : 'text-[#6f6f6f]'} hover:text-blueColor no-underline`}
                      onClick={closeMobileMenu}
                    >
                      Services
                    </Link>
                </li>
                
                <li className={`menuList py-2 md:py-0 ${currentPath === '/categories' ? 'active' : ''}`}>
                    <Link 
                      to="/categories" 
                      className={`${currentPath === '/categories' ? 'text-blueColor font-bold' : 'text-[#6f6f6f]'} hover:text-blueColor no-underline`}
                      onClick={closeMobileMenu}
                    >
                      Categories
                    </Link>
                </li>
                
                <li className={`menuList py-2 md:py-0 ${currentPath === '/about' ? 'active' : ''}`}>
                    <Link 
                      to="/about" 
                      className={`${currentPath === '/about' ? 'text-blueColor font-bold' : 'text-[#6f6f6f]'} hover:text-blueColor no-underline`}
                      onClick={closeMobileMenu}
                    >
                      About
                    </Link>
                </li>
                
                <li className={`menuList py-2 md:py-0 ${currentPath === '/faq' ? 'active' : ''}`}>
                    <Link 
                      to="/faq" 
                      className={`${currentPath === '/faq' ? 'text-blueColor font-bold' : 'text-[#6f6f6f]'} hover:text-blueColor no-underline`}
                      onClick={closeMobileMenu}
                    >
                      FAQ
                    </Link>
                </li>
                
                <li className={`menuList py-2 md:py-0 ${currentPath === '/contact' ? 'active' : ''}`}>
                    <Link 
                      to="/contact" 
                      className={`${currentPath === '/contact' ? 'text-blueColor font-bold' : 'text-[#6f6f6f]'} hover:text-blueColor no-underline`}
                      onClick={closeMobileMenu}
                    >
                      Contact
                    </Link>
                </li>
                
                <div className="flex md:items-center py-2 md:py-0 gap-4 mt-2 md:mt-0 border-t md:border-0 pt-2 md:pt-0">
                  {/* Notifications Icon */}
                  <div className="relative" ref={notificationRef}>
                    <button 
                      onClick={toggleNotifications}
                      className={`${currentPath === '/notifications' ? 'text-blueColor' : 'text-[#6f6f6f]'} hover:text-blueColor no-underline flex items-center p-1`}
                      title="Notifications"
                    >
                      <FaBell size={16} />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </button>
                    
                    {/* Notifications Dropdown */}
                    {showNotifications && (
                      <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white rounded-md shadow-lg z-20 border border-[#e7e7e7]">
                        <div className="p-3 border-b border-[#e7e7e7] flex justify-between items-center">
                          <h3 className="font-semibold">Notifications</h3>
                          <button 
                            onClick={goToAllNotifications}
                            className="text-sm text-blueColor hover:underline"
                          >
                            View All
                          </button>
                        </div>
                        
                        <div className="max-h-80 overflow-y-auto">
                          {notifications.length > 0 ? (
                            // Only show the most recent 5 notifications in the dropdown
                            notifications.slice(0, 5).map(notification => (
                              <div 
                                key={notification.id}
                                className={`p-3 border-b border-[#e7e7e7] hover:bg-[#f9f9f9] cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                                onClick={() => handleNotificationClick(notification.id)}
                              >
                                <div className="flex gap-3">
                                  <div className="text-lg mt-1">
                                    {getIconComponent(notification.icon)}
                                  </div>
                                  <div className="flex-1">
                                    <p className={`text-sm ${!notification.read ? 'font-semibold' : ''}`}>
                                      {notification.message}
                                    </p>
                                    <p className="text-xs text-[#959595] mt-1">{notification.time}</p>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-[#959595]">
                              No notifications
                            </div>
                          )}
                        </div>
                        
                        {notifications.length > 5 && (
                          <div className="p-2 text-center border-t border-[#e7e7e7]">
                            <p className="text-xs text-[#959595]">
                              Showing 5 of {notifications.length} notifications
                            </p>
                          </div>
                        )}
                        
                        {unreadCount > 0 && (
                          <div className="p-2 text-center border-t border-[#e7e7e7]">
                            <button 
                              className="text-sm text-blueColor hover:underline"
                              onClick={handleMarkAllAsRead}
                            >
                              Mark all as read
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <Link 
                    to="/profile" 
                    className={`${currentPath === '/profile' ? 'text-blueColor font-bold' : 'text-[#6f6f6f]'} hover:text-blueColor no-underline flex items-center`}
                    style={{ textDecoration: 'none' }}
                    title="Profile"
                    onClick={closeMobileMenu}
                  >
                    <FaUser size={16} />
                    <span className="ml-2 md:hidden">Profile</span>
                  </Link>
                  
                  <button 
                    onClick={() => {
                      logout();
                      navigate('/');
                      closeMobileMenu();
                    }} 
                    className="text-[#6f6f6f] hover:text-redColor no-underline flex items-center gap-1"
                  >
                    <FaSignOutAlt size={16} />
                    <span className="md:inline">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* User is not logged in - show in original order */}
                <li className={`menuList py-2 md:py-0 ${currentPath === '/' ? 'active' : ''}`}>
                    <Link 
                      to="/" 
                      className={`${currentPath === '/' ? 'text-blueColor font-bold' : 'text-[#6f6f6f]'} hover:text-blueColor no-underline`}
                      onClick={closeMobileMenu}
                    >
                      Services
                    </Link>
                </li>
                
                <li className={`menuList py-2 md:py-0 ${currentPath === '/categories' ? 'active' : ''}`}>
                    <Link 
                      to="/categories" 
                      className={`${currentPath === '/categories' ? 'text-blueColor font-bold' : 'text-[#6f6f6f]'} hover:text-blueColor no-underline`}
                      onClick={closeMobileMenu}
                    >
                      Categories
                    </Link>
                </li>
                
                <li className={`menuList py-2 md:py-0 ${currentPath === '/about' ? 'active' : ''}`}>
                    <Link 
                      to="/about" 
                      className={`${currentPath === '/about' ? 'text-blueColor font-bold' : 'text-[#6f6f6f]'} hover:text-blueColor no-underline`}
                      onClick={closeMobileMenu}
                    >
                      About
                    </Link>
                </li>
                
                <li className={`menuList py-2 md:py-0 ${currentPath === '/faq' ? 'active' : ''}`}>
                    <Link 
                      to="/faq" 
                      className={`${currentPath === '/faq' ? 'text-blueColor font-bold' : 'text-[#6f6f6f]'} hover:text-blueColor no-underline`}
                      onClick={closeMobileMenu}
                    >
                      FAQ
                    </Link>
                </li>
                
                <li className={`menuList py-2 md:py-0 ${currentPath === '/contact' ? 'active' : ''}`}>
                    <Link 
                      to="/contact" 
                      className={`${currentPath === '/contact' ? 'text-blueColor font-bold' : 'text-[#6f6f6f]'} hover:text-blueColor no-underline`}
                      onClick={closeMobileMenu}
                    >
                      Contact
                    </Link>
                </li>

                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-2 md:mt-0 border-t md:border-0 pt-2 md:pt-0">
                  <li className={`menuList py-2 md:py-0 ${currentPath === '/login' ? 'active' : ''}`}>
                      <Link 
                        to="/login" 
                        className={`${currentPath === '/login' ? 'text-blueColor font-bold' : 'text-[#6f6f6f]'} hover:text-blueColor no-underline`}
                        onClick={closeMobileMenu}
                      >
                        Login
                      </Link>
                  </li>
                  
                  <li className={`menuList py-2 md:py-0 ${currentPath === '/register' ? 'active' : ''}`}>
                      <Link 
                        to="/register" 
                        className={`${currentPath === '/register' ? 'text-blueColor font-bold' : 'text-[#6f6f6f]'} hover:text-blueColor no-underline`}
                        onClick={closeMobileMenu}
                      >
                        Register
                      </Link>
                  </li>
                </div>
              </>
            )}
          </ul>
        </div>
    </div>
  )
}

export default NavBar