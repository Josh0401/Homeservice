import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaMapMarkerAlt,
  FaClock,
  FaUser,
  FaTools,
  FaPhone,
  FaEnvelope,
  FaCheck,
  FaTimes,
  FaHistory,
  FaSpinner,
  FaExclamationTriangle,
  FaPlay
} from 'react-icons/fa';

const BookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  // Get token from localStorage
  const getToken = () => {
    const token = localStorage.getItem('token');
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

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  };
  
  // Fetch booking details
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        setError('');
        console.log('Fetching booking details for ID:', id);
        
        const response = await apiRequest(`/bookings/${id}`);
        console.log('Booking details response:', response);
        
        if (response.success && response.booking) {
          const bookingData = response.booking;
          
          // Transform API data to component structure
          const transformedBooking = {
            id: bookingData.id || bookingData._id,
            customer: {
              name: bookingData.customer?.fullName || 'Unknown Customer',
              phone: bookingData.customer?.phone || '',
              email: bookingData.customer?.email || '',
              address: bookingData.location?.address ? 
                `${bookingData.location.address.street}, ${bookingData.location.address.city}, ${bookingData.location.address.state} ${bookingData.location.address.zipCode}` :
                'Address not specified',
              profileImage: bookingData.customer?.profileImage || null
            },
            service: bookingData.service?.title || bookingData.title || 'Service Request',
            description: bookingData.description || 'No description provided',
            date: bookingData.preferredDate || bookingData.scheduledDate || bookingData.date,
            time: bookingData.preferredTime || bookingData.scheduledTime || bookingData.time,
            duration: Math.round((bookingData.estimatedDuration || 120) / 60), // Convert minutes to hours
            price: bookingData.pricing?.estimatedCost || bookingData.estimatedCost || 0,
            status: bookingData.status || 'pending',
            notes: bookingData.notes || bookingData.specialInstructions || '',
            referenceNumber: bookingData.referenceNumber,
            urgency: bookingData.urgency,
            paymentStatus: bookingData.paymentStatus,
            createdAt: bookingData.createdAt,
            updatedAt: bookingData.updatedAt,
            statusHistory: bookingData.statusHistory || []
          };
          
          console.log('Transformed booking data:', transformedBooking);
          setBooking(transformedBooking);
          
        } else {
          throw new Error('Booking not found or invalid response');
        }
      } catch (error) {
        console.error('Error fetching booking details:', error);
        setError(error.message || 'Failed to fetch booking details');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchBookingDetails();
    }
  }, [id]);

  // Enhanced status update with better error handling and user feedback
  const updateBookingStatus = async (newStatus, options = {}) => {
    try {
      setUpdating(true);
      setError(''); // Clear any previous errors
      
      console.log(`Updating booking ${id} status to:`, newStatus);
      
      // Validate status transition
      const validTransitions = {
        'pending': ['accepted', 'declined'],
        'accepted': ['completed', 'cancelled', 'in-progress'],
        'confirmed': ['completed', 'cancelled', 'in-progress'],
        'in-progress': ['completed', 'cancelled']
      };
      
      if (!validTransitions[booking.status]?.includes(newStatus)) {
        throw new Error(`Cannot change status from ${booking.status} to ${newStatus}`);
      }
      
      // Prepare request payload
      const payload = {
        status: newStatus,
        ...options.additionalData
      };
      
      // Add completion notes if marking as complete
      if (newStatus === 'completed' && options.completionNotes) {
        payload.completionNotes = options.completionNotes;
      }
      
      // Add cancellation reason if cancelling
      if (newStatus === 'cancelled' && options.cancellationReason) {
        payload.cancellationReason = options.cancellationReason;
      }
      
      const response = await apiRequest(`/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(payload)
      });

      if (response.success) {
        // Update local state with server response
        const updatedBooking = {
          ...booking,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          // Add any additional fields from server response
          ...(response.booking || {})
        };
        
        // Add to status history if not already there
        if (!updatedBooking.statusHistory) {
          updatedBooking.statusHistory = [];
        }
        updatedBooking.statusHistory.push({
          status: newStatus,
          timestamp: new Date().toISOString(),
          note: options.note || ''
        });
        
        setBooking(updatedBooking);
        
        // Show success message
        const successMessages = {
          'accepted': 'Booking accepted successfully!',
          'declined': 'Booking declined successfully!',
          'completed': 'Booking marked as completed!',
          'cancelled': 'Booking cancelled successfully!',
          'in-progress': 'Booking status updated to in-progress!'
        };
        
        alert(successMessages[newStatus] || `Booking ${newStatus} successfully!`);
        
        // Optional: Refresh data from server to ensure consistency
        if (options.refreshData) {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
        
      } else {
        throw new Error(response.message || 'Failed to update booking status');
      }
      
    } catch (error) {
      console.error('Error updating booking status:', error);
      setError(error.message);
      
      // Show user-friendly error messages
      const errorMessages = {
        'Network Error': 'Please check your internet connection and try again.',
        'Unauthorized': 'Your session has expired. Please login again.',
        'Forbidden': 'You do not have permission to perform this action.',
        'Not Found': 'Booking not found. It may have been deleted.',
        'Conflict': 'This booking has already been updated by someone else.'
      };
      
      const userMessage = errorMessages[error.message] || `Failed to update booking: ${error.message}`;
      alert(userMessage);
      
    } finally {
      setUpdating(false);
    }
  };

  // Enhanced completion handler with optional notes
  const handleCompleteBooking = async () => {
    const confirmed = window.confirm(
      'Mark this booking as completed?\n\nThis will finalize the service and process payment.'
    );
    
    if (confirmed) {
      // Optional: Ask for completion notes
      const completionNotes = prompt('Add any completion notes (optional):');
      
      await updateBookingStatus('completed', {
        completionNotes: completionNotes?.trim() || '',
        note: 'Service completed successfully',
        additionalData: {
          completedAt: new Date().toISOString()
        }
      });
    }
  };

  // Enhanced cancellation handler with reason
  const handleCancelBooking = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this booking?\n\nThis action cannot be undone.'
    );
    
    if (confirmed) {
      // Ask for cancellation reason
      const cancellationReason = prompt('Please provide a reason for cancellation:');
      
      if (cancellationReason?.trim()) {
        await updateBookingStatus('cancelled', {
          cancellationReason: cancellationReason.trim(),
          note: `Cancelled: ${cancellationReason.trim()}`,
          additionalData: {
            cancelledAt: new Date().toISOString()
          }
        });
      } else {
        alert('Cancellation reason is required.');
      }
    }
  };

  // Enhanced accept handler
  const handleAcceptBooking = async () => {
    const confirmed = window.confirm(
      'Accept this booking?\n\nYou will be committed to providing this service.'
    );
    
    if (confirmed) {
      await updateBookingStatus('accepted', {
        note: 'Booking accepted by service provider',
        additionalData: {
          acceptedAt: new Date().toISOString()
        }
      });
    }
  };

  // Enhanced decline handler with reason
  const handleDeclineBooking = async () => {
    const confirmed = window.confirm('Decline this booking?');
    
    if (confirmed) {
      const declineReason = prompt('Please provide a reason for declining (optional):');
      
      await updateBookingStatus('declined', {
        note: declineReason?.trim() ? `Declined: ${declineReason.trim()}` : 'Booking declined',
        additionalData: {
          declinedAt: new Date().toISOString(),
          declineReason: declineReason?.trim() || ''
        }
      });
    }
  };

  // Handler for starting work (in-progress)
  const handleStartWork = async () => {
    const confirmed = window.confirm('Start working on this booking?');
    
    if (confirmed) {
      await updateBookingStatus('in-progress', {
        note: 'Work started on booking',
        additionalData: {
          startedAt: new Date().toISOString()
        }
      });
    }
  };

  // Utility function to check if status update is allowed
  const canUpdateStatus = (currentStatus, targetStatus) => {
    const validTransitions = {
      'pending': ['accepted', 'declined'],
      'accepted': ['completed', 'cancelled', 'in-progress'],
      'confirmed': ['completed', 'cancelled', 'in-progress'],
      'in-progress': ['completed', 'cancelled']
    };
    
    return validTransitions[currentStatus]?.includes(targetStatus) || false;
  };

  // Function to get next available status options
  const getAvailableStatusOptions = (currentStatus) => {
    const transitions = {
      'pending': [
        { status: 'accepted', label: 'Accept', color: 'green', icon: 'FaCheck' },
        { status: 'declined', label: 'Decline', color: 'red', icon: 'FaTimes' }
      ],
      'accepted': [
        { status: 'in-progress', label: 'Start Work', color: 'blue', icon: 'FaPlay' },
        { status: 'completed', label: 'Complete', color: 'green', icon: 'FaCheck' },
        { status: 'cancelled', label: 'Cancel', color: 'red', icon: 'FaTimes' }
      ],
      'confirmed': [
        { status: 'in-progress', label: 'Start Work', color: 'blue', icon: 'FaPlay' },
        { status: 'completed', label: 'Complete', color: 'green', icon: 'FaCheck' },
        { status: 'cancelled', label: 'Cancel', color: 'red', icon: 'FaTimes' }
      ],
      'in-progress': [
        { status: 'completed', label: 'Complete', color: 'green', icon: 'FaCheck' },
        { status: 'cancelled', label: 'Cancel', color: 'red', icon: 'FaTimes' }
      ]
    };
    
    return transitions[currentStatus] || [];
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date not specified';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format timeline date
  const formatTimelineDate = (dateString) => {
    if (!dateString) return 'Unknown time';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-500';
      case 'accepted': 
      case 'confirmed': return 'bg-blue-500';
      case 'in-progress': return 'bg-purple-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': 
      case 'declined': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  // Get timeline icon color
  const getTimelineIconColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'bg-yellow-500';
      case 'accepted':
      case 'confirmed': return 'bg-blue-500';
      case 'in-progress': return 'bg-purple-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled':
      case 'declined': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-greyIsh-50">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blueColor mb-4 mx-auto" />
          <p className="text-lg text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-greyIsh-50">
        <div className="text-center max-w-md mx-auto p-6">
          <FaExclamationTriangle className="text-4xl text-red-500 mb-4 mx-auto" />
          <h2 className="text-xl font-bold mb-2">Failed to Load Booking</h2>
          <p className="text-red-500 mb-4">{error || 'Booking not found'}</p>
          <div className="space-x-4">
            <button 
              onClick={() => window.location.reload()}
              className="bg-blueColor text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Retry
            </button>
            <Link 
              to="/provider/dashboard" 
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 inline-block"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-greyIsh-50 min-h-screen pb-8">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link to="/provider/dashboard" className="text-gray-600 hover:text-blueColor mr-4">
            <FaArrowLeft size={20} />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-blueColor">Booking Details</h1>
            {booking.referenceNumber && (
              <p className="text-sm text-gray-600">Reference: {booking.referenceNumber}</p>
            )}
          </div>
          
          <div className="ml-auto flex space-x-2">
            {booking.status === 'pending' && (
              <>
                <button 
                  onClick={handleAcceptBooking}
                  disabled={updating}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center disabled:opacity-50"
                >
                  {updating ? <FaSpinner className="animate-spin mr-1" /> : <FaCheck className="mr-1" />}
                  Accept
                </button>
                
                <button 
                  onClick={handleDeclineBooking}
                  disabled={updating}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center disabled:opacity-50"
                >
                  {updating ? <FaSpinner className="animate-spin mr-1" /> : <FaTimes className="mr-1" />}
                  Decline
                </button>
              </>
            )}
            
            {(booking.status === 'accepted' || booking.status === 'confirmed') && (
              <>
                <button 
                  onClick={handleStartWork}
                  disabled={updating}
                  className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center disabled:opacity-50"
                >
                  {updating ? <FaSpinner className="animate-spin mr-1" /> : <FaPlay className="mr-1" />}
                  Start Work
                </button>
                
                <button 
                  onClick={handleCompleteBooking}
                  disabled={updating}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center disabled:opacity-50"
                >
                  {updating ? <FaSpinner className="animate-spin mr-1" /> : <FaCheck className="mr-1" />}
                  Mark Complete
                </button>
                
                <button 
                  onClick={handleCancelBooking}
                  disabled={updating}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center disabled:opacity-50"
                >
                  {updating ? <FaSpinner className="animate-spin mr-1" /> : <FaTimes className="mr-1" />}
                  Cancel
                </button>
              </>
            )}

            {booking.status === 'in-progress' && (
              <>
                <button 
                  onClick={handleCompleteBooking}
                  disabled={updating}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center disabled:opacity-50"
                >
                  {updating ? <FaSpinner className="animate-spin mr-1" /> : <FaCheck className="mr-1" />}
                  Mark Complete
                </button>
                
                <button 
                  onClick={handleCancelBooking}
                  disabled={updating}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center disabled:opacity-50"
                >
                  {updating ? <FaSpinner className="animate-spin mr-1" /> : <FaTimes className="mr-1" />}
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold">{booking.service}</h2>
                <div className="flex flex-col items-end">
                  <div className={`px-3 py-1 rounded-full text-sm text-white ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </div>
                  {booking.urgency && (
                    <span className={`mt-2 px-2 py-1 rounded text-xs ${
                      booking.urgency === 'high' ? 'bg-red-100 text-red-800' :
                      booking.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {booking.urgency} priority
                    </span>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-start mb-4">
                    <FaCalendarAlt className="text-blueColor mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium">Date & Time</h3>
                      <p className="text-gray-600">{formatDate(booking.date)}</p>
                      <p className="text-gray-600">{booking.time} ({booking.duration} hours)</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start mb-4">
                    <FaMapMarkerAlt className="text-blueColor mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium">Location</h3>
                      <p className="text-gray-600">{booking.customer.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FaTools className="text-blueColor mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium">Service Details</h3>
                      <p className="text-gray-600">{booking.description}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-start mb-4">
                    <FaUser className="text-blueColor mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium">Customer</h3>
                      <p className="text-gray-600">{booking.customer.name}</p>
                      <div className="flex items-center mt-2">
                        {booking.customer.phone && (
                          <a href={`tel:${booking.customer.phone}`} className="text-blueColor hover:underline flex items-center mr-4">
                            <FaPhone className="mr-1" size={14} /> Call
                          </a>
                        )}
                        {booking.customer.email && (
                          <a href={`mailto:${booking.customer.email}`} className="text-blueColor hover:underline flex items-center">
                            <FaEnvelope className="mr-1" size={14} /> Email
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start mb-4">
                    <FaClock className="text-blueColor mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium">Notes</h3>
                      <p className="text-gray-600">{booking.notes || 'No additional notes'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FaClock className="text-blueColor mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium">Payment</h3>
                      <p className="text-gray-600 font-medium">
                        {booking.price ? `$${booking.price}` : 'Price TBD'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Status: {booking.paymentStatus || 'Pending'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {booking.status === 'completed' ? 'Payment completed' : 'Payment will be processed after service completion'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Activity Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-medium text-gray-700 mb-4 flex items-center">
                <FaHistory className="mr-2 text-blueColor" /> Booking Timeline
              </h3>
              
              <div className="border-l-2 border-gray-200 ml-3 pl-6 space-y-6">
                {/* Created */}
                <div className="relative">
                  <div className="absolute -left-10 top-0 bg-blue-500 rounded-full w-4 h-4 border-2 border-white"></div>
                  <p className="text-sm text-gray-600">Booking created</p>
                  <p className="text-xs text-gray-500">{formatTimelineDate(booking.createdAt)}</p>
                </div>
                
                {/* Status updates from timeline */}
                {booking.statusHistory && booking.statusHistory.map((event, index) => (
                  <div key={index} className="relative">
                    <div className={`absolute -left-10 top-0 ${getTimelineIconColor(event.status)} rounded-full w-4 h-4 border-2 border-white`}></div>
                    <p className="text-sm text-gray-600 capitalize">Booking {event.status}</p>
                    <p className="text-xs text-gray-500">{formatTimelineDate(event.timestamp)}</p>
                    {event.note && (
                      <p className="text-xs text-gray-400 mt-1">{event.note}</p>
                    )}
                  </div>
                ))}
                
                {/* Current status if different from timeline */}
                {booking.status !== 'pending' && (
                  <div className="relative">
                    <div className={`absolute -left-10 top-0 ${getTimelineIconColor(booking.status)} rounded-full w-4 h-4 border-2 border-white`}></div>
                    <p className="text-sm text-gray-600 capitalize">Booking {booking.status}</p>
                    <p className="text-xs text-gray-500">{formatTimelineDate(booking.updatedAt)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsPage;