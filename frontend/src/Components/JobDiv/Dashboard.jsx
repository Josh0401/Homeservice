import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { userData } = useUser();
  const navigate = useNavigate();
  
  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    bookings: [],
    stats: {
      pending: 0,
      completed: 0,
      totalBookings: 0
    },
    recentBookings: [],
    recommendations: [],
    loading: true,
    error: null
  });

  // Fetch dashboard data
  const fetchDashboardData = async () => {
  const generateRecommendations = (bookings) => {
    const recommendations = [];
    
    // Get user's booking patterns
    const serviceTypes = bookings.map(b => b.serviceTitle.toLowerCase());
    const hasPlumbing = serviceTypes.some(s => s.includes('plumbing'));
    const hasCleaning = serviceTypes.some(s => s.includes('cleaning'));
    const hasElectrical = serviceTypes.some(s => s.includes('electrical'));
    const hasHVAC = serviceTypes.some(s => s.includes('hvac') || s.includes('heating') || s.includes('cooling'));
    
    // Seasonal recommendations
    const currentMonth = new Date().getMonth();
    const isSummer = currentMonth >= 5 && currentMonth <= 7; // June-August
    const isWinter = currentMonth >= 11 || currentMonth <= 1; // Dec-Feb
    const isSpring = currentMonth >= 2 && currentMonth <= 4; // Mar-May
    const isFall = currentMonth >= 8 && currentMonth <= 10; // Sep-Nov

    // Base recommendations always shown
    if (hasPlumbing) {
      recommendations.push({
        id: 'plumbing-maintenance',
        title: 'Plumbing Maintenance Check',
        description: 'Since you\'ve used plumbing services, consider a preventive maintenance check.',
        category: 'plumbing',
        reason: 'Based on your previous plumbing service',
        priority: 'high'
      });
    }

    if (isSummer) {
      recommendations.push({
        id: 'hvac-summer',
        title: 'AC Maintenance & Repair',
        description: 'Keep your home cool this summer with professional AC maintenance and repair services.',
        category: 'hvac',
        reason: 'Summer season recommendation',
        priority: 'high'
      });
    }

    if (isWinter) {
      recommendations.push({
        id: 'heating-winter',
        title: 'Heating System Service',
        description: 'Ensure your heating system is working efficiently during the cold months.',
        category: 'heating',
        reason: 'Winter season recommendation',
        priority: 'high'
      });
    }

    if (isSpring) {
      recommendations.push({
        id: 'spring-cleaning',
        title: 'Spring Deep Cleaning',
        description: 'Give your home a fresh start with professional deep cleaning services.',
        category: 'cleaning',
        reason: 'Spring season recommendation',
        priority: 'medium'
      });
    }

    if (isFall) {
      recommendations.push({
        id: 'gutter-cleaning',
        title: 'Gutter Cleaning & Maintenance',
        description: 'Prepare for winter by cleaning gutters and preventing water damage.',
        category: 'maintenance',
        reason: 'Fall season recommendation',
        priority: 'medium'
      });
    }

    // Add complementary services
    if (!hasCleaning) {
      recommendations.push({
        id: 'house-cleaning',
        title: 'Professional House Cleaning',
        description: 'Save time and maintain a spotless home with regular cleaning services.',
        category: 'cleaning',
        reason: 'Popular service recommendation',
        priority: 'medium'
      });
    }

    if (!hasElectrical) {
      recommendations.push({
        id: 'electrical-safety',
        title: 'Electrical Safety Inspection',
        description: 'Ensure your home\'s electrical system is safe and up to code.',
        category: 'electrical',
        reason: 'Safety recommendation',
        priority: 'medium'
      });
    }

    // Fallback recommendations if user has no bookings
    if (bookings.length === 0) {
      recommendations.push(
        {
          id: 'popular-cleaning',
          title: 'House Cleaning Services',
          description: 'Most popular service - professional cleaning for your home.',
          category: 'cleaning',
          reason: 'Most popular service',
          priority: 'high'
        },
        {
          id: 'popular-maintenance',
          title: 'Home Maintenance',
          description: 'Keep your home in perfect condition with regular maintenance.',
          category: 'maintenance',
          reason: 'Essential home service',
          priority: 'high'
        },
        {
          id: 'popular-plumbing',
          title: 'Plumbing Services',
          description: 'Professional plumbing services for all your needs.',
          category: 'plumbing',
          reason: 'Essential home service',
          priority: 'high'
        }
      );
    }

    // Sort by priority and return top 3
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return recommendations
      .sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
      .slice(0, 3);
  };
    try {
      setDashboardData(prev => ({ ...prev, loading: true, error: null }));

      // Fetch bookings from the same API
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
      console.log('Dashboard API Response:', data);
      
      // Handle the API response structure
      const applicationsArray = data.applications || data || [];
      
      // Transform bookings data
      const transformedBookings = applicationsArray.map(booking => ({
        id: booking._id || booking.id,
        serviceTitle: booking.service?.title || booking.title || 'Service',
        providerName: booking.professional?.fullName || booking.professional?.businessName || 'Provider',
        date: booking.preferredDate || booking.scheduledDate || booking.date,
        time: booking.preferredTime || '',
        status: booking.status || 'pending',
        price: booking.pricing?.estimatedCost || booking.estimatedCost || booking.price || 0,
        currency: booking.pricing?.currency || 'USD',
        referenceNumber: booking.referenceNumber || '',
        urgency: booking.urgency || '',
        paymentStatus: booking.paymentStatus || ''
      }));

      // Calculate statistics
      const stats = {
        pending: transformedBookings.filter(b => b.status === 'pending' || b.status === 'accepted').length,
        completed: transformedBookings.filter(b => b.status === 'completed' || b.status === 'finished').length,
        totalBookings: transformedBookings.length
      };

      // Get recent bookings (latest 5)
      const recentBookings = transformedBookings
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      // Generate smart recommendations
      const recommendations = generateRecommendations(transformedBookings);

      setDashboardData({
        bookings: transformedBookings,
        stats,
        recentBookings,
        recommendations,
        loading: false,
        error: null
      });

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setDashboardData(prev => ({
        ...prev,
        loading: false,
        error: err.message,
        // Set empty data on error
        bookings: [],
        stats: { pending: 0, completed: 0, totalBookings: 0 },
        recentBookings: [],
        recommendations: []
      }));
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    if (userData?.token || localStorage.getItem('token')) {
      fetchDashboardData();
    }
  }, [userData]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      accepted: 'bg-blue-100 text-blue-700',
      completed: 'bg-green-100 text-green-700',
      finished: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      rejected: 'bg-red-100 text-red-700'
    };
    
    return styles[status] || 'bg-gray-100 text-gray-700';
  };

  // Loading state
  if (dashboardData.loading) {
    return (
      <div className="w-full">
        <div className="pageHeader flex flex-col items-center justify-center py-10 bg-greyIsh">
          <h1 className="text-[32px] text-textColor font-bold mb-4">My Dashboard</h1>
          <p className="text-[16px] text-[#959595] max-w-[600px] text-center">
            Welcome back, {user?.name || 'User'}! Loading your dashboard...
          </p>
        </div>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blueColor"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="pageHeader flex flex-col items-center justify-center py-10 bg-greyIsh">
        <h1 className="text-[32px] text-textColor font-bold mb-4">My Dashboard</h1>
        <p className="text-[16px] text-[#959595] max-w-[600px] text-center">
          Welcome back, {user?.name || 'User'}! Manage your bookings, settings, and preferences here.
        </p>
      </div>

      <div className="py-12 px-4">
        <div className="max-w-[1200px] mx-auto">
          {/* Error State */}
          {dashboardData.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              <p className="font-medium">Error loading dashboard data</p>
              <p className="text-sm">{dashboardData.error}</p>
              <button
                onClick={fetchDashboardData}
                className="mt-2 text-sm bg-red-100 hover:bg-red-200 px-3 py-1 rounded"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Dashboard content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stats Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-[#e7e7e7]">
              <h2 className="text-xl font-bold mb-4 text-blueColor">Activity Summary</h2>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center pb-2 border-b border-[#e7e7e7]">
                  <span className="text-[#6f6f6f]">Pending Appointments</span>
                  <span className="font-bold">{dashboardData.stats.pending}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#e7e7e7]">
                  <span className="text-[#6f6f6f]">Completed Services</span>
                  <span className="font-bold">{dashboardData.stats.completed}</span>
                </div>
                <div className="flex justify-between items-center pb-2">
                  <span className="text-[#6f6f6f]">Total Bookings</span>
                  <span className="font-bold">{dashboardData.stats.totalBookings}</span>
                </div>
              </div>
              
              {/* Quick Action Button */}
              <div className="mt-4 pt-4 border-t border-[#e7e7e7]">
                <button
                  onClick={() => navigate('/booking')}
                  className="w-full bg-blueColor text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
                >
                  View All Bookings
                </button>
              </div>
            </div>

            {/* Recent Bookings Card */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-[#e7e7e7] md:col-span-2">
              <h2 className="text-xl font-bold mb-4 text-blueColor">Recent Bookings</h2>
              
              {dashboardData.recentBookings.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#e7e7e7]">
                          <th className="text-left pb-3 text-[#6f6f6f]">Service</th>
                          <th className="text-left pb-3 text-[#6f6f6f]">Provider</th>
                          <th className="text-left pb-3 text-[#6f6f6f]">Date</th>
                          <th className="text-left pb-3 text-[#6f6f6f]">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.recentBookings.map((booking, index) => (
                          <tr 
                            key={booking.id || index} 
                            className={`border-b border-[#e7e7e7] hover:bg-gray-50 cursor-pointer`}
                            onClick={() => navigate('/booking')}
                          >
                            <td className="py-3">{booking.serviceTitle}</td>
                            <td className="py-3">{booking.providerName}</td>
                            <td className="py-3">{formatDate(booking.date)}</td>
                            <td className="py-3">
                              <span className={`${getStatusBadge(booking.status)} px-2 py-1 rounded-full text-xs`}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => navigate('/booking')}
                      className="text-blueColor hover:underline text-sm"
                    >
                      View all bookings →
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#6f6f6f] mb-4">No bookings found</p>
                  <button
                    onClick={() => navigate('/jobs')}
                    className="bg-blueColor text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Book Your First Service
                  </button>
                </div>
              )}
            </div>

            {/* Dynamic Recommended Services */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-[#e7e7e7] md:col-span-3">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-blueColor">Recommended For You</h2>
                <span className="text-sm text-[#6f6f6f]">
                  {dashboardData.recommendations.length > 0 ? 'Personalized recommendations' : 'Popular services'}
                </span>
              </div>
              
              {dashboardData.recommendations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {dashboardData.recommendations.map((recommendation) => (
                    <div 
                      key={recommendation.id}
                      className="p-4 border border-[#e7e7e7] rounded-lg hover:shadow-md transition-all cursor-pointer group"
                      onClick={() => navigate(`/jobs?category=${recommendation.category}`)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-textColor group-hover:text-blueColor transition-colors">
                          {recommendation.title}
                        </h3>
                        {recommendation.priority === 'high' && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                            Recommended
                          </span>
                        )}
                      </div>
                      
                      <p className="text-[#6f6f6f] text-sm mb-3 line-clamp-2">
                        {recommendation.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blueColor bg-blue-50 px-2 py-1 rounded">
                          {recommendation.reason}
                        </span>
                        <button className="text-blueColor hover:underline text-sm font-medium">
                          View providers →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#6f6f6f] mb-4">Loading personalized recommendations...</p>
                  <div className="flex justify-center">
                    <div className="animate-pulse flex space-x-4">
                      <div className="rounded-lg bg-gray-200 h-32 w-64"></div>
                      <div className="rounded-lg bg-gray-200 h-32 w-64"></div>
                      <div className="rounded-lg bg-gray-200 h-32 w-64"></div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Browse All Services */}
              <div className="mt-6 pt-4 border-t border-[#e7e7e7]">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-[#6f6f6f]">
                    <span className="font-medium">Need something else?</span> Browse our complete service catalog
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate('/jobs')}
                      className="bg-blueColor text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                      Browse All Services
                    </button>
                    <button
                      onClick={() => {
                        // Refresh recommendations
                        const newRecommendations = generateRecommendations(dashboardData.bookings);
                        setDashboardData(prev => ({
                          ...prev,
                          recommendations: newRecommendations
                        }));
                      }}
                      className="border border-blueColor text-blueColor px-4 py-2 rounded hover:bg-blue-50 transition-colors"
                    >
                      Refresh
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;