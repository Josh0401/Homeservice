import React, { useState } from 'react'
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
    role: 'homeowner', // default role
    companyName: '',
    serviceCategory: '',
    agreeToTerms: false
  })

  // State for validation errors
  const [errors, setErrors] = useState({})

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })

    // Clear error when user starts typing in a field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
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

    // Validate service provider information if role is provider
    if (formData.role === 'provider') {
      if (!formData.companyName.trim()) {
        newErrors.companyName = 'Business name is required'
      }
      if (!formData.serviceCategory.trim()) {
        newErrors.serviceCategory = 'Service category is required'
      }
    }

    // Validate terms agreement
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions'
    }

    return newErrors
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate form
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }
    
    // Set submitting state
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData)
      setIsSubmitting(false)
      setSubmitSuccess(true)
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'homeowner',
          companyName: '',
          serviceCategory: '',
          agreeToTerms: false
        })
        setSubmitSuccess(false)
      }, 3000)
    }, 1500)
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
              {/* Role Selection */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-textColor mb-4">I want to:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    className={`role-card cursor-pointer p-4 border rounded-lg flex items-center gap-3 transition-all ${
                      formData.role === 'homeowner' 
                        ? 'border-blueColor bg-blue-50' 
                        : 'border-[#e7e7e7] hover:border-blue-200'
                    }`}
                    onClick={() => setFormData({...formData, role: 'homeowner'})}
                  >
                    <div className={`icon-box p-3 rounded-full ${
                      formData.role === 'homeowner' ? 'bg-blueColor text-white' : 'bg-[#f7f7f7] text-[#959595]'
                    }`}>
                      <FaHome />
                    </div>
                    <div>
                      <h3 className="font-medium text-textColor">Find Services</h3>
                      <p className="text-sm text-[#959595]">I need home services</p>
                    </div>
                    <input 
                      type="radio"
                      name="role"
                      value="homeowner"
                      checked={formData.role === 'homeowner'}
                      onChange={handleChange}
                      className="ml-auto"
                    />
                  </div>
                  
                  <div 
                    className={`role-card cursor-pointer p-4 border rounded-lg flex items-center gap-3 transition-all ${
                      formData.role === 'provider' 
                        ? 'border-blueColor bg-blue-50' 
                        : 'border-[#e7e7e7] hover:border-blue-200'
                    }`}
                    onClick={() => setFormData({...formData, role: 'provider'})}
                  >
                    <div className={`icon-box p-3 rounded-full ${
                      formData.role === 'provider' ? 'bg-blueColor text-white' : 'bg-[#f7f7f7] text-[#959595]'
                    }`}>
                      <FaTools />
                    </div>
                    <div>
                      <h3 className="font-medium text-textColor">Offer Services</h3>
                      <p className="text-sm text-[#959595]">I'm a service provider</p>
                    </div>
                    <input 
                      type="radio"
                      name="role"
                      value="provider"
                      checked={formData.role === 'provider'}
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
              </div>
              
              {/* Provider Information (Conditional) */}
              {formData.role === 'provider' && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-textColor mb-4">Service Provider Information</h2>
                  
                  <div className="mb-4">
                    <label htmlFor="companyName" className="block text-textColor mb-2">Business Name <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-[#959595]">
                        <FaTools />
                      </span>
                      <input 
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="Enter your business name"
                        className={`w-full p-3 pl-10 rounded-md border ${errors.companyName ? 'border-red-500' : 'border-[#e7e7e7]'} focus:border-blueColor focus:outline-none`}
                      />
                    </div>
                    {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="serviceCategory" className="block text-textColor mb-2">Service Category <span className="text-red-500">*</span></label>
                    <select 
                      id="serviceCategory"
                      name="serviceCategory"
                      value={formData.serviceCategory}
                      onChange={handleChange}
                      className={`w-full p-3 rounded-md border ${errors.serviceCategory ? 'border-red-500' : 'border-[#e7e7e7]'} focus:border-blueColor focus:outline-none`}
                    >
                      <option value="">Select primary service category</option>
                      <option value="plumbing">Plumbing</option>
                      <option value="electrical">Electrical</option>
                      <option value="carpentry">Carpentry</option>
                      <option value="painting">Painting</option>
                      <option value="hvac">HVAC</option>
                      <option value="cleaning">Cleaning</option>
                      <option value="landscaping">Landscaping</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.serviceCategory && <p className="text-red-500 text-sm mt-1">{errors.serviceCategory}</p>}
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