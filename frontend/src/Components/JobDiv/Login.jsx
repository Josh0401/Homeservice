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

  // API call to login
  const loginUser = async (loginData) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return data;
    } catch (error) {
      throw new Error(error.message || 'Network error. Please try again.');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }
    
    // Set submitting state
    setIsSubmitting(true)
    setLoginError('')
    
    try {
      // Call the API
      const response = await loginUser({
        email: formData.email,
        password: formData.password
      });

      // Handle successful login
      if (response.success) {
        // Store token in localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));

        // Call the login function from auth context
        login(response.user, response.token);

        // Show success message (optional)
        console.log('Login successful:', response.user);

        // Redirect based on user type
        if (response.user.userType === 'professional') {
          navigate('/provider/dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error) {
      // Handle login error
      setLoginError(error.message);
    } finally {
      setIsSubmitting(false);
    }
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
                <button 
                  type="button"
                  className="absolute right-3 top-3 text-[#959595] hover:text-blueColor"
                  onClick={togglePasswordVisibility}
                  tabIndex="-1"
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                className="w-full bg-blueColor text-white py-3 rounded-md hover:bg-opacity-90 transition-all disabled:bg-opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging in...
                  </>
                ) : (
                  'Log In'
                )}
              </button>
            </div>
            
            {/* Test Account Info */}
            <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-md p-4 mb-6 text-sm">
              <strong>For testing:</strong> Create an account first or use your registered credentials
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
                className="flex items-center justify-center gap-2 p-3 border border-[#e7e7e7] rounded-md hover:bg-[#f7f7f7] transition-all disabled:opacity-50"
                disabled={isSubmitting}
              >
                <FaGoogle className="text-red-500" />
                <span>Google</span>
              </button>
              
              <button 
                type="button"
                onClick={() => handleSocialLogin('Facebook')}
                className="flex items-center justify-center gap-2 p-3 border border-[#e7e7e7] rounded-md hover:bg-[#f7f7f7] transition-all disabled:opacity-50"
                disabled={isSubmitting}
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