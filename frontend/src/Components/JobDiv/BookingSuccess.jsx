import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FaCheckCircle, FaCalendarAlt, FaClock, FaUser, FaMapMarkerAlt, FaPhone, FaCreditCard, FaFileInvoiceDollar } from 'react-icons/fa'
import { MdEmail, MdHome } from 'react-icons/md'

const BookingSuccess = () => {
  const location = useLocation()
  const bookingData = location.state?.bookingData || {}
  const provider = location.state?.provider || {}
  const bookingResponse = location.state?.bookingResponse || location.state?.apiResponse || {}
  
  // Use the actual reference number from the booking response or generate fallback
  const confirmationNumber = React.useMemo(() => {
    console.log('BookingSuccess - Detailed Debug:');
    console.log('Full location.state:', JSON.stringify(location.state, null, 2));
    console.log('bookingResponse keys:', bookingResponse ? Object.keys(bookingResponse) : 'No bookingResponse');
    console.log('bookingResponse content:', JSON.stringify(bookingResponse, null, 2));
    console.log('bookingData keys:', bookingData ? Object.keys(bookingData) : 'No bookingData');
    console.log('bookingData content:', JSON.stringify(bookingData, null, 2));
    
    // Check multiple possible locations for the reference number
    const possibleReferences = [
      bookingResponse?.booking?.referenceNumber,
      bookingResponse?.referenceNumber,
      bookingResponse?.request?.referenceNumber,
      bookingResponse?.requests?.[0]?.referenceNumber,
      bookingData?.referenceNumber,
      location.state?.referenceNumber,
      // Check if the booking response has a different structure
      bookingResponse?.data?.referenceNumber,
      bookingResponse?.data?.booking?.referenceNumber,
      // Check for any field that might contain the reference
      bookingResponse?.id,
      bookingResponse?._id,
      bookingResponse?.booking?.id,
      bookingResponse?.booking?._id,
      // Check the actual response structure from your API
      bookingResponse?.booking?.booking?.referenceNumber,
      bookingResponse?.result?.referenceNumber
    ];
    
    console.log('All possible reference values:', possibleReferences);
    
    // Find the first valid reference number (should start with 'BK')
    const validReference = possibleReferences.find(ref => ref && typeof ref === 'string' && ref.includes('BK'));
    
    console.log('Found valid reference:', validReference);
    
    // If no valid reference found, try to find any ID that might be the reference
    if (!validReference) {
      const anyId = possibleReferences.find(ref => ref && typeof ref === 'string' && ref.length > 5);
      console.log('Fallback ID found:', anyId);
      
      if (anyId) {
        return anyId;
      }
    }
    
    // Return the valid reference or generate fallback only if none found
    return validReference || 'BK' + Math.floor(100000 + Math.random() * 900000)
  }, [bookingResponse, bookingData, location.state])

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
                <p className="text-gray-800">{provider.title || provider.fullName || 'Provider Name'}</p>
                <p className="text-gray-600 text-sm">{provider.profession || provider.businessName || 'Service Professional'}</p>
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
                <p className="text-gray-800">{bookingData.serviceType || bookingData.service || 'Service not specified'}</p>
                {bookingData.customServiceDescription && (
                  <p className="text-gray-600 text-sm mt-1">{bookingData.customServiceDescription}</p>
                )}
                {bookingData.description && (
                  <p className="text-gray-600 text-sm mt-1">{bookingData.description}</p>
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
                    : bookingData.fullName || 'Name not provided'}
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
                ) : bookingData.location ? (
                  <p className="text-gray-800">{bookingData.location}</p>
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
                      : bookingData.paymentMethod === 'cash'
                        ? 'Cash Payment'
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
                  ${bookingData.totalAmount || 
                    bookingData.estimatedCost || 
                    (provider.price ? ((provider.price * 2) + 10).toFixed(2) : '0.00')}
                </p>
                {(provider.price && !bookingData.totalAmount) && (
                  <p className="text-gray-600 text-sm">
                    (Service: ${(provider.price * 2).toFixed(2)}, Fee: $10.00)
                  </p>
                )}
                {bookingData.paymentStatus && (
                  <p className="text-sm text-green-600 mt-1">
                    Status: {bookingData.paymentStatus}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Additional Booking Info */}
        {(bookingData.urgency || bookingData.specialInstructions) && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b">Additional Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookingData.urgency && (
                <div className="flex items-start">
                  <div className="bg-gray-100 p-3 rounded-full mr-4">
                    <FaClock className="text-xl text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Priority</h3>
                    <p className={`text-gray-800 capitalize ${
                      bookingData.urgency === 'high' ? 'text-red-600 font-semibold' :
                      bookingData.urgency === 'medium' ? 'text-yellow-600 font-semibold' :
                      'text-green-600'
                    }`}>
                      {bookingData.urgency} Priority
                    </p>
                  </div>
                </div>
              )}
              
              {bookingData.specialInstructions && (
                <div className="flex items-start">
                  <div className="bg-gray-100 p-3 rounded-full mr-4">
                    <MdEmail className="text-xl text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Special Instructions</h3>
                    <p className="text-gray-800">{bookingData.specialInstructions}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
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
              <span>Your service provider will contact you within 24 hours to confirm the appointment.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blueColor mr-2">•</span>
              <span>You can track your booking status using the confirmation number above.</span>
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
          <Link to="/customer/bookings" className="bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 text-center">
            View My Bookings
          </Link>
          <button 
            onClick={() => window.print()}
            className="bg-white text-blueColor border-2 border-blueColor py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 text-center"
          >
            Print Confirmation
          </button>
        </div>
        
        {/* Support Info */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            Need help? Contact our support team at{' '}
            <a href="mailto:support@homeservice.com" className="text-blueColor hover:underline">
              support@homeservice.com
            </a>
            {' '}or call{' '}
            <a href="tel:+1234567890" className="text-blueColor hover:underline">
              (123) 456-7890
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default BookingSuccess