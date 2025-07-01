import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaChartBar, 
  FaMoneyBillWave, 
  FaUsers, 
  FaServer,
  FaUserShield,
  FaBell,
  FaCog,
  FaSearch,
  FaDownload,
  FaUsersCog,
  FaClipboardList,
  FaExclamationTriangle,
  FaCheckCircle,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const AdminDashboard = () => {
  // Add useNavigate hook for navigation
  const navigate = useNavigate();

  // State for mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sample data - in a real app, this would come from an API
  const [platformMetrics, setPlatformMetrics] = useState({
    totalUsers: 15487,
    activeUsers: 8952,
    providers: 487,
    customers: 15000,
    totalBookings: 37845,
    conversionRate: 68
  });

  const [revenueData, setRevenueData] = useState({
    totalRevenue: 452680,
    monthlyRevenue: 42750,
    averageOrderValue: 85,
    transactionFees: 12825,
    subscriptionRevenue: 29925,
    projectedGrowth: 12
  });

  const [userActivity, setUserActivity] = useState({
    newSignups: 243,
    dailyActiveUsers: 3254,
    averageSessionTime: '12m 37s',
    topServices: [
      { name: 'Pipe Installation', count: 543 },
      { name: 'Water Heater Services', count: 487 },
      { name: 'Drain Cleaning', count: 412 },
      { name: 'Leak Repair', count: 378 }
    ],
    peakHours: [
      { hour: '9-10 AM', users: 875 },
      { hour: '12-1 PM', users: 936 },
      { hour: '6-7 PM', users: 1023 }
    ]
  });

  const [systemHealth, setSystemHealth] = useState({
    uptime: '99.98%',
    responseTime: '187ms',
    errorRate: '0.05%',
    cpuUtilization: 42,
    memoryUsage: 67,
    apiStatus: 'Operational',
    databaseStatus: 'Operational',
    storageStatus: 'Warning',
    storageUsed: 82,
    lastDeployment: '2025-03-24 09:15 AM'
  });

  const [recentAlerts, setRecentAlerts] = useState([
    {
      id: 1,
      type: 'warning',
      message: 'Storage capacity approaching limit (82%)',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'error',
      message: 'Payment gateway timeout issues detected',
      time: '5 hours ago',
      resolved: true
    },
    {
      id: 3,
      type: 'info',
      message: 'System update scheduled for Mar 30, 2025 at 02:00 AM',
      time: '1 day ago'
    }
  ]);

  // Monthly revenue data for chart
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([
    { month: 'Jan', revenue: 36540 },
    { month: 'Feb', revenue: 38250 },
    { month: 'Mar', revenue: 42750 },
    { month: 'Apr', revenue: 0 },
    { month: 'May', revenue: 0 },
    { month: 'Jun', revenue: 0 },
    { month: 'Jul', revenue: 0 },
    { month: 'Aug', revenue: 0 },
    { month: 'Sep', revenue: 0 },
    { month: 'Oct', revenue: 0 },
    { month: 'Nov', revenue: 0 },
    { month: 'Dec', revenue: 0 }
  ]);
  
  // For active bar on chart hover
  const [activeBarIndex, setActiveBarIndex] = useState(null);

  // Handle navigation to notifications page
  const handleNotificationClick = () => {
    navigate('/admin/notifications');
  };

  // Handle navigation to settings page
  const handleSettingsClick = () => {
    navigate('/admin/systems');
  };

  // Handle export data
  const handleExportData = (reportType) => {
    // In a real app, this would trigger a data export
    console.log(`Exporting ${reportType} data...`);
    // Simulate a download delay
    setTimeout(() => {
      alert(`${reportType} data exported successfully`);
    }, 1000);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu if screen size changes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
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
          <h1 className="text-xl md:text-2xl font-bold text-white">Admin Dashboard</h1>
          
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
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
            </div>
            <button 
              className="text-white hover:text-indigo-200" 
              onClick={handleNotificationClick}
            >
              <FaBell size={20} />
            </button>
            <button 
              className="text-white hover:text-indigo-200"
              onClick={handleSettingsClick}
            >
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
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <button 
                className="flex flex-col items-center justify-center p-2 rounded-lg text-white hover:bg-indigo-700" 
                onClick={handleNotificationClick}
              >
                <FaBell size={20} />
                <span className="text-xs mt-1">Notifications</span>
              </button>
              <button 
                className="flex flex-col items-center justify-center p-2 rounded-lg text-white hover:bg-indigo-700"
                onClick={handleSettingsClick}
              >
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
        {/* Dashboard Title and Controls */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 md:mb-8 space-y-4 md:space-y-0">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">Analytics Overview</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <select className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto">
              <option>Last 30 days</option>
              <option>This month</option>
              <option>Last quarter</option>
              <option>Year to date</option>
            </select>
            <button 
              onClick={() => handleExportData('dashboard')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm flex items-center w-full sm:w-auto justify-center"
            >
              <FaDownload className="mr-2" />
              Export Data
            </button>
          </div>
        </div>

        {/* Platform Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base md:text-lg font-semibold text-gray-700">Total Users</h3>
              <FaUsers className="text-indigo-500" size={20} />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-indigo-600">{platformMetrics.totalUsers.toLocaleString()}</p>
            <div className="flex justify-between mt-4 text-xs md:text-sm">
              <span className="text-gray-500">Providers: {platformMetrics.providers.toLocaleString()}</span>
              <span className="text-gray-500">Customers: {platformMetrics.customers.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base md:text-lg font-semibold text-gray-700">Active Users</h3>
              <FaUsers className="text-green-500" size={20} />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-green-600">{platformMetrics.activeUsers.toLocaleString()}</p>
            <div className="mt-4 text-xs md:text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Engagement Rate</span>
                <span className="text-gray-700 font-medium">{Math.round((platformMetrics.activeUsers / platformMetrics.totalUsers) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(platformMetrics.activeUsers / platformMetrics.totalUsers) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base md:text-lg font-semibold text-gray-700">Total Bookings</h3>
              <FaClipboardList className="text-blue-500" size={20} />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-blue-600">{platformMetrics.totalBookings.toLocaleString()}</p>
            <div className="flex justify-between mt-4 text-xs md:text-sm">
              <span className="text-gray-500">Conversion Rate</span>
              <span className="text-gray-700 font-medium">{platformMetrics.conversionRate}%</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base md:text-lg font-semibold text-gray-700">Total Revenue</h3>
              <FaMoneyBillWave className="text-emerald-500" size={20} />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-emerald-600">${revenueData.totalRevenue.toLocaleString()}</p>
            <div className="mt-4 text-xs md:text-sm">
              <span className="text-gray-500">Projected Growth</span>
              <div className="flex items-center mt-1">
                <div className="flex items-center text-emerald-600">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12 7a1 1 0 11-2 0 1 1 0 012 0zm-8.485.879a.5.5 0 01-.707-.707l5-5a.5.5 0 01.707 0l5 5a.5.5 0 01-.707.707L9 3.172V17.5a.5.5 0 01-1 0V3.172L4.793 7.879z" clipRule="evenodd" />
                  </svg>
                  <span className="font-medium">{revenueData.projectedGrowth}%</span>
                </div>
                <span className="ml-2 text-gray-500">this quarter</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Revenue Analytics */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 md:mb-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 md:mb-6 space-y-3 sm:space-y-0">
                <h2 className="text-lg md:text-xl font-semibold flex items-center">
                  <FaMoneyBillWave className="mr-2 text-indigo-600" />
                  Revenue Analytics
                </h2>
                <div>
                  <button
                    onClick={() => handleExportData('revenue')}
                    className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                  >
                    <FaDownload className="mr-1" />
                    Export
                  </button>
                </div>
              </div>
              
              {/* Revenue Chart - Made responsive with min-height */}
              <div className="bg-white p-2 md:p-4 rounded-lg mb-4 md:mb-6" style={{ minHeight: "200px" }}>
                <div className="w-full h-40 md:h-64 flex items-end overflow-x-auto">
                  {monthlyRevenueData.map((item, index) => (
                    <div key={index} className="flex flex-col items-center mx-1 flex-1 min-w-[40px]">
                      <div 
                        className="w-full bg-indigo-500 hover:bg-indigo-600 rounded-t-sm transition-all duration-300"
                        style={{ 
                          height: `${(item.revenue / Math.max(...monthlyRevenueData.map(d => d.revenue)) * 80)}%`,
                          opacity: item.revenue === 0 ? 0.2 : 1
                        }}
                      ></div>
                      <div className="text-xs mt-2 text-gray-600">{item.month}</div>
                      <div className="text-xs font-medium text-gray-800">
                        {item.revenue > 0 ? `$${(item.revenue / 1000).toFixed(1)}K` : '-'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Revenue Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                  <h4 className="text-gray-500 text-xs md:text-sm mb-1">Monthly Revenue</h4>
                  <p className="text-lg md:text-xl font-bold text-indigo-600">${revenueData.monthlyRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                  <h4 className="text-gray-500 text-xs md:text-sm mb-1">Avg. Order Value</h4>
                  <p className="text-lg md:text-xl font-bold text-indigo-600">${revenueData.averageOrderValue}</p>
                </div>
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                  <h4 className="text-gray-500 text-xs md:text-sm mb-1">Transaction Fees</h4>
                  <p className="text-lg md:text-xl font-bold text-indigo-600">${revenueData.transactionFees.toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            {/* User Activity Monitoring */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 md:mb-8">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 md:mb-6 space-y-3 sm:space-y-0">
                <h2 className="text-lg md:text-xl font-semibold flex items-center">
                  <FaUsers className="mr-2 text-indigo-600" />
                  User Activity Monitoring
                </h2>
                <Link 
                  to="/admin/users" 
                  className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                >
                  View Details
                </Link>
              </div>
              
              {/* User Activity Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                  <h4 className="text-gray-500 text-xs md:text-sm mb-1">New Signups (Today)</h4>
                  <p className="text-lg md:text-xl font-bold text-indigo-600">{userActivity.newSignups}</p>
                </div>
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                  <h4 className="text-gray-500 text-xs md:text-sm mb-1">Daily Active Users</h4>
                  <p className="text-lg md:text-xl font-bold text-indigo-600">{userActivity.dailyActiveUsers.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                  <h4 className="text-gray-500 text-xs md:text-sm mb-1">Avg. Session Time</h4>
                  <p className="text-lg md:text-xl font-bold text-indigo-600">{userActivity.averageSessionTime}</p>
                </div>
              </div>
              
              {/* Top Services */}
              <div className="mb-4 md:mb-6">
                <h3 className="text-sm md:text-md font-semibold text-gray-700 mb-2 md:mb-3">Most Requested Services</h3>
                <div className="space-y-2 md:space-y-3">
                  {userActivity.topServices.map((service, index) => (
                    <div key={index} className="flex items-center flex-wrap sm:flex-nowrap">
                      <div className="w-full sm:w-7/12 bg-gray-200 rounded-full h-2 mb-1 sm:mb-0">
                        <div 
                          className="bg-indigo-600 h-2 rounded-full" 
                          style={{ width: `${(service.count / userActivity.topServices[0].count) * 100}%` }}
                        ></div>
                      </div>
                      <div className="w-full sm:w-5/12 sm:ml-4 flex justify-between">
                        <span className="text-xs md:text-sm text-gray-700">{service.name}</span>
                        <span className="text-xs md:text-sm font-medium text-gray-900">{service.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* User Activity Chart - Simple Responsive Version */}
              <div className="bg-white p-2 md:p-4 rounded-lg">
                <h3 className="text-sm md:text-md font-semibold text-gray-700 mb-2 md:mb-3">Peak User Activity Hours</h3>
                <div className="space-y-2 md:space-y-3 mt-2 md:mt-4">
                  {userActivity.peakHours.map((hour, index) => (
                    <div key={index} className="flex items-center flex-wrap sm:flex-nowrap">
                      <div className="w-full sm:w-24 text-xs md:text-sm text-gray-600 mb-1 sm:mb-0">{hour.hour}</div>
                      <div className="w-full sm:flex-1">
                        <div className="relative pt-1">
                          <div className="flex mb-1 md:mb-2 items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                                {hour.users} users
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 mb-2 md:mb-4 text-xs flex rounded bg-green-200">
                            <div 
                              style={{ width: `${(hour.users / 1100) * 100}%` }} 
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* System Health */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 md:mb-8">
              <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 flex items-center">
                <FaServer className="mr-2 text-indigo-600" />
                System Health
              </h2>
              
              <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs md:text-sm text-gray-600">Uptime</span>
                    <span className="text-xs md:text-sm font-medium text-green-600">{systemHealth.uptime}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: '99.98%' }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs md:text-sm text-gray-600">Response Time</span>
                    <span className="text-xs md:text-sm font-medium">{systemHealth.responseTime}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: '80%' }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs md:text-sm text-gray-600">Error Rate</span>
                    <span className="text-xs md:text-sm font-medium text-green-600">{systemHealth.errorRate}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: '0.05%' }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs md:text-sm text-gray-600">CPU Utilization</span>
                    <span className="text-xs md:text-sm font-medium">{systemHealth.cpuUtilization}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${systemHealth.cpuUtilization}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs md:text-sm text-gray-600">Memory Usage</span>
                    <span className="text-xs md:text-sm font-medium">{systemHealth.memoryUsage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${systemHealth.memoryUsage}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs md:text-sm text-gray-600">Storage Used</span>
                    <span className="text-xs md:text-sm font-medium text-amber-600">{systemHealth.storageUsed}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-amber-500 h-2 rounded-full" 
                      style={{ width: `${systemHealth.storageUsed}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className={`p-2 md:p-3 rounded-lg text-center col-span-2 ${systemHealth.storageStatus === 'Operational' ? 'bg-green-100 text-green-800' : systemHealth.storageStatus === 'Warning' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                  <p className="text-xs font-medium mb-1">Storage System</p>
                  <p className="text-xs md:text-sm font-semibold">{systemHealth.storageStatus}</p>
                </div>
              </div>
              
              <div className="mt-4 text-xs text-gray-500 text-center">
                Last deployment: {systemHealth.lastDeployment}
              </div>
            </div>
            
            {/* Recent Alerts */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 md:mb-8">
              <div className="flex justify-between items-center mb-3 md:mb-4">
                <h2 className="text-lg md:text-xl font-semibold flex items-center">
                  <FaExclamationTriangle className="mr-2 text-amber-500" />
                  Recent Alerts
                </h2>
                <Link 
                  to="/admin/alerts" 
                  className="text-indigo-600 hover:text-indigo-800 text-xs md:text-sm"
                >
                  View All
                </Link>
              </div>
              
              <div className="space-y-3 md:space-y-4">
                {recentAlerts.map(alert => (
                  <div key={alert.id} className="border-l-4 px-3 md:px-4 py-2 md:py-3 rounded-r-lg" 
                    style={{ 
                      borderColor: alert.type === 'error' ? '#ef4444' : alert.type === 'warning' ? '#f59e0b' : '#3b82f6',
                      backgroundColor: alert.type === 'error' ? '#fee2e2' : alert.type === 'warning' ? '#fef3c7' : '#eff6ff'
                    }}
                  >
                    <div className="flex justify-between">
                      <h5 className="font-medium text-xs md:text-sm" style={{ 
                        color: alert.type === 'error' ? '#b91c1c' : alert.type === 'warning' ? '#92400e' : '#1e40af'
                      }}>
                        {alert.message}
                      </h5>
                      {alert.resolved && (
                        <FaCheckCircle className="text-green-600 flex-shrink-0" size={16} />
                      )}
                    </div>
                    <p className="text-xs mt-1 text-gray-500">{alert.time}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Quick Actions</h2>
              <ul className="space-y-2 md:space-y-3">
                <li>
                  <Link to="/admin/users" className="flex items-center p-2 md:p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 transition">
                    <FaUsersCog className="text-indigo-600 mr-2 md:mr-3" size={16} />
                    <span className="text-sm text-gray-700">Manage Users</span>
                  </Link>
                </li>
                <li>
                  <Link to="/admin/payments" className="flex items-center p-2 md:p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 transition">
                    <FaMoneyBillWave className="text-indigo-600 mr-2 md:mr-3" size={16} />
                    <span className="text-sm text-gray-700">Payment Settings</span>
                  </Link>
                </li>
                <li>
                  <Link to="/admin/reports" className="flex items-center p-2 md:p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 transition">
                    <FaChartBar className="text-indigo-600 mr-2 md:mr-3" size={16} />
                    <span className="text-sm text-gray-700">Generate Reports</span>
                  </Link>
                </li>
                <li>
                  <Link to="/admin/systems" className="flex items-center p-2 md:p-3 bg-gray-50 rounded-lg hover:bg-indigo-50 transition">
                    <FaServer className="text-indigo-600 mr-2 md:mr-3" size={16} />
                    <span className="text-sm text-gray-700">System Settings</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 