import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaServer, 
  FaShieldAlt, 
  FaBell, 
  FaDatabase,
  FaCog,
  FaSearch,
  FaUserShield,
  FaSave,
  FaUndo,
  FaCloudUploadAlt,
  FaEnvelope,
  FaHistory,
  FaExclamationTriangle,
  FaInfoCircle,
  FaSyncAlt,
  FaNetworkWired,
  FaGlobe,
  FaFileExport,
  FaFileImport,
  FaBars,
  FaTimes
} from 'react-icons/fa';
import { FaKey } from 'react-icons/fa';

const SystemSettings = () => {
  // State to track active tab
  const [activeTab, setActiveTab] = useState('general');
  
  // State for mobile menu
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // State for form inputs
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'PlumberPro Platform',
    adminEmail: 'admin@plumberpro.com',
    maxUploadSize: 25,
    defaultLanguage: 'en',
    timeZone: 'UTC-5',
    maintenanceMode: false,
    debugMode: false
  });

  const [securitySettings, setSecuritySettings] = useState({
    passwordExpiry: 90,
    minPasswordLength: 12,
    requireSpecialChars: true,
    requireNumbers: true,
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    twoFactorAuth: true,
    ipWhitelisting: false,
    sessionTimeout: 60
  });

  const [storageSettings, setStorageSettings] = useState({
    primaryStorage: 'aws',
    backupStorage: 'google',
    backupFrequency: 'daily',
    retentionPeriod: 90,
    compressionEnabled: true,
    encryptionEnabled: true,
    autoCleanup: true,
    lowSpaceWarning: 90,
    criticalSpaceWarning: 95
  });

  const [emailSettings, setEmailSettings] = useState({
    smtpServer: 'smtp.plumberpro.com',
    smtpPort: 587,
    smtpUsername: 'notifications@plumberpro.com',
    requireSSL: true,
    fromEmail: 'no-reply@plumberpro.com',
    fromName: 'PlumberPro Admin',
    maxRecipients: 100,
    throttleLimit: 500
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    systemErrors: true,
    securityAlerts: true,
    userRegistrations: true,
    paymentEvents: true,
    storageWarnings: true,
    performanceAlerts: true,
    maintenanceReminders: true
  });

  const [apiSettings, setApiSettings] = useState({
    enablePublicApi: true,
    requireApiKey: true,
    rateLimitPerMinute: 60,
    maxRequestSize: 10,
    logAllRequests: true,
    allowCORS: true,
    apiTimeout: 30
  });

  // Mock navigation function for demo purposes
  const navigateTo = (route) => {
    console.log(`Navigating to ${route}`);
    // This would be replaced with actual navigation in a real app
  };

  // Handling form submission
  const handleSubmit = (section, e) => {
    e.preventDefault();
    // In a real app, this would save the settings to the backend
    console.log(`Saving ${section} settings...`);
    // Show success message
    alert(`${section} settings saved successfully`);
  };

  // Handle input changes
  const handleGeneralChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSecurityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSecuritySettings({
      ...securitySettings,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value
    });
  };

  const handleStorageChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStorageSettings({
      ...storageSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleEmailChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmailSettings({
      ...emailSettings,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value
    });
  };

  const handleNotificationChange = (e) => {
    const { name, checked } = e.target;
    setNotificationSettings({
      ...notificationSettings,
      [name]: checked
    });
  };

  const handleApiChange = (e) => {
    const { name, value, type, checked } = e.target;
    setApiSettings({
      ...apiSettings,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value
    });
  };

  // Reset settings for a section
  const handleReset = (section) => {
    switch (section) {
      case 'general':
        setGeneralSettings({
          siteName: 'PlumberPro Platform',
          adminEmail: 'admin@plumberpro.com',
          maxUploadSize: 25,
          defaultLanguage: 'en',
          timeZone: 'UTC-5',
          maintenanceMode: false,
          debugMode: false
        });
        break;
      case 'security':
        setSecuritySettings({
          passwordExpiry: 90,
          minPasswordLength: 12,
          requireSpecialChars: true,
          requireNumbers: true,
          maxLoginAttempts: 5,
          lockoutDuration: 30,
          twoFactorAuth: true,
          ipWhitelisting: false,
          sessionTimeout: 60
        });
        break;
      // Add other reset cases as needed
      default:
        break;
    }
    alert(`${section.charAt(0).toUpperCase() + section.slice(1)} settings have been reset to defaults`);
  };

  // For toggling maintenance mode
  const toggleMaintenanceMode = () => {
    const newValue = !generalSettings.maintenanceMode;
    if (newValue) {
      const confirm = window.confirm("Enabling maintenance mode will prevent user access. Are you sure?");
      if (confirm) {
        setGeneralSettings({
          ...generalSettings,
          maintenanceMode: newValue
        });
      }
    } else {
      setGeneralSettings({
        ...generalSettings,
        maintenanceMode: newValue
      });
    }
  };

  // Handle backup action
  const handleBackupNow = () => {
    // In a real app, this would trigger a backup process
    alert("Manual backup initiated. This may take a few minutes.");
  };

  // Test email configuration
  const handleTestEmail = () => {
    // In a real app, this would send a test email
    alert("Test email sent to admin@plumberpro.com");
  };

  // Reset API keys
  const handleResetApiKeys = () => {
    const confirm = window.confirm("This will invalidate all existing API keys. Are you sure?");
    if (confirm) {
      alert("All API keys have been reset. New keys have been generated.");
    }
  };

  // Tab definition with emoji icons
  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'security', label: 'Security', icon: '🛡️' },
    { id: 'storage', label: 'Storage', icon: '💾' },
    { id: 'email', label: 'Email', icon: '✉️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'api', label: 'API', icon: '🔌' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-8">
      {/* Header */}
      <header className="bg-indigo-700 shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Admin Dashboard</h1>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          
          {/* Desktop nav items */}
          <div className="hidden md:flex items-center space-x-6">
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
              onClick={() => navigateTo('/admin/notifications')}
            >
              <FaBell size={20} />
            </button>
            <button 
              className="text-white hover:text-indigo-200"
              onClick={() => navigateTo('/admin/settings')}
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
        
        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-indigo-800 py-3 px-4 space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
            </div>
            <div className="flex justify-between">
              <button 
                className="flex items-center text-white hover:text-indigo-200"
                onClick={() => navigateTo('/admin/notifications')}
              >
                <FaBell size={20} className="mr-2" />
                <span>Notifications</span>
              </button>
              <button 
                className="flex items-center text-white hover:text-indigo-200"
                onClick={() => navigateTo('/admin/settings')}
              >
                <FaCog size={20} className="mr-2" />
                <span>Settings</span>
              </button>
            </div>
            <Link to="/admin/profile" className="flex items-center text-white hover:text-indigo-200">
              <FaUserShield size={22} className="mr-2" />
              <span>Admin Profile</span>
            </Link>
          </div>
        )}
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">System Settings</h2>
            <p className="text-gray-600 mt-1">Configure and manage system settings and preferences</p>
          </div>
          <div>
            <Link 
              to="/admin/dashboard"
              className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm inline-block text-center"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Settings Navigation Tabs - Mobile Dropdown */}
        <div className="bg-white rounded-lg shadow-md mb-8 block sm:hidden">
          <select 
            className="w-full p-3 border-none rounded-lg focus:ring-2 focus:ring-indigo-500"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.icon} {tab.label}
              </option>
            ))}
          </select>
        </div>

        {/* Settings Navigation Tabs - Desktop */}
        <div className="bg-white rounded-lg shadow-md mb-8 hidden sm:block">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button 
                key={tab.id}
                className={`px-6 py-3 border-b-2 flex items-center ${activeTab === tab.id 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent hover:text-indigo-600'} font-medium whitespace-nowrap`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="mr-2" role="img" aria-label={tab.label}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            {/* General Settings */}
            {activeTab === 'general' && (
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8">
                <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
                  <span className="mr-2 text-indigo-600">⚙️</span>
                  General Settings
                </h3>

                <form onSubmit={(e) => handleSubmit('general', e)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
                      <input
                        type="text"
                        name="siteName"
                        value={generalSettings.siteName}
                        onChange={handleGeneralChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
                      <input
                        type="email"
                        name="adminEmail"
                        value={generalSettings.adminEmail}
                        onChange={handleGeneralChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max Upload Size (MB)</label>
                      <input
                        type="number"
                        name="maxUploadSize"
                        value={generalSettings.maxUploadSize}
                        onChange={handleGeneralChange}
                        min="1"
                        max="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Default Language</label>
                      <select
                        name="defaultLanguage"
                        value={generalSettings.defaultLanguage}
                        onChange={handleGeneralChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time Zone</label>
                      <select
                        name="timeZone"
                        value={generalSettings.timeZone}
                        onChange={handleGeneralChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="UTC">UTC (Coordinated Universal Time)</option>
                        <option value="UTC-5">UTC-5 (Eastern Time)</option>
                        <option value="UTC-6">UTC-6 (Central Time)</option>
                        <option value="UTC-7">UTC-7 (Mountain Time)</option>
                        <option value="UTC-8">UTC-8 (Pacific Time)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="maintenanceMode"
                        name="maintenanceMode"
                        checked={generalSettings.maintenanceMode}
                        onChange={toggleMaintenanceMode}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="maintenanceMode" className="ml-2 text-sm text-gray-700">
                        Maintenance Mode
                        <span className="ml-2 text-xs text-red-600 font-medium">Disables public access to the site</span>
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="debugMode"
                        name="debugMode"
                        checked={generalSettings.debugMode}
                        onChange={handleGeneralChange}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="debugMode" className="ml-2 text-sm text-gray-700">
                        Debug Mode
                        <span className="ml-2 text-xs text-amber-600 font-medium">Enables detailed error reporting</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:justify-end sm:space-x-3">
                    <button
                      type="button"
                      onClick={() => handleReset('general')}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm flex items-center justify-center"
                    >
                      <span className="mr-2">↩️</span>
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center"
                    >
                      <span className="mr-2">💾</span>
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8">
                <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
                  <span className="mr-2 text-indigo-600">🛡️</span>
                  Security Settings
                </h3>

                <form onSubmit={(e) => handleSubmit('security', e)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password Expiry (days)</label>
                      <input
                        type="number"
                        name="passwordExpiry"
                        value={securitySettings.passwordExpiry}
                        onChange={handleSecurityChange}
                        min="0"
                        max="365"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">Set to 0 for no expiry</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Password Length</label>
                      <input
                        type="number"
                        name="minPasswordLength"
                        value={securitySettings.minPasswordLength}
                        onChange={handleSecurityChange}
                        min="8"
                        max="24"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Max Login Attempts</label>
                      <input
                        type="number"
                        name="maxLoginAttempts"
                        value={securitySettings.maxLoginAttempts}
                        onChange={handleSecurityChange}
                        min="1"
                        max="10"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lockout Duration (minutes)</label>
                      <input
                        type="number"
                        name="lockoutDuration"
                        value={securitySettings.lockoutDuration}
                        onChange={handleSecurityChange}
                        min="5"
                        max="1440"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
                      <input
                        type="number"
                        name="sessionTimeout"
                        value={securitySettings.sessionTimeout}
                        onChange={handleSecurityChange}
                        min="5"
                        max="1440"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="requireSpecialChars"
                        name="requireSpecialChars"
                        checked={securitySettings.requireSpecialChars}
                        onChange={handleSecurityChange}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="requireSpecialChars" className="ml-2 text-sm text-gray-700">
                        Require Special Characters in Passwords
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="requireNumbers"
                        name="requireNumbers"
                        checked={securitySettings.requireNumbers}
                        onChange={handleSecurityChange}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="requireNumbers" className="ml-2 text-sm text-gray-700">
                        Require Numbers in Passwords
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="twoFactorAuth"
                        name="twoFactorAuth"
                        checked={securitySettings.twoFactorAuth}
                        onChange={handleSecurityChange}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="twoFactorAuth" className="ml-2 text-sm text-gray-700">
                        Enable Two-Factor Authentication
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="ipWhitelisting"
                        name="ipWhitelisting"
                        checked={securitySettings.ipWhitelisting}
                        onChange={handleSecurityChange}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="ipWhitelisting" className="ml-2 text-sm text-gray-700">
                        Enable IP Whitelisting for Admin Access
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:justify-end sm:space-x-3">
                    <button
                      type="button"
                      onClick={() => handleReset('security')}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm flex items-center justify-center"
                    >
                      <span className="mr-2">↩️</span>
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center"
                    >
                      <span className="mr-2">💾</span>
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Storage Settings */}
{activeTab === 'storage' && (
  <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8">
    <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
      <span className="mr-2 text-indigo-600">💾</span>
      Storage Management
    </h3>

    <form onSubmit={(e) => handleSubmit('storage', e)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Primary Storage Provider</label>
          <select
            name="primaryStorage"
            value={storageSettings.primaryStorage}
            onChange={handleStorageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="local">Local Storage</option>
            <option value="aws">Amazon S3</option>
            <option value="google">Google Cloud Storage</option>
            <option value="azure">Azure Blob Storage</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Backup Storage Provider</label>
          <select
            name="backupStorage"
            value={storageSettings.backupStorage}
            onChange={handleStorageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="none">None (No Backup)</option>
            <option value="local">Local Storage</option>
            <option value="aws">Amazon S3</option>
            <option value="google">Google Cloud Storage</option>
            <option value="azure">Azure Blob Storage</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Backup Frequency</label>
          <select
            name="backupFrequency"
            value={storageSettings.backupFrequency}
            onChange={handleStorageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="hourly">Hourly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Retention Period (days)</label>
          <input
            type="number"
            name="retentionPeriod"
            value={storageSettings.retentionPeriod}
            onChange={handleStorageChange}
            min="7"
            max="365"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Low Space Warning (%)</label>
          <input
            type="number"
            name="lowSpaceWarning"
            value={storageSettings.lowSpaceWarning}
            onChange={handleStorageChange}
            min="70"
            max="95"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Critical Space Warning (%)</label>
          <input
            type="number"
            name="criticalSpaceWarning"
            value={storageSettings.criticalSpaceWarning}
            onChange={handleStorageChange}
            min="90"
            max="99"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="compressionEnabled"
            name="compressionEnabled"
            checked={storageSettings.compressionEnabled}
            onChange={handleStorageChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="compressionEnabled" className="ml-2 text-sm text-gray-700">
            Enable File Compression
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="encryptionEnabled"
            name="encryptionEnabled"
            checked={storageSettings.encryptionEnabled}
            onChange={handleStorageChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="encryptionEnabled" className="ml-2 text-sm text-gray-700">
            Enable Storage Encryption
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="autoCleanup"
            name="autoCleanup"
            checked={storageSettings.autoCleanup}
            onChange={handleStorageChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="autoCleanup" className="ml-2 text-sm text-gray-700">
            Enable Automatic Cleanup of Old Files
          </label>
        </div>
      </div>

      <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:justify-between sm:space-x-3">
        <button
          type="button"
          onClick={handleBackupNow}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center"
        >
          <span className="mr-2">☁️</span>
          Backup Now
        </button>
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
          <button
            type="button"
            onClick={() => handleReset('storage')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm flex items-center justify-center"
          >
            <span className="mr-2">↩️</span>
            Reset
          </button>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center"
          >
            <span className="mr-2">💾</span>
            Save Changes
          </button>
        </div>
      </div>
    </form>
  </div>
)}

{/* Email Settings */}
{activeTab === 'email' && (
  <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8">
    <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
      <span className="mr-2 text-indigo-600">✉️</span>
      Email Configuration
    </h3>

    <form onSubmit={(e) => handleSubmit('email', e)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Server</label>
          <input
            type="text"
            name="smtpServer"
            value={emailSettings.smtpServer}
            onChange={handleEmailChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Port</label>
          <input
            type="number"
            name="smtpPort"
            value={emailSettings.smtpPort}
            onChange={handleEmailChange}
            min="1"
            max="65535"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Username</label>
          <input
            type="text"
            name="smtpUsername"
            value={emailSettings.smtpUsername}
            onChange={handleEmailChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SMTP Password</label>
          <input
            type="password"
            name="smtpPassword"
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Email</label>
          <input
            type="email"
            name="fromEmail"
            value={emailSettings.fromEmail}
            onChange={handleEmailChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">From Name</label>
          <input
            type="text"
            name="fromName"
            value={emailSettings.fromName}
            onChange={handleEmailChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="requireSSL"
            name="requireSSL"
            checked={emailSettings.requireSSL}
            onChange={handleEmailChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="requireSSL" className="ml-2 text-sm text-gray-700">
            Require SSL/TLS Connection
          </label>
        </div>
      </div>

      <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:justify-between sm:space-x-3">
        <button
          type="button"
          onClick={handleTestEmail}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center"
        >
          <span className="mr-2">✉️</span>
          Send Test Email
        </button>
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
          <button
            type="button"
            onClick={() => handleReset('email')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm flex items-center justify-center"
          >
            <span className="mr-2">↩️</span>
            Reset
          </button>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center"
          >
            <span className="mr-2">💾</span>
            Save Changes
          </button>
        </div>
      </div>
    </form>
  </div>
)}
            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
                  <span className="mr-2 text-indigo-600">🔔</span>
                  Notification Settings
                </h3>

                <form onSubmit={(e) => handleSubmit('notification', e)} className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="emailAlerts"
                        name="emailAlerts"
                        checked={notificationSettings.emailAlerts}
                        onChange={handleNotificationChange}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="emailAlerts" className="ml-2 text-sm text-gray-700">
                        Enable Email Alerts
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="smsAlerts"
                        name="smsAlerts"
                        checked={notificationSettings.smsAlerts}
                        onChange={handleNotificationChange}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor="smsAlerts" className="ml-2 text-sm text-gray-700">
                        Enable SMS Alerts (additional charges may apply)
                      </label>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium text-gray-700 mb-3">Alert Types</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="systemErrors"
                          name="systemErrors"
                          checked={notificationSettings.systemErrors}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="systemErrors" className="ml-2 text-sm text-gray-700">
                          System Errors
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="securityAlerts"
                          name="securityAlerts"
                          checked={notificationSettings.securityAlerts}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="securityAlerts" className="ml-2 text-sm text-gray-700">
                          Security Alerts
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="userRegistrations"
                          name="userRegistrations"
                          checked={notificationSettings.userRegistrations}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="userRegistrations" className="ml-2 text-sm text-gray-700">
                          New User Registrations
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="paymentEvents"
                          name="paymentEvents"
                          checked={notificationSettings.paymentEvents}
                          onChange={handleNotificationChange}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="paymentEvents" className="ml-2 text-sm text-gray-700">
                          Payment Events
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => handleReset('notification')}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm flex items-center"
                    >
                      <span className="mr-2">↩️</span>
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm flex items-center"
                    >
                      <span className="mr-2">💾</span>
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* API Settings */}
{activeTab === 'api' && (
  <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8">
    <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
      <span className="mr-2 text-indigo-600">🔌</span>
      API Configuration
    </h3>

    <form onSubmit={(e) => handleSubmit('api', e)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rate Limit (requests per minute)</label>
          <input
            type="number"
            name="rateLimitPerMinute"
            value={apiSettings.rateLimitPerMinute}
            onChange={handleApiChange}
            min="10"
            max="1000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Request Size (MB)</label>
          <input
            type="number"
            name="maxRequestSize"
            value={apiSettings.maxRequestSize}
            onChange={handleApiChange}
            min="1"
            max="50"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">API Timeout (seconds)</label>
          <input
            type="number"
            name="apiTimeout"
            value={apiSettings.apiTimeout}
            onChange={handleApiChange}
            min="5"
            max="300"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="enablePublicApi"
            name="enablePublicApi"
            checked={apiSettings.enablePublicApi}
            onChange={handleApiChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="enablePublicApi" className="ml-2 text-sm text-gray-700">
            Enable Public API
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="requireApiKey"
            name="requireApiKey"
            checked={apiSettings.requireApiKey}
            onChange={handleApiChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="requireApiKey" className="ml-2 text-sm text-gray-700">
            Require API Key for All Requests
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="logAllRequests"
            name="logAllRequests"
            checked={apiSettings.logAllRequests}
            onChange={handleApiChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="logAllRequests" className="ml-2 text-sm text-gray-700">
            Log All API Requests
          </label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="allowCORS"
            name="allowCORS"
            checked={apiSettings.allowCORS}
            onChange={handleApiChange}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="allowCORS" className="ml-2 text-sm text-gray-700">
            Allow Cross-Origin Requests (CORS)
          </label>
        </div>
      </div>

      <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:justify-between sm:space-x-3">
        <button
          type="button"
          onClick={handleResetApiKeys}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center"
        >
          <span className="mr-2">🔑</span>
          Reset API Keys
        </button>
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
          <button
            type="button"
            onClick={() => handleReset('api')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm flex items-center justify-center"
          >
            <span className="mr-2">↩️</span>
            Reset
          </button>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center"
          >
            <span className="mr-2">💾</span>
            Save Changes
          </button>
        </div>
      </div>
    </form>
  </div>
)}

{/* Maintenance Tab */}
{activeTab === 'maintenance' && (
  <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-8">
    <h3 className="text-xl font-semibold mb-6 flex items-center text-gray-800">
      <span className="mr-2 text-indigo-600">🔧</span>
      System Maintenance
    </h3>

    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-blue-400">ℹ️</span>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Maintenance operations can affect system performance. Consider scheduling these during off-peak hours.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-2">Cache Management</h4>
          <p className="text-sm text-gray-600 mb-3">
            Clear system caches to free up memory and potentially resolve performance issues.
          </p>
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center">
            <span className="mr-2">🧹</span>
            Clear All Caches
          </button>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-2">Database Optimization</h4>
          <p className="text-sm text-gray-600 mb-3">
            Optimize database tables and indexes for better performance.
          </p>
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center">
            <span className="mr-2">⚡</span>
            Optimize Database
          </button>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-2">System Logs</h4>
          <p className="text-sm text-gray-600 mb-3">
            Download or clear system logs for troubleshooting.
          </p>
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
            <button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm flex items-center justify-center">
              <span className="mr-1">📥</span>
              Download
            </button>
            <button className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm flex items-center justify-center">
              <span className="mr-1">🗑️</span>
              Clear
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-2">System Diagnostics</h4>
          <p className="text-sm text-gray-600 mb-3">
            Run system diagnostics to identify potential issues.
          </p>
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center">
            <span className="mr-2">🔍</span>
            Run Diagnostics
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-4">
        <h4 className="font-medium text-gray-700 mb-3">System Configuration</h4>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
          <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center">
            <span className="mr-2">📤</span>
            Export Config
          </button>
          <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center">
            <span className="mr-2">📥</span>
            Import Config
          </button>
          <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center">
            <span className="mr-2">🔄</span>
            Reset to Default
          </button>
        </div>
      </div>
    </div>
  </div>
)}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* System Status */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">System Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Server Status</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Online</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Memory Usage</span>
                  <span className="text-sm text-gray-800">78% (3.1/4GB)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">CPU Load</span>
                  <span className="text-sm text-gray-800">42%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Storage Usage</span>
                  <span className="text-sm text-gray-800">63% (252/400GB)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Database Status</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">Healthy</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center"
                  onClick={() => navigateTo('/admin/system-status')}
                >
                  <span className="mr-2">🔄</span>
                  View Detailed Status
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center">
                  <span className="mr-2">🔄</span>
                  Clear System Cache
                </button>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center">
                  <span className="mr-2">📜</span>
                  View System Logs
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center">
                  <span className="mr-2">📤</span>
                  Export System Config
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center">
                  <span className="mr-2">📥</span>
                  Import System Config
                </button>
                <button className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center">
                  <span className="mr-2">⚠️</span>
                  Run Diagnostics
                </button>
              </div>
            </div>

            {/* Help & Documentation */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Help & Resources</h3>
              <div className="space-y-3">
                <button 
                  className="block text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                >
                  <span className="mr-2">ℹ️</span>
                  Admin Guide Documentation
                </button>
                <button 
                  className="block text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                >
                  <span className="mr-2">🖥️</span>
                  Server Configuration Help
                </button>
                <button 
                  className="block text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                >
                  <span className="mr-2">🛡️</span>
                  Security Best Practices
                </button>
                <button 
                  className="block text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                >
                  <span className="mr-2">💾</span>
                  Backup & Restore Guide
                </button>
                <button 
                  className="block text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                >
                  <span className="mr-2">🌐</span>
                  API Documentation
                </button>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm flex items-center justify-center">
                  <span className="mr-2">✉️</span>
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;