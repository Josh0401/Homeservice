import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaMoneyBillWave, 
  FaChartLine, 
  FaClipboardList,
  FaUserCircle,
  FaBell,
  FaCog
} from 'react-icons/fa';

const ProviderDashboard = () => {
  // Add useNavigate hook for navigation
  const navigate = useNavigate();

  // Sample data - in a real app, this would come from an API
  const [bookingRequests, setBookingRequests] = useState([
    { 
      id: 1, 
      customer: 'John Doe', 
      service: 'Pipe Installation',
      date: '2025-03-28',
      time: '10:00 AM',
      location: '123 Main St, Anytown',
      status: 'pending'
    },
    { 
      id: 2, 
      customer: 'Jane Smith', 
      service: 'Leak Repair',
      date: '2025-03-29',
      time: '2:30 PM',
      location: '456 Oak Ave, Somewhere',
      status: 'pending'
    }
  ]);

  const [upcomingBookings, setUpcomingBookings] = useState([
    { 
      id: 3, 
      customer: 'Bob Johnson', 
      service: 'Water Heater Services',
      date: '2025-03-26',
      time: '9:00 AM',
      location: '789 Pine Rd, Elsewhere',
      status: 'confirmed'
    },
    { 
      id: 4, 
      customer: 'Alice Williams', 
      service: 'Drain Cleaning',
      date: '2025-03-27',
      time: '1:00 PM',
      location: '321 Elm Blvd, Nowhere',
      status: 'confirmed'
    }
  ]);

  const [earningsSummary, setEarningsSummary] = useState({
    currentMonth: 2450,
    lastMonth: 770,
    pending: 325,
    average: 78
  });

  const [performanceMetrics, setPerformanceMetrics] = useState({
    rating: 4.8,
    completedJobs: 32,
    responseRate: 94,
    completionRate: 98
  });

  // Handle booking acceptance
  const handleAcceptBooking = (id) => {
    const updatedRequests = bookingRequests.filter(request => request.id !== id);
    const acceptedBooking = bookingRequests.find(request => request.id === id);
    
    if (acceptedBooking) {
      acceptedBooking.status = 'confirmed';
      setUpcomingBookings([...upcomingBookings, acceptedBooking]);
      setBookingRequests(updatedRequests);
    }
  };

  // Handle booking decline
  const handleDeclineBooking = (id) => {
    const updatedRequests = bookingRequests.filter(request => request.id !== id);
    setBookingRequests(updatedRequests);
  };

  // Handle navigation to notifications page
  const handleNotificationClick = () => {
    navigate('/provider/notifications');
  };

  // Handle navigation to settings page
  const handleSettingsClick = () => {
    navigate('/provider/settings');
  };

  return (
    <div className="bg-greyIsh-50 min-h-screen pb-8">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blueColor">Provider Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button 
              className="text-gray-600 hover:text-blueColor" 
              onClick={handleNotificationClick}
            >
              <FaBell size={20} />
            </button>
            <button 
              className="text-gray-600 hover:text-blueColor"
              onClick={handleSettingsClick}
            >
              <FaCog size={20} />
            </button>
            <Link to="/provider/profile" className="flex items-center text-gray-700 hover:text-blueColor">
              <FaUserCircle size={24} className="mr-2" />
              <span>John Smith</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pt-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Rating</h3>
              <FaChartLine className="text-blueColor" size={20} />
            </div>
            <p className="text-3xl font-bold text-blueColor">{performanceMetrics.rating}/5</p>
            <p className="text-sm text-gray-500 mt-2">Based on {performanceMetrics.completedJobs} reviews</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Earnings</h3>
              <FaMoneyBillWave className="text-blueColor" size={20} />
            </div>
            <p className="text-3xl font-bold text-blueColor">${earningsSummary.currentMonth}</p>
            <p className="text-sm text-gray-500 mt-2">This month</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Response Rate</h3>
              <FaClipboardList className="text-blueColor" size={20} />
            </div>
            <p className="text-3xl font-bold text-blueColor">{performanceMetrics.responseRate}%</p>
            <p className="text-sm text-gray-500 mt-2">Last 30 days</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Completion Rate</h3>
              <FaCalendarAlt className="text-blueColor" size={20} />
            </div>
            <p className="text-3xl font-bold text-blueColor">{performanceMetrics.completionRate}%</p>
            <p className="text-sm text-gray-500 mt-2">Last 30 days</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Requests */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaClipboardList className="mr-2 text-blueColor" />
                Booking Requests
              </h2>
              
              {bookingRequests.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Customer</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Service</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Date/Time</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Location</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {bookingRequests.map(booking => (
                        <tr key={booking.id} className="hover:bg-gray-50">
                          <td className="py-4 px-4">{booking.customer}</td>
                          <td className="py-4 px-4">{booking.service}</td>
                          <td className="py-4 px-4">{new Date(booking.date).toLocaleDateString()} at {booking.time}</td>
                          <td className="py-4 px-4">{booking.location}</td>
                          <td className="py-4 px-4 flex space-x-2">
                            <button 
                              onClick={() => handleAcceptBooking(booking.id)}
                              className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                            >
                              Accept
                            </button>
                            <button 
                              onClick={() => handleDeclineBooking(booking.id)}
                              className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                            >
                              Decline
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No pending booking requests at this time.
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
              
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-600">Current Month</span>
                  <span className="font-medium">${earningsSummary.currentMonth}</span>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-600">Last Month</span>
                  <span className="font-medium">${earningsSummary.lastMonth}</span>
                </div>
                <div className="flex justify-between border-b pb-3">
                  <span className="text-gray-600">Pending Payments</span>
                  <span className="font-medium">${earningsSummary.pending}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Per Job</span>
                  <span className="font-medium">${earningsSummary.average}</span>
                </div>
              </div>
            </div>
            
            {/* Performance Metrics */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <FaChartLine className="mr-2 text-blueColor" />
                Performance
              </h2>
              
              <div className="space-y-4">
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Customer Rating</span>
                    <span className="font-medium">{performanceMetrics.rating}/5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blueColor h-2 rounded-full" 
                      style={{ width: `${(performanceMetrics.rating / 5) * 100}%` }}
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
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;