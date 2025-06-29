import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaCog, 
  FaBell, 
  FaLock, 
  FaUserCircle, 
  FaMapMarkerAlt, 
  FaMoneyBillWave,
  FaToggleOn,
  FaToggleOff,
  FaPlus,
  FaCreditCard,
  FaPaypal,
  FaCheck
} from 'react-icons/fa';

const SettingsPage = () => {
  // Sample settings states
  const [notificationSettings, setNotificationSettings] = useState({
    bookingRequests: true,
    bookingReminders: true,
    paymentNotifications: true,
    marketingEmails: false,
  });

  const [privacySettings, setPrivacySettings] = useState({
    showProfilePhoto: true,
    shareContactInfo: false,
    allowReviews: true,
  });
  
  const [locationSettings, setLocationSettings] = useState({
    serviceRadius: 25,
    travelFee: true,
    onlineService: false,
    address: "123 Main St, San Francisco, CA 94105",
    zipCodes: ["94105", "94107", "94108", "94111"]
  });
  
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: "credit_card", last4: "4242", brand: "Visa", isDefault: true },
    { id: 2, type: "paypal", email: "john.smith@example.com", isDefault: false }
  ]);

  // Toggle notification setting
  const toggleNotification = (setting) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
  };

  // Toggle privacy setting
  const togglePrivacy = (setting) => {
    setPrivacySettings({
      ...privacySettings,
      [setting]: !privacySettings[setting]
    });
  };
  
  // Toggle location setting
  const toggleLocationSetting = (setting) => {
    setLocationSettings({
      ...locationSettings,
      [setting]: !locationSettings[setting]
    });
  };
  
  // Update service radius
  const updateServiceRadius = (value) => {
    setLocationSettings({
      ...locationSettings,
      serviceRadius: value
    });
  };
  
  // Remove zip code
  const removeZipCode = (zipToRemove) => {
    setLocationSettings({
      ...locationSettings,
      zipCodes: locationSettings.zipCodes.filter(zip => zip !== zipToRemove)
    });
  };
  
  // Add zip code
  const addZipCode = (newZip) => {
    if (newZip && !locationSettings.zipCodes.includes(newZip)) {
      setLocationSettings({
        ...locationSettings,
        zipCodes: [...locationSettings.zipCodes, newZip]
      });
    }
  };
  
  // Set default payment method
  const setDefaultPayment = (id) => {
    setPaymentMethods(
      paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };
  
  // Remove payment method
  const removePaymentMethod = (id) => {
    setPaymentMethods(
      paymentMethods.filter(method => method.id !== id)
    );
  };

  return (
    <div className="bg-greyIsh-50 min-h-screen pb-8">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link to="/provider/dashboard" className="text-gray-600 hover:text-blueColor mr-4">
            <FaArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-blueColor">Settings</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Settings Navigation */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Settings Menu</h2>
              <nav>
                <ul className="space-y-3">
                  <li>
                    <a href="#account" className="flex items-center text-blueColor">
                      <FaUserCircle className="mr-3" />
                      <span>Account</span>
                    </a>
                  </li>
                  <li>
                    <a href="#notifications" className="flex items-center text-gray-700 hover:text-blueColor">
                      <FaBell className="mr-3" />
                      <span>Notifications</span>
                    </a>
                  </li>
                  <li>
                    <a href="#privacy" className="flex items-center text-gray-700 hover:text-blueColor">
                      <FaLock className="mr-3" />
                      <span>Privacy</span>
                    </a>
                  </li>
                  <li>
                    <a href="#location" className="flex items-center text-gray-700 hover:text-blueColor">
                      <FaMapMarkerAlt className="mr-3" />
                      <span>Location & Service Area</span>
                    </a>
                  </li>
                  <li>
                    <a href="#payments" className="flex items-center text-gray-700 hover:text-blueColor">
                      <FaMoneyBillWave className="mr-3" />
                      <span>Payment Methods</span>
                    </a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="md:col-span-2 space-y-8">
            {/* Account Settings */}
            <div id="account" className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <FaUserCircle className="mr-2 text-blueColor" />
                Account Settings
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Email Address</h3>
                  <p className="text-gray-600 mb-2">johnsmith@example.com</p>
                  <button className="text-sm text-blueColor hover:underline">Change email</button>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Password</h3>
                  <p className="text-gray-600 mb-2">Last changed 3 months ago</p>
                  <button className="text-sm text-blueColor hover:underline">Change password</button>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Connected Accounts</h3>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 mr-2">Google</span>
                      <span className="text-xs bg-green-100 text-green-800 py-1 px-2 rounded">Connected</span>
                    </div>
                    <button className="text-sm text-red-500 hover:underline">Disconnect</button>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="font-medium text-gray-700">Facebook</span>
                    <button className="text-sm text-blueColor hover:underline">Connect</button>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <button className="text-red-500 hover:underline">Deactivate Account</button>
                </div>
              </div>
            </div>
            
            {/* Notification Settings */}
            <div id="notifications" className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <FaBell className="mr-2 text-blueColor" />
                Notification Settings
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium text-gray-700">Booking Requests</h3>
                    <p className="text-sm text-gray-500">Get notified when you receive a new booking request</p>
                  </div>
                  <button 
                    onClick={() => toggleNotification('bookingRequests')}
                    className="text-2xl text-blueColor"
                  >
                    {notificationSettings.bookingRequests ? <FaToggleOn /> : <FaToggleOff />}
                  </button>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium text-gray-700">Booking Reminders</h3>
                    <p className="text-sm text-gray-500">Get reminders for upcoming bookings</p>
                  </div>
                  <button 
                    onClick={() => toggleNotification('bookingReminders')}
                    className="text-2xl text-blueColor"
                  >
                    {notificationSettings.bookingReminders ? <FaToggleOn /> : <FaToggleOff />}
                  </button>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium text-gray-700">Payment Notifications</h3>
                    <p className="text-sm text-gray-500">Get notified when you receive a payment</p>
                  </div>
                  <button 
                    onClick={() => toggleNotification('paymentNotifications')}
                    className="text-2xl text-blueColor"
                  >
                    {notificationSettings.paymentNotifications ? <FaToggleOn /> : <FaToggleOff />}
                  </button>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium text-gray-700">Marketing Emails</h3>
                    <p className="text-sm text-gray-500">Receive promotional emails and platform updates</p>
                  </div>
                  <button 
                    onClick={() => toggleNotification('marketingEmails')}
                    className="text-2xl text-blueColor"
                  >
                    {notificationSettings.marketingEmails ? <FaToggleOn /> : <FaToggleOff />}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Privacy Settings */}
            <div id="privacy" className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <FaLock className="mr-2 text-blueColor" />
                Privacy Settings
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium text-gray-700">Profile Photo Visibility</h3>
                    <p className="text-sm text-gray-500">Allow customers to see your profile photo</p>
                  </div>
                  <button 
                    onClick={() => togglePrivacy('showProfilePhoto')}
                    className="text-2xl text-blueColor"
                  >
                    {privacySettings.showProfilePhoto ? <FaToggleOn /> : <FaToggleOff />}
                  </button>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium text-gray-700">Contact Information Sharing</h3>
                    <p className="text-sm text-gray-500">Share your contact details with customers before booking confirmation</p>
                  </div>
                  <button 
                    onClick={() => togglePrivacy('shareContactInfo')}
                    className="text-2xl text-blueColor"
                  >
                    {privacySettings.shareContactInfo ? <FaToggleOn /> : <FaToggleOff />}
                  </button>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium text-gray-700">Customer Reviews</h3>
                    <p className="text-sm text-gray-500">Allow customers to leave reviews on your profile</p>
                  </div>
                  <button 
                    onClick={() => togglePrivacy('allowReviews')}
                    className="text-2xl text-blueColor"
                  >
                    {privacySettings.allowReviews ? <FaToggleOn /> : <FaToggleOff />}
                  </button>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <button className="px-4 py-2 bg-blueColor text-white rounded-md hover:bg-blue-600 transition-colors">
                    Save Privacy Settings
                  </button>
                </div>
              </div>
            </div>
            
            {/* Location & Service Area Settings */}
            <div id="location" className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-blueColor" />
                Location & Service Area
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Business Address</h3>
                  <p className="text-gray-600 mb-2">{locationSettings.address}</p>
                  <button className="text-sm text-blueColor hover:underline">Update address</button>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Service Radius</h3>
                  <div className="flex items-center space-x-2">
                    <input 
                      type="range" 
                      min="5" 
                      max="100" 
                      step="5" 
                      value={locationSettings.serviceRadius} 
                      onChange={(e) => updateServiceRadius(Number(e.target.value))}
                      className="w-full accent-blueColor"
                    />
                    <span className="text-gray-700 font-medium">{locationSettings.serviceRadius} miles</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium text-gray-700">Travel Fee</h3>
                    <p className="text-sm text-gray-500">Charge clients for travel outside your primary area</p>
                  </div>
                  <button 
                    onClick={() => toggleLocationSetting('travelFee')}
                    className="text-2xl text-blueColor"
                  >
                    {locationSettings.travelFee ? <FaToggleOn /> : <FaToggleOff />}
                  </button>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <div>
                    <h3 className="font-medium text-gray-700">Online Services</h3>
                    <p className="text-sm text-gray-500">Offer services through video call or other online methods</p>
                  </div>
                  <button 
                    onClick={() => toggleLocationSetting('onlineService')}
                    className="text-2xl text-blueColor"
                  >
                    {locationSettings.onlineService ? <FaToggleOn /> : <FaToggleOff />}
                  </button>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Service Area Zip Codes</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {locationSettings.zipCodes.map(zip => (
                      <div key={zip} className="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                        <span className="mr-2">{zip}</span>
                        <button 
                          onClick={() => removeZipCode(zip)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center">
                      <input 
                        type="text" 
                        placeholder="Add zip code" 
                        className="border rounded-l px-2 py-1 w-24 focus:outline-none focus:ring-1 focus:ring-blueColor"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addZipCode(e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                      <button 
                        className="bg-blueColor text-white px-2 py-1 rounded-r"
                        onClick={(e) => {
                          const input = e.target.previousSibling;
                          addZipCode(input.value);
                          input.value = '';
                        }}
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t">
                  <button className="px-4 py-2 bg-blueColor text-white rounded-md hover:bg-blue-600 transition-colors">
                    Save Location Settings
                  </button>
                </div>
              </div>
            </div>
            
            {/* Payment Methods Settings */}
            <div id="payments" className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <FaMoneyBillWave className="mr-2 text-blueColor" />
                Payment Methods
              </h2>
              
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Your Payment Methods</h3>
                
                {paymentMethods.map(method => (
                  <div key={method.id} className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center">
                      {method.type === 'credit_card' ? (
                        <>
                          <FaCreditCard className="text-gray-700 mr-3" size={24} />
                          <div>
                            <p className="font-medium">{method.brand} •••• {method.last4}</p>
                            <p className="text-sm text-gray-500">Expires 12/2025</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <FaPaypal className="text-blue-600 mr-3" size={24} />
                          <div>
                            <p className="font-medium">PayPal</p>
                            <p className="text-sm text-gray-500">{method.email}</p>
                          </div>
                        </>
                      )}
                      {method.isDefault && (
                        <span className="ml-3 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                          <FaCheck size={10} className="mr-1" /> Default
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      {!method.isDefault && (
                        <button 
                          onClick={() => setDefaultPayment(method.id)}
                          className="text-sm text-blueColor hover:underline mr-4"
                        >
                          Set as default
                        </button>
                      )}
                      <button 
                        onClick={() => removePaymentMethod(method.id)}
                        className="text-sm text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="mt-4">
                  <button className="flex items-center text-blueColor hover:underline">
                    <FaPlus size={12} className="mr-2" />
                    Add Payment Method
                  </button>
                </div>
                
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Payout Information</h3>
                  <p className="text-gray-600 mb-2">Your current payout method is <span className="font-medium">Direct Deposit</span></p>
                  <button className="text-sm text-blueColor hover:underline">Update payout method</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;