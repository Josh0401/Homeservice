import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaCheckCircle, FaCalendarAlt, FaClock, FaUser, FaMapMarkerAlt, FaPhone, FaCreditCard, FaFileInvoiceDollar } from 'react-icons/fa'
import { MdEmail, MdHome } from 'react-icons/md'

const BookingSuccess = () => {
  const location = useLocation()
  const bookingData = location.state?.bookingData || {}
  const provider = location.state?.provider || {}
  
  // Generate random confirmation number
  const confirmationNumber = React.useMemo(() => {
    return 'BK' + Math.floor(100000 + Math.random() * 900000)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
            <FaCheckCircle className="text-5xl text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-textColor mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600 text-lg">
            Your appointment has been successfully scheduled.
          </p>
          <div className="mt-4 bg-blue-50 py-2 px-4 rounded-md inline-block">
            <p className="font-semibold text-blueColor">Confirmation #: {confirmationNumber}</p>
          </div>
        </div>
        
        {/* Booking Summary */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Appointment Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Provider Info */}
            <div className="flex items-start">
              <div className="bg-gray-100 p-3 rounded-full mr-4">
                <FaUser className="text-xl text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Service Provider</h3>
                <p className="text-gray-800">{provider.title || 'Provider Name'}</p>
                <p className="text-gray-600 text-sm">{provider.profession || 'Service Professional'}</p>
              </div>
            </div>
            
            {/* Date */}
            <div className="flex items-start">
              <div className="bg-gray-100 p-3 rounded-full mr-4">
                <FaCalendarAlt className="text-xl text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Date</h3>
                <p className="text-gray-800">
                  {bookingData.date ? new Date(bookingData.date).toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Date not specified'}
                </p>
              </div>
            </div>
            
            {/* Time */}
            <div className="flex items-start">
              <div className="bg-gray-100 p-3 rounded-full mr-4">
                <FaClock className="text-xl text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Time</h3>
                <p className="text-gray-800">{bookingData.time || 'Time not specified'}</p>
              </div>
            </div>
            
            {/* Service Type */}
            <div className="flex items-start">
              <div className="bg-gray-100 p-3 rounded-full mr-4">
                <MdHome className="text-xl text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Service</h3>
                <p className="text-gray-800">{bookingData.serviceType || 'Service not specified'}</p>
                {bookingData.customServiceDescription && (
                  <p className="text-gray-600 text-sm mt-1">{bookingData.customServiceDescription}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Contact Details */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="flex items-start">
              <div className="bg-gray-100 p-3 rounded-full mr-4">
                <FaUser className="text-xl text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Client Name</h3>
                <p className="text-gray-800">
                  {(bookingData.firstName && bookingData.lastName) 
                    ? `${bookingData.firstName} ${bookingData.lastName}`
                    : 'Name not provided'}
                </p>
              </div>
            </div>
            
            {/* Email */}
            <div className="flex items-start">
              <div className="bg-gray-100 p-3 rounded-full mr-4">
                <MdEmail className="text-xl text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Email</h3>
                <p className="text-gray-800">{bookingData.email || 'Email not provided'}</p>
              </div>
            </div>
            
            {/* Phone */}
            <div className="flex items-start">
              <div className="bg-gray-100 p-3 rounded-full mr-4">
                <FaPhone className="text-xl text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Phone</h3>
                <p className="text-gray-800">{bookingData.phone || 'Phone not provided'}</p>
              </div>
            </div>
            
            {/* Address */}
            <div className="flex items-start">
              <div className="bg-gray-100 p-3 rounded-full mr-4">
                <FaMapMarkerAlt className="text-xl text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Service Address</h3>
                {bookingData.address ? (
                  <>
                    <p className="text-gray-800">{bookingData.address}</p>
                    <p className="text-gray-600 text-sm">{bookingData.city}, {bookingData.zipCode}</p>
                  </>
                ) : (
                  <p className="text-gray-800">Address not provided</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Payment Details */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Payment Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Payment Method */}
            <div className="flex items-start">
              <div className="bg-gray-100 p-3 rounded-full mr-4">
                <FaCreditCard className="text-xl text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Payment Method</h3>
                <p className="text-gray-800">
                  {bookingData.paymentMethod === 'creditCard'
                    ? `Credit Card (ending in ${bookingData.cardNumber?.slice(-4) || 'XXXX'})`
                    : bookingData.paymentMethod === 'paypal'
                      ? 'PayPal'
                      : 'Payment method not specified'
                  }
                </p>
              </div>
            </div>
            
            {/* Order Total */}
            <div className="flex items-start">
              <div className="bg-gray-100 p-3 rounded-full mr-4">
                <FaFileInvoiceDollar className="text-xl text-gray-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Payment Amount</h3>
                <p className="text-gray-800">
                  ${provider.price ? ((provider.price * 2) + 10).toFixed(2) : '0.00'}
                </p>
                <p className="text-gray-600 text-sm">
                  (Service: ${provider.price ? (provider.price * 2).toFixed(2) : '0.00'}, Fee: $10.00)
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Next Steps */}
        <div className="bg-blue-50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold mb-3 text-blueColor">What's Next?</h2>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-blueColor mr-2">•</span>
              <span>A confirmation email has been sent to your email address.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blueColor mr-2">•</span>
              <span>Your service provider will contact you 24 hours before the appointment.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blueColor mr-2">•</span>
              <span>You can reschedule or cancel your appointment up to 24 hours before the scheduled time.</span>
            </li>
          </ul>
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/" className="bg-blueColor text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 text-center">
            Return to Home
          </Link>
          <button 
            onClick={() => window.print()}
            className="bg-white text-blueColor border-2 border-blueColor py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 text-center"
          >
            Print Confirmation
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookingSuccess