import React, { useState } from 'react'
import { FaRegEnvelope, FaArrowLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const ForgotPassword = () => {
  // State for form data
  const [email, setEmail] = useState('')
  
  // State for form validation and submission
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  
  // Handle input change
  const handleChange = (e) => {
    setEmail(e.target.value)
    setError('')
  }
  
  // Validate email
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      return 'Email is required'
    } else if (!emailRegex.test(email)) {
      return 'Please enter a valid email address'
    }
    return ''
  }
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate email
    const emailError = validateEmail()
    if (emailError) {
      setError(emailError)
      return
    }
    
    // Set submitting state
    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      console.log('Password reset request for:', email)
      setIsSubmitting(false)
      setIsSubmitted(true)
      
      // In a real app, this would send a reset link to the user's email
    }, 1500)
  }

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="pageHeader flex flex-col items-center justify-center py-10 bg-greyIsh">
        <h1 className="text-[32px] text-textColor font-bold mb-4">Forgot Password</h1>
        <p className="text-[16px] text-[#959595] max-w-[600px] text-center">
          Enter your email address below and we'll send you a link to reset your password.
        </p>
      </div>

      <div className="py-16 px-4">
        <div className="max-w-[500px] mx-auto">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-[#e7e7e7] p-8">
              {/* Email Input */}
              <div className="mb-6">
                <label htmlFor="email" className="block text-textColor mb-2">Email Address</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-[#959595]">
                    <FaRegEnvelope />
                  </span>
                  <input 
                    type="email"
                    id="email"
                    value={email}
                    onChange={handleChange}
                    placeholder="Enter your registered email address"
                    className={`w-full p-3 pl-10 rounded-md border ${error ? 'border-red-500' : 'border-[#e7e7e7]'} focus:border-blueColor focus:outline-none`}
                  />
                </div>
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>
              
              {/* Submit Button */}
              <div className="mb-6">
                <button 
                  type="submit"
                  className="w-full bg-blueColor text-white py-3 rounded-md hover:bg-opacity-90 transition-all disabled:bg-opacity-70 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
              
              {/* Back to Login Link */}
              <div className="text-center">
                <Link to="/login" className="text-[#959595] hover:text-blueColor flex items-center justify-center gap-2">
                  <FaArrowLeft size={12} />
                  <span>Back to Login</span>
                </Link>
              </div>
            </form>
          ) : (
            /* Success Message */
            <div className="bg-white rounded-lg shadow-md border border-[#e7e7e7] p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 mx-auto rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-textColor mb-2">Check Your Email</h2>
                <p className="text-[#959595] mb-6">
                  We've sent a password reset link to <strong>{email}</strong>.
                  Please check your email and follow the instructions to reset your password.
                </p>
                <p className="text-[#959595] mb-6 text-sm">
                  If you don't see the email in your inbox, please check your spam folder.
                </p>
                <div className="mt-6">
                  <Link to="/login" className="text-blueColor hover:underline">
                    Return to Login
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword