import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaMoneyBillWave, 
  FaChartLine, 
  FaClipboardList,
  FaUserCircle,
  FaBell,
  FaCog,
  FaSpinner,
  FaHistory,
  FaExclamationTriangle,
  FaTimes
} from 'react-icons/fa';

const ProviderDashboard = () => {
  const navigate = useNavigate();

  // User state
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    businessName: '',
    rating: 0,
    isVerified: false,
    userType: ''
  });
  const [loading, setLoading] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [updatingBooking, setUpdatingBooking] = useState(null); // Track which booking is being updated
  const [error, setError] = useState('');

  // Booking data states
  const [bookingRequests, setBookingRequests] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [bookingStats, setBookingStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalEarnings: 0,
    currentMonthEarnings: 0,
    lastMonthEarnings: 0,
    pendingEarnings: 0,
    averageEarningsPerJob: 0,
    averageRating: 0,
    responseRate: 0,
    completionRate: 0
  });

  const [earningsSummary, setEarningsSummary] = useState({
    currentMonth: 0,
    lastMonth: 0,
    pending: 0,
    average: 0
  });

  const [performanceMetrics, setPerformanceMetrics] = useState({
    rating: 4.8,
    completedJobs: 0,
    responseRate: 94,
    completionRate: 98
  });

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

  // Fetch incoming booking requests
  const fetchIncomingRequests = async () => {
    try {
      setLoadingRequests(true);
      console.log('Fetching incoming booking requests...');
      
      const response = await apiRequest('/bookings/incoming-requests');
      console.log('Incoming requests response:', response);
      
      if (response.success) {
        // Filter out already accepted/declined bookings - only show truly pending ones
        const pendingRequests = response.requests.filter(booking => {
          const status = booking.status?.toLowerCase();
          // Only show bookings that are truly pending/new/submitted
          return status === 'pending' || status === 'new' || status === 'submitted';
        });

        // Transform API data to match component structure
        const transformedRequests = pendingRequests.map(booking => ({
          id: booking.id || booking._id,
          customer: booking.customer?.fullName || 'Unknown Customer',
          service: booking.service?.title || booking.title || 'Service Request',
          date: booking.preferredDate,
          time: booking.preferredTime,
          location: booking.location?.address ? 
            `${booking.location.address.street}, ${booking.location.address.city}, ${booking.location.address.state} ${booking.location.address.zipCode}` :
            'Location not specified',
          status: booking.status || 'pending',
          description: booking.description,
          customerEmail: booking.customer?.email,
          customerPhone: booking.customer?.phone,
          price: booking.pricing?.estimatedCost || booking.estimatedCost,
          referenceNumber: booking.referenceNumber,
          urgency: booking.urgency,
          estimatedDuration: booking.estimatedDuration,
          originalBooking: booking // Store original data for actions
        }));
        
        setBookingRequests(transformedRequests);
        console.log('Filtered pending requests:', transformedRequests);
        console.log('Total requests from API:', response.requests.length);
        console.log('Filtered pending requests:', transformedRequests.length);
      } else {
        console.error('Failed to fetch incoming requests:', response.message);
        setBookingRequests([]);
      }
    } catch (error) {
      console.error('Error fetching incoming requests:', error);
      setBookingRequests([]);
    } finally {
      setLoadingRequests(false);
    }
  };

  // Fetch pending bookings count
  const fetchPendingCount = async () => {
    try {
      const response = await apiRequest('/bookings/pending-count');
      if (response.success) {
        setPendingCount(response.count || 0);
      } else {
        // Fallback: count only truly pending bookings from incoming requests
        const requestsResponse = await apiRequest('/bookings/incoming-requests');
        if (requestsResponse.success) {
          const pendingOnly = requestsResponse.requests.filter(booking => {
            const status = booking.status?.toLowerCase();
            return status === 'pending' || status === 'new' || status === 'submitted';
          });
          setPendingCount(pendingOnly.length);
        } else {
          setPendingCount(0);
        }
      }
    } catch (error) {
      console.error('Error fetching pending count:', error);
      // Try to get count from incoming requests as fallback
      try {
        const requestsResponse = await apiRequest('/bookings/incoming-requests');
        if (requestsResponse.success) {
          const pendingOnly = requestsResponse.requests.filter(booking => {
            const status = booking.status?.toLowerCase();
            return status === 'pending' || status === 'new' || status === 'submitted';
          });
          setPendingCount(pendingOnly.length);
        }
      } catch (fallbackError) {
        setPendingCount(0);
      }
    }
  };

  // Fetch booking stats
  const fetchBookingStats = async () => {
    try {
      setLoadingStats(true);
      console.log('Fetching booking stats...');
      
      const response = await apiRequest('/bookings/stats');
      console.log('Booking stats response:', response);
      
      if (response.success) {
        const stats = response.stats;
        const updatedBookingStats = {
          totalBookings: stats.totalBookings || 0,
          completedBookings: stats.completedBookings || 0,
          cancelledBookings: stats.cancelledBookings || 0,
          totalEarnings: stats.totalEarnings || 0,
          currentMonthEarnings: stats.currentMonthEarnings || 0,
          lastMonthEarnings: stats.lastMonthEarnings || 0,
          pendingEarnings: stats.pendingEarnings || 0,
          averageEarningsPerJob: stats.averageEarningsPerJob || 0,
          averageRating: stats.averageRating || 0,
          responseRate: stats.responseRate || 0,
          completionRate: stats.completionRate || 0
        };
        
        setBookingStats(updatedBookingStats);

        // Update earnings summary
        setEarningsSummary({
          currentMonth: updatedBookingStats.currentMonthEarnings,
          lastMonth: updatedBookingStats.lastMonthEarnings,
          pending: updatedBookingStats.pendingEarnings,
          average: updatedBookingStats.averageEarningsPerJob
        });

        // Update performance metrics
        setPerformanceMetrics(prev => ({
          ...prev,
          rating: updatedBookingStats.averageRating || prev.rating,
          completedJobs: updatedBookingStats.completedBookings,
          responseRate: updatedBookingStats.responseRate || prev.responseRate,
          completionRate: updatedBookingStats.completionRate || prev.completionRate
        }));

      } else {
        console.error('Failed to fetch booking stats:', response.message);
      }
    } catch (error) {
      console.error('Error fetching booking stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Fetching user profile for dashboard...');
      
      const response = await apiRequest('/auth/me');
      console.log('Dashboard profile response:', response);
      
      if (response.success) {
        const user = response.user;
        console.log('User data for dashboard:', user);
        
        // Check if user is professional
        if (user.userType !== 'professional') {
          throw new Error('Access denied. This dashboard is only for professional accounts.');
        }

        // Map user data
        const mappedUserData = {
          fullName: user.fullName || '',
          email: user.email || '',
          businessName: user.businessName || user.professional?.businessName || '',
          rating: user.rating || 0,
          isVerified: user.isVerified || false,
          userType: user.userType || '',
          services: user.services || user.professional?.services || [],
          hourlyRate: user.hourlyRate || user.professional?.hourlyRate || 0
        };

        console.log('Mapped user data for dashboard:', mappedUserData);
        setUserData(mappedUserData);

        // Update performance metrics with real data
        setPerformanceMetrics(prev => ({
          ...prev,
          rating: mappedUserData.rating
        }));

      } else {
        throw new Error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Fetch user profile error:', error);
      setError(error.message || 'Failed to fetch user profile');
      
      // If it's an authentication error, redirect to login
      if (error.message.includes('authentication') || error.message.includes('token')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch confirmed bookings (upcoming schedule)
  const fetchUpcomingBookings = async () => {
    try {
      console.log('Fetching upcoming bookings...');
      
      // Fetch from the same endpoint but filter for accepted/confirmed bookings
      const response = await apiRequest('/bookings/incoming-requests');
      
      if (response.success) {
        // Filter for accepted/confirmed bookings only
        const confirmedBookings = response.requests
          .filter(booking => {
            const status = booking.status?.toLowerCase();
            // Show bookings that have been accepted/confirmed
            return status === 'accepted' || status === 'confirmed' || status === 'approved' || status === 'active';
          })
          .map(booking => ({
            id: booking.id || booking._id,
            customer: booking.customer?.fullName || 'Unknown Customer',
            service: booking.service?.title || booking.title || 'Service Request',
            date: booking.preferredDate,
            time: booking.preferredTime,
            location: booking.location?.address ? 
              `${booking.location.address.street}, ${booking.location.address.city}, ${booking.location.address.state}` :
              'Location not specified',
            status: booking.status,
            referenceNumber: booking.referenceNumber
          }));
        
        setUpcomingBookings(confirmedBookings);
        console.log('Upcoming confirmed bookings:', confirmedBookings);
      }
    } catch (error) {
      console.error('Error fetching upcoming bookings:', error);
      // Keep existing upcoming bookings if API fails - don't show error to user
      // This is secondary data, so we handle it gracefully
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const initializeDashboard = async () => {
      // Always try to fetch user profile first
      await fetchUserProfile();
      
      // Then fetch other data regardless of profile success (for better UX)
      await Promise.all([
        fetchIncomingRequests(),
        fetchPendingCount(),
        fetchBookingStats(),
        fetchUpcomingBookings()
      ]);
    };

    initializeDashboard();
  }, []);

  // Auto-refresh data every 5 minutes
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Only refresh if not in error state
      if (!error) {
        refreshDashboardData();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(intervalId);
  }, [error]);

  // Debug function to test status values (remove this in production)
  const debugStatusValues = async (bookingId) => {
    console.log('=== DEBUGGING STATUS VALUES ===');
    const statusesToTest = [
      'accepted', 'confirmed', 'approved', 'active',
      'declined', 'rejected', 'cancelled', 'dismissed'
    ];
    
    for (const status of statusesToTest) {
      try {
        const response = await apiRequest(`/bookings/${bookingId}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status: status })
        });
        console.log(`✅ Status "${status}" works:`, response);
      } catch (error) {
        console.log(`❌ Status "${status}" failed:`, error.message);
      }
    }
  };

  // Refresh all data
  const refreshDashboardData = async () => {
    await Promise.all([
      fetchIncomingRequests(),
      fetchPendingCount(),
      fetchBookingStats(),
      fetchUpcomingBookings()
    ]);
  };

  // Handle booking acceptance
  const handleAcceptBooking = async (id) => {
    try {
      setUpdatingBooking(id);
      console.log('Accepting booking:', id);
      
      // Try different status values that might be accepted by your API
      const possibleAcceptStatuses = ['accepted', 'confirmed', 'approved'];
      let response = null;
      let successStatus = null;
      
      for (const status of possibleAcceptStatuses) {
        try {
          console.log(`Trying to set status to: ${status}`);
          response = await apiRequest(`/bookings/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status: status })
          });
          
          if (response.success) {
            successStatus = status;
            break;
          }
        } catch (statusError) {
          console.log(`Status "${status}" failed:`, statusError.message);
          // Continue to next status
        }
      }

      console.log('Accept booking response:', response);

      if (response && response.success) {
        // Remove from requests and add to upcoming
        const bookingToAccept = bookingRequests.find(request => request.id === id);
        if (bookingToAccept) {
          const updatedRequests = bookingRequests.filter(request => request.id !== id);
          const acceptedBooking = { ...bookingToAccept, status: successStatus };
          
          setUpcomingBookings([...upcomingBookings, acceptedBooking]);
          setBookingRequests(updatedRequests);
          
          // Update pending count
          setPendingCount(prev => Math.max(0, prev - 1));
          
          // Show success message
          alert(`Booking accepted successfully with status: ${successStatus}!`);
        }
        
        console.log('Booking accepted successfully with status:', successStatus);
      } else {
        throw new Error(response?.message || 'Failed to accept booking with any valid status');
      }
    } catch (error) {
      console.error('Error accepting booking:', error);
      alert(`Failed to accept booking: ${error.message}`);
    } finally {
      setUpdatingBooking(null);
    }
  };

  // Handle booking decline
  const handleDeclineBooking = async (id) => {
    try {
      setUpdatingBooking(id);
      console.log('Declining booking:', id);
      
      // Try different decline status values
      const possibleDeclineStatuses = ['declined', 'rejected', 'cancelled'];
      let response = null;
      let successStatus = null;
      
      for (const status of possibleDeclineStatuses) {
        try {
          console.log(`Trying to set status to: ${status}`);
          response = await apiRequest(`/bookings/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status: status })
          });
          
          if (response.success) {
            successStatus = status;
            break;
          }
        } catch (statusError) {
          console.log(`Status "${status}" failed:`, statusError.message);
          // Continue to next status
        }
      }

      console.log('Decline booking response:', response);

      if (response && response.success) {
        // Remove from requests
        const updatedRequests = bookingRequests.filter(request => request.id !== id);
        setBookingRequests(updatedRequests);
        
        // Update pending count
        setPendingCount(prev => Math.max(0, prev - 1));
        
        // Show success message
        alert(`Booking declined successfully with status: ${successStatus}!`);
        
        console.log('Booking declined successfully with status:', successStatus);
      } else {
        throw new Error(response?.message || 'Failed to decline booking with any valid status');
      }
    } catch (error) {
      console.error('Error declining booking:', error);
      alert(`Failed to decline booking: ${error.message}`);
    } finally {
      setUpdatingBooking(null);
    }
  };

  // Handle navigation to notifications page
  const handleNotificationClick = () => {
    navigate('/provider/notifications');
  };

  // Handle navigation to settings page
  const handleSettingsClick = () => {
    navigate('/provider/settings');
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <FaSpinner className="animate-spin text-4xl text-blueColor mb-4" />
        <span className="text-lg">Loading dashboard...</span>
      </div>
    );
  }

  // Error state - only show if critical profile fetch fails
  if (error && !userData.email) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen max-w-2xl mx-auto p-6">
        <div className="text-4xl text-red-500 mb-4">⚠️</div>
        <h2 className="text-xl font-bold mb-2">Dashboard Access Error</h2>
        <p className="text-red-500 mb-4 text-center">{error}</p>
        <div className="flex space-x-4">
          <button 
            onClick={fetchUserProfile}
            className="bg-blueColor text-white px-6 py-2 rounded hover:bg-opacity-90"
          >
            Retry
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-opacity-90"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-greyIsh-50 min-h-screen pb-8">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blueColor">Provider Dashboard</h1>
            {userData.businessName && (
              <p className="text-sm text-gray-600">{userData.businessName}</p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button 
                className="text-gray-600 hover:text-blueColor" 
                onClick={handleNotificationClick}
              >
                <FaBell size={20} />
                {pendingCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {pendingCount > 99 ? '99+' : pendingCount}
                  </span>
                )}
              </button>
            </div>
            <button 
              className="text-gray-600 hover:text-blueColor"
              onClick={handleSettingsClick}
            >
              <FaCog size={20} />
            </button>
            <Link to="/provider/profile" className="flex items-center text-gray-700 hover:text-blueColor">
              <FaUserCircle size={24} className="mr-2" />
              <div className="text-right">
                <span className="block font-medium">{userData.fullName || 'Provider'}</span>
                <div className="flex items-center space-x-2">
                  {userData.isVerified && (
                    <span className="text-xs text-green-600">✓ Verified</span>
                  )}
                  {userData.rating > 0 && (
                    <span className="text-xs text-gray-500">★ {userData.rating.toFixed(1)}</span>
                  )}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Error Alert for non-critical errors */}
      {error && userData.email && (
        <div className="container mx-auto px-4 pt-4">
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-4 mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <FaExclamationTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm">
                  Some data may not be up to date. {error}
                </p>
              </div>
              <div className="ml-auto pl-3">
                <div className="-mx-1.5 -my-1.5">
                  <button
                    onClick={() => setError('')}
                    className="inline-flex bg-yellow-50 rounded-md p-1.5 text-yellow-500 hover:bg-yellow-100"
                  >
                    <FaTimes className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 pt-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Rating</h3>
              <FaChartLine className="text-blueColor" size={20} />
            </div>
            <p className="text-3xl font-bold text-blueColor">
              {loadingStats ? '...' : (userData.rating || performanceMetrics.rating).toFixed(1)}/5
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Based on {performanceMetrics.completedJobs} reviews
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Earnings</h3>
              <FaMoneyBillWave className="text-blueColor" size={20} />
            </div>
            <p className="text-3xl font-bold text-blueColor">
              {loadingStats ? '...' : `$${earningsSummary.currentMonth.toLocaleString()}`}
            </p>
            <p className="text-sm text-gray-500 mt-2">This month</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Response Rate</h3>
              <FaClipboardList className="text-blueColor" size={20} />
            </div>
            <p className="text-3xl font-bold text-blueColor">
              {loadingStats ? '...' : `${performanceMetrics.responseRate}%`}
            </p>
            <p className="text-sm text-gray-500 mt-2">Last 30 days</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Completion Rate</h3>
              <FaCalendarAlt className="text-blueColor" size={20} />
            </div>
            <p className="text-3xl font-bold text-blueColor">
              {loadingStats ? '...' : `${performanceMetrics.completionRate}%`}
            </p>
            <p className="text-sm text-gray-500 mt-2">Last 30 days</p>
          </div>
        </div>

        {/* User Services Info */}
        {userData.services && userData.services.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Services</h2>
            <div className="flex flex-wrap gap-2">
              {userData.services.map((service, index) => (
                <span 
                  key={index} 
                  className="px-3 py-1 bg-blueColor text-white text-sm rounded-full capitalize"
                >
                  {service}
                </span>
              ))}
            </div>
            {userData.hourlyRate > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                Base rate: ${userData.hourlyRate}/hour
              </p>
            )}
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Requests */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <FaClipboardList className="mr-2 text-blueColor" />
                  Booking Requests
                  {pendingCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {pendingCount}
                    </span>
                  )}
                </h2>
                <button
                  onClick={fetchIncomingRequests}
                  disabled={loadingRequests}
                  className="text-sm text-blueColor hover:underline disabled:opacity-50"
                >
                  {loadingRequests ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
              
              {loadingRequests ? (
                <div className="text-center py-8">
                  <FaSpinner className="animate-spin text-2xl text-blueColor mb-2 mx-auto" />
                  <p className="text-gray-500">Loading booking requests...</p>
                </div>
              ) : bookingRequests.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Reference</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Customer</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Service</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Date/Time</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Location</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Price</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Urgency</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {bookingRequests.map(booking => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="font-mono text-sm text-blue-600">
                              {booking.referenceNumber}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-medium">{booking.customer}</div>
                              {booking.customerEmail && (
                                <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                              )}
                              {booking.customerPhone && (
                                <div className="text-sm text-gray-500">{booking.customerPhone}</div>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-medium">{booking.service}</div>
                              {booking.description && (
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {booking.description}
                                </div>
                              )}
                              {booking.estimatedDuration && (
                                <div className="text-xs text-gray-400 mt-1">
                                  Duration: {Math.round(booking.estimatedDuration / 60)} hours
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              {booking.date && (
                                <div>{new Date(booking.date).toLocaleDateString()}</div>
                              )}
                              {booking.time && (
                                <div className="text-sm text-gray-500">{booking.time}</div>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm max-w-xs truncate" title={booking.location}>
                              {booking.location}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            {booking.price ? (
                              <span className="font-medium">${booking.price}/hour</span>
                            ) : (
                              <span className="text-gray-400">TBD</span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              booking.urgency === 'high' ? 'bg-red-100 text-red-800' :
                              booking.urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {booking.urgency || 'Low'}
                            </span>
                          </td>
                          <td className="py-4 px-4 flex space-x-2">
                            <button 
                              onClick={() => handleAcceptBooking(booking.id)}
                              disabled={updatingBooking === booking.id}
                              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                              {updatingBooking === booking.id ? (
                                <>
                                  <FaSpinner className="animate-spin mr-1" size={12} />
                                  Accepting...
                                </>
                              ) : (
                                'Accept'
                              )}
                            </button>
                            <button 
                              onClick={() => handleDeclineBooking(booking.id)}
                              disabled={updatingBooking === booking.id}
                              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                              {updatingBooking === booking.id ? (
                                <>
                                  <FaSpinner className="animate-spin mr-1" size={12} />
                                  Declining...
                                </>
                              ) : (
                                'Decline'
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaClipboardList className="text-4xl text-gray-300 mb-4 mx-auto" />
                  <p>No pending booking requests at this time.</p>
                  <p className="text-sm mt-2">New requests will appear here when customers book your services.</p>
                </div>
              )}
            </div>
            
            {/* Schedule Overview */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <FaCalendarAlt className="mr-2 text-blueColor" />
                  Upcoming Schedule
                </h2>
                <Link 
                  to="/provider/availability" 
                  className="text-sm text-blueColor hover:underline"
                >
                  Manage Availability
                </Link>
              </div>
              
              {upcomingBookings.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Customer</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Service</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Date/Time</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Location</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {upcomingBookings.map(booking => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="py-4 px-4">{booking.customer}</td>
                          <td className="py-4 px-4">{booking.service}</td>
                          <td className="py-4 px-4">{new Date(booking.date).toLocaleDateString()} at {booking.time}</td>
                          <td className="py-4 px-4">{booking.location}</td>
                          <td className="py-4 px-4">
                            <Link 
                              to={`/provider/bookings/${booking.id}`}
                              className="text-blueColor hover:underline"
                            >
                              View Details
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No upcoming bookings scheduled.
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Earnings Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <FaMoneyBillWave className="mr-2 text-blueColor" />
                  Earnings
                </h2>
                <Link 
                  to="/provider/earnings" 
                  className="text-sm text-blueColor hover:underline"
                >
                  View All
                </Link>
              </div>
              
              {loadingStats ? (
                <div className="text-center py-4">
                  <FaSpinner className="animate-spin text-xl text-blueColor mb-2 mx-auto" />
                  <p className="text-sm text-gray-500">Loading earnings...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between border-b pb-3">
                    <span className="text-gray-600">Current Month</span>
                    <span className="font-medium">${earningsSummary.currentMonth.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b pb-3">
                    <span className="text-gray-600">Last Month</span>
                    <span className="font-medium">${earningsSummary.lastMonth.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b pb-3">
                    <span className="text-gray-600">Pending Payments</span>
                    <span className="font-medium">${earningsSummary.pending.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Per Job</span>
                    <span className="font-medium">${earningsSummary.average.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Performance Metrics */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaChartLine className="mr-2 text-blueColor" />
                Performance
              </h2>
              
              {loadingStats ? (
                <div className="text-center py-4">
                  <FaSpinner className="animate-spin text-xl text-blueColor mb-2 mx-auto" />
                  <p className="text-sm text-gray-500">Loading performance...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Customer Rating</span>
                      <span className="font-medium">{(userData.rating || performanceMetrics.rating).toFixed(1)}/5</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blueColor h-2 rounded-full" 
                        style={{ width: `${((userData.rating || performanceMetrics.rating) / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Response Rate</span>
                      <span className="font-medium">{performanceMetrics.responseRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blueColor h-2 rounded-full" 
                        style={{ width: `${performanceMetrics.responseRate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600">Completion Rate</span>
                      <span className="font-medium">{performanceMetrics.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blueColor h-2 rounded-full" 
                        style={{ width: `${performanceMetrics.completionRate}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="text-center mt-6">
                    <span className="text-sm text-gray-500">
                      Based on {performanceMetrics.completedJobs} completed jobs
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
              <ul className="space-y-2">
                <li>
                  <Link to="/provider/profile" className="text-blueColor hover:underline flex items-center">
                    <FaUserCircle className="mr-2" />
                    Manage Profile
                  </Link>
                </li>
                <li>
                  <Link to="/provider/availability" className="text-blueColor hover:underline flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    Set Availability
                  </Link>
                </li>
                <li>
                  <Link to="/provider/earnings" className="text-blueColor hover:underline flex items-center">
                    <FaMoneyBillWave className="mr-2" />
                    Payment Settings
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={refreshDashboardData} 
                    className="text-blueColor hover:underline flex items-center w-full text-left"
                    disabled={loadingRequests || loadingStats}
                  >
                    {(loadingRequests || loadingStats) ? (
                      <FaSpinner className="animate-spin mr-2" />
                    ) : (
                      <FaChartLine className="mr-2" />
                    )}
                    {(loadingRequests || loadingStats) ? 'Refreshing...' : 'Refresh Data'}
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaHistory className="mr-2 text-blueColor" />
                Recent Activity
              </h2>
              
              <div className="space-y-3">
                {bookingRequests.length > 0 && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{bookingRequests.length}</span> new booking requests
                  </div>
                )}
                
                {upcomingBookings.length > 0 && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{upcomingBookings.length}</span> upcoming appointments
                  </div>
                )}
                
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{bookingStats.completedBookings}</span> jobs completed this month
                </div>
                
                {earningsSummary.currentMonth > 0 && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">${earningsSummary.currentMonth.toLocaleString()}</span> earned this month
                  </div>
                )}
                
                {bookingStats.totalBookings === 0 && bookingRequests.length === 0 && (
                  <div className="text-sm text-gray-500 text-center py-4">
                    No recent activity. Your dashboard will update as you receive bookings.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Summary Section */}
        {!loadingStats && (
          <div className="mt-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Monthly Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blueColor mb-2">
                    {bookingStats.totalBookings}
                  </div>
                  <div className="text-gray-600">Total Bookings</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {bookingStats.completedBookings} completed
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    ${bookingStats.totalEarnings.toLocaleString()}
                  </div>
                  <div className="text-gray-600">Total Earnings</div>
                  <div className="text-sm text-gray-500 mt-1">
                    ${earningsSummary.pending.toLocaleString()} pending
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {(userData.rating || 0).toFixed(1)}
                  </div>
                  <div className="text-gray-600">Average Rating</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Based on {performanceMetrics.completedJobs} reviews
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDashboard;