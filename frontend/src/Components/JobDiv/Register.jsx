import React, { useState, useEffect } from 'react'
import { FaUserAlt, FaRegEnvelope, FaLock, FaTools, FaUserTie, FaHome, FaEye, FaEyeSlash } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Register = () => {
  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  // State for form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    userType: 'homeowner', // default userType
    businessName: '',
    services: [],
    hourlyRate: '',
    address: {
      city: '',
      state: ''
    },
    agreeToTerms: false
  })

  // State for validation errors
  const [errors, setErrors] = useState({})

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [apiError, setApiError] = useState('')

  // State for services from database
  const [availableServices, setAvailableServices] = useState([])
  const [servicesLoading, setServicesLoading] = useState(false)
  const [servicesError, setServicesError] = useState('')

  // Fetch services from database
  const fetchServices = async () => {
    try {
      setServicesLoading(true)
      setServicesError('')
      
      const response = await fetch('http://localhost:5000/api/categories')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Services/Categories API Response:', data)
      
      // Handle different possible response structures
      let servicesData = []
      if (Array.isArray(data)) {
        servicesData = data
      } else if (data.categories && Array.isArray(data.categories)) {
        servicesData = data.categories
      } else if (data.data && Array.isArray(data.data)) {
        servicesData = data.data
      } else {
        console.warn('Unexpected services API response structure:', data)
        throw new Error('Invalid services data structure')
      }
      
      // Transform services data to get service names
      const serviceNames = servicesData.map(service => {
        // Handle different possible service object structures
        return service.name || service.title || service.category || service
      }).filter(Boolean) // Remove any null/undefined values
      
      // Remove 'All Services' if it exists and sort alphabetically
      const filteredServices = serviceNames
        .filter(service => service !== 'All Services')
        .sort()
      
      setAvailableServices(filteredServices)
      console.log('Processed services:', filteredServices)
      
    } catch (err) {
      console.error('Error fetching services:', err)
      setServicesError('Failed to load services. Using default list.')
      
      // Fallback to default services if API fails
      setAvailableServices([
        'Carpentry',
        'Cleaning', 
        'Electrical',
        'HVAC',
        'Interior Design',
        'Landscaping',
        'Painting',
        'Plumbing',
        'Security'
      ])
    } finally {
      setServicesLoading(false)
    }
  }

  // Fetch services when component mounts
  useEffect(() => {
    fetchServices()
  }, [])

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    
    // Handle nested address fields
    if (name === 'city' || name === 'state') {
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [name]: value
        }
      })
    } else if (name === 'services') {
      // Handle services array (checkboxes)
      const serviceValue = value
      const currentServices = [...formData.services]
      
      if (checked) {
        // Add service if checked
        if (!currentServices.includes(serviceValue)) {
          currentServices.push(serviceValue)
        }
      } else {
        // Remove service if unchecked
        const index = currentServices.indexOf(serviceValue)
        if (index > -1) {
          currentServices.splice(index, 1)
        }
      }
      
      setFormData({
        ...formData,
        services: currentServices
      })
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      })
    }

    // Clear error when user starts typing in a field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }

    // Clear API error when user makes changes
    if (apiError) {
      setApiError('')
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // Validate phone
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    // Validate provider-specific fields
    if (formData.userType === 'professional') {
      if (!formData.businessName.trim()) {
        newErrors.businessName = 'Business name is required'
      }
      if (formData.services.length === 0) {
        newErrors.services = 'Please select at least one service'
      }
      if (!formData.hourlyRate) {
        newErrors.hourlyRate = 'Hourly rate is required'
      } else if (isNaN(formData.hourlyRate) || parseFloat(formData.hourlyRate) <= 0) {
        newErrors.hourlyRate = 'Please enter a valid hourly rate'
      }
    }

    // Validate address
    if (!formData.address.city.trim()) {
      newErrors.city = 'City is required'
    }
    if (!formData.address.state.trim()) {
      newErrors.state = 'State is required'
    }

    // Validate terms agreement
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions'
    }

    return newErrors
  }

  // API call function
  const registerUser = async (userData) => {
    try {
      const apiUrl = 'http://localhost:5000/api/auth/register';
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      // Check if response has content
      const contentType = response.headers.get('content-type');
      let data = null;

      if (contentType && contentType.includes('application/json')) {
        // Only try to parse JSON if content-type indicates JSON
        const text = await response.text();
        if (text) {
          try {
            data = JSON.parse(text);
          } catch (parseError) {
            console.error('JSON parse error:', parseError);
            throw new Error('Invalid response format from server');
          }
        }
      } else {
        // For non-JSON responses, get as text
        data = await response.text();
      }

      if (!response.ok) {
        // Handle different error scenarios
        if (response.status === 404) {
          throw new Error('Registration endpoint not found. Please check if the server is running.');
        } else if (response.status === 400) {
          throw new Error(data?.message || data || 'Invalid registration data');
        } else if (response.status === 409) {
          throw new Error('Email already exists');
        } else if (response.status === 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(data?.message || data || `Registration failed: ${response.status}`);
        }
      }

      return data || { success: true };
    } catch (error) {
      // Re-throw our custom errors, wrap network errors
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network error. Please check your connection.');
      }
      throw error;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Clear previous API errors
    setApiError('')
    
    // Validate form
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }
    
    // Set submitting state
    setIsSubmitting(true)
    
    try {
      // Prepare data for API - matches your exact API structure
      const apiData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        userType: formData.userType,
        address: {
          city: formData.address.city,
          state: formData.address.state
        }
      };

      // Add provider-specific fields if userType is provider
      if (formData.userType === 'professional') {
        apiData.businessName = formData.businessName;
        apiData.services = formData.services;
        apiData.hourlyRate = parseFloat(formData.hourlyRate);
      }

      // Call the API
      const result = await registerUser(apiData);
      
      console.log('Registration successful:', result);
      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: '',
          userType: 'professional',
          businessName: '',
          services: [],
          hourlyRate: '',
          address: {
            city: '',
            state: ''
          },
          agreeToTerms: false
        })
        setSubmitSuccess(false)
      }, 5000) // Extended time to allow user to see success message
      
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle different types of errors
      if (error.message.includes('email already exists') || error.message.includes('already registered')) {
        setErrors({ email: 'This email is already registered' });
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        setApiError('Network error. Please check your connection and try again.');
      } else {
        setApiError(error.message || 'Registration failed. Please try again.');
      }
      
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="pageHeader flex flex-col items-center justify-center py-10 bg-greyIsh">
        <h1 className="text-[32px] text-textColor font-bold mb-4">Create an Account</h1>
        <p className="text-[16px] text-[#959595] max-w-[600px] text-center">
          Join HomeServices to find reliable professionals for your home or offer your services to homeowners in need.
        </p>
      </div>

      <div className="py-16 px-4">
        <div className="max-w-[600px] mx-auto">
          {submitSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
              <h2 className="text-2xl font-semibold text-green-700 mb-2">Registration Successful!</h2>
              <p className="text-green-600 mb-6">Thank you for registering with HomeServices. Your account has been created successfully.</p>
              <Link to="/login" className="bg-blueColor text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-all">
                Proceed to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-[#e7e7e7] p-8">
              {/* API Error Display */}
              {apiError && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <div className="text-red-500 mr-2">⚠️</div>
                    <p className="text-red-700">{apiError}</p>
                  </div>
                </div>
              )}

              {/* Role Selection */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-textColor mb-4">I want to:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    className={`role-card cursor-pointer p-4 border rounded-lg flex items-center gap-3 transition-all ${
                      formData.userType === 'homeowner' 
                        ? 'border-blueColor bg-blue-50' 
                        : 'border-[#e7e7e7] hover:border-blue-200'
                    }`}
                    onClick={() => setFormData({...formData, userType: 'homeowner'})}
                  >
                    <div className={`icon-box p-3 rounded-full ${
                      formData.userType === 'homeowner' ? 'bg-blueColor text-white' : 'bg-[#f7f7f7] text-[#959595]'
                    }`}>
                      <FaHome />
                    </div>
                    <div>
                      <h3 className="font-medium text-textColor">Find Services</h3>
                      <p className="text-sm text-[#959595]">I need home services</p>
                    </div>
                    <input 
                      type="radio"
                      name="userType"
                      value="homeowner"
                      checked={formData.userType === 'homeowner'}
                      onChange={handleChange}
                      className="ml-auto"
                    />
                  </div>
                  
                  <div 
                    className={`role-card cursor-pointer p-4 border rounded-lg flex items-center gap-3 transition-all ${
                      formData.userType === 'professional' 
                        ? 'border-blueColor bg-blue-50' 
                        : 'border-[#e7e7e7] hover:border-blue-200'
                    }`}
                    onClick={() => setFormData({...formData, userType: 'professional'})}
                  >
                    <div className={`icon-box p-3 rounded-full ${
                      formData.userType === 'professional' ? 'bg-blueColor text-white' : 'bg-[#f7f7f7] text-[#959595]'
                    }`}>
                      <FaTools />
                    </div>
                    <div>
                      <h3 className="font-medium text-textColor">Offer Services</h3>
                      <p className="text-sm text-[#959595]">I'm a service provider</p>
                    </div>
                    <input 
                      type="radio"
                      name="userType"
                      value="professional"
                      checked={formData.userType === 'professional'}
                      onChange={handleChange}
                      className="ml-auto"
                    />
                  </div>
                </div>
              </div>
              
              {/* User Information */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-textColor mb-4">Your Information</h2>
                
                <div className="mb-4">
                  <label htmlFor="fullName" className="block text-textColor mb-2">Full Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-[#959595]">
                      <FaUserTie />
                    </span>
                    <input 
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={`w-full p-3 pl-10 rounded-md border ${errors.fullName ? 'border-red-500' : 'border-[#e7e7e7]'} focus:border-blueColor focus:outline-none`}
                    />
                  </div>
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-textColor mb-2">Email Address <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-[#959595]">
                      <FaRegEnvelope />
                    </span>
                    <input 
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                      className={`w-full p-3 pl-10 rounded-md border ${errors.email ? 'border-red-500' : 'border-[#e7e7e7]'} focus:border-blueColor focus:outline-none`}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-textColor mb-2">Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-[#959595]">
                        <FaLock />
                      </span>
                      <input 
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Create a password"
                        className={`w-full p-3 pl-10 pr-10 rounded-md border ${errors.password ? 'border-red-500' : 'border-[#e7e7e7]'} focus:border-blueColor focus:outline-none`}
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-3 text-[#959595] hover:text-blueColor"
                        onClick={() => togglePasswordVisibility('password')}
                        tabIndex="-1"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="confirmPassword" className="block text-textColor mb-2">Confirm Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-[#959595]">
                        <FaLock />
                      </span>
                      <input 
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        className={`w-full p-3 pl-10 pr-10 rounded-md border ${errors.confirmPassword ? 'border-red-500' : 'border-[#e7e7e7]'} focus:border-blueColor focus:outline-none`}
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-3 text-[#959595] hover:text-blueColor"
                        onClick={() => togglePasswordVisibility('confirm')}
                        tabIndex="-1"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-textColor mb-2">Phone Number <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-[#959595]">
                      📞
                    </span>
                    <input 
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className={`w-full p-3 pl-10 rounded-md border ${errors.phone ? 'border-red-500' : 'border-[#e7e7e7]'} focus:border-blueColor focus:outline-none`}
                    />
                  </div>
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-textColor mb-2">City <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-[#959595]">
                        🏙️
                      </span>
                      <input 
                        type="text"
                        id="city"
                        name="city"
                        value={formData.address.city}
                        onChange={handleChange}
                        placeholder="Enter your city"
                        className={`w-full p-3 pl-10 rounded-md border ${errors.city ? 'border-red-500' : 'border-[#e7e7e7]'} focus:border-blueColor focus:outline-none`}
                      />
                    </div>
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="state" className="block text-textColor mb-2">State <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-[#959595]">
                        📍
                      </span>
                      <input 
                        type="text"
                        id="state"
                        name="state"
                        value={formData.address.state}
                        onChange={handleChange}
                        placeholder="Enter your state"
                        className={`w-full p-3 pl-10 rounded-md border ${errors.state ? 'border-red-500' : 'border-[#e7e7e7]'} focus:border-blueColor focus:outline-none`}
                      />
                    </div>
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>
                </div>
              </div>
              
              {/* Provider Information (Conditional) */}
              {formData.userType === 'professional' && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-textColor mb-4">Service Provider Information</h2>
                  
                  <div className="mb-4">
                    <label htmlFor="businessName" className="block text-textColor mb-2">Business Name <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-[#959595]">
                        <FaTools />
                      </span>
                      <input 
                        type="text"
                        id="businessName"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        placeholder="Enter your business name"
                        className={`w-full p-3 pl-10 rounded-md border ${errors.businessName ? 'border-red-500' : 'border-[#e7e7e7]'} focus:border-blueColor focus:outline-none`}
                      />
                    </div>
                    {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-textColor mb-2">
                      Services Offered <span className="text-red-500">*</span>
                      {servicesLoading && <span className="text-sm text-[#959595] ml-2">(Loading services...)</span>}
                    </label>
                    
                    {/* Services Error Display */}
                    {servicesError && (
                      <div className="mb-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <div className="flex items-center">
                          <div className="text-yellow-500 mr-2">⚠️</div>
                          <p className="text-yellow-700 text-sm">{servicesError}</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Services Loading State */}
                    {servicesLoading ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                          <div key={i} className="flex items-center animate-pulse">
                            <div className="w-4 h-4 bg-gray-200 rounded mr-2"></div>
                            <div className="h-4 bg-gray-200 rounded flex-1"></div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {availableServices.map((service) => (
                          <div key={service} className="flex items-center">
                            <input 
                              type="checkbox"
                              id={service}
                              name="services"
                              value={service}
                              checked={formData.services.includes(service)}
                              onChange={handleChange}
                              className="mr-2"
                            />
                            <label htmlFor={service} className="text-sm text-textColor cursor-pointer">
                              {service}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {errors.services && <p className="text-red-500 text-sm mt-1">{errors.services}</p>}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="hourlyRate" className="block text-textColor mb-2">Hourly Rate (USD) <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-[#959595]">
                        💰
                      </span>
                      <input 
                        type="number"
                        id="hourlyRate"
                        name="hourlyRate"
                        value={formData.hourlyRate}
                        onChange={handleChange}
                        placeholder="Enter your hourly rate"
                        min="0"
                        step="0.01"
                        className={`w-full p-3 pl-10 rounded-md border ${errors.hourlyRate ? 'border-red-500' : 'border-[#e7e7e7]'} focus:border-blueColor focus:outline-none`}
                      />
                    </div>
                    {errors.hourlyRate && <p className="text-red-500 text-sm mt-1">{errors.hourlyRate}</p>}
                  </div>
                </div>
              )}
              
              {/* Terms and Conditions */}
              <div className="mb-8">
                <div className="flex items-start gap-2">
                  <input 
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="mt-1"
                  />
                  <label htmlFor="agreeToTerms" className="text-[#959595]">
                    I agree to the <Link to="#" className="text-blueColor hover:underline">Terms & Conditions</Link> and <Link to="#" className="text-blueColor hover:underline">Privacy Policy</Link> of HomeServices
                  </label>
                </div>
                {errors.agreeToTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeToTerms}</p>}
              </div>
              
              {/* Submit Button */}
              <div className="text-center">
                <button 
                  type="submit"
                  className="bg-blueColor text-white py-3 px-8 rounded-md hover:bg-opacity-90 transition-all disabled:bg-opacity-70 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>
                
                <div className="mt-6 text-[#959595]">
                  Already have an account? <Link to="/login" className="text-blueColor hover:underline">Log in</Link>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Register