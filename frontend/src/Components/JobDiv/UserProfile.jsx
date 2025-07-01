import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaSave, FaBell, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';
import { BiCog } from 'react-icons/bi';
import { useUser } from '../../context/UserContext';

const UserProfile = () => {
  // Get user data and update functions from context
  const { userData, updateUserData } = useUser();

  // State for which tab is active
  const [activeTab, setActiveTab] = useState('personalInfo');
  
  // State for edit mode
  const [editMode, setEditMode] = useState(false);
  
  // API states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Profile data from API
  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    userType: '',
    businessName: '',
    services: [],
    hourlyRate: '',
    isActive: false,
    isVerified: false,
    rating: 0
  });
  
  // State for password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordVisible, setPasswordVisible] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordError, setPasswordError] = useState('');

  // Get current user from localStorage
  const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  };

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('token');
  };

  // API request helper
  const apiRequest = async (endpoint, options = {}) => {
    const token = getToken();
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(`http://localhost:5000/api${endpoint}`, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  };

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError('');
      
      const user = getCurrentUser();
      if (!user || !user._id) {
        throw new Error('No authenticated user found');
      }

      const response = await apiRequest(`/auth/profile/${user._id}`);
      
      if (response.success) {
        setProfileData(response.user);
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch profile');
      console.error('Fetch profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (updateData) => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const user = getCurrentUser();
      if (!user || !user._id) {
        throw new Error('No authenticated user found');
      }

      const response = await apiRequest(`/auth/profile/${user._id}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });

      if (response.success) {
        setProfileData(response.user);
        setSuccess('Profile updated successfully!');
        
        // Update user in localStorage
        const updatedUserData = { ...user, ...response.user };
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
        
        return true;
      }
    } catch (error) {
      setError(error.message || 'Failed to update profile');
      console.error('Update profile error:', error);
      return false;
    } finally {
      setSaving(false);
    }
  };

  // Fetch profile on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle service preference toggles
  const handleServiceToggle = (service) => {
    const currentPreferences = userData.preferences.servicePreferences;
    let updatedPreferences;
    
    if (currentPreferences.includes(service)) {
      updatedPreferences = currentPreferences.filter(pref => pref !== service);
    } else {
      updatedPreferences = [...currentPreferences, service];
    }
    
    updateUserData('preferences', 'servicePreferences', updatedPreferences);
  };
  
  // Handle password visibility toggle
  const togglePasswordVisibility = (field) => {
    setPasswordVisible(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };
  
  // Handle password input changes
  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user types
    if (passwordError) setPasswordError('');
  };
  
  // Handle password form submission
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (!passwordData.currentPassword || 
        !passwordData.newPassword || 
        !passwordData.confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }
    
    // Here you would typically verify the current password with your API
    // and update with the new password
    
    // Update the last changed date
    updateUserData('securitySettings', 'passwordLastChanged', new Date().toISOString().split('T')[0]);
    
    // Close modal and reset form
    setShowPasswordModal(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    setSuccess('Password updated successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  // Handle profile image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUserData('personalInfo', 'profileImage', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare update data based on active tab
    let updateData = {};
    
    if (activeTab === 'personalInfo') {
      // Get the form values from the current profile data and user inputs
      const form = e.target;
      const formData = new FormData(form);
      
      updateData = {
        fullName: formData.get('fullName') || profileData.fullName,
        phone: formData.get('phone') || profileData.phone,
        address: {
          street: formData.get('street') || profileData.address?.street || '',
          city: formData.get('city') || profileData.address?.city || '',
          state: formData.get('state') || profileData.address?.state || '',
          zipCode: formData.get('zipCode') || profileData.address?.zipCode || ''
        }
      };

      // Add professional fields if user is a professional
      if (profileData.userType === 'professional') {
        updateData.businessName = formData.get('businessName') || profileData.businessName;
        const hourlyRate = formData.get('hourlyRate');
        if (hourlyRate) {
          updateData.hourlyRate = parseFloat(hourlyRate);
        }
        // Note: services would need separate handling as they're checkboxes
      }
    }
    
    const success = await updateProfile(updateData);
    if (success) {
      setEditMode(false);
    }
  };

  // Handle input changes for profile data
  const handleProfileInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // List of available services (would typically come from your API/Data)
  const availableServices = [
    'plumbing', 'electrical', 'hvac', 'roofing', 'painting', 
    'carpentry', 'cleaning', 'handyman', 'other'
  ];

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blueColor" />
        <span className="ml-3 text-lg">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="bg-greyIsh-50 p-8 rounded-lg shadow-md max-w-4xl mx-auto my-10">
      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4 mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 rounded-md p-4 mb-4">
          {success}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Profile Sidebar */}
        <div className="md:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center">
            <div className="relative mb-4">
              {userData.personalInfo.profileImage ? (
                <img 
                  src={userData.personalInfo.profileImage} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-blueColor"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-greyIsh-200 flex items-center justify-center text-5xl text-greyIsh-400">
                  <FaUser />
                </div>
              )}
              
              {editMode && (
                <label className="absolute bottom-0 right-0 bg-blueColor text-white p-2 rounded-full cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <span className="text-xs">Edit</span>
                </label>
              )}
            </div>
            
            <h2 className="text-xl font-bold">{profileData.fullName || 'No Name'}</h2>
            <p className="text-greyIsh-500 mb-2">{profileData.email}</p>
            <p className="text-sm text-greyIsh-400 capitalize mb-6">{profileData.userType}</p>
            
            {/* Account Status */}
            <div className="w-full mb-4 text-sm">
              <div className="flex justify-between items-center mb-2">
                <span>Status:</span>
                <span className={`px-2 py-1 rounded text-xs ${profileData.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {profileData.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              {/* <div className="flex justify-between items-center mb-2">
                <span>Verified:</span>
                <span className={`px-2 py-1 rounded text-xs ${profileData.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {profileData.isVerified ? 'Verified' : 'Pending'}
                </span>
              </div> */}
              <div className="flex justify-between items-center">
                <span>Rating:</span>
                <span>{profileData.rating || 0}/5</span>
              </div>
            </div>
            
            <div className="w-full">
              <button
                className={`w-full py-3 px-4 mb-2 rounded-md flex items-center gap-3 ${activeTab === 'personalInfo' ? 'bg-blueColor text-white' : 'hover:bg-greyIsh-100'}`}
                onClick={() => setActiveTab('personalInfo')}
              >
                <FaUser /> Personal Information
              </button>
              
              <button
                className={`w-full py-3 px-4 mb-2 rounded-md flex items-center gap-3 ${activeTab === 'preferences' ? 'bg-blueColor text-white' : 'hover:bg-greyIsh-100'}`}
                onClick={() => setActiveTab('preferences')}
              >
                <BiCog /> Preferences
              </button>
              
              <button
                className={`w-full py-3 px-4 rounded-md flex items-center gap-3 ${activeTab === 'securitySettings' ? 'bg-blueColor text-white' : 'hover:bg-greyIsh-100'}`}
                onClick={() => setActiveTab('securitySettings')}
              >
                <FaLock /> Security
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="md:w-2/3">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">
                {activeTab === 'personalInfo' && 'Personal Information'}
                {activeTab === 'preferences' && 'Preferences'}
                {activeTab === 'securitySettings' && 'Security Settings'}
              </h1>
              
              {!editMode ? (
                <button 
                  className="bg-blueColor text-white py-2 px-4 rounded-md"
                  onClick={() => setEditMode(true)}
                >
                  Edit Profile
                </button>
              ) : (
                <button 
                  className="bg-green-500 text-white py-2 px-4 rounded-md flex items-center gap-2 disabled:opacity-50"
                  onClick={handleSubmit}
                  disabled={saving}
                >
                  {saving ? <FaSpinner className="animate-spin" /> : <FaSave />} 
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Personal Information Tab */}
              {activeTab === 'personalInfo' && (
                <div>
                  <div className="mb-4">
                    <label className="block text-greyIsh-600 mb-2">Full Name</label>
                    <div className="flex border rounded-md overflow-hidden">
                      <span className="bg-greyIsh-100 p-2 flex items-center">
                        <FaUser className="text-greyIsh-500" />
                      </span>
                      <input
                        type="text"
                        name="fullName"
                        value={profileData.fullName}
                        onChange={(e) => handleProfileInputChange('fullName', e.target.value)}
                        disabled={!editMode}
                        className="flex-1 p-2 outline-none disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-greyIsh-600 mb-2">Email Address</label>
                    <div className="flex border rounded-md overflow-hidden">
                      <span className="bg-greyIsh-100 p-2 flex items-center">
                        <FaEnvelope className="text-greyIsh-500" />
                      </span>
                      <input
                        type="email"
                        value={profileData.email}
                        disabled={true}
                        className="flex-1 p-2 outline-none bg-gray-100 text-gray-500"
                      />
                    </div>
                    <small className="text-gray-500">Email cannot be changed</small>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-greyIsh-600 mb-2">Phone Number</label>
                    <div className="flex border rounded-md overflow-hidden">
                      <span className="bg-greyIsh-100 p-2 flex items-center">
                        <FaPhone className="text-greyIsh-500" />
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={(e) => handleProfileInputChange('phone', e.target.value)}
                        disabled={!editMode}
                        className="flex-1 p-2 outline-none disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-greyIsh-600 mb-2">Street Address</label>
                    <div className="flex border rounded-md overflow-hidden">
                      <span className="bg-greyIsh-100 p-2 flex items-center">
                        <FaMapMarkerAlt className="text-greyIsh-500" />
                      </span>
                      <input
                        type="text"
                        name="street"
                        value={profileData.address?.street || ''}
                        onChange={(e) => handleProfileInputChange('address.street', e.target.value)}
                        disabled={!editMode}
                        className="flex-1 p-2 outline-none disabled:bg-gray-50"
                        placeholder="Enter street address"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-greyIsh-600 mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={profileData.address?.city || ''}
                        onChange={(e) => handleProfileInputChange('address.city', e.target.value)}
                        disabled={!editMode}
                        className="w-full p-2 border rounded-md outline-none disabled:bg-gray-50"
                        placeholder="Enter city"
                      />
                    </div>
                    <div>
                      <label className="block text-greyIsh-600 mb-2">State</label>
                      <input
                        type="text"
                        name="state"
                        value={profileData.address?.state || ''}
                        onChange={(e) => handleProfileInputChange('address.state', e.target.value)}
                        disabled={!editMode}
                        className="w-full p-2 border rounded-md outline-none disabled:bg-gray-50"
                        placeholder="Enter state"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-greyIsh-600 mb-2">Zip Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={profileData.address?.zipCode || ''}
                      onChange={(e) => handleProfileInputChange('address.zipCode', e.target.value)}
                      disabled={!editMode}
                      className="w-full p-2 border rounded-md outline-none disabled:bg-gray-50"
                      placeholder="Enter zip code"
                    />
                  </div>

                  {/* Professional fields */}
                  {profileData.userType === 'professional' && (
                    <>
                      <div className="mb-4">
                        <label className="block text-greyIsh-600 mb-2">Business Name</label>
                        <input
                          type="text"
                          name="businessName"
                          value={profileData.businessName || ''}
                          onChange={(e) => handleProfileInputChange('businessName', e.target.value)}
                          disabled={!editMode}
                          className="w-full p-2 border rounded-md outline-none disabled:bg-gray-50"
                          placeholder="Enter business name"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-greyIsh-600 mb-2">Hourly Rate ($)</label>
                        <input
                          type="number"
                          name="hourlyRate"
                          value={profileData.hourlyRate || ''}
                          onChange={(e) => handleProfileInputChange('hourlyRate', e.target.value)}
                          disabled={!editMode}
                          className="w-full p-2 border rounded-md outline-none disabled:bg-gray-50"
                          placeholder="Enter hourly rate"
                          min="0"
                          step="0.01"
                        />
                      </div>

                      <div className="mb-4">
                        <label className="block text-greyIsh-600 mb-2">Services Offered</label>
                        {profileData.services && profileData.services.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {profileData.services.map(service => (
                              <span 
                                key={service} 
                                className="px-2 py-1 bg-blueColor text-white text-sm rounded capitalize"
                              >
                                {service}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">No services selected</p>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
              
              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
                    
                    <div className="flex items-center justify-between mb-3 p-3 bg-greyIsh-50 rounded-md">
                      <div className="flex items-center gap-3">
                        <FaBell className="text-blueColor" />
                        <span>Receive Notifications</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={userData.preferences.receiveNotifications}
                          onChange={(e) => updateUserData('preferences', 'receiveNotifications', e.target.checked)}
                          disabled={!editMode}
                        />
                        <div className={`w-11 h-6 bg-greyIsh-300 peer-focus:outline-none rounded-full peer ${userData.preferences.receiveNotifications ? 'peer-checked:bg-blueColor' : ''} after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${userData.preferences.receiveNotifications ? 'after:translate-x-5' : ''}`}></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3 p-3 bg-greyIsh-50 rounded-md">
                      <div className="flex items-center gap-3">
                        <BiCog className="text-blueColor" />
                        <span>Dark Mode</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={userData.preferences.darkMode}
                          onChange={(e) => updateUserData('preferences', 'darkMode', e.target.checked)}
                          disabled={!editMode}
                        />
                        <div className={`w-11 h-6 bg-greyIsh-300 peer-focus:outline-none rounded-full peer ${userData.preferences.darkMode ? 'peer-checked:bg-blueColor' : ''} after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${userData.preferences.darkMode ? 'after:translate-x-5' : ''}`}></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3 p-3 bg-greyIsh-50 rounded-md">
                      <div className="flex items-center gap-3">
                        <FaEnvelope className="text-blueColor" />
                        <span>Newsletter Subscription</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={userData.preferences.newsletterSubscription}
                          onChange={(e) => updateUserData('preferences', 'newsletterSubscription', e.target.checked)}
                          disabled={!editMode}
                        />
                        <div className={`w-11 h-6 bg-greyIsh-300 peer-focus:outline-none rounded-full peer ${userData.preferences.newsletterSubscription ? 'peer-checked:bg-blueColor' : ''} after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${userData.preferences.newsletterSubscription ? 'after:translate-x-5' : ''}`}></div>
                      </label>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">Service Preferences</h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      {availableServices.map(service => (
                        <div key={service} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`service-${service}`}
                            checked={userData.preferences.servicePreferences.includes(service)}
                            onChange={() => handleServiceToggle(service)}
                            disabled={!editMode}
                            className="w-4 h-4 accent-blueColor"
                          />
                          <label htmlFor={`service-${service}`} className="capitalize">{service}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Location Settings</h3>
                    
                    <div className="mb-4">
                      <label className="block text-greyIsh-600 mb-2">
                        Search Radius: {userData.preferences.locationRadius} miles
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="50"
                        step="5"
                        value={userData.preferences.locationRadius}
                        onChange={(e) => updateUserData('preferences', 'locationRadius', parseInt(e.target.value))}
                        disabled={!editMode}
                        className="w-full accent-blueColor"
                      />
                      <div className="flex justify-between text-sm text-greyIsh-500">
                        <span>5 miles</span>
                        <span>50 miles</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Security Settings Tab */}
              {activeTab === 'securitySettings' && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">Account Security</h3>
                    
                    <div className="flex items-center justify-between mb-3 p-3 bg-greyIsh-50 rounded-md">
                      <div className="flex items-center gap-3">
                        <FaLock className="text-blueColor" />
                        <span>Two-Factor Authentication</span>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer"
                          checked={userData.securitySettings.twoFactorAuth}
                          onChange={(e) => updateUserData('securitySettings', 'twoFactorAuth', e.target.checked)}
                          disabled={!editMode}
                        />
                        <div className={`w-11 h-6 bg-greyIsh-300 peer-focus:outline-none rounded-full peer ${userData.securitySettings.twoFactorAuth ? 'peer-checked:bg-blueColor' : ''} after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${userData.securitySettings.twoFactorAuth ? 'after:translate-x-5' : ''}`}></div>
                      </label>
                    </div>
                    
                    <div className="mb-6">
                      <p className="text-greyIsh-600">
                        Password last changed: <span className="font-medium">{userData.securitySettings.passwordLastChanged}</span>
                      </p>
                    </div>
                    
                    {editMode && (
                      <div>
                        <button
                          type="button"
                          className="bg-greyIsh-200 text-textColor py-2 px-4 rounded-md hover:bg-greyIsh-300 transition"
                          onClick={() => setShowPasswordModal(true)}
                        >
                          Change Password
                        </button>
                      </div>
                    )}
                    
                    {/* Password Change Modal */}
                    {showPasswordModal && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                          <h3 className="text-xl font-bold mb-4">Change Password</h3>
                          
                          <form onSubmit={handlePasswordSubmit}>
                            {passwordError && (
                              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                                {passwordError}
                              </div>
                            )}
                            
                            <div className="mb-4">
                              <label className="block text-greyIsh-600 mb-2">Current Password</label>
                              <div className="flex border rounded-md overflow-hidden">
                                <span className="bg-greyIsh-100 p-2 flex items-center">
                                  <FaLock className="text-greyIsh-500" />
                                </span>
                                <input
                                  type={passwordVisible.current ? "text" : "password"}
                                  value={passwordData.currentPassword}
                                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                  className="flex-1 p-2 outline-none"
                                />
                                <button
                                  type="button"
                                  className="px-2 bg-greyIsh-100"
                                  onClick={() => togglePasswordVisibility('current')}
                                >
                                  {passwordVisible.current ? <FaEyeSlash /> : <FaEye />}
                                </button>
                              </div>
                            </div>
                            
                            <div className="mb-4">
                              <label className="block text-greyIsh-600 mb-2">New Password</label>
                              <div className="flex border rounded-md overflow-hidden">
                                <span className="bg-greyIsh-100 p-2 flex items-center">
                                  <FaLock className="text-greyIsh-500" />
                                </span>
                                <input
                                  type={passwordVisible.new ? "text" : "password"}
                                  value={passwordData.newPassword}
                                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                  className="flex-1 p-2 outline-none"
                                />
                                <button
                                  type="button"
                                  className="px-2 bg-greyIsh-100"
                                  onClick={() => togglePasswordVisibility('new')}
                                >
                                  {passwordVisible.new ? <FaEyeSlash /> : <FaEye />}
                                </button>
                              </div>
                            </div>
                            
                            <div className="mb-6">
                              <label className="block text-greyIsh-600 mb-2">Confirm New Password</label>
                              <div className="flex border rounded-md overflow-hidden">
                                <span className="bg-greyIsh-100 p-2 flex items-center">
                                  <FaLock className="text-greyIsh-500" />
                                </span>
                                <input
                                  type={passwordVisible.confirm ? "text" : "password"}
                                  value={passwordData.confirmPassword}
                                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                  className="flex-1 p-2 outline-none"
                                />
                                <button
                                  type="button"
                                  className="px-2 bg-greyIsh-100"
                                  onClick={() => togglePasswordVisibility('confirm')}
                                >
                                  {passwordVisible.confirm ? <FaEyeSlash /> : <FaEye />}
                                </button>
                              </div>
                            </div>
                            
                            <div className="flex justify-end gap-3">
                              <button
                                type="button"
                                className="border border-greyIsh-300 px-4 py-2 rounded-md hover:bg-greyIsh-100"
                                onClick={() => {
                                  setShowPasswordModal(false);
                                  setPasswordData({
                                    currentPassword: '',
                                    newPassword: '',
                                    confirmPassword: ''
                                  });
                                  setPasswordError('');
                                }}
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="bg-blueColor text-white px-4 py-2 rounded-md hover:opacity-90"
                              >
                                Update Password
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {editMode && (
                    <div className="mt-8 pt-6 border-t">
                      <h3 className="text-lg font-semibold text-red-500 mb-4">Danger Zone</h3>
                      <button
                        type="button"
                        className="border border-red-500 text-red-500 py-2 px-4 rounded-md hover:bg-red-50 transition"
                      >
                        Delete Account
                      </button>
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;