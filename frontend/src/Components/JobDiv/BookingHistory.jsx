import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaHistory, FaClock, FaMapMarkerAlt, FaUser, FaTools, FaEllipsisV, FaStar, FaRegStar, FaSpinner } from 'react-icons/fa';
import { useUser } from '../../context/UserContext';
import { useLocation } from 'react-router-dom';

const BookingHistory = () => {
  const { userData } = useUser();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showNewBookingAlert, setShowNewBookingAlert] = useState(false);
  const [newBookingId, setNewBookingId] = useState(null);
  const [cancelling, setCancelling] = useState(null); // Track which booking is being cancelled

  // Fetch bookings from API
  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:5000/api/bookings/my-applications', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userData?.token || localStorage.getItem('token')}`
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      // Handle the actual API response structure
      const applicationsArray = data.applications || data || [];
      
      // Transform API data to match component structure
      const transformedBookings = applicationsArray.map(booking => ({
        id: booking._id || booking.id,
        serviceTitle: booking.service?.title || booking.title || 'Service',
        providerName: booking.professional?.fullName || booking.professional?.businessName || 'Provider',
        providerImage: booking.professional?.image || '/path/to/default.jpg',
        date: booking.preferredDate || booking.scheduledDate || booking.date,
        time: booking.preferredTime || '',
        address: `${booking.location?.address?.street || ''}, ${booking.location?.address?.city || ''}, ${booking.location?.address?.zipCode || ''}`.trim().replace(/^,|,$/, ''),
        status: booking.status || 'pending',
        price: booking.pricing?.estimatedCost || booking.estimatedCost || booking.price || 0,
        currency: booking.pricing?.currency || 'USD',
        duration: Math.floor((booking.estimatedDuration || 120) / 60), // Convert minutes to hours
        rating: booking.rating || null,
        review: booking.review || null,
        notes: booking.description || booking.notes || '',
        images: booking.images || [],
        cancelReason: booking.cancelReason || '',
        referenceNumber: booking.referenceNumber || '',
        urgency: booking.urgency || '',
        paymentStatus: booking.paymentStatus || '',
        // Keep original API data for reference
        originalData: booking
      }));

      setBookings(transformedBookings);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookings on component mount and when a new booking is added
  useEffect(() => {
    // Check if there's a new booking in location state
    const newBookingData = location.state?.newBooking;
    const providerData = location.state?.provider;
    
    if (newBookingData && providerData) {
      // Create a new booking entry from the form data
      const newBooking = {
        id: `temp-${Date.now()}`, // Temporary ID until API returns real ID
        serviceTitle: newBookingData.serviceType === 'custom' 
          ? 'Custom Service' 
          : newBookingData.serviceType,
        providerName: providerData.title,
        providerImage: providerData.image || '/path/to/default.jpg',
        date: `${newBookingData.date}T${newBookingData.time.replace(' ', '')}`,
        address: `${newBookingData.address}, ${newBookingData.city}, ${newBookingData.zipCode}`,
        status: 'scheduled',
        price: providerData.price * 2 + 10,
        duration: 2,
        rating: null,
        review: null,
        notes: newBookingData.serviceType === 'custom' 
          ? newBookingData.customServiceDescription 
          : `Standard ${providerData.profession} service`,
        images: []
      };
      
      // Add the new booking to the state temporarily
      setBookings(prevBookings => [newBooking, ...prevBookings]);
      setNewBookingId(newBooking.id);
      setShowNewBookingAlert(true);
      setActiveTab('upcoming');
      
      // Clear the location state after processing
      window.history.replaceState({}, document.title);
      
      // Auto-hide the alert and refresh from API
      const timer = setTimeout(() => {
        setShowNewBookingAlert(false);
        setNewBookingId(null);
        fetchBookings(); // Refresh to get real data from API
      }, 6000);
      
      return () => clearTimeout(timer);
    } else {
      // Fetch bookings from API
      fetchBookings();
    }
  }, [location.state, userData]);

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'upcoming') {
      return booking.status === 'pending' || booking.status === 'accepted' || booking.status === 'confirmed';
    } else if (activeTab === 'completed') {
      return booking.status === 'completed' || booking.status === 'finished';
    } else if (activeTab === 'cancelled') {
      return booking.status === 'cancelled' || booking.status === 'rejected' || booking.status === 'declined';
    } else if (activeTab === 'all') {
      return true;
    }
    return false;
  });

  // Handle booking cancellation - FIXED TO USE PATCH /status endpoint
  const handleCancelBooking = async () => {
    try {
      console.log(`Attempting to cancel booking: ${selectedBooking.id}`);
      setCancelling(selectedBooking.id);
      
      const token = userData?.token || localStorage.getItem('token') || 
                   localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('Authentication required to cancel booking');
      }

      // Use PATCH /status endpoint as specified (FIXED)
      const response = await fetch(`http://localhost:5000/api/bookings/${selectedBooking.id}/status`, {
        method: 'PATCH', // Changed from PUT to PATCH
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: 'cancelled',
          cancelledAt: new Date().toISOString(),
          cancelledBy: 'client',
          cancelReason: cancelReason // Include cancel reason if provided
        })
      });

      console.log(`Cancel response status: ${response.status}`);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
          console.error('Error response:', errorData);
        } catch (parseError) {
          console.warn('Could not parse error response as JSON');
        }
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('Booking cancelled successfully:', result);

      // Update local state
      const updatedBookings = bookings.map(booking => 
        booking.id === selectedBooking.id 
          ? {
              ...booking, 
              status: 'cancelled', 
              cancelReason,
              cancelledAt: new Date().toISOString()
            } 
          : booking
      );
      
      setBookings(updatedBookings);
      setCancelReason('');
      setShowCancelModal(false);
      setSelectedBooking(null);
      
      alert('Booking cancelled successfully');
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert(`Failed to cancel booking: ${err.message}`);
    } finally {
      setCancelling(null);
    }
  };

  // Handle submitting a review
  const handleSubmitReview = async () => {
    try {
      const token = userData?.token || localStorage.getItem('token') || 
                   localStorage.getItem('authToken') || localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('Authentication required to submit review');
      }

      const response = await fetch(`http://localhost:5000/api/bookings/${selectedBooking.id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rating: userRating,
          review: reviewText
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to submit review: ${response.status}`);
      }

      // Update local state
      const updatedBookings = bookings.map(booking => 
        booking.id === selectedBooking.id 
          ? {...booking, rating: userRating, review: reviewText} 
          : booking
      );
      
      setBookings(updatedBookings);
      setUserRating(0);
      setReviewText('');
      setShowReviewModal(false);
      setSelectedBooking(null);
      
      alert('Review submitted successfully');
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review. Please try again.');
    }
  };

  // Format date to readable string
  const formatDate = (dateString) => {
    const options = { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Decide on status badge color
  const getStatusColor = (status) => {
    switch(status) {
      case 'completed':
      case 'finished': return 'bg-green-500';
      case 'accepted':
      case 'confirmed': return 'bg-green-600';
      case 'pending': return 'bg-blue-500';
      case 'cancelled':
      case 'rejected':
      case 'declined': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Check if a booking date is today
  const isToday = (dateString) => {
    const bookingDate = new Date(dateString);
    const today = new Date();
    return bookingDate.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0);
  };

  // Star rating component
  const StarRating = ({ rating, setRating, editable = false }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star}
            onClick={() => editable && setRating(star)}
            className={`${editable ? 'cursor-pointer' : ''} text-xl mx-0.5`}
          >
            {star <= (rating || 0) ? 
              <FaStar className="text-yellow-400" /> : 
              <FaRegStar className="text-gray-300" />
            }
          </span>
        ))}
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-greyIsh-50 p-6 rounded-lg max-w-6xl mx-auto my-10">
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blueColor mx-auto mb-4"></div>
          <p className="text-greyIsh-500">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-greyIsh-50 p-6 rounded-lg max-w-6xl mx-auto my-10">
        <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-red-600 mb-2">Error Loading Bookings</h3>
          <p className="text-greyIsh-500 mb-4">{error}</p>
          <button
            className="px-4 py-2 bg-blueColor text-white rounded-md hover:bg-blue-600"
            onClick={fetchBookings}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-greyIsh-50 p-6 rounded-lg max-w-6xl mx-auto my-10">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      
      {/* New Booking Alert */}
      {showNewBookingAlert && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-2">✓</div>
            <div>
              <p className="font-medium">Booking successfully added to your history!</p>
              <p className="text-sm">Your new appointment has been scheduled.</p>
            </div>
          </div>
          <button 
            onClick={() => setShowNewBookingAlert(false)}
            className="text-green-500 hover:text-green-700"
          >
            ×
          </button>
        </div>
      )}
      
      {/* Tabs */}
      <div className="flex mb-6 border-b overflow-x-auto">
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'upcoming' ? 'text-blueColor border-b-2 border-blueColor' : 'text-greyIsh-500'}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'completed' ? 'text-blueColor border-b-2 border-blueColor' : 'text-greyIsh-500'}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'cancelled' ? 'text-blueColor border-b-2 border-blueColor' : 'text-greyIsh-500'}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled
        </button>
        <button 
          className={`py-2 px-4 font-medium ${activeTab === 'all' ? 'text-blueColor border-b-2 border-blueColor' : 'text-greyIsh-500'}`}
          onClick={() => setActiveTab('all')}
        >
          All Bookings
        </button>
      </div>
      
      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map(booking => {
            const isBeingCancelled = cancelling === booking.id;
            const canCancel = booking.status && !['cancelled', 'completed', 'rejected', 'declined', 'finished'].includes(booking.status.toLowerCase());
            
            return (
              <div 
                key={booking.id} 
                className={`bg-white rounded-lg shadow-sm p-4 border transition-all duration-300 ${
                  booking.id === newBookingId ? 'border-green-500 shadow-md animate-pulse' : ''
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-greyIsh-100 rounded-lg flex items-center justify-center text-blueColor">
                        <FaTools className="text-2xl" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{booking.serviceTitle}</h3>
                        <p className="text-greyIsh-500">{booking.providerName}</p>
                        <span className={`text-xs ${getStatusColor(booking.status)} text-white px-2 py-1 rounded-full inline-block mt-2`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        {isToday(booking.date) && (booking.status === 'pending' || booking.status === 'accepted') && (
                          <span className="ml-2 text-xs bg-orange-500 text-white px-2 py-1 rounded-full">
                            Today
                          </span>
                        )}
                        {booking.id === newBookingId && (
                          <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex flex-col items-end justify-between h-full">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-greyIsh-500 mb-1">
                        <FaCalendarAlt className="text-blueColor" />
                        <span>{formatDate(booking.date)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-greyIsh-500">
                        <FaMapMarkerAlt className="text-blueColor" />
                        <span>{booking.address}</span>
                      </div>
                      <div className="flex items-center gap-1 text-greyIsh-500 mt-1">
                        <FaClock className="text-blueColor" />
                        <span>{booking.duration} {booking.duration === 1 ? 'hour' : 'hours'}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex gap-2 items-center">
                      {booking.rating && (
                        <div className="flex items-center">
                          <StarRating rating={booking.rating} />
                        </div>
                      )}
                      <div className="relative">
                        <button 
                          className="p-2 hover:bg-greyIsh-100 rounded-full"
                          onClick={() => {
                            setSelectedBooking(booking);
                            setShowDetailsModal(true);
                          }}
                        >
                          <FaEllipsisV className="text-greyIsh-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="mt-4 flex gap-3 justify-end">
                  <button 
                    className="px-3 py-1.5 border border-blueColor text-blueColor rounded hover:bg-blue-50"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowDetailsModal(true);
                    }}
                  >
                    View Details
                  </button>
                  
                  {canCancel && (
                    <button 
                      className={`px-3 py-1.5 border rounded font-medium ${
                        isBeingCancelled
                          ? 'border-gray-300 text-gray-500 cursor-not-allowed bg-gray-100'
                          : 'border-red-500 text-red-500 hover:bg-red-50'
                      }`}
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowCancelModal(true);
                      }}
                      disabled={isBeingCancelled}
                    >
                      {isBeingCancelled ? (
                        <>
                          <FaSpinner className="inline mr-1 animate-spin" />
                          Cancelling...
                        </>
                      ) : (
                        'Cancel'
                      )}
                    </button>
                  )}
                  
                  {booking.status === 'completed' && !booking.rating && (
                    <button 
                      className="px-3 py-1.5 bg-blueColor text-white rounded hover:bg-blue-600"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowReviewModal(true);
                      }}
                    >
                      Leave Review
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="text-6xl text-greyIsh-300 flex justify-center mb-4">
            {activeTab === 'upcoming' ? <FaCalendarAlt /> : <FaHistory />}
          </div>
          <h3 className="text-xl font-semibold text-greyIsh-600 mb-2">
            No {activeTab} bookings found
          </h3>
          <p className="text-greyIsh-500">
            {activeTab === 'upcoming' 
              ? "You don't have any upcoming service bookings." 
              : activeTab === 'completed' 
                ? "You don't have any completed service bookings yet."
                : activeTab === 'cancelled' 
                  ? "You don't have any cancelled bookings."
                  : "You don't have any bookings yet."}
          </p>
          {activeTab !== 'all' && (
            <button
              className="mt-4 px-4 py-2 bg-blueColor text-white rounded-md hover:bg-blue-600"
              onClick={() => setActiveTab('all')}
            >
              View All Bookings
            </button>
          )}
        </div>
      )}
      
      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-2xl font-bold">{selectedBooking.serviceTitle}</h2>
                <button 
                  className="text-greyIsh-500 hover:text-greyIsh-700"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedBooking(null);
                  }}
                >
                  &times;
                </button>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-greyIsh-600">
                  <FaUser className="text-blueColor" />
                  <span><strong>Provider:</strong> {selectedBooking.providerName}</span>
                </div>
                
                <div className="flex items-center gap-3 text-greyIsh-600">
                  <FaCalendarAlt className="text-blueColor" />
                  <span><strong>Date & Time:</strong> {formatDate(selectedBooking.date)}</span>
                </div>
                
                <div className="flex items-center gap-3 text-greyIsh-600">
                  <FaMapMarkerAlt className="text-blueColor" />
                  <span><strong>Address:</strong> {selectedBooking.address}</span>
                </div>
                
                <div className="flex items-center gap-3 text-greyIsh-600">
                  <FaClock className="text-blueColor" />
                  <span><strong>Duration:</strong> {selectedBooking.duration} {selectedBooking.duration === 1 ? 'hour' : 'hours'}</span>
                </div>
                
                <div className="flex items-center gap-3 text-greyIsh-600">
                  <FaTools className="text-blueColor" />
                  <span>
                    <strong>Status:</strong> 
                    <span className={`ml-2 ${getStatusColor(selectedBooking.status)} text-white px-2 py-1 rounded-full text-xs`}>
                      {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                    </span>
                  </span>
                </div>
                
                <div className="flex items-center gap-3 text-greyIsh-600">
                  <span className="text-blueColor">$</span>
                  <span><strong>Price:</strong> ${selectedBooking.price.toFixed(2)}</span>
                </div>
                
                {selectedBooking.referenceNumber && (
                  <div className="flex items-center gap-3 text-greyIsh-600">
                    <span className="text-blueColor">#</span>
                    <span><strong>Reference:</strong> {selectedBooking.referenceNumber}</span>
                  </div>
                )}
                
                {selectedBooking.urgency && (
                  <div className="flex items-center gap-3 text-greyIsh-600">
                    <span className="text-blueColor">⚡</span>
                    <span><strong>Urgency:</strong> {selectedBooking.urgency.charAt(0).toUpperCase() + selectedBooking.urgency.slice(1)}</span>
                  </div>
                )}
                
                {selectedBooking.rating && (
                  <div className="flex items-center gap-3 text-greyIsh-600">
                    <FaStar className="text-blueColor" />
                    <div>
                      <strong>Your Rating:</strong>
                      <div className="mt-1">
                        <StarRating rating={selectedBooking.rating} />
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedBooking.review && (
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-semibold text-lg mb-2">Your Review</h3>
                    <p className="text-greyIsh-600 italic">"{selectedBooking.review}"</p>
                  </div>
                )}
                
                {selectedBooking.cancelReason && (
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-semibold text-lg mb-2">Cancellation Reason</h3>
                    <p className="text-greyIsh-600">{selectedBooking.cancelReason}</p>
                  </div>
                )}
                
                {selectedBooking.notes && (
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-semibold text-lg mb-2">Notes</h3>
                    <p className="text-greyIsh-600">{selectedBooking.notes}</p>
                  </div>
                )}
                
                {selectedBooking.images && selectedBooking.images.length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-semibold text-lg mb-2">Photos</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedBooking.images.map((image, index) => (
                        <div key={index} className="w-24 h-24 bg-greyIsh-200 rounded">
                          <img 
                            src={image} 
                            alt={`Booking photo ${index + 1}`}
                            className="w-full h-full object-cover rounded"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full flex items-center justify-center text-greyIsh-500" style={{display: 'none'}}>
                            Photo {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end gap-2">
                {(selectedBooking.status === 'pending' || selectedBooking.status === 'accepted') && (
                  <button 
                    className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50"
                    onClick={() => {
                      setShowDetailsModal(false);
                      setShowCancelModal(true);
                    }}
                  >
                    Cancel Booking
                  </button>
                )}
                
                {selectedBooking.status === 'completed' && !selectedBooking.rating && (
                  <button 
                    className="px-4 py-2 bg-blueColor text-white rounded hover:bg-blue-600"
                    onClick={() => {
                      setShowDetailsModal(false);
                      setShowReviewModal(true);
                    }}
                  >
                    Leave Review
                  </button>
                )}
                
                <button 
                  className="px-4 py-2 border text-greyIsh-600 rounded hover:bg-greyIsh-100"
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedBooking(null);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Cancel Booking Modal */}
      {showCancelModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Cancel Booking</h2>
              <p className="mb-4 text-greyIsh-600">
                Are you sure you want to cancel your {selectedBooking.serviceTitle} booking 
                with {selectedBooking.providerName} on {formatDate(selectedBooking.date)}?
              </p>
              
              <div className="mb-4">
                <label className="block text-greyIsh-600 mb-2">
                  Reason for cancellation (optional)
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full border rounded-md p-2 h-24"
                  placeholder="Please provide a reason for cancellation..."
                  disabled={cancelling === selectedBooking.id}
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-2">
                <button 
                  className="px-4 py-2 border text-greyIsh-600 rounded hover:bg-greyIsh-100"
                  onClick={() => {
                    setShowCancelModal(false);
                    setSelectedBooking(null);
                    setCancelReason('');
                  }}
                  disabled={cancelling === selectedBooking.id}
                >
                  Cancel
                </button>
                <button 
                  className={`px-4 py-2 rounded font-medium ${
                    cancelling === selectedBooking.id
                      ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                  onClick={handleCancelBooking}
                  disabled={cancelling === selectedBooking.id}
                >
                  {cancelling === selectedBooking.id ? (
                    <>
                      <FaSpinner className="inline mr-2 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    'Confirm Cancellation'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Review Modal */}
      {showReviewModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Leave a Review</h2>
              <p className="mb-4 text-greyIsh-600">
                Rate your experience with {selectedBooking.providerName}
              </p>
              
              <div className="mb-4">
                <label className="block text-greyIsh-600 mb-2">Rating</label>
                <StarRating 
                  rating={userRating} 
                  setRating={setUserRating} 
                  editable={true} 
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-greyIsh-600 mb-2">
                  Review (optional)
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full border rounded-md p-2 h-24"
                  placeholder="Share your experience..."
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-2">
                <button 
                  className="px-4 py-2 border text-greyIsh-600 rounded hover:bg-greyIsh-100"
                  onClick={() => {
                    setShowReviewModal(false);
                    setSelectedBooking(null);
                    setUserRating(0);
                    setReviewText('');
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="px-4 py-2 bg-blueColor text-white rounded hover:bg-blue-600"
                  onClick={handleSubmitReview}
                  disabled={userRating === 0}
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;