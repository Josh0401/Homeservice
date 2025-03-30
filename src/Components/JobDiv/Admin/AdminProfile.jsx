import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUserShield, 
  FaEdit, 
  FaKey, 
  FaBell,
  FaCog,
  FaSearch,
  FaChevronLeft,
  FaCamera,
  FaBars,
  FaTimes,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaShieldAlt,
  FaHistory,
  FaUserCog,
  FaSignOutAlt
} from 'react-icons/fa';

const AdminProfile = () => {
  const navigate = useNavigate();
  
  // State for mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Sample admin profile data
  const [profile, setProfile] = useState({
    id: 'A-001',
    name: 'Admin User',
    email: 'admin@plumbingapp.com',
    phone: '+1 (555) 123-4567',
    role: 'System Administrator',
    location: 'Chicago, IL',
    department: 'Technical Operations',
    joinDate: 'March, 2023',
    lastLogin: 'March 29, 2025 - 08:45 AM',
    imageUrl: null, // This will be null and we'll use initials instead
    twoFactorEnabled: true,
    emailNotifications: true,
    smsNotifications: false,
    bio: 'Experienced system administrator with 5+ years in platform operations management and user support. Specialized in service platforms and customer satisfaction optimization.',
    permissions: [
      'User Management',
      'Payment Processing',
      'System Configuration',
      'Data Analytics',
      'Provider Approval',
      'Content Management'
    ]
  });
  
  // State for editing profile
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({...profile});
  
  // State for password change dialog
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  
  // Security activity log
  const [securityLog, setSecurityLog] = useState([
    {
      id: 1,
      activity: 'Password changed',
      date: 'March 25, 2025',
      time: '14:32 PM',
      ipAddress: '192.168.1.102',
      location: 'Chicago, IL'
    },
    {
      id: 2,
      activity: 'Login successful',
      date: 'March 25, 2025',
      time: '14:30 PM',
      ipAddress: '192.168.1.102',
      location: 'Chicago, IL'
    },
    {
      id: 3,
      activity: 'Login successful',
      date: 'March 24, 2025',
      time: '09:15 AM',
      ipAddress: '192.168.1.102',
      location: 'Chicago, IL'
    },
    {
      id: 4,
      activity: 'Two-factor authentication enabled',
      date: 'March 22, 2025',
      time: '16:48 PM',
      ipAddress: '192.168.1.102',
      location: 'Chicago, IL'
    },
    {
      id: 5,
      activity: 'Profile information updated',
      date: 'March 20, 2025',
      time: '11:23 AM',
      ipAddress: '192.168.1.102',
      location: 'Chicago, IL'
    }
  ]);
  
  // Handle profile edit form changes
  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });
  };
  
  // Save profile changes
  const saveProfileChanges = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    // In a real app, you would send this to an API
    
    // Add to security log
    const newLogEntry = {
      id: securityLog.length + 1,
      activity: 'Profile information updated',
      date: 'March 29, 2025',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      ipAddress: '192.168.1.102',
      location: 'Chicago, IL'
    };
    
    setSecurityLog([newLogEntry, ...securityLog]);
  };
  
  // Cancel profile editing
  const cancelEditing = () => {
    setEditedProfile({...profile});
    setIsEditing(false);
  };
  
  // Handle password change submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    
    // Validate password
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }
    
    // In a real app, you would send this to an API
    // For now, just close the dialog and add to security log
    setShowPasswordDialog(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordErrors({});
    
    // Add to security log
    const newLogEntry = {
      id: securityLog.length + 1,
      activity: 'Password changed',
      date: 'March 29, 2025',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      ipAddress: '192.168.1.102',
      location: 'Chicago, IL'
    };
    
    setSecurityLog([newLogEntry, ...securityLog]);
  };
  
  // Handle navigation to dashboard
  const handleBackToDashboard = () => {
    navigate('/admin/dashboard');
  };
  
  // Get the initials for the avatar placeholder
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  // Toggle 2FA
  const toggleTwoFactor = () => {
    setEditedProfile({
      ...editedProfile,
      twoFactorEnabled: !editedProfile.twoFactorEnabled
    });
  };
  
  // Toggle notifications
  const toggleNotifications = (type) => {
    if (type === 'email') {
      setEditedProfile({
        ...editedProfile,
        emailNotifications: !editedProfile.emailNotifications
      });
    } else if (type === 'sms') {
      setEditedProfile({
        ...editedProfile,
        smsNotifications: !editedProfile.smsNotifications
      });
    }
  };
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  // Close mobile menu on resize
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
          <h1 className="text-xl md:text-2xl font-bold text-white">Admin Profile</h1>
          
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
            <button onClick={() => navigate('/admin/notifications')} className="text-white hover:text-indigo-200">
              <FaBell size={20} />
            </button>
            <button onClick={() => navigate('/admin/systems')} className="text-white hover:text-indigo-200">
              <FaCog size={20} />
            </button>
            <Link to="/admin/profile" className="flex items-center text-white hover:text-indigo-200">
              <FaUserShield size={22} className="mr-2" />
              <span>Admin</span>
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
                onClick={() => navigate('/admin/notifications')}
                className="flex flex-col items-center justify-center p-2 rounded-lg text-white hover:bg-indigo-700"
              >
                <FaBell size={20} />
                <span className="text-xs mt-1">Notifications</span>
              </button>
              <button 
                onClick={() => navigate('/admin/systems')}
                className="flex flex-col items-center justify-center p-2 rounded-lg text-white hover:bg-indigo-700"
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
        {/* Back to Dashboard Button */}
        <button 
          onClick={handleBackToDashboard}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mb-4 md:mb-6"
        >
          <FaChevronLeft className="mr-1" /> 
          <span>Back to Dashboard</span>
        </button>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 md:p-6 border-b">
                <div className="flex flex-col md:flex-row md:items-center">
                  {/* Profile picture/initials */}
                  <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                    {profile.imageUrl ? (
                      <img 
                        src={profile.imageUrl} 
                        alt={profile.name} 
                        className="w-24 h-24 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-2xl font-semibold">
                          {getInitials(profile.name)}
                        </span>
                      </div>
                    )}
                    
                    {isEditing && (
                      <button className="mt-2 w-full text-xs flex items-center justify-center px-2 py-1 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300">
                        <FaCamera className="mr-1" size={12} />
                        <span>Change</span>
                      </button>
                    )}
                  </div>
                  
                  {/* Basic info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">
                          {isEditing ? (
                            <input 
                              type="text" 
                              name="name" 
                              value={editedProfile.name} 
                              onChange={handleProfileChange}
                              className="border rounded px-2 py-1 w-full"
                            />
                          ) : (
                            profile.name
                          )}
                        </h2>
                        <p className="text-sm md:text-md text-gray-600 mt-1">
                          {isEditing ? (
                            <input 
                              type="text" 
                              name="role" 
                              value={editedProfile.role} 
                              onChange={handleProfileChange}
                              className="border rounded px-2 py-1 w-full"
                            />
                          ) : (
                            profile.role
                          )}
                        </p>
                      </div>
                      
                      {!isEditing ? (
                        <button 
                          onClick={() => setIsEditing(true)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm flex items-center"
                        >
                          <FaEdit className="mr-1" />
                          Edit Profile
                        </button>
                      ) : (
                        <div className="flex space-x-2">
                          <button 
                            onClick={cancelEditing}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded-md text-sm"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={saveProfileChanges}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm"
                          >
                            Save
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* ID and Department */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-xs text-gray-500">Admin ID</p>
                        <p className="text-sm font-medium">{profile.id}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Department</p>
                        {isEditing ? (
                          <input 
                            type="text" 
                            name="department" 
                            value={editedProfile.department} 
                            onChange={handleProfileChange}
                            className="border rounded px-2 py-1 text-sm w-full"
                          />
                        ) : (
                          <p className="text-sm font-medium">{profile.department}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Contact Information */}
              <div className="p-4 md:p-6 border-b">
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-full">
                      <FaEnvelope className="text-indigo-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-gray-500">Email</p>
                      {isEditing ? (
                        <input 
                          type="email" 
                          name="email" 
                          value={editedProfile.email} 
                          onChange={handleProfileChange}
                          className="border rounded px-2 py-1 text-sm w-full"
                        />
                      ) : (
                        <p className="text-sm font-medium">{profile.email}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-full">
                      <FaPhone className="text-indigo-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-gray-500">Phone</p>
                      {isEditing ? (
                        <input 
                          type="tel" 
                          name="phone" 
                          value={editedProfile.phone} 
                          onChange={handleProfileChange}
                          className="border rounded px-2 py-1 text-sm w-full"
                        />
                      ) : (
                        <p className="text-sm font-medium">{profile.phone}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-full">
                      <FaMapMarkerAlt className="text-indigo-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-gray-500">Location</p>
                      {isEditing ? (
                        <input 
                          type="text" 
                          name="location" 
                          value={editedProfile.location} 
                          onChange={handleProfileChange}
                          className="border rounded px-2 py-1 text-sm w-full"
                        />
                      ) : (
                        <p className="text-sm font-medium">{profile.location}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-full">
                      <FaCalendarAlt className="text-indigo-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs text-gray-500">Member Since</p>
                      <p className="text-sm font-medium">{profile.joinDate}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Professional Bio */}
              <div className="p-4 md:p-6 border-b">
                <h3 className="text-lg font-semibold mb-3">Professional Bio</h3>
                {isEditing ? (
                  <textarea 
                    name="bio" 
                    value={editedProfile.bio} 
                    onChange={handleProfileChange}
                    className="border rounded px-3 py-2 w-full h-24"
                  />
                ) : (
                  <p className="text-sm text-gray-700">{profile.bio}</p>
                )}
              </div>
              
              {/* System Permissions */}
              <div className="p-4 md:p-6">
                <h3 className="text-lg font-semibold mb-3">System Permissions</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {profile.permissions.map((permission, index) => (
                    <div key={index} className="flex items-center bg-gray-100 px-3 py-2 rounded-md">
                      <FaShieldAlt className="text-indigo-600 mr-2" size={14} />
                      <span className="text-sm">{permission}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Security Settings */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaKey className="mr-2 text-indigo-600" />
                Security Settings
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Require a verification code when signing in
                    </p>
                  </div>
                  {isEditing ? (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={editedProfile.twoFactorEnabled}
                        onChange={toggleTwoFactor}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  ) : (
                    <span className={`px-2 py-1 text-xs rounded-full ${profile.twoFactorEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {profile.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  )}
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-2">Change Password</h4>
                  <button 
                    onClick={() => setShowPasswordDialog(true)}
                    className="w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-md text-sm"
                  >
                    Update Password
                  </button>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-2">Notification Preferences</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Email Notifications</span>
                      {isEditing ? (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={editedProfile.emailNotifications}
                            onChange={() => toggleNotifications('email')}
                          />
                          <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      ) : (
                        <span className={`text-xs ${profile.emailNotifications ? 'text-green-600' : 'text-gray-500'}`}>
                          {profile.emailNotifications ? 'On' : 'Off'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs">SMS Notifications</span>
                      {isEditing ? (
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={editedProfile.smsNotifications}
                            onChange={() => toggleNotifications('sms')}
                          />
                          <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      ) : (
                        <span className={`text-xs ${profile.smsNotifications ? 'text-green-600' : 'text-gray-500'}`}>
                          {profile.smsNotifications ? 'On' : 'Off'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recent Security Activity */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <FaHistory className="mr-2 text-indigo-600" />
                  Recent Activity
                </h3>
                <Link 
                  to="/admin/security-log" 
                  className="text-indigo-600 hover:text-indigo-800 text-xs"
                >
                  View All
                </Link>
              </div>
              
              <div className="space-y-3">
                {securityLog.slice(0, 5).map(activity => (
                  <div key={activity.id} className="border-l-2 border-indigo-200 pl-3 py-1">
                    <p className="text-sm font-medium">{activity.activity}</p>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{activity.date} - {activity.time}</span>
                      <span>{activity.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Account Actions */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaUserCog className="mr-2 text-indigo-600" />
                Account Actions
              </h3>
              
              <div className="space-y-3">
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm flex items-center justify-center">
                  <FaUserShield className="mr-2" />
                  Request Access Change
                </button>
                <button className="w-full bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm flex items-center justify-center">
                  <FaSignOutAlt className="mr-2" />
                  Sign Out All Devices
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
      
      