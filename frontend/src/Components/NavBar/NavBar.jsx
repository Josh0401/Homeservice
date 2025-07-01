import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { FaUser, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";

const NavBar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Check if current route is provider or admin
  const isProviderRoute = location.pathname.startsWith('/provider');
  const isAdminRoute = location.pathname.startsWith('/admin');
  const shouldHideNavItems = isProviderRoute || isAdminRoute;
  
  // State for mobile menu
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const mobileMenuRef = useRef(null);
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };
  
  // Close mobile menu when clicking a link
  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };
  
  // Handle clicks outside of the mobile menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    };

    // Add event listener when mobile menu is shown
    if (showMobileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    // Clean up event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileMenu]);
  
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
                {!shouldHideNavItems && (
                  <>
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
                  </>
                )}
                
                <div className="flex md:items-center py-2 md:py-0 gap-4 mt-2 md:mt-0 border-t md:border-0 pt-2 md:pt-0">
                  {/* Profile Icon - Only show if not on provider/admin routes */}
                  {!shouldHideNavItems && (
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
                  )}
                  
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