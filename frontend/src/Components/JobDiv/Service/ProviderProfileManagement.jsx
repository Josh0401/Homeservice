import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUser, 
  FaTools, 
  FaMoneyBillWave, 
  FaImages, 
  FaCertificate,
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaPencilAlt,
  FaSave,
  FaTimes,
  FaSpinner,
  FaExclamationTriangle
} from 'react-icons/fa';

const ProviderProfileManagement = () => {
  // API states
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Profile information state - now fetched from API
  const [profileInfo, setProfileInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    businessName: '',
    description: '',
    hourlyRate: '',
    services: [],
    experience: '',
    availability: '',
    userType: '',
    isActive: false,
    isVerified: false,
    rating: 0
  });

  // Services state
  const [services, setServices] = useState([]);

  // Portfolio state
  const [portfolio, setPortfolio] = useState([]);

  // Certifications state
  const [certifications, setCertifications] = useState([]);

  // Edit states
  const [editingService, setEditingService] = useState(null);
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [editingCertification, setEditingCertification] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // New item states
  const [newService, setNewService] = useState({ name: '', description: '', price: '', priceType: 'hourly' });
  const [newPortfolio, setNewPortfolio] = useState({ title: '', description: '', imageFile: null });
  const [newCertification, setNewCertification] = useState({ name: '', issuingAuthority: '', issueDate: '', expiryDate: '', file: null });

  // File input refs
  const portfolioFileInputRef = useRef(null);
  const certificationFileInputRef = useRef(null);

  // Tab state
  const [activeTab, setActiveTab] = useState('profile');

  // Available services list
  const availableServices = [
    'plumbing', 'electrical', 'hvac', 'roofing', 'painting', 
    'carpentry', 'cleaning', 'handyman', 'other'
  ];

  // Get token from localStorage
  const getToken = () => {
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token ? 'Token exists' : 'No token found');
    return token;
  };

  // API request helper
  const apiRequest = async (endpoint, options = {}) => {
    const token = getToken();
    
    if (!token) {
      throw new Error('No authentication token found. Please login again.');
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
      ...options,
    };

    const url = `http://localhost:5000/api${endpoint}`;
    console.log('Making API request to:', url);
    console.log('Request config:', config);

    try {
      const response = await fetch(url, config);
      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);

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
      console.log('Fetching provider profile...');
      
      const response = await apiRequest('/auth/me');
      console.log('Provider profile response:', response);
      
      if (response.success) {
        const userData = response.user;
        console.log('Raw user data from API:', JSON.stringify(userData, null, 2));
        
        // Map the user data to profileInfo
        const mappedProfileInfo = {
          fullName: userData.fullName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: {
            street: userData.address?.street || '',
            city: userData.address?.city || '',
            state: userData.address?.state || '',
            zipCode: userData.address?.zipCode || ''
          },
          businessName: userData.businessName || userData.professional?.businessName || '',
          description: userData.description || userData.professional?.description || '',
          hourlyRate: userData.hourlyRate || userData.professional?.hourlyRate || '',
          services: userData.services || userData.professional?.services || [],
          experience: userData.experience || userData.professional?.experience || '',
          availability: userData.availability || userData.professional?.availability || '',
          userType: userData.userType || '',
          isActive: userData.isActive || false,
          isVerified: userData.isVerified || false,
          rating: userData.rating || 0
        };
        
        console.log('Mapped profile info:', mappedProfileInfo);
        setProfileInfo(mappedProfileInfo);
        
        // Set services based on user's services
        if (mappedProfileInfo.services && mappedProfileInfo.services.length > 0) {
          const servicesList = mappedProfileInfo.services.map((service, index) => ({
            id: index + 1,
            name: service,
            description: `${service} services`,
            price: mappedProfileInfo.hourlyRate || 0,
            priceType: 'hourly'
          }));
          setServices(servicesList);
        }
        
        // Initialize portfolio and certifications (you can extend this based on your API structure)
        setPortfolio(userData.portfolio || []);
        setCertifications(userData.certifications || []);
        
      } else {
        throw new Error('Profile fetch was not successful');
      }
    } catch (error) {
      console.error('Fetch profile error:', error);
      setError(error.message || 'Failed to fetch profile');
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

      console.log('Updating provider profile...');
      console.log('Update data being sent:', JSON.stringify(updateData, null, 2));

      const response = await apiRequest('/auth/me', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });

      console.log('Update response:', response);

      if (response.success) {
        const userData = response.user;
        
        // Update the profileInfo state with the new data
        const mappedProfileInfo = {
          fullName: userData.fullName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: {
            street: userData.address?.street || '',
            city: userData.address?.city || '',
            state: userData.address?.state || '',
            zipCode: userData.address?.zipCode || ''
          },
          businessName: userData.businessName || userData.professional?.businessName || '',
          description: userData.description || userData.professional?.description || '',
          hourlyRate: userData.hourlyRate || userData.professional?.hourlyRate || '',
          services: userData.services || userData.professional?.services || [],
          experience: userData.experience || userData.professional?.experience || '',
          availability: userData.availability || userData.professional?.availability || '',
          userType: userData.userType || '',
          isActive: userData.isActive || false,
          isVerified: userData.isVerified || false,
          rating: userData.rating || 0
        };
        
        setProfileInfo(mappedProfileInfo);
        
        // Update localStorage
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUserData = { ...currentUser, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUserData));
        
        setSuccess('Profile updated successfully!');
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

  // Handle profile edit
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfileInfo({
        ...profileInfo,
        [parent]: {
          ...profileInfo[parent],
          [child]: value
        }
      });
    } else {
      setProfileInfo({
        ...profileInfo,
        [name]: value
      });
    }
  };

  const saveProfileChanges = async () => {
    console.log('Saving profile changes:', profileInfo);
    
    const updateData = {
      fullName: profileInfo.fullName,
      phone: profileInfo.phone,
      address: profileInfo.address,
      businessName: profileInfo.businessName,
      description: profileInfo.description,
      services: profileInfo.services,
      availability: profileInfo.availability
    };
    
    if (profileInfo.hourlyRate) {
      updateData.hourlyRate = parseFloat(profileInfo.hourlyRate);
    }
    if (profileInfo.experience) {
      updateData.experience = parseInt(profileInfo.experience);
    }
    
    const success = await updateProfile(updateData);
    if (success) {
      setIsEditingProfile(false);
    }
  };

  // Handle service functions
  const handleServiceChange = (e, isNew = false) => {
    const { name, value } = e.target;
    
    if (isNew) {
      setNewService({
        ...newService,
        [name]: name === 'price' ? parseFloat(value) || '' : value
      });
    } else {
      setEditingService({
        ...editingService,
        [name]: name === 'price' ? parseFloat(value) || 0 : value
      });
    }
  };

  const addService = async () => {
    if (newService.name && newService.price) {
      // Update the profile's services array
      const updatedServices = [...profileInfo.services, newService.name];
      const updateData = {
        services: updatedServices,
        hourlyRate: newService.priceType === 'hourly' ? parseFloat(newService.price) : profileInfo.hourlyRate
      };
      
      const success = await updateProfile(updateData);
      if (success) {
        const serviceToAdd = {
          ...newService,
          id: services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1
        };
        setServices([...services, serviceToAdd]);
        setNewService({ name: '', description: '', price: '', priceType: 'hourly' });
      }
    }
  };

  const startEditService = (service) => {
    setEditingService({ ...service });
  };

  const saveServiceChanges = async () => {
    if (editingService && editingService.name && editingService.price) {
      // Update services in the profile
      const updatedServices = services.map(service => 
        service.id === editingService.id ? editingService : service
      );
      setServices(updatedServices);
      
      // Extract service names for API
      const serviceNames = updatedServices.map(s => s.name);
      const updateData = {
        services: serviceNames,
        hourlyRate: editingService.priceType === 'hourly' ? parseFloat(editingService.price) : profileInfo.hourlyRate
      };
      
      await updateProfile(updateData);
      setEditingService(null);
    }
  };

  const deleteService = async (id) => {
    const updatedServices = services.filter(service => service.id !== id);
    setServices(updatedServices);
    
    // Update profile with remaining services
    const serviceNames = updatedServices.map(s => s.name);
    const updateData = { services: serviceNames };
    await updateProfile(updateData);
    
    if (editingService && editingService.id === id) {
      setEditingService(null);
    }
  };

  // Handle portfolio functions (these would need additional API endpoints)
  const handlePortfolioChange = (e, isNew = false) => {
    const { name, value } = e.target;
    
    if (isNew) {
      setNewPortfolio({
        ...newPortfolio,
        [name]: value
      });
    } else {
      setEditingPortfolio({
        ...editingPortfolio,
        [name]: value
      });
    }
  };

  const handlePortfolioImageChange = (e, isNew = false) => {
    if (e.target.files && e.target.files[0]) {
      if (isNew) {
        setNewPortfolio({
          ...newPortfolio,
          imageFile: e.target.files[0]
        });
      } else {
        setEditingPortfolio({
          ...editingPortfolio,
          imageFile: e.target.files[0],
          imageUrl: URL.createObjectURL(e.target.files[0])
        });
      }
    }
  };

  const addPortfolioItem = () => {
    if (newPortfolio.title && newPortfolio.description) {
      const itemToAdd = {
        ...newPortfolio,
        id: portfolio.length > 0 ? Math.max(...portfolio.map(p => p.id)) + 1 : 1,
        imageUrl: newPortfolio.imageFile ? URL.createObjectURL(newPortfolio.imageFile) : '/api/placeholder/400/300'
      };
      setPortfolio([...portfolio, itemToAdd]);
      setNewPortfolio({ title: '', description: '', imageFile: null });
      if (portfolioFileInputRef.current) {
        portfolioFileInputRef.current.value = '';
      }
    }
  };

  const startEditPortfolio = (item) => {
    setEditingPortfolio({ ...item });
  };

  const savePortfolioChanges = () => {
    if (editingPortfolio && editingPortfolio.title) {
      setPortfolio(portfolio.map(item => 
        item.id === editingPortfolio.id ? editingPortfolio : item
      ));
      setEditingPortfolio(null);
    }
  };

  const deletePortfolioItem = (id) => {
    setPortfolio(portfolio.filter(item => item.id !== id));
    if (editingPortfolio && editingPortfolio.id === id) {
      setEditingPortfolio(null);
    }
  };

  // Handle certification functions (these would need additional API endpoints)
  const handleCertificationChange = (e, isNew = false) => {
    const { name, value } = e.target;
    
    if (isNew) {
      setNewCertification({
        ...newCertification,
        [name]: value
      });
    } else {
      setEditingCertification({
        ...editingCertification,
        [name]: value
      });
    }
  };

  const handleCertificationFileChange = (e, isNew = false) => {
    if (e.target.files && e.target.files[0]) {
      if (isNew) {
        setNewCertification({
          ...newCertification,
          file: e.target.files[0]
        });
      } else {
        setEditingCertification({
          ...editingCertification,
          file: e.target.files[0],
          fileUrl: e.target.files[0].name
        });
      }
    }
  };

  const addCertification = () => {
    if (newCertification.name && newCertification.issuingAuthority) {
      const certToAdd = {
        ...newCertification,
        id: certifications.length > 0 ? Math.max(...certifications.map(c => c.id)) + 1 : 1,
        fileUrl: newCertification.file ? newCertification.file.name : 'certificate.pdf'
      };
      setCertifications([...certifications, certToAdd]);
      setNewCertification({ name: '', issuingAuthority: '', issueDate: '', expiryDate: '', file: null });
      if (certificationFileInputRef.current) {
        certificationFileInputRef.current.value = '';
      }
    }
  };

  const startEditCertification = (cert) => {
    setEditingCertification({ ...cert });
  };

  const saveCertificationChanges = () => {
    if (editingCertification && editingCertification.name) {
      setCertifications(certifications.map(cert => 
        cert.id === editingCertification.id ? editingCertification : cert
      ));
      setEditingCertification(null);
    }
  };

  const deleteCertification = (id) => {
    setCertifications(certifications.filter(cert => cert.id !== id));
    if (editingCertification && editingCertification.id === id) {
      setEditingCertification(null);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blueColor mb-4" />
        <span className="text-lg">Loading provider profile...</span>
      </div>
    );
  }

  // Error state
  if (error && !profileInfo.email) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen max-w-2xl mx-auto p-6">
        <FaExclamationTriangle className="text-4xl text-red-500 mb-4" />
        <h2 className="text-xl font-bold mb-2">Failed to Load Provider Profile</h2>
        <p className="text-red-500 mb-4 text-center">{error}</p>
        <button 
          onClick={fetchProfile}
          className="bg-blueColor text-white px-6 py-2 rounded hover:bg-opacity-90"
        >
          Retry Loading Profile
        </button>
      </div>
    );
  }

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            
            {/* Success/Error Messages */}
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
            
            {isEditingProfile ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="fullName" 
                    value={profileInfo.fullName} 
                    onChange={handleProfileChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={profileInfo.email} 
                    disabled={true}
                    className="w-full p-2 border rounded bg-gray-100 text-gray-500"
                  />
                  <small className="text-gray-500">Email cannot be changed</small>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Phone</label>
                  <input 
                    type="text" 
                    name="phone" 
                    value={profileInfo.phone} 
                    onChange={handleProfileChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Business Name</label>
                  <input 
                    type="text" 
                    name="businessName" 
                    value={profileInfo.businessName} 
                    onChange={handleProfileChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Street Address</label>
                    <input 
                      type="text" 
                      name="address.street" 
                      value={profileInfo.address.street} 
                      onChange={handleProfileChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">City</label>
                    <input 
                      type="text" 
                      name="address.city" 
                      value={profileInfo.address.city} 
                      onChange={handleProfileChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">State</label>
                    <input 
                      type="text" 
                      name="address.state" 
                      value={profileInfo.address.state} 
                      onChange={handleProfileChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Zip Code</label>
                    <input 
                      type="text" 
                      name="address.zipCode" 
                      value={profileInfo.address.zipCode} 
                      onChange={handleProfileChange}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Hourly Rate ($)</label>
                    <input 
                      type="number" 
                      name="hourlyRate" 
                      value={profileInfo.hourlyRate} 
                      onChange={handleProfileChange}
                      className="w-full p-2 border rounded"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">Years of Experience</label>
                    <input 
                      type="number" 
                      name="experience" 
                      value={profileInfo.experience} 
                      onChange={handleProfileChange}
                      className="w-full p-2 border rounded"
                      min="0"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Availability</label>
                  <select 
                    name="availability" 
                    value={profileInfo.availability} 
                    onChange={handleProfileChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select availability</option>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="weekends">Weekends Only</option>
                    <option value="emergency">Emergency Only</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Professional Description</label>
                  <textarea 
                    name="description" 
                    value={profileInfo.description} 
                    onChange={handleProfileChange}
                    className="w-full p-2 border rounded"
                    rows="4"
                    placeholder="Describe your professional services and expertise"
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button 
                    onClick={() => setIsEditingProfile(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={saveProfileChanges}
                    className="bg-blueColor text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                    disabled={saving}
                  >
                    {saving ? <FaSpinner className="animate-spin mr-2" /> : null}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-500">Full Name</p>
                    <p className="font-medium">{profileInfo.fullName || 'Not set'}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium">{profileInfo.email || 'Not set'}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium">{profileInfo.phone || 'Not set'}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500">Business Name</p>
                    <p className="font-medium">{profileInfo.businessName || 'Not set'}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500">Address</p>
                    <p className="font-medium">
                      {profileInfo.address.street && profileInfo.address.city ? 
                        `${profileInfo.address.street}, ${profileInfo.address.city}, ${profileInfo.address.state} ${profileInfo.address.zipCode}` : 
                        'Not set'
                      }
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500">Hourly Rate</p>
                    <p className="font-medium">{profileInfo.hourlyRate ? `$${profileInfo.hourlyRate}/hour` : 'Not set'}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500">Experience</p>
                    <p className="font-medium">{profileInfo.experience ? `${profileInfo.experience} years` : 'Not set'}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500">Availability</p>
                    <p className="font-medium capitalize">{profileInfo.availability || 'Not set'}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-500">Services</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profileInfo.services && profileInfo.services.length > 0 ? (
                      profileInfo.services.map((service, index) => (
                        <span key={index} className="px-2 py-1 bg-blueColor text-white text-sm rounded capitalize">
                          {service}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400">No services set</span>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-500">Professional Description</p>
                  <p className="font-medium">{profileInfo.description || 'No description provided'}</p>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-500">Account Status</p>
                  <div className="flex gap-4 mt-1">
                    <span className={`px-2 py-1 rounded text-xs ${profileInfo.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {profileInfo.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${profileInfo.isVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {profileInfo.isVerified ? 'Verified' : 'Pending Verification'}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      Rating: {profileInfo.rating || 0}/5
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    onClick={() => setIsEditingProfile(true)}
                    className="bg-blueColor text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                  >
                    <FaPencilAlt className="mr-2" />
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        );
        
      case 'services':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Service Offerings</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Add New Service</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">Service Name</label>
                  <select 
                    name="name" 
                    value={newService.name} 
                    onChange={(e) => handleServiceChange(e, true)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="">Select a service</option>
                    {availableServices.map(service => (
                      <option key={service} value={service} className="capitalize">
                        {service}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-700 mb-2">Price ($)</label>
                    <input 
                      type="number" 
                      name="price" 
                      value={newService.price} 
                      onChange={(e) => handleServiceChange(e, true)}
                      className="w-full p-2 border rounded"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Price Type</label>
                    <select 
                      name="priceType" 
                      value={newService.priceType} 
                      onChange={(e) => handleServiceChange(e, true)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="flat">Flat Rate</option>
                      <option value="estimate">Estimate Required</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea 
                  name="description" 
                  value={newService.description} 
                  onChange={(e) => handleServiceChange(e, true)}
                  className="w-full p-2 border rounded"
                  rows="2"
                  placeholder="Describe the service you offer..."
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={addService}
                  className="bg-blueColor text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                  disabled={!newService.name || !newService.price || saving}
                >
                  {saving ? <FaSpinner className="animate-spin mr-2" /> : <FaPlus className="mr-2" />}
                  {saving ? 'Adding...' : 'Add Service'}
                </button>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-2">Your Services</h3>
              
              {services.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Service</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Description</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Price</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {services.map(service => (
                        <tr key={service.id} className="hover:bg-gray-50">
                          {editingService && editingService.id === service.id ? (
                            <>
                              <td className="py-4 px-4">
                                <select 
                                  name="name" 
                                  value={editingService.name} 
                                  onChange={handleServiceChange}
                                  className="w-full p-1 border rounded"
                                >
                                  {availableServices.map(srv => (
                                    <option key={srv} value={srv} className="capitalize">
                                      {srv}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="py-4 px-4">
                                <input 
                                  type="text" 
                                  name="description" 
                                  value={editingService.description} 
                                  onChange={handleServiceChange}
                                  className="w-full p-1 border rounded"
                                />
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center space-x-2">
                                  <input 
                                    type="number" 
                                    name="price" 
                                    value={editingService.price} 
                                    onChange={handleServiceChange}
                                    className="w-20 p-1 border rounded"
                                    min="0"
                                    step="0.01"
                                  />
                                  <select 
                                    name="priceType" 
                                    value={editingService.priceType} 
                                    onChange={handleServiceChange}
                                    className="p-1 border rounded"
                                  >
                                    <option value="hourly">Hourly</option>
                                    <option value="flat">Flat</option>
                                    <option value="estimate">Estimate</option>
                                  </select>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex space-x-2">
                                  <button 
                                    onClick={saveServiceChanges}
                                    className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
                                    title="Save"
                                    disabled={saving}
                                  >
                                    {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                                  </button>
                                  <button 
                                    onClick={() => setEditingService(null)}
                                    className="bg-gray-500 text-white p-1 rounded hover:bg-gray-600"
                                    title="Cancel"
                                  >
                                    <FaTimes />
                                  </button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="py-4 px-4 capitalize">{service.name}</td>
                              <td className="py-4 px-4">{service.description}</td>
                              <td className="py-4 px-4">
                                ${service.price} {service.priceType === 'hourly' ? '/hour' : 
                                  service.priceType === 'flat' ? ' flat rate' : 
                                  ' (estimate required)'}
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex space-x-2">
                                  <button 
                                    onClick={() => startEditService(service)}
                                    className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                                    title="Edit"
                                  >
                                    <FaPencilAlt />
                                  </button>
                                  <button 
                                    onClick={() => deleteService(service.id)}
                                    className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                                    title="Delete"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No services added yet. Add your first service above.
                </div>
              )}
            </div>
          </div>
        );
        
      case 'portfolio':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Portfolio & Work Samples</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Add New Project</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">Project Title</label>
                  <input 
                    type="text" 
                    name="title" 
                    value={newPortfolio.title} 
                    onChange={(e) => handlePortfolioChange(e, true)}
                    className="w-full p-2 border rounded"
                    placeholder="e.g. Complete Bathroom Renovation"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Project Image</label>
                  <input 
                    type="file" 
                    ref={portfolioFileInputRef}
                    onChange={(e) => handlePortfolioImageChange(e, true)}
                    className="w-full p-2 border rounded"
                    accept="image/*"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea 
                  name="description" 
                  value={newPortfolio.description} 
                  onChange={(e) => handlePortfolioChange(e, true)}
                  className="w-full p-2 border rounded"
                  rows="2"
                  placeholder="Describe the project..."
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={addPortfolioItem}
                  className="bg-blueColor text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                  disabled={!newPortfolio.title}
                >
                  <FaPlus className="mr-2" />
                  Add Project
                </button>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">Your Projects</h3>
              
              {portfolio.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {portfolio.map(item => (
                    <div key={item.id} className="border rounded shadow-sm overflow-hidden">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-48 object-cover"
                      />
                      
                      {editingPortfolio && editingPortfolio.id === item.id ? (
                        <div className="p-4">
                          <input 
                            type="text" 
                            name="title" 
                            value={editingPortfolio.title} 
                            onChange={handlePortfolioChange}
                            className="w-full p-1 border rounded mb-2"
                          />
                          <textarea 
                            name="description" 
                            value={editingPortfolio.description} 
                            onChange={handlePortfolioChange}
                            className="w-full p-1 border rounded mb-2"
                            rows="2"
                          ></textarea>
                          <input 
                            type="file" 
                            onChange={(e) => handlePortfolioImageChange(e)}
                            className="w-full p-1 border rounded mb-2"
                            accept="image/*"
                          />
                          <div className="flex justify-end space-x-2 mt-2">
                            <button 
                              onClick={() => setEditingPortfolio(null)}
                              className="bg-gray-500 text-white p-1 rounded hover:bg-gray-600"
                              title="Cancel"
                            >
                              <FaTimes />
                            </button>
                            <button 
                              onClick={savePortfolioChanges}
                              className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
                              title="Save"
                            >
                              <FaSave />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4">
                          <h4 className="font-medium text-lg mb-1">{item.title}</h4>
                          <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                          <div className="flex justify-end space-x-2">
                            <button 
                              onClick={() => startEditPortfolio(item)}
                              className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                              title="Edit"
                            >
                              <FaPencilAlt />
                            </button>
                            <button 
                              onClick={() => deletePortfolioItem(item.id)}
                              className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No portfolio items yet. Add your first project above.
                </div>
              )}
            </div>
          </div>
        );
        
      case 'certifications':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Certifications & Licenses</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Add New Certification</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">Certification Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={newCertification.name} 
                    onChange={(e) => handleCertificationChange(e, true)}
                    className="w-full p-2 border rounded"
                    placeholder="e.g. Master Plumber License"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Issuing Authority</label>
                  <input 
                    type="text" 
                    name="issuingAuthority" 
                    value={newCertification.issuingAuthority} 
                    onChange={(e) => handleCertificationChange(e, true)}
                    className="w-full p-2 border rounded"
                    placeholder="e.g. State Plumbing Board"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">Issue Date</label>
                  <input 
                    type="date" 
                    name="issueDate" 
                    value={newCertification.issueDate} 
                    onChange={(e) => handleCertificationChange(e, true)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Expiry Date</label>
                  <input 
                    type="date" 
                    name="expiryDate" 
                    value={newCertification.expiryDate} 
                    onChange={(e) => handleCertificationChange(e, true)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Certification Document</label>
                <input 
                  type="file" 
                  ref={certificationFileInputRef}
                  onChange={(e) => handleCertificationFileChange(e, true)}
                  className="w-full p-2 border rounded"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <p className="text-xs text-gray-500 mt-1">Upload PDF or image of your certification document</p>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={addCertification}
                  className="bg-blueColor text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                  disabled={!newCertification.name || !newCertification.issuingAuthority}
                >
                  <FaPlus className="mr-2" />
                  Add Certification
                </button>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-2">Your Certifications</h3>
              
              {certifications.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Certification</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Issuing Authority</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Validity</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Document</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {certifications.map(cert => (
                        <tr key={cert.id} className="hover:bg-gray-50">
                          {editingCertification && editingCertification.id === cert.id ? (
                            <>
                              <td className="py-4 px-4">
                                <input 
                                  type="text" 
                                  name="name" 
                                  value={editingCertification.name} 
                                  onChange={handleCertificationChange}
                                  className="w-full p-1 border rounded"
                                />
                              </td>
                              <td className="py-4 px-4">
                                <input 
                                  type="text" 
                                  name="issuingAuthority" 
                                  value={editingCertification.issuingAuthority} 
                                  onChange={handleCertificationChange}
                                  className="w-full p-1 border rounded"
                                />
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex space-x-2">
                                  <input 
                                    type="date" 
                                    name="issueDate" 
                                    value={editingCertification.issueDate} 
                                    onChange={handleCertificationChange}
                                    className="w-32 p-1 border rounded"
                                  />
                                  -
                                  <input 
                                    type="date" 
                                    name="expiryDate" 
                                    value={editingCertification.expiryDate} 
                                    onChange={handleCertificationChange}
                                    className="w-32 p-1 border rounded"
                                  />
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <input 
                                  type="file" 
                                  onChange={(e) => handleCertificationFileChange(e)}
                                  className="w-full p-1 border rounded"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                />
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex space-x-2">
                                  <button 
                                    onClick={saveCertificationChanges}
                                    className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
                                    title="Save"
                                  >
                                    <FaSave />
                                  </button>
                                  <button 
                                    onClick={() => setEditingCertification(null)}
                                    className="bg-gray-500 text-white p-1 rounded hover:bg-gray-600"
                                    title="Cancel"
                                  >
                                    <FaTimes />
                                  </button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="py-4 px-4">{cert.name}</td>
                              <td className="py-4 px-4">{cert.issuingAuthority}</td>
                              <td className="py-4 px-4">
                                {new Date(cert.issueDate).toLocaleDateString()} - {new Date(cert.expiryDate).toLocaleDateString()}
                              </td>
                              <td className="py-4 px-4">
                                <a href="#" className="text-blueColor hover:underline">
                                  {cert.fileUrl}
                                </a>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex space-x-2">
                                  <button 
                                    onClick={() => startEditCertification(cert)}
                                    className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                                    title="Edit"
                                  >
                                    <FaPencilAlt />
                                  </button>
                                  <button 
                                    onClick={() => deleteCertification(cert.id)}
                                    className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                                    title="Delete"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No certifications added yet. Add your first certification above.
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-greyIsh-50 min-h-screen pb-8">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/provider/dashboard" className="mr-4">
              <FaArrowLeft className="text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-blueColor">Profile Management</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pt-8">
        {/* Tabs */}
        <div className="flex border-b mb-8">
          <button 
            className={`py-3 px-6 ${activeTab === 'profile' ? 'border-b-2 border-blueColor text-blueColor font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('profile')}
          >
            <FaUser className="inline mr-2" />
            Basic Info
          </button>
          <button 
            className={`py-3 px-6 ${activeTab === 'services' ? 'border-b-2 border-blueColor text-blueColor font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('services')}
          >
            <FaTools className="inline mr-2" />
            Services
          </button>
          <button 
            className={`py-3 px-6 ${activeTab === 'portfolio' ? 'border-b-2 border-blueColor text-blueColor font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('portfolio')}
          >
            <FaImages className="inline mr-2" />
            Portfolio
          </button>
          <button 
            className={`py-3 px-6 ${activeTab === 'certifications' ? 'border-b-2 border-blueColor text-blueColor font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('certifications')}
          >
            <FaCertificate className="inline mr-2" />
            Certifications
          </button>
        </div>
        
        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProviderProfileManagement;
        