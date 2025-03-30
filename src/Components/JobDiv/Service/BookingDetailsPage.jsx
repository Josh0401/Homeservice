import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaMapMarkerAlt,
  FaClock,
  FaUser,
  FaTools,
  FaPhone,
  FaEnvelope,
  FaComment,
  FaCheck,
  FaTimes,
  FaHistory
} from 'react-icons/fa';

const BookingDetailsPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageHistory, setMessageHistory] = useState([
    {
      id: 1,
      sender: 'provider',
      content: 'Hello, I will be arriving at the scheduled time. Please make sure that someone is at home.',
      timestamp: '2025-03-25T14:30:00Z'
    },
    {
      id: 2,
      sender: 'customer',
      content: 'Great, thank you! I will be home during that time.',
      timestamp: '2025-03-25T15:05:00Z'
    }
  ]);
  
  // Fetch booking details
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchData = async () => {
      try {
        // Simulating API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Example booking data
        const bookingData = {
          id: parseInt(id),
          customer: {
            name: 'Bob Johnson',
            phone: '(555) 123-4567',
            email: 'bob.johnson@example.com',
            address: '789 Pine Rd, Elsewhere',
            profileImage: null
          },
          service: 'Water Heater Services',
          description: 'Need to inspect and possibly repair water heater. Not heating water properly.',
          date: '2025-03-26',
          time: '9:00 AM',
          duration: 2, // hours
          price: 220,
          status: 'confirmed',
          notes: 'Water heater is in the garage. Code for garage keypad: 1234'
        };
        
        setBooking(bookingData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching booking details:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  // Send a message
  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        sender: 'provider',
        content: message,
        timestamp: new Date().toISOString()
      };
      
      setMessageHistory([...messageHistory, newMessage]);
      setMessage('');
    }
  };

  // Cancel booking
  const handleCancelBooking = () => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      // In a real app, this would make an API call
      alert('Booking has been canceled');
      // Redirect to dashboard or update local state
    }
  };

  // Complete booking
  const handleCompleteBooking = () => {
    if (window.confirm('Mark this booking as completed?')) {
      // In a real app, this would make an API call
      alert('Booking has been marked as completed');
      // Update local state
      setBooking({
        ...booking,
        status: 'completed'
      });
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time (for message timestamps)
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-greyIsh-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blueColor mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-greyIsh-50">
        <div className="text-center">
          <p className="text-xl text-gray-700">Booking not found</p>
          <Link to="/provider/dashboard" className="text-blueColor hover:underline mt-4 inline-block">
            Return to Dashboard
          </Link>
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
          <h1 className="text-2xl font-bold text-blueColor">Booking Details</h1>
          
          <div className="ml-auto flex space-x-2">
            {booking.status === 'confirmed' && (
              <>
                <button 
                  onClick={handleCompleteBooking}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                >
                  <FaCheck className="mr-1" /> Mark Complete
                </button>
                
                <button 
                  onClick={handleCancelBooking}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
                >
                  <FaTimes className="mr-1" /> Cancel
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
                <div className={`px-3 py-1 rounded-full text-sm text-white ${
                  booking.status === 'confirmed' ? 'bg-blue-500' : 
                  booking.status === 'completed' ? 'bg-green-500' : 
                  booking.status === 'cancelled' ? 'bg-red-500' : 'bg-gray-500'
                }`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
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
                        <a href={`tel:${booking.customer.phone}`} className="text-blueColor hover:underline flex items-center mr-4">
                          <FaPhone className="mr-1" size={14} /> Call
                        </a>
                        <a href={`mailto:${booking.customer.email}`} className="text-blueColor hover:underline flex items-center">
                          <FaEnvelope className="mr-1" size={14} /> Email
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start mb-4">
                    <FaComment className="text-blueColor mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium">Notes</h3>
                      <p className="text-gray-600">{booking.notes || 'No additional notes'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <FaClock className="text-blueColor mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium">Payment</h3>
                      <p className="text-gray-600 font-medium">${booking.price}</p>
                      <p className="text-xs text-gray-500">
                        {booking.status === 'completed' ? 'Payment completed' : 'Payment will be processed after service completion'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Messages */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <FaComment className="mr-2 text-blueColor" />
                Messages
              </h2>
              
              <div className="mb-6 max-h-80 overflow-y-auto">
                {messageHistory.length > 0 ? (
                  <div className="space-y-4">
                    {messageHistory.map(msg => (
                      <div 
                        key={msg.id} 
                        className={`flex ${msg.sender === 'provider' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs sm:max-w-md rounded-lg p-3 ${
                          msg.sender === 'provider' ? 'bg-blueColor text-white' : 'bg-gray-100'
                        }`}>
                          <p>{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            msg.sender === 'provider' ? 'text-blue-100' : 'text-gray-500'
                          }`}>
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No messages yet
                  </div>
                )}
              </div>
              
              <div className="flex">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blueColor"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blueColor text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
                >
                  Send
                </button>
              </div>
            </div>
            
            {/* Activity Timeline */}
            <div className="mt-8">
              <h3 className="font-medium text-gray-700 mb-4 flex items-center">
                <FaHistory className="mr-2 text-blueColor" /> Booking Timeline
              </h3>
              
              <div className="border-l-2 border-gray-200 ml-3 pl-6 space-y-6">
                <div className="relative">
                  <div className="absolute -left-10 top-0 bg-green-500 rounded-full w-4 h-4 border-2 border-white"></div>
                  <p className="text-sm text-gray-600">Booking created</p>
                  <p className="text-xs text-gray-500">March 20, 2025 at 11:32 AM</p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-10 top-0 bg-blue-500 rounded-full w-4 h-4 border-2 border-white"></div>
                  <p className="text-sm text-gray-600">Booking confirmed</p>
                  <p className="text-xs text-gray-500">March 20, 2025 at 2:15 PM</p>
                </div>
                
                {booking.status === 'completed' && (
                  <div className="relative">
                    <div className="absolute -left-10 top-0 bg-purple-500 rounded-full w-4 h-4 border-2 border-white"></div>
                    <p className="text-sm text-gray-600">Service completed</p>
                    <p className="text-xs text-gray-500">March 26, 2025 at 11:45 AM</p>
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