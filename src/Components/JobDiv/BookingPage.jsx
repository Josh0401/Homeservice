import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaUserCircle, FaCreditCard, FaPaypal } from 'react-icons/fa';
import { MdDateRange, MdAccessTime, MdHome, MdPerson, MdEmail, MdPhone, MdPayment } from 'react-icons/md';
import { Data } from './Jobs';

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get selected date and time from location state (if available)
  let selectedDateFromCalendar = location.state?.selectedDate || '';
  const selectedTimeFromCalendar = location.state?.selectedTime || '';
  
  // Fix date format issue - make sure the date is correctly formatted
  // If the date is in format MM/DD/YYYY, convert it to YYYY-MM-DD for the date input
  if (selectedDateFromCalendar && selectedDateFromCalendar.includes('/')) {
    const dateParts = selectedDateFromCalendar.split('/');
    // Check if we have a valid date
    if (dateParts.length === 3) {
      const month = dateParts[0].padStart(2, '0');
      const day = dateParts[1].padStart(2, '0');
      const year = dateParts[2];
      selectedDateFromCalendar = `${year}-${month}-${day}`;
    }
  }
  
  const [provider, setProvider] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    date: selectedDateFromCalendar,
    time: selectedTimeFromCalendar,
    serviceType: '',
    customServiceDescription: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    paymentMethod: 'creditCard',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    savePaymentInfo: false
  });
  
  // Available time slots
  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
    '4:00 PM', '5:00 PM', '6:00 PM'
  ];
  
  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];
  
  // Find the provider based on the ID
  useEffect(() => {
    const providerData = Data.find(p => p.id === parseInt(id));
    if (providerData) {
      setProvider(providerData);
      
      // Set default service type based on provider's profession
      setFormData(prev => ({
        ...prev,
        serviceType: `Standard ${providerData.profession} Service`
      }));
    }
  }, [id]);
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Generate service type options based on provider profession
  const getServiceOptions = () => {
    if (!provider) return [];
    
    const profession = provider.profession;
    
    switch(profession) {
      case 'Carpenter':
        return ['Furniture Repair', 'Custom Woodworking', 'Cabinet Installation', 'General Carpentry'];
      case 'Plumber':
        return ['Leak Repair', 'Pipe Installation', 'Drain Cleaning', 'Fixture Installation'];
      case 'Electrician':
        return ['Wiring Installation', 'Lighting Installation', 'Safety Inspection', 'Outlet Repair'];
      case 'Interior Designer':
        return ['Design Consultation', 'Room Redesign', 'Color Scheme Planning', 'Furniture Selection'];
      case 'Painter':
        return ['Interior Painting', 'Exterior Painting', 'Decorative Painting', 'Cabinet Refinishing'];
      case 'Landscaper':
        return ['Lawn Maintenance', 'Garden Design', 'Irrigation Installation', 'Outdoor Renovation'];
      case 'HVAC Technician':
        return ['System Installation', 'Maintenance & Repair', 'Duct Cleaning', 'System Inspection'];
      case 'Security Specialist':
        return ['System Installation', 'Camera Setup', 'Security Assessment', 'Monitoring Setup'];
      default:
        return [`Standard ${profession} Service`];
    }
  };
  
  // Next step handler
  const handleNextStep = (e) => {
    e.preventDefault();
    setCurrentStep(prev => prev + 1);
  };
  
  // Previous step handler
  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  // Submit form handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real application, you would send this data to your backend
    console.log('Booking submitted:', formData);
    
    // Navigate to success page
    navigate('/booking-success', {
      state: {
        bookingData: formData,
        provider: provider
      }
    });
  };
  
  if (!provider) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-blueColor mb-6 hover:underline"
        >
          <FaArrowLeft className="mr-2" /> Back to provider
        </button>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p>Loading provider information...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-blueColor mb-6 hover:underline"
      >
        <FaArrowLeft className="mr-2" /> Back to provider
      </button>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-textColor">Book an Appointment with {provider.title}</h1>
          <p className="text-gray-500">{provider.profession} • ${provider.price}/hr • ★ {provider.rating}</p>
        </div>
        
        {/* Booking Progress */}
        <div className="mb-8">
          <div className="flex justify-between">
            <div className={`flex flex-col items-center ${currentStep >= 1 ? 'text-blueColor' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep >= 1 ? 'bg-blueColor text-white' : 'bg-gray-200'}`}>1</div>
              <span className="text-sm">Schedule</span>
            </div>
            <div className={`flex flex-col items-center ${currentStep >= 2 ? 'text-blueColor' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep >= 2 ? 'bg-blueColor text-white' : 'bg-gray-200'}`}>2</div>
              <span className="text-sm">Details</span>
            </div>
            <div className={`flex flex-col items-center ${currentStep >= 3 ? 'text-blueColor' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep >= 3 ? 'bg-blueColor text-white' : 'bg-gray-200'}`}>3</div>
              <span className="text-sm">Payment</span>
            </div>
            <div className={`flex flex-col items-center ${currentStep >= 4 ? 'text-blueColor' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${currentStep >= 4 ? 'bg-blueColor text-white' : 'bg-gray-200'}`}>4</div>
              <span className="text-sm">Confirm</span>
            </div>
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 h-1 bg-gray-200 w-full"></div>
            <div 
              className="absolute top-0 h-1 bg-blueColor transition-all duration-500" 
              style={{ width: `${(currentStep - 1) * 33.33}%` }}
            ></div>
          </div>
        </div>
        
        <form onSubmit={currentStep === 4 ? handleSubmit : handleNextStep}>
          {/* Step 1: Date and Time Selection */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <MdDateRange className="mr-2 text-blueColor" />
                Select Date and Time
              </h2>
              
              {selectedDateFromCalendar && selectedTimeFromCalendar && (
                <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-green-700 font-medium">
                    You selected {new Date(selectedDateFromCalendar).toLocaleDateString()} at {selectedTimeFromCalendar} from the provider's calendar.
                  </p>
                </div>
              )}
              
              <div className="mb-6">
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  min={today}
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blueColor"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Time Slots
                </label>
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {timeSlots.map(time => (
                    <div key={time} className="flex items-center">
                      <input
                        type="radio"
                        id={`time-${time}`}
                        name="time"
                        value={time}
                        checked={formData.time === time}
                        onChange={handleInputChange}
                        required
                        className="sr-only"
                      />
                      <label
                        htmlFor={`time-${time}`}
                        className={`cursor-pointer block w-full text-center p-2 rounded-md ${
                          formData.time === time
                            ? 'bg-blueColor text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {time}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center">
                    <MdHome className="mr-2 text-blueColor" />
                    Service Type
                  </div>
                </label>
                <select
                  id="serviceType"
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blueColor"
                >
                  <option value="">Select a service</option>
                  {getServiceOptions().map(service => (
                    <option key={service} value={service}>{service}</option>
                  ))}
                  <option value="custom">Custom (describe below)</option>
                </select>
              </div>
              
              {formData.serviceType === 'custom' && (
                <div className="mb-6">
                  <label htmlFor="customServiceDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Describe Your Service Needs
                  </label>
                  <textarea
                    id="customServiceDescription"
                    name="customServiceDescription"
                    value={formData.customServiceDescription}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blueColor"
                    placeholder="Please describe what service you need..."
                  ></textarea>
                </div>
              )}
            </div>
          )}
          
          {/* Step 2: Contact Details */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <MdPerson className="mr-2 text-blueColor" />
                Contact Details
              </h2>
              
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blueColor"
                  />
                </div>
                
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blueColor"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <MdEmail className="mr-2 text-blueColor" />
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blueColor"
                />
              </div>
              
              <div className="mt-6">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <MdPhone className="mr-2 text-blueColor" />
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blueColor"
                />
              </div>
              
              <div className="mt-6">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Service Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blueColor"
                  placeholder="Street Address"
                />
              </div>
              
              <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blueColor"
                  />
                </div>
                
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blueColor"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Step 3: Payment Information */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <MdPayment className="mr-2 text-blueColor" />
                Payment Information
              </h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Payment Method
                </label>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="relative">
                    <input
                      type="radio"
                      id="creditCard"
                      name="paymentMethod"
                      value="creditCard"
                      checked={formData.paymentMethod === 'creditCard'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor="creditCard"
                      className={`cursor-pointer flex items-center justify-center p-4 border rounded-lg ${
                        formData.paymentMethod === 'creditCard'
                          ? 'border-blueColor bg-blue-50'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <FaCreditCard className="mr-2 text-xl" />
                      Credit/Debit Card
                    </label>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="radio"
                      id="paypal"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor="paypal"
                      className={`cursor-pointer flex items-center justify-center p-4 border rounded-lg ${
                        formData.paymentMethod === 'paypal'
                          ? 'border-blueColor bg-blue-50'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <FaPaypal className="mr-2 text-xl" />
                      PayPal
                    </label>
                  </div>
                </div>
              </div>
              
              {formData.paymentMethod === 'creditCard' && (
                <>
                  <div className="mb-6">
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      required
                      placeholder="0000 0000 0000 0000"
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blueColor"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blueColor"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        required
                        placeholder="MM/YY"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blueColor"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        required
                        placeholder="123"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blueColor"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-6">
                    <input
                      type="checkbox"
                      id="savePaymentInfo"
                      name="savePaymentInfo"
                      checked={formData.savePaymentInfo}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-blueColor focus:ring-blueColor border-gray-300 rounded"
                    />
                    <label htmlFor="savePaymentInfo" className="ml-2 block text-sm text-gray-700">
                      Save this card for future bookings
                    </label>
                  </div>
                </>
              )}
              
              {formData.paymentMethod === 'paypal' && (
                <div className="bg-gray-50 p-4 rounded-md mt-4">
                  <p className="text-gray-700">
                    You will be redirected to PayPal to complete your payment after confirming your booking.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Step 4: Review and Confirm */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Review and Confirm</h2>
              
              <div className="mb-6 border-b pb-4">
                <h3 className="font-medium text-gray-700 mb-2">Provider</h3>
                <div className="flex items-center">
                  <FaUserCircle className="text-4xl text-gray-400 mr-3" />
                  <div>
                    <p className="font-semibold text-textColor">{provider.title}</p>
                    <p className="text-gray-500">{provider.profession} • ${provider.price}/hr • ★ {provider.rating}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-6 border-b pb-4">
                <h3 className="font-medium text-gray-700 mb-2">Appointment Details</h3>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <div className="flex items-center">
                    <MdDateRange className="text-blueColor mr-2" />
                    <span>Date: {formData.date}</span>
                  </div>
                  <div className="flex items-center">
                    <MdAccessTime className="text-blueColor mr-2" />
                    <span>Time: {formData.time}</span>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex items-center">
                    <MdHome className="text-blueColor mr-2" />
                    <span>Service: {formData.serviceType === 'custom' ? 'Custom Service' : formData.serviceType}</span>
                  </div>
                  {formData.serviceType === 'custom' && (
                    <p className="mt-1 text-gray-600 ml-6">{formData.customServiceDescription}</p>
                  )}
                </div>
              </div>
              
              <div className="mb-6 border-b pb-4">
                <h3 className="font-medium text-gray-700 mb-2">Contact Details</h3>
                <p>{formData.firstName} {formData.lastName}</p>
                <p className="flex items-center"><MdEmail className="mr-1 text-blueColor" /> {formData.email}</p>
                <p className="flex items-center"><MdPhone className="mr-1 text-blueColor" /> {formData.phone}</p>
                <p className="mt-2">{formData.address}</p>
                <p>{formData.city}, {formData.zipCode}</p>
              </div>
              
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-2">Payment Method</h3>
                <p className="flex items-center">
                  {formData.paymentMethod === 'creditCard' ? (
                    <>
                      <FaCreditCard className="mr-2" />
                      Credit Card ending in {formData.cardNumber.slice(-4)}
                    </>
                  ) : (
                    <>
                      <FaPaypal className="mr-2" />
                      PayPal
                    </>
                  )}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <div className="flex justify-between mb-2">
                  <span>Service Rate</span>
                  <span>${provider.price}/hr</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Estimated Duration</span>
                  <span>2 hours</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Service Fee</span>
                  <span>$10.00</span>
                </div>
                <div className="flex justify-between font-semibold border-t border-gray-300 pt-2 mt-2">
                  <span>Total (estimated)</span>
                  <span>${(provider.price * 2) + 10}.00</span>
                </div>
              </div>
              
              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="termsAgreed"
                  required
                  className="h-4 w-4 text-blueColor focus:ring-blueColor border-gray-300 rounded"
                />
                <label htmlFor="termsAgreed" className="ml-2 block text-sm text-gray-700">
                  I agree to the <a href="#" className="text-blueColor hover:underline">Terms of Service</a> and <a href="#" className="text-blueColor hover:underline">Privacy Policy</a>
                </label>
              </div>
            </div>
          )}
          
          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="bg-white text-blueColor border-2 border-blueColor py-2 px-6 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
            ) : (
              <div></div> // Empty div for spacing
            )}
            
            <button
              type="submit"
              className="bg-blueColor text-white py-2 px-8 rounded-lg hover:bg-blue-600"
            >
              {currentStep < 4 ? 'Next' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;