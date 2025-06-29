import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationsContext'
import { useLanguage, languages } from '../../context/LanguageContext' // Import language context and languages array
import { FaUser, FaSignOutAlt, FaBell, FaCheckCircle, FaCalendarCheck, FaTools, FaTag, FaClock, FaBars, FaTimes, FaGlobe } from "react-icons/fa";

const NavBar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { language, setLanguage, t } = useLanguage(); // Use the language context
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // State for notification dropdown
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  
  // State for mobile menu
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const mobileMenuRef = useRef(null);

  // State for language selector
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const languageSelectorRef = useRef(null);
  
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
    // Close other dropdowns
    setShowLanguageSelector(false);
  };
  
  // Toggle language selector
  const toggleLanguageSelector = (e) => {
    e.stopPropagation();
    setShowLanguageSelector(!showLanguageSelector);
    // Close other dropdowns
    setShowNotifications(false);
  };
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };
  
  // Close mobile menu when clicking a link
  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };
  
  // Change language
  const changeLanguage = (code) => {
    setLanguage(code);
    setShowLanguageSelector(false);
  };
  
  // Handle clicks outside of the dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      
      if (languageSelectorRef.current && !languageSelectorRef.current.contains(event.target)) {
        setShowLanguageSelector(false);
      }
      
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    };

    // Add event listener when dropdown or mobile menu is shown
    if (showNotifications || showMobileMenu || showLanguageSelector) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Clean up event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications, showMobileMenu, showLanguageSelector]);
  
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
                     {t.dashboard}
                    </Link>
                </li>
                
                <li className={`menuList py-2 md:py-0 ${currentPath === '/booking' ? 'active' : ''}`}>
                    <Link 
                      to="/booking" 
                      className={`${currentPath === '/booking' ? 'text-blueColor font-bold' : 'text-[#6f6f6f]'} hover:text-blueColor no-underline flex items-center gap-1`}
                      onClick={closeMobileMenu}
                    >
                     {t.bookings || 'Bookings'}
                    </Link>
                </li>
                
                <li className={`menuList py-2 md:py-0 ${currentPath === '/' ? 'active' : ''}`}>
                    <Link 
                      to="/" 
                      className={`${currentPath === '/' ? 'text-blueColor font-bold' : 'text-[#6f6f6f]'} hover:text-blueColor no-underline`}
                      onClick={closeMobileMenu}
                    >
                      {t.services || 'Services'}
                    </Link>
                </li>
                
                <li className={`menuList py-2 md:py-0 ${currentPath === '/categories' ? 'active' : ''}`}>
                    <Link 
                      to="/categories" 
                      className={`${currentPath === '/categories' ? 'text-blueColor font-bold' : 'text-[#6f6f6f]'} hover:text-blueColor no-underline`}
                      onClick={closeMobileMenu}
                    >
                      {t.categories}
                    </Link>
                </li>
                
                <li className={`menuList py-2 md:py-0 ${currentPath === '/about' ? 'active' : ''}`}>
                    <Link 
                      to="/about" 
                      className={`${currentPath === '/about' ? 'text-blueColor font-bold' : 'text-[#6f6f6f]'} hover:text-blueColor no-underline`}
                      onClick={closeMobileMenu}
                    >
                      {t.about}
                    </Link>
                </li>
                
                <li className={`menuList py-2 md:py-0 ${currentPath === '/faq' ? 'active' : ''}`}>
                    <Link 
                      to="/faq" 
                      className={`${currentPath === '/faq' ? 'text-blueColor font-bold' : 'text-[#6f6f6f]'} hover:text-blueColor no-underline`}
                      onClick={closeMobileMenu}
                    >
                      {t.faq || 'FAQ'}
                    </Link>
                </li>
                
                <li className={`menuList py-2 md:py-0 ${currentPath === '/contact' ? 'active' : ''}`}>
                    <Link 
                      to="/contact" 
                      className={`${currentPath === '/contact' ? 'text-blueColor font-bold' : 'text-[#6f6f6f]'} hover:text-blueColor no-underline`}
                      onClick={closeMobileMenu}
                    >
                      {t.contact}
                    </Link>
                </li>
                
                <div className="flex md:items-center py-2 md:py-0 gap-4 mt-2 md:mt-0 border-t md:border-0 pt-2 md:pt-0">
                  {/* Language Selector */}
                  <div className="relative" ref={languageSelectorRef}>
                    <button 
                      onClick={toggleLanguageSelector}
                      className="text-[#6f6f6f] hover:text-blueColor no-underline flex items-center p-1"
                      title={t.languageSelector}
                    >
                      <FaGlobe size={16} />
                    </button>
                    
                    {/* Language Dropdown */}
                    {showLanguageSelector && (
                      <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-20 border border-[#e7e7e7]">
                        <div className="p-2 border-b border-[#e7e7e7]">
                          <h3 className="text-sm font-semibold">{t.languageSelector}</h3>
                        </div>
                        <div>
                          {languages.map(lang => (
                            <button
                              key={lang.code}
                              onClick={() => changeLanguage(lang.code)}
                              className={`w-full text-left px-3 py-2 text-sm ${
                                language === lang.code ? 'bg-blue-50 text-blueColor font-medium' : 'text-[#6f6f6f] hover:bg-gray-50'
                              }`}
                            >
                              {lang.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                
                  {/* Notifications Icon */}
                  <div className="relative" ref={notificationRef}>
                    <button 
                      onClick={toggleNotifications}
                      className={`${currentPath === '/notifications' ? 'text-blueColor' : 'text-[#6f6f6f]'} hover:text-blueColor no-underline flex items-center p-1`}
                      title={t.notifications}
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
                          <h3 className="font-semibold">{t.notifications}</h3>
                          <button 
                            onClick={goToAllNotifications}
                            className="text-sm text-blueColor hover:underline"
                          >
                            {t.viewAll || 'View All'}
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
                              {t.noNotifications || 'No notifications'}
                            </div>
                          )}
                        </div>
                        
                        {notifications.length > 5 && (
                          <div className="p-2 text-center border-t border-[#e7e7e7]">
                            <p className="text-xs text-[#959595]">
                              {t.showingNotifications || 'Showing'} 5 {t.of || 'of'} {notifications.length} {t.notifications.toLowerCase()}
                            </p>
                          </div>
                        )}
                        
                        {unreadCount > 0 && (
                          <div className="p-2 text-center border-t border-[#e7e7e7]">
                            <button 
                              className="text-sm text-blueColor hover:underline"
                              onClick={handleMarkAllAsRead}
                            >
                              {t.markAllAsRead || 'Mark all as read'}
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
                    title={t.profile}
                    onClick={closeMobileMenu}
                  >
                    <FaUser size={16} />
                    <span className="ml-2 md:hidden">{t.profile}</span>
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
                    <span className="md:inline">{t.logout}</span>
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
                      {t.services || 'Services'}
                    </Link>
                </li>
                
                <li className={`menuList py-2 md:py-0 ${currentPath === '/categories' ? 'active' : ''}`}>
                    <Link 
                      to="/categories" 
                      className={`${currentPath === '/categories' ? 'text-blueColor font-bold' : 'text-[#6f6f6f]'} hover:text-blueColor no-underline`}
                      onClick={closeMobileMenu}
                    >
                      {t.categories}
                    </Link>
                </li>
                
                <li className={`menuList py-2 md:py-0 ${currentPath === '/about' ? 'active' : ''}`}>
                    <Link 
                      to="/about" 
                      className={`${currentPath === '/about' ? 'text-blueColor font-bold' : 'text-[#6f6f6f]'} hover:text-blueColor no-underline`}
                      onClick={closeMobileMenu}
                    >
                      {t.about}
                    </Link>
                </li>
                
                <li className={`menuList py-2 md:py-0 ${currentPath === '/faq' ? 'active' : ''}`}>
                    <Link 
                      to="/faq" 
                      className={`${currentPath === '/faq' ? 'text-blueColor font-bold' : 'text-[#6f6f6f]'} hover:text-blueColor no-underline`}
                      onClick={closeMobileMenu}
                    >
                      {t.faq || 'FAQ'}
                    </Link>
                </li>
                
                <li className={`menuList py-2 md:py-0 ${currentPath === '/contact' ? 'active' : ''}`}>
                    <Link 
                      to="/contact" 
                      className={`${currentPath === '/contact' ? 'text-blueColor font-bold' : 'text-[#6f6f6f]'} hover:text-blueColor no-underline`}
                      onClick={closeMobileMenu}
                    >
                      {t.contact}
                    </Link>
                </li>

                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mt-2 md:mt-0 border-t md:border-0 pt-2 md:pt-0">
                  {/* Language Selector for non-authenticated users */}
                  <div className="relative md:order-last" ref={languageSelectorRef}>
                    <button 
                      onClick={toggleLanguageSelector}
                      className="text-[#6f6f6f] hover:text-blueColor no-underline flex items-center p-1"
                      title={t.languageSelector}
                    >
                      <FaGlobe size={16} />
                      <span className="ml-2 md:hidden">{t.languageSelector}</span>
                    </button>
                    
                    {/* Language Dropdown */}
                    {showLanguageSelector && (
                      <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-20 border border-[#e7e7e7]">
                        <div className="p-2 border-b border-[#e7e7e7]">
                          <h3 className="text-sm font-semibold">{t.languageSelector}</h3>
                        </div>
                        <div>
                          {languages.map(lang => (
                            <button
                              key={lang.code}
                              onClick={() => changeLanguage(lang.code)}
                              className={`w-full text-left px-3 py-2 text-sm ${
                                language === lang.code ? 'bg-blue-50 text-blueColor font-medium' : 'text-[#6f6f6f] hover:bg-gray-50'
                              }`}
                            >
                              {lang.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <li className={`menuList py-2 md:py-0 ${currentPath === '/login' ? 'active' : ''}`}>
                      <Link 
                        to="/login" 
                        className={`${currentPath === '/login' ? 'text-blueColor font-bold' : 'text-[#6f6f6f]'} hover:text-blueColor no-underline`}
                        onClick={closeMobileMenu}
                      >
                        {t.login}
                      </Link>
                  </li>
                  
                  <li className={`menuList py-2 md:py-0 ${currentPath === '/register' ? 'active' : ''}`}>
                      <Link 
                        to="/register" 
                        className={`${currentPath === '/register' ? 'text-blueColor font-bold' : 'text-[#6f6f6f]'} hover:text-blueColor no-underline`}
                        onClick={closeMobileMenu}
                      >
                        {t.register}
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