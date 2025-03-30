import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUserShield, 
  FaBell, 
  FaCog, 
  FaSearch,
  FaChartBar,
  FaFileAlt,
  FaDownload,
  FaCalendarAlt,
  FaUsers,
  FaMoneyBillWave,
  FaClipboardList,
  FaExclamationTriangle,
  FaCheckCircle,
  FaArrowLeft,
  FaSpinner,
  FaRegFilePdf,
  FaRegFileExcel,
  FaFileCsv,
  FaTrash,
  FaBars
} from 'react-icons/fa';

const AdminReports = () => {
  const navigate = useNavigate();

  // State for report generation
  const [reportType, setReportType] = useState('earnings');
  const [dateRange, setDateRange] = useState('last30');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [format, setFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [savedReports, setSavedReports] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sample data for saved reports
  useEffect(() => {
    setSavedReports([
      {
        id: 'RPT-00123',
        name: 'Monthly Earnings - March 2025',
        type: 'earnings',
        dateCreated: '2025-03-25',
        creator: 'Admin',
        format: 'pdf',
        size: '758 KB'
      },
      {
        id: 'RPT-00122',
        name: 'User Activity - Q1 2025',
        type: 'activity',
        dateCreated: '2025-03-20',
        creator: 'Admin',
        format: 'xlsx',
        size: '1.2 MB'
      },
      {
        id: 'RPT-00121',
        name: 'Provider Performance - February 2025',
        type: 'providers',
        dateCreated: '2025-03-15',
        creator: 'Admin',
        format: 'csv',
        size: '980 KB'
      },
      {
        id: 'RPT-00120',
        name: 'Service Bookings - January 2025',
        type: 'bookings',
        dateCreated: '2025-02-05',
        creator: 'Admin',
        format: 'pdf',
        size: '1.5 MB'
      },
      {
        id: 'RPT-00119',
        name: 'Annual Earnings Report - 2024',
        type: 'earnings',
        dateCreated: '2025-01-15',
        creator: 'Admin',
        format: 'xlsx',
        size: '2.3 MB'
      }
    ]);
  }, []);

  // Handle navigation to notifications page
  const handleNotificationClick = () => {
    navigate('/admin/notifications');
  };

  // Handle navigation to dashboard
  const handleBackToDashboard = () => {
    navigate('/admin/dashboard');
  };

  // Handle navigation to settings page
  const handleSettingsClick = () => {
    navigate('/admin/systems');
  };

  // Handle report type change
  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };

  // Handle date range change
  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
    
    // Reset custom dates if not custom
    if (e.target.value !== 'custom') {
      setStartDate('');
      setEndDate('');
    }
  };

  // Handle format change
  const handleFormatChange = (e) => {
    setFormat(e.target.value);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Handle form submission
  const handleGenerateReport = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    
    // Simulate report generation delay
    setTimeout(() => {
      setIsGenerating(false);
      setReportGenerated(true);
      
      // Add the new report to saved reports
      const newReport = {
        id: `RPT-${Math.floor(10000 + Math.random() * 90000)}`,
        name: getReportName(),
        type: reportType,
        dateCreated: new Date().toISOString().slice(0, 10),
        creator: 'Admin',
        format: format,
        size: getRandomSize()
      };
      
      setSavedReports([newReport, ...savedReports]);
      
      // Reset form after 2 seconds
      setTimeout(() => {
        setReportGenerated(false);
      }, 2000);
    }, 2000);
  };

  // Get report name based on selected options
  const getReportName = () => {
    const reportTypeNames = {
      earnings: 'Earnings Report',
      bookings: 'Bookings Report',
      providers: 'Provider Performance Report',
      customers: 'Customer Activity Report',
      activity: 'Platform Activity Report'
    };
    
    const base = reportTypeNames[reportType] || 'Custom Report';
    let date = 'Custom Date Range';
    
    switch (dateRange) {
      case 'last7':
        date = 'Last 7 Days';
        break;
      case 'last30':
        date = 'Last 30 Days';
        break;
      case 'last90':
        date = 'Last 90 Days';
        break;
      case 'thisMonth':
        date = getCurrentMonth();
        break;
      case 'lastMonth':
        date = getPreviousMonth();
        break;
      case 'thisYear':
        date = `Year ${new Date().getFullYear()}`;
        break;
      case 'custom':
        if (startDate && endDate) {
          date = `${startDate} to ${endDate}`;
        }
        break;
      default:
        date = 'Custom Period';
    }
    
    return `${base} - ${date}`;
  };

  // Get random file size for demo
  const getRandomSize = () => {
    const size = (Math.random() * 2 + 0.5).toFixed(1);
    return `${size} MB`;
  };

  // Get current month name
  const getCurrentMonth = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const now = new Date();
    return `${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  // Get previous month name
  const getPreviousMonth = () => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const now = new Date();
    now.setMonth(now.getMonth() - 1);
    return `${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  // Handle report deletion confirmation
  const handleConfirmDelete = (report) => {
    setReportToDelete(report);
    setShowConfirmDelete(true);
  };

  // Execute report deletion
  const executeDeleteReport = () => {
    if (reportToDelete) {
      const updatedReports = savedReports.filter(report => report.id !== reportToDelete.id);
      setSavedReports(updatedReports);
      setShowConfirmDelete(false);
      setReportToDelete(null);
    }
  };

  // Get report icon based on format
  const getReportIcon = (format) => {
    switch (format) {
      case 'pdf':
        return <FaRegFilePdf className="text-red-500" size={18} />;
      case 'xlsx':
        return <FaRegFileExcel className="text-green-600" size={18} />;
      case 'csv':
        return <FaFileCsv className="text-indigo-500" size={18} />;
      default:
        return <FaFileAlt className="text-gray-500" size={18} />;
    }
  };

  // Get report type badge color
  const getReportTypeBadgeColor = (type) => {
    switch (type) {
      case 'earnings':
        return 'bg-green-100 text-green-800';
      case 'bookings':
        return 'bg-blue-100 text-blue-800';
      case 'providers':
        return 'bg-indigo-100 text-indigo-800';
      case 'customers':
        return 'bg-purple-100 text-purple-800';
      case 'activity':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-8">
      {/* Header */}
      <header className="bg-indigo-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Admin Dashboard</h1>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden text-white hover:text-indigo-200"
              onClick={toggleMobileMenu}
            >
              <FaBars size={24} />
            </button>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search reports..."
                  className="pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-48 lg:w-64"
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
            </div>
          </div>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-2 space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search reports..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
              </div>
              <div className="flex justify-between pt-2">
                <button 
                  className="text-white hover:text-indigo-200 flex items-center" 
                  onClick={handleNotificationClick}
                >
                  <FaBell size={20} className="mr-2" />
                  <span>Notifications</span>
                </button>
                <button 
                  className="text-white hover:text-indigo-200 flex items-center"
                  onClick={handleSettingsClick}
                >
                  <FaCog size={20} className="mr-2" />
                  <span>Settings</span>
                </button>
              </div>
              <Link to="/admin/profile" className="block text-white hover:text-indigo-200">
                <div className="flex items-center">
                  <FaUserShield size={22} className="mr-2" />
                  <span>Admin Profile</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {/* Back to Dashboard Link */}
        <div className="mb-6">
          <button 
            onClick={handleBackToDashboard}
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <FaArrowLeft className="mr-2" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      
        {/* Page Title */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Generate Reports</h2>
          <p className="text-gray-600 mt-1">Create and download reports on platform performance and activities</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Report Generator */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaFileAlt className="mr-2 text-indigo-600" />
                Create New Report
              </h3>
              
              <form onSubmit={handleGenerateReport}>
                {/* Report Type */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Report Type
                  </label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={reportType}
                    onChange={handleReportTypeChange}
                  >
                    <option value="earnings">Earnings Report</option>
                    <option value="bookings">Bookings Report</option>
                    <option value="providers">Provider Performance</option>
                    <option value="customers">Customer Activity</option>
                    <option value="activity">Platform Activity</option>
                  </select>
                </div>
                
                {/* Date Range */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
                    value={dateRange}
                    onChange={handleDateRangeChange}
                  >
                    <option value="last7">Last 7 Days</option>
                    <option value="last30">Last 30 Days</option>
                    <option value="last90">Last 90 Days</option>
                    <option value="thisMonth">This Month</option>
                    <option value="lastMonth">Last Month</option>
                    <option value="thisYear">This Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                  
                  {/* Custom Date Range */}
                  {dateRange === 'custom' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Start Date
                        </label>
                        <input 
                          type="date" 
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          End Date
                        </label>
                        <input 
                          type="date" 
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Format Options */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Format
                  </label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="format" 
                        value="pdf" 
                        checked={format === 'pdf'}
                        onChange={handleFormatChange}
                        className="mr-2"
                      />
                      <FaRegFilePdf className="mr-1 text-red-500" />
                      <span>PDF</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="format" 
                        value="xlsx" 
                        checked={format === 'xlsx'}
                        onChange={handleFormatChange}
                        className="mr-2"
                      />
                      <FaRegFileExcel className="mr-1 text-green-600" />
                      <span>Excel</span>
                    </label>
                    <label className="flex items-center">
                      <input 
                        type="radio" 
                        name="format" 
                        value="csv" 
                        checked={format === 'csv'}
                        onChange={handleFormatChange}
                        className="mr-2"
                      />
                      <FaFileCsv className="mr-1 text-indigo-500" />
                      <span>CSV</span>
                    </label>
                  </div>
                </div>
                
                {/* Generate Button */}
                <button 
                  type="submit" 
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition"
                  disabled={isGenerating || (dateRange === 'custom' && (!startDate || !endDate))}
                >
                  {isGenerating ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Generating...
                    </>
                  ) : reportGenerated ? (
                    <>
                      <FaCheckCircle className="mr-2" />
                      Report Generated!
                    </>
                  ) : (
                    <>
                      <FaDownload className="mr-2" />
                      Generate Report
                    </>
                  )}
                </button>
              </form>
              
              {/* Report Type Information */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Report Description</h4>
                <p className="text-sm text-gray-600">
                  {reportType === 'earnings' && "Detailed financial report showing revenue, fees, and profits over the selected time period."}
                  {reportType === 'bookings' && "Comprehensive overview of bookings statistics including number of bookings, completion rates, and services breakdown."}
                  {reportType === 'providers' && "Performance metrics for service providers including ratings, job completion, and earnings data."}
                  {reportType === 'customers' && "Customer activity analysis showing engagement metrics, booking frequency, and spending patterns."}
                  {reportType === 'activity' && "Platform usage statistics including visits, search patterns, and conversion metrics."}
                </p>
              </div>
            </div>
          </div>
          
          {/* Right Column - Saved Reports */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaChartBar className="mr-2 text-indigo-600" />
                Saved Reports
              </h3>
              
              {savedReports.length > 0 ? (
                <div className="overflow-x-auto -mx-4 sm:-mx-6">
                  <div className="inline-block min-w-full px-4 sm:px-6">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Report Name
                          </th>
                          <th scope="col" className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                            Type
                          </th>
                          <th scope="col" className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                            Created
                          </th>
                          <th scope="col" className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                            Format
                          </th>
                          <th scope="col" className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                            Size
                          </th>
                          <th scope="col" className="px-3 sm:px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {savedReports.map(report => (
                          <tr key={report.id} className="hover:bg-gray-50">
                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                {getReportIcon(report.format)}
                                <span className="ml-2 text-sm font-medium text-gray-900 truncate max-w-xs">{report.name}</span>
                              </div>
                              {/* Mobile only info */}
                              <div className="sm:hidden mt-1 text-xs text-gray-500">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getReportTypeBadgeColor(report.type)}`}>
                                  {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                                </span>
                                <span className="ml-2">{report.format.toUpperCase()}</span>
                              </div>
                            </td>
                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getReportTypeBadgeColor(report.type)}`}>
                                {report.type.charAt(0).toUpperCase() + report.type.slice(1)}
                              </span>
                            </td>
                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                              {new Date(report.dateCreated).toLocaleDateString()}
                            </td>
                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-500 uppercase hidden sm:table-cell">
                              {report.format}
                            </td>
                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                              {report.size}
                            </td>
                            <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-3">
                                <button className="text-indigo-600 hover:text-indigo-900" title="Download Report">
                                  <FaDownload />
                                </button>
                                <button 
                                  className="text-red-600 hover:text-red-900" 
                                  title="Delete Report"
                                  onClick={() => handleConfirmDelete(report)}
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaFileAlt className="mx-auto mb-3 text-gray-300" size={32} />
                  <p>No saved reports yet. Generate a new report to see it here.</p>
                </div>
              )}
            </div>
            
            {/* Report Templates */}
            <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaClipboardList className="mr-2 text-indigo-600" />
                Quick Report Templates
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  className="flex items-center p-3 sm:p-4 border rounded-lg hover:bg-indigo-50 transition"
                  onClick={() => {
                    setReportType('earnings');
                    setDateRange('thisMonth');
                    setFormat('pdf');
                  }}
                >
                  <div className="p-2 sm:p-3 rounded-full bg-green-100 text-green-600 mr-2 sm:mr-3">
                    <FaMoneyBillWave />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-sm sm:text-base">Monthly Earnings</h4>
                    <p className="text-xs text-gray-500">Current month's financial summary</p>
                  </div>
                </button>
                
                <button 
                  className="flex items-center p-3 sm:p-4 border rounded-lg hover:bg-indigo-50 transition"
                  onClick={() => {
                    setReportType('activity');
                    setDateRange('last7');
                    setFormat('xlsx');
                  }}
                >
                  <div className="p-2 sm:p-3 rounded-full bg-blue-100 text-blue-600 mr-2 sm:mr-3">
                    <FaChartBar />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-sm sm:text-base">Weekly Activity</h4>
                    <p className="text-xs text-gray-500">Last 7 days platform usage</p>
                  </div>
                </button>
                
                <button 
                  className="flex items-center p-3 sm:p-4 border rounded-lg hover:bg-indigo-50 transition"
                  onClick={() => {
                    setReportType('providers');
                    setDateRange('last30');
                    setFormat('pdf');
                  }}
                >
                  <div className="p-2 sm:p-3 rounded-full bg-indigo-100 text-indigo-600 mr-2 sm:mr-3">
                    <FaUsers />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-sm sm:text-base">Provider Performance</h4>
                    <p className="text-xs text-gray-500">30-day service provider metrics</p>
                  </div>
                </button>
                
                <button 
                  className="flex items-center p-3 sm:p-4 border rounded-lg hover:bg-indigo-50 transition"
                  onClick={() => {
                    setReportType('bookings');
                    setDateRange('thisYear');
                    setFormat('csv');
                  }}
                >
                  <div className="p-2 sm:p-3 rounded-full bg-yellow-100 text-yellow-600 mr-2 sm:mr-3">
                    <FaCalendarAlt />
                  </div>
                  <div className="text-left">
                    <h4 className="font-medium text-sm sm:text-base">Yearly Bookings</h4>
                    <p className="text-xs text-gray-500">Year-to-date booking data</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Report Deletion */}
      {showConfirmDelete && reportToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 sm:p-6">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <FaExclamationTriangle className="text-yellow-600" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Confirm Deletion</h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Are you sure you want to delete the report "{reportToDelete.name}"? This action cannot be undone.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  onClick={() => setShowConfirmDelete(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeDeleteReport}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;