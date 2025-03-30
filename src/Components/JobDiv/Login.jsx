import React, { useState } from 'react'
import { FaRegEnvelope, FaLock, FaGoogle, FaFacebook, FaEye, FaEyeSlash } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // State for form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })

  // State for validation errors
  const [errors, setErrors] = useState({})

  // State for form submission
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginError, setLoginError] = useState('')

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

    // Clear login error when user starts typing
    if (loginError) {
      setLoginError('')
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

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
      console.log('Login attempt:', formData)
      setIsSubmitting(false)
      
      // Simulate successful login
      // In a real app, you would handle authentication here
      if (formData.email === 'test@example.com' && formData.password === 'password123') {
        // Create a user object with some sample data
        const userData = {
          id: 1,
          email: formData.email,
          name: 'John Doe',
          role: 'customer'
        };
        
        // Call the login function from our auth context
        login(userData);
        
        // Redirect to dashboard instead of home page
        navigate('/dashboard');
      } else {
        // Show login error
        setLoginError('Invalid email or password. Please try again.')
      }
    }, 1500)
  }

  // Handle social login
  const handleSocialLogin = (provider) => {
    console.log(`Login with ${provider}`)
    // In a real app, you would implement OAuth authentication here
  }

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="pageHeader flex flex-col items-center justify-center py-10 bg-greyIsh">
        <h1 className="text-[32px] text-textColor font-bold mb-4">Login to Your Account</h1>
        <p className="text-[16px] text-[#959595] max-w-[600px] text-center">
          Welcome back! Log in to access your service bookings, saved professionals, and account settings.
        </p>
      </div>

      <div className="py-16 px-4">
        <div className="max-w-[500px] mx-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-[#e7e7e7] p-8">
            {/* Login Error Message */}
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4 mb-6">
                {loginError}
              </div>
            )}
            
            {/* Email */}
            <div className="mb-5">
              <label htmlFor="email" className="block text-textColor mb-2">Email Address</label>
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
            
            {/* Password */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-textColor">Password</label>
                <Link to="/forgot-password" className="text-sm text-blueColor hover:underline">
                  Forgot Password?
                </Link>
              </div>
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
                  placeholder="Enter your password"
                  className={`w-full p-3 pl-10 pr-10 rounded-md border ${errors.password ? 'border-red-500' : 'border-[#e7e7e7]'} focus:border-blueColor focus:outline-none`}
                />
                <button 
                  type="button"
                  className="absolute right-3 top-3 text-[#959595] hover:text-blueColor"
                  onClick={togglePasswordVisibility}
                  tabIndex="-1"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            
            {/* Remember Me */}
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <label htmlFor="rememberMe" className="text-[#959595]">
                  Remember me on this device
                </label>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="mb-6">
              <button 
                type="submit"
                className="w-full bg-blueColor text-white py-3 rounded-md hover:bg-opacity-90 transition-all disabled:bg-opacity-70 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Log In'}
              </button>
            </div>
            
            {/* Test Account Info */}
            <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-md p-4 mb-6 text-sm">
              <strong>For testing:</strong> Use email <code>test@example.com</code> and password <code>password123</code>
            </div>
            
            {/* Divider */}
            <div className="flex items-center mb-6">
              <div className="flex-grow h-px bg-[#e7e7e7]"></div>
              <span className="px-4 text-[#959595] text-sm">OR</span>
              <div className="flex-grow h-px bg-[#e7e7e7]"></div>
            </div>
            
            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <button 
                type="button"
                onClick={() => handleSocialLogin('Google')}
                className="flex items-center justify-center gap-2 p-3 border border-[#e7e7e7] rounded-md hover:bg-[#f7f7f7] transition-all"
              >
                <FaGoogle className="text-red-500" />
                <span>Google</span>
              </button>
              
              <button 
                type="button"
                onClick={() => handleSocialLogin('Facebook')}
                className="flex items-center justify-center gap-2 p-3 border border-[#e7e7e7] rounded-md hover:bg-[#f7f7f7] transition-all"
              >
                <FaFacebook className="text-blue-600" />
                <span>Facebook</span>
              </button>
            </div>
            
            {/* Register Link */}
            <div className="text-center text-[#959595]">
              Don't have an account yet? 
              <Link to="/register" className="text-blueColor hover:underline ml-1">
                Create an account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login