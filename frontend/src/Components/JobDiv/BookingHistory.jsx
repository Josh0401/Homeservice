import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaHistory, FaClock, FaMapMarkerAlt, FaUser, FaTools, FaEllipsisV, FaStar, FaRegStar } from 'react-icons/fa';
import { useUser } from '../../context/UserContext';
import { useLocation } from 'react-router-dom';

// Sample booking data - in a real app, this would come from your API
const sampleBookings = [
  {
    id: 1,
    serviceTitle: 'Plumbing Services',
    providerName: 'Liquid Accessments',
    providerImage: '/path/to/provider1.jpg',
    date: '2023-05-15T14:00:00',
    address: '123 Main St, Manchester',
    status: 'completed',
    price: 85.50,
    duration: 2,
    rating: 4,
    notes: 'Fixed kitchen sink and bathroom leak.',
    images: ['/path/to/image1.jpg', '/path/to/image2.jpg']
  },
  {
    id: 2,
    serviceTitle: 'House Painting',
    providerName: 'ColorWorks',
    providerImage: '/path/to/provider2.jpg',
    date: '2023-06-10T09:30:00',
    address: '456 Oak Ave, Manchester',
    status: 'completed',
    price: 350.00,
    duration: 8,
    rating: 5,
    notes: 'Painted living room and dining room. Very satisfied with the results!',
    images: ['/path/to/image3.jpg']
  },
  {
    id: 3,
    serviceTitle: 'Electrical Services',
    providerName: 'PowerTech',
    providerImage: '/path/to/provider3.jpg',
    date: '2023-12-05T11:00:00',
    address: '789 Pine St, Manchester',
    status: 'scheduled',
    price: 120.00,
    duration: 3,
    rating: null,
    notes: 'Need to install new lighting fixtures in kitchen and dining room.',
    images: []
  },
  {
    id: 4,
    serviceTitle: 'Lawn Care',
    providerName: 'Green Thumbs',
    providerImage: '/path/to/provider4.jpg',
    date: '2023-12-15T15:00:00',
    address: '123 Main St, Manchester',
    status: 'scheduled',
    price: 45.00,
    duration: 1.5,
    rating: null,
    notes: 'Regular lawn maintenance service.',
    images: []
  },
  {
    id: 5,
    serviceTitle: 'HVAC Services',
    providerName: 'Climate Control',
    providerImage: '/path/to/provider5.jpg',
    date: '2023-11-20T13:00:00',
    address: '321 Elm St, Manchester',
    status: 'cancelled',
    price: 95.00,
    duration: 2,
    rating: null,
    notes: 'Cancelled due to scheduling conflict.',
    images: []
  }
];

const BookingHistory = () => {
  const { userData } = useUser();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
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

  // Fetch bookings on component mount and when a new booking is added
  useEffect(() => {
    // Check if there's a new booking in location state
    const newBookingData = location.state?.newBooking;
    const providerData = location.state?.provider;
    
    if (newBookingData && providerData) {
      // Generate a unique ID for the new booking
      const newId = bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 1;
      
      // Create a new booking entry from the form data
      const newBooking = {
        id: newId,
        serviceTitle: newBookingData.serviceType === 'custom' 
          ? 'Custom Service' 
          : newBookingData.serviceType,
        providerName: providerData.title,
        providerImage: providerData.image || '/path/to/default.jpg',
        date: `${newBookingData.date}T${newBookingData.time.replace(' ', '')}`,
        address: `${newBookingData.address}, ${newBookingData.city}, ${newBookingData.zipCode}`,
        status: 'scheduled',
        price: providerData.price * 2 + 10, // Estimated from booking process
        duration: 2, // Default duration
        rating: null,
        notes: newBookingData.serviceType === 'custom' 
          ? newBookingData.customServiceDescription 
          : `Standard ${providerData.profession} service`,
        images: []
      };
      
      // Add the new booking to the state
      setBookings(prevBookings => [newBooking, ...prevBookings]);
      
      // Set the new booking ID to highlight it
      setNewBookingId(newId);
      setShowNewBookingAlert(true);
      
      // Set active tab to 'upcoming' to show the new booking
      setActiveTab('upcoming');
      
      // Clear the location state after processing
      window.history.replaceState({}, document.title);
      
      // Auto-hide the alert after 6 seconds
      const timer = setTimeout(() => {
        setShowNewBookingAlert(false);
        setNewBookingId(null);
      }, 6000);
      
      return () => clearTimeout(timer);
    } else {
      // In a real app, you would fetch from your API
      // For now, we'll use our sample data
      setBookings(sampleBookings);
    }
  }, [location.state]);

  // Filter bookings based on active tab
  const filteredBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    const today = new Date();
    
    if (activeTab === 'upcoming') {
      return booking.status === 'scheduled'; // Show all scheduled bookings regardless of date
    } else if (activeTab === 'completed') {
      return booking.status === 'completed';
    } else if (activeTab === 'cancelled') {
      return booking.status === 'cancelled';
    } else if (activeTab === 'all') {
      return true;
    }
    return false;
  });

  // Handle booking cancellation
  const handleCancelBooking = () => {
    // In a real app, you would send a cancellation request to your API
    const updatedBookings = bookings.map(booking => 
      booking.id === selectedBooking.id 
        ? {...booking, status: 'cancelled', cancelReason} 
        : booking
    );
    
    setBookings(updatedBookings);
    setCancelReason('');
    setShowCancelModal(false);
    setSelectedBooking(null);
    
    // Show success message
    alert('Booking cancelled successfully');
  };

  // Handle submitting a review
  const handleSubmitReview = () => {
    // In a real app, you would send the review to your API
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
    
    // Show success message
    alert('Review submitted successfully');
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
      case 'completed': return 'bg-green-500';
      case 'scheduled': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
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
          {filteredBookings.map(booking => (
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
                      {isToday(booking.date) && booking.status === 'scheduled' && (
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
                
                {booking.status === 'scheduled' && (
                  <button 
                    className="px-3 py-1.5 border border-red-500 text-red-500 rounded hover:bg-red-50"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowCancelModal(true);
                    }}
                  >
                    Cancel
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
          ))}
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
                  <span className="text-blueColor">£</span>
                  <span><strong>Price:</strong> £{selectedBooking.price.toFixed(2)}</span>
                </div>
                
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
                          {/* In a real app, you would display the actual image */}
                          <div className="w-full h-full flex items-center justify-center text-greyIsh-500">
                            Photo {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end gap-2">
                {selectedBooking.status === 'scheduled' && (
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
                >
                  No, Keep Booking
                </button>
                <button 
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  onClick={handleCancelBooking}
                >
                  Yes, Cancel Booking
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
                How was your {selectedBooking.serviceTitle} service from {selectedBooking.providerName}?
              </p>
              
              <div className="mb-4">
                <label className="block text-greyIsh-600 mb-2">
                  Your Rating
                </label>
                <div className="p-2">
                  <StarRating rating={userRating} setRating={setUserRating} editable={true} />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-greyIsh-600 mb-2">
                  Your Review (optional)
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  className="w-full border rounded-md p-2 h-24"
                  placeholder="Share your experience with this service..."
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