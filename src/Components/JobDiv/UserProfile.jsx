import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaSave, FaBell, FaEye, FaEyeSlash } from 'react-icons/fa';
import { BiCog } from 'react-icons/bi';
import { useUser } from '../../context/UserContext';

const UserProfile = () => {
  // Get user data and update functions from context
  const { userData, updateUserData } = useUser();

  // State for which tab is active
  const [activeTab, setActiveTab] = useState('personalInfo');
  
  // State for edit mode
  const [editMode, setEditMode] = useState(false);
  
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
    
    alert('Password updated successfully!');
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
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your API
    console.log('Saving user data:', userData);
    setEditMode(false);
    alert('Profile updated successfully!');
  };

  // List of available services (would typically come from your API/Data)
  const availableServices = [
    'Carpentry', 'Plumbing', 'Electrical', 'Interior Design', 
    'House Painting', 'Lawn Care', 'HVAC', 'Home Security'
  ];

  return (
    <div className="bg-greyIsh-50 p-8 rounded-lg shadow-md max-w-4xl mx-auto my-10">
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
            
            <h2 className="text-xl font-bold">{userData.personalInfo.fullName}</h2>
            <p className="text-greyIsh-500 mb-6">{userData.personalInfo.email}</p>
            
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
                  className="bg-green-500 text-white py-2 px-4 rounded-md flex items-center gap-2"
                  onClick={handleSubmit}
                >
                  <FaSave /> Save Changes
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
                        value={userData.personalInfo.fullName}
                        onChange={(e) => updateUserData('personalInfo', 'fullName', e.target.value)}
                        disabled={!editMode}
                        className="flex-1 p-2 outline-none"
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
                        value={userData.personalInfo.email}
                        onChange={(e) => updateUserData('personalInfo', 'email', e.target.value)}
                        disabled={!editMode}
                        className="flex-1 p-2 outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-greyIsh-600 mb-2">Phone Number</label>
                    <div className="flex border rounded-md overflow-hidden">
                      <span className="bg-greyIsh-100 p-2 flex items-center">
                        <FaPhone className="text-greyIsh-500" />
                      </span>
                      <input
                        type="tel"
                        value={userData.personalInfo.phone}
                        onChange={(e) => updateUserData('personalInfo', 'phone', e.target.value)}
                        disabled={!editMode}
                        className="flex-1 p-2 outline-none"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-greyIsh-600 mb-2">Address</label>
                    <div className="flex border rounded-md overflow-hidden">
                      <span className="bg-greyIsh-100 p-2 flex items-center">
                        <FaMapMarkerAlt className="text-greyIsh-500" />
                      </span>
                      <textarea
                        value={userData.personalInfo.address}
                        onChange={(e) => updateUserData('personalInfo', 'address', e.target.value)}
                        disabled={!editMode}
                        className="flex-1 p-2 outline-none"
                        rows="3"
                      />
                    </div>
                  </div>
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
                          <label htmlFor={`service-${service}`}>{service}</label>
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
                                onClick={() => setShowPasswordModal(false)}
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