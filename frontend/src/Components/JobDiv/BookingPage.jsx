import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaUserCircle } from 'react-icons/fa';
import { MdDateRange, MdAccessTime, MdHome, MdPerson, MdEmail, MdPhone } from 'react-icons/md';
import { fetchProfessionals, transformProfessionalsData, createBooking } from '../../utils/apiService';

// Fetch services specific to the selected professional
const fetchProfessionalServicesLocal = async (professionalId) => {
  try {
    const response = await fetch(`http://localhost:5000/api/services/professional/${professionalId}`);
    if (!response.ok) {
      // If professional-specific endpoint doesn't exist, try general services with filter
      const fallbackResponse = await fetch(`http://localhost:5000/api/services?professionalId=${professionalId}`);
      if (!fallbackResponse.ok) {
        throw new Error(`Failed to fetch professional services: ${response.status}`);
      }
      return await fallbackResponse.json();
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch professional services:', error);
    throw error;
  }
};

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
  const [originalProvider, setOriginalProvider] = useState(null); // Store original API data
  const [services, setServices] = useState([]); // Store available services
  const [loadingServices, setLoadingServices] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
    state: '',
    zipCode: ''
  });
  
  // Available time slots
  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
    '4:00 PM', '5:00 PM', '6:00 PM'
  ];
  
  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];
  
  // Fetch available services from API when provider is loaded
  useEffect(() => {
    const loadServices = async () => {
      if (!provider && !originalProvider) return;
      
      try {
        setLoadingServices(true);
        const professionalId = originalProvider?.id || originalProvider?._id || provider?.id;
        
        console.log('=== SERVICES DEBUG ===');
        console.log('Professional ID for services:', professionalId);
        console.log('Provider data:', provider);
        console.log('Original provider data:', originalProvider);
        
        if (!professionalId) {
          console.warn('No professional ID available, skipping service fetch');
          setServices([]);
          return;
        }
        
        // Try multiple endpoints to see which one works
        const endpoints = [
          `http://localhost:5000/api/services/professional/${professionalId}`,
          `http://localhost:5000/api/services?professionalId=${professionalId}`,
          `http://localhost:5000/api/professionals/${professionalId}/services`
        ];
        
        let servicesData = null;
        let workingEndpoint = null;
        
        for (const endpoint of endpoints) {
          try {
            console.log(`Trying endpoint: ${endpoint}`);
            const response = await fetch(endpoint);
            console.log(`Response status: ${response.status}`);
            
            if (response.ok) {
              servicesData = await response.json();
              workingEndpoint = endpoint;
              console.log(`SUCCESS with endpoint: ${endpoint}`);
              console.log('Services response:', servicesData);
              break;
            } else {
              const errorText = await response.text();
              console.log(`Failed with status ${response.status}:`, errorText);
            }
          } catch (err) {
            console.log(`Error with endpoint ${endpoint}:`, err.message);
          }
        }
        
        if (!servicesData) {
          console.error('All service endpoints failed - using fallback services');
          setServices([]);
          return;
        }
        
        // Handle different response formats
        let servicesList = servicesData;
        if (servicesData.services) {
          servicesList = servicesData.services;
        } else if (servicesData.data) {
          servicesList = servicesData.data;
        }
        
        console.log('Final services list:', servicesList);
        console.log('Number of services:', servicesList?.length || 0);
        
        if (servicesList && servicesList.length > 0) {
          console.log('Sample service structure:', servicesList[0]);
        }
        
        setServices(servicesList || []);
        
      } catch (err) {
        console.error('Failed to load professional services:', err);
        setServices([]);
      } finally {
        setLoadingServices(false);
      }
    };

    loadServices();
  }, [provider, originalProvider]);

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken') || 
                   localStorage.getItem('token') || 
                   localStorage.getItem('accessToken');
      setIsAuthenticated(!!token);
    };
    
    checkAuth();
    
    // Listen for storage changes (when user logs in/out in another tab)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // Find the provider based on the ID using API
  useEffect(() => {
    const loadProvider = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all professionals from API
        const apiData = await fetchProfessionals();
        console.log('Raw API data:', apiData);
        
        const transformedData = transformProfessionalsData(apiData);
        console.log('Transformed data:', transformedData);
        
        // Find the provider by id in transformed data
        const foundProvider = transformedData.find(item => 
          item.id === parseInt(id) || item.id === id
        );
        
        // Also find the original provider data for the serviceId
        let originalProviderData = null;
        if (apiData && apiData.professionals) {
          originalProviderData = apiData.professionals.find(item => 
            item.id === id || item._id === id || 
            item.id === parseInt(id) || item._id === parseInt(id)
          );
        }
        
        console.log('Found provider (transformed):', foundProvider);
        console.log('Found provider (original):', originalProviderData);
        
        if (foundProvider) {
          setProvider(foundProvider);
          setOriginalProvider(originalProviderData);
          
          // Set default service type based on provider's profession
          setFormData(prev => ({
            ...prev,
            serviceType: `Standard ${foundProvider.profession} Service`
          }));
        } else {
          setError('Provider not found');
        }
      } catch (err) {
        console.error('Failed to load provider:', err);
        setError('Failed to load provider details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProvider();
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
  
  // Generate service type options from professional's services or fallback
  const getServiceOptions = () => {
    // First priority: Use services from professional-specific API
    if (services && services.length > 0) {
      console.log('Using professional-specific services from API');
      return services.map(service => ({
        id: service.id || service._id,
        name: service.name || service.title || service.serviceName,
        description: service.description,
        price: service.price || service.rate
      }));
    }
    
    // Second priority: Check if provider has services array
    if (provider?.services && provider.services.length > 0) {
      console.log('Using provider services array');
      return provider.services.map((service, index) => ({
        id: `provider-service-${index}`,
        name: service.name || service,
        description: service.description
      }));
    }
    
    // Third priority: Check original provider data for services
    if (originalProvider?.services && originalProvider.services.length > 0) {
      console.log('Using original provider services');
      return originalProvider.services.map((service, index) => ({
        id: `original-service-${index}`,
        name: service.name || service,
        description: service.description
      }));
    }
    
    // Fallback: Generate profession-based options
    if (!provider) return [];
    
    console.log('Using profession-based fallback services for:', provider.profession);
    const profession = provider.profession;
    
    switch(profession) {
      case 'Carpenter':
        return [
          { id: 'furniture-repair', name: 'Furniture Repair', description: 'Repair and restoration of furniture' },
          { id: 'custom-woodworking', name: 'Custom Woodworking', description: 'Custom wood projects and crafting' },
          { id: 'cabinet-installation', name: 'Cabinet Installation', description: 'Kitchen and bathroom cabinet installation' },
          { id: 'general-carpentry', name: 'General Carpentry', description: 'General carpentry and woodworking services' }
        ];
      case 'Plumber':
        return [
          { id: 'leak-repair', name: 'Leak Repair', description: 'Fix leaks in pipes, faucets, and fixtures' },
          { id: 'pipe-installation', name: 'Pipe Installation', description: 'Install new pipes and plumbing systems' },
          { id: 'drain-cleaning', name: 'Drain Cleaning', description: 'Clear clogged drains and pipes' },
          { id: 'fixture-installation', name: 'Fixture Installation', description: 'Install toilets, sinks, and other fixtures' }
        ];
      case 'Electrician':
        return [
          { id: 'wiring-installation', name: 'Wiring Installation', description: 'Install electrical wiring and circuits' },
          { id: 'lighting-installation', name: 'Lighting Installation', description: 'Install light fixtures and switches' },
          { id: 'safety-inspection', name: 'Safety Inspection', description: 'Electrical safety inspections and testing' },
          { id: 'outlet-repair', name: 'Outlet Repair', description: 'Repair and replace electrical outlets' }
        ];
      case 'Interior Designer':
        return [
          { id: 'design-consultation', name: 'Design Consultation', description: 'Professional interior design consultation' },
          { id: 'room-redesign', name: 'Room Redesign', description: 'Complete room makeover and redesign' },
          { id: 'color-scheme', name: 'Color Scheme Planning', description: 'Color palette and scheme design' },
          { id: 'furniture-selection', name: 'Furniture Selection', description: 'Help choose furniture and decor' }
        ];
      case 'Painter':
        return [
          { id: 'interior-painting', name: 'Interior Painting', description: 'Paint interior walls and surfaces' },
          { id: 'exterior-painting', name: 'Exterior Painting', description: 'Paint exterior walls and surfaces' },
          { id: 'decorative-painting', name: 'Decorative Painting', description: 'Specialty and decorative paint finishes' },
          { id: 'cabinet-refinishing', name: 'Cabinet Refinishing', description: 'Refinish and paint cabinets' }
        ];
      case 'Landscaper':
        return [
          { id: 'lawn-maintenance', name: 'Lawn Maintenance', description: 'Regular lawn care and maintenance' },
          { id: 'garden-design', name: 'Garden Design', description: 'Design and plan garden layouts' },
          { id: 'irrigation-installation', name: 'Irrigation Installation', description: 'Install sprinkler and irrigation systems' },
          { id: 'outdoor-renovation', name: 'Outdoor Renovation', description: 'Renovate outdoor spaces and landscapes' }
        ];
      case 'HVAC Technician':
        return [
          { id: 'system-installation', name: 'System Installation', description: 'Install HVAC systems and equipment' },
          { id: 'maintenance-repair', name: 'Maintenance & Repair', description: 'Maintain and repair HVAC systems' },
          { id: 'duct-cleaning', name: 'Duct Cleaning', description: 'Clean air ducts and ventilation systems' },
          { id: 'system-inspection', name: 'System Inspection', description: 'Inspect and diagnose HVAC issues' }
        ];
      case 'Security Specialist':
        return [
          { id: 'system-installation', name: 'System Installation', description: 'Install security systems and equipment' },
          { id: 'camera-setup', name: 'Camera Setup', description: 'Set up security cameras and monitoring' },
          { id: 'security-assessment', name: 'Security Assessment', description: 'Assess security needs and vulnerabilities' },
          { id: 'monitoring-setup', name: 'Monitoring Setup', description: 'Set up security monitoring systems' }
        ];
      default:
        return [{ 
          id: 'standard-service', 
          name: `Standard ${profession} Service`,
          description: `General ${profession.toLowerCase()} services`
        }];
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
  
  // Convert 12-hour time format to 24-hour format
  const convertTo24Hour = (time12h) => {
    if (!time12h) return '';
    
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    
    if (hours === '12') {
      hours = '00';
    }
    
    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }
    
    return `${hours.toString().padStart(2, '0')}:${minutes}`;
  };

  // Validate required fields before submission
  const validateBookingData = () => {
    const errors = [];
    
    if (!formData.date) errors.push('Date is required');
    if (!formData.time) errors.push('Time is required');
    if (!formData.serviceType) errors.push('Service type is required');
    if (formData.serviceType === 'custom' && !formData.customServiceDescription) {
      errors.push('Service description is required for custom services');
    }
    if (!formData.firstName) errors.push('First name is required');
    if (!formData.lastName) errors.push('Last name is required');
    if (!formData.email) errors.push('Email is required');
    if (!formData.phone) errors.push('Phone is required');
    if (!formData.address) errors.push('Address is required');
    if (!formData.city) errors.push('City is required');
    if (!formData.state) errors.push('State is required');
    if (!formData.zipCode) errors.push('ZIP code is required');
    
    return errors;
  };

  // Submit form handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all required fields
    const validationErrors = validateBookingData();
    if (validationErrors.length > 0) {
      alert(`Please fill in all required fields:\n${validationErrors.join('\n')}`);
      return;
    }
    
    setSubmitting(true);
    
    try {
      let serviceId = null;
      let bookingStrategy = 'unknown';
      
      // Strategy 1: Try to find the service ID from the services API
      if (formData.serviceType && formData.serviceType !== 'custom' && services.length > 0) {
        const selectedService = services.find(service => 
          service.name === formData.serviceType || 
          service.title === formData.serviceType ||
          service.serviceName === formData.serviceType
        );
        
        if (selectedService) {
          serviceId = selectedService.id || selectedService._id;
          bookingStrategy = 'api-service-id';
          console.log('Strategy 1 SUCCESS: Found service ID from services API:', serviceId);
        }
      }
      
      // Strategy 2: If no specific service found, use the correct serviceId for this professional
      if (!serviceId) {
        console.warn('Strategy 1 FAILED: No specific service ID found');
        
        // Use the specific serviceId provided for this professional
        const professionalId = originalProvider?.id || originalProvider?._id || provider.id;
        
        // For this specific professional, use the correct serviceId
        if (professionalId === '6862690f51589b2c33c0e6c0') {
          serviceId = '6862690f51589b2c33c0e6c0'; // Use the same ID as both professional and service
          bookingStrategy = 'hardcoded-service-id';
          console.log('Strategy 2: Using hardcoded service ID for this professional:', serviceId);
        } else {
          // For other professionals, try different booking approaches
          if (formData.serviceType === 'custom') {
            bookingStrategy = 'custom-service';
            console.log('Strategy 2A: Custom service booking');
          } else {
            bookingStrategy = 'professional-service';
            serviceId = professionalId; // Use professional ID as fallback
            console.log('Strategy 2B: Using professional ID as service ID:', serviceId);
          }
        }
      }
      
      // Prepare different booking data structures based on strategy
      let bookingData;
      
      if (bookingStrategy === 'api-service-id' || bookingStrategy === 'hardcoded-service-id') {
        // Standard booking with known service ID
        bookingData = {
          serviceId: String(serviceId),
          title: `${provider.profession} Service - ${formData.serviceType}`,
          description: `${formData.serviceType} provided by ${provider.title}`,
          preferredDate: formData.date,
          preferredTime: convertTo24Hour(formData.time),
          location: {
            address: {
              street: formData.address,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode
            }
          }
        };
      } else if (bookingStrategy === 'custom-service') {
        // Custom service booking - for this professional, still use the serviceId
        const professionalId = originalProvider?.id || originalProvider?._id || provider.id;
        const finalServiceId = professionalId === '6862690f51589b2c33c0e6c0' ? '6862690f51589b2c33c0e6c0' : professionalId;
        
        bookingData = {
          serviceId: String(finalServiceId), // Include serviceId even for custom services
          professionalId: String(professionalId),
          serviceType: 'custom',
          title: `Custom ${provider.profession} Service`,
          description: formData.customServiceDescription,
          preferredDate: formData.date,
          preferredTime: convertTo24Hour(formData.time),
          location: {
            address: {
              street: formData.address,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode
            }
          },
          clientInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone
          }
        };
      } else {
        // Fallback: Professional service booking
        bookingData = {
          serviceId: String(serviceId), // Always include serviceId
          professionalId: String(originalProvider?.id || originalProvider?._id || provider.id),
          serviceType: formData.serviceType,
          title: `${provider.profession} Service - ${formData.serviceType}`,
          description: `${formData.serviceType} provided by ${provider.title}`,
          preferredDate: formData.date,
          preferredTime: convertTo24Hour(formData.time),
          location: {
            address: {
              street: formData.address,
              city: formData.city,
              state: formData.state,
              zipCode: formData.zipCode
            }
          },
          clientInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone
          }
        };
      }
      
      console.log('=== BOOKING SUBMISSION DEBUG ===');
      console.log('Booking strategy:', bookingStrategy);
      console.log('Professional ID:', originalProvider?.id || originalProvider?._id || provider.id);
      console.log('Service ID being sent:', serviceId);
      console.log('Available services count:', services.length);
      console.log('Available services:', services);
      console.log('Selected service type:', formData.serviceType);
      console.log('Complete booking data:', JSON.stringify(bookingData, null, 2));
      
      // Try the booking request
      try {
        const result = await createBooking(bookingData);
        
        // Navigate to success page with booking details
        navigate('/booking-success', {
          state: {
            bookingData: formData,
            provider: provider,
            bookingId: result.id || result._id || result.bookingId,
            apiResponse: result
          }
        });
        
      } catch (bookingError) {
        // If the first attempt fails and we used professional ID as service ID, try alternative approaches
        if (bookingStrategy === 'professional-service' && bookingError.message.includes('Service not found')) {
          console.log('Booking with professional ID failed, trying alternative approach...');
          
          // Alternative 1: Try without serviceId at all
          const alternativeBookingData = {
            professionalId: String(originalProvider?.id || originalProvider?._id || provider.id),
            serviceType: formData.serviceType,
            title: `${provider.profession} Service - ${formData.serviceType}`,
            description: `${formData.serviceType} provided by ${provider.title}`,
            preferredDate: formData.date,
            preferredTime: convertTo24Hour(formData.time),
            location: {
              address: {
                street: formData.address,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode
              }
            },
            clientInfo: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phone: formData.phone
            }
          };
          
          console.log('Trying alternative booking data (no serviceId):', JSON.stringify(alternativeBookingData, null, 2));
          
          try {
            const result = await createBooking(alternativeBookingData);
            
            navigate('/booking-success', {
              state: {
                bookingData: formData,
                provider: provider,
                bookingId: result.id || result._id || result.bookingId,
                apiResponse: result
              }
            });
            return;
            
          } catch (alternativeError) {
            console.error('Alternative booking approach also failed:', alternativeError);
            throw bookingError; // Throw the original error
          }
        } else {
          throw bookingError; // Re-throw the original error
        }
      }
      
    } catch (error) {
      console.error('Failed to create booking:', error);
      
      // Handle specific service not found error
      if (error.message.includes('Service not found')) {
        const errorMsg = services.length === 0 
          ? `No services are currently available for ${provider.title}. This may be because:\n\n• The professional hasn't set up their services yet\n• There's a connectivity issue with the services database\n• The professional ID (${originalProvider?.id || provider.id}) doesn't have associated services\n\nPlease try again later or contact support.`
          : `The selected service "${formData.serviceType}" is not available for this professional.\n\nAvailable services: ${services.map(s => s.name || s.title).join(', ')}\n\nPlease select a different service or contact support.`;
        
        alert(errorMsg);
        return;
      }
      
      // Handle authentication errors specifically
      if (error.message.includes('Authentication required') || error.message.includes('Access denied')) {
        const shouldLogin = window.confirm(
          'You need to be logged in to create a booking. Would you like to go to the login page?'
        );
        
        if (shouldLogin) {
          localStorage.setItem('pendingBooking', JSON.stringify({
            bookingData,
            providerId: provider.id,
            formData
          }));
          
          navigate('/login', {
            state: {
              redirectAfterLogin: `/provider/${provider.id}/book`,
              message: 'Please log in to complete your booking'
            }
          });
          return;
        }
      }
      
      // Show generic error for other cases
      alert(`Failed to create booking: ${error.message}\n\nDebugging info:\n• Professional ID: ${originalProvider?.id || provider.id}\n• Services available: ${services.length}\n• Selected service: ${formData.serviceType}\n\nPlease try again or contact support.`);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-blueColor mb-6 hover:underline"
        >
          <FaArrowLeft className="mr-2" /> Back to provider
        </button>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blueColor mx-auto mb-4"></div>
              <p className="text-textColor">Loading provider information...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error || !provider) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-blueColor mb-6 hover:underline"
        >
          <FaArrowLeft className="mr-2" /> Back to provider
        </button>
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Booking Error</h1>
          <p className="text-red-500 mb-4">{error || 'Provider not found'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blueColor text-white px-4 py-2 rounded hover:bg-blue-600 mr-4"
          >
            Retry
          </button>
          <button 
            onClick={() => navigate('/')} 
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Go Home
          </button>
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
              <span className="text-sm">Confirm</span>
            </div>
          </div>
          <div className="relative mt-2">
            <div className="absolute top-0 h-1 bg-gray-200 w-full"></div>
            <div 
              className="absolute top-0 h-1 bg-blueColor transition-all duration-500" 
              style={{ width: `${(currentStep - 1) * 50}%` }}
            ></div>
          </div>
        </div>
        
        <form onSubmit={currentStep === 3 ? handleSubmit : handleNextStep}>
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
                  disabled={loadingServices}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blueColor"
                >
                  <option value="">
                    {loadingServices ? 'Loading professional services...' : 'Select a service'}
                  </option>
                  {getServiceOptions().map((service) => (
                    <option key={service.id || service.name} value={service.name}>
                      {service.name}
                      {service.price && ` - ${service.price}`}
                      {service.description && ` - ${service.description.substring(0, 50)}${service.description.length > 50 ? '...' : ''}`}
                    </option>
                  ))}
                  <option value="custom">Custom (describe below)</option>
                </select>
                
                {/* Show service source indicator */}
                {getServiceOptions().length > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    {services.length > 0 ? 
                      `${services.length} professional services available` :
                      `${getServiceOptions().length} standard services for ${provider.profession}`
                    }
                  </div>
                )}
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
              
              <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-3">
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
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    placeholder="NY"
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
          
          {/* Step 3: Review and Confirm */}
          {currentStep === 3 && (
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
                <p>{formData.city}, {formData.state} {formData.zipCode}</p>
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
                <p className="text-sm text-gray-600 mt-3">
                  * Payment will be processed after service completion
                </p>
              </div>
              
              {/* Authentication warning */}
              {!isAuthenticated && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Login Required
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>You need to be logged in to create a booking. 
                          <button 
                            onClick={() => navigate('/login')}
                            className="font-medium underline hover:text-yellow-600 ml-1"
                          >
                            Click here to log in
                          </button>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
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
              disabled={submitting}
              className={`py-2 px-8 rounded-lg font-semibold ${
                submitting 
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                  : 'bg-blueColor text-white hover:bg-blue-600'
              }`}
            >
              {submitting 
                ? (currentStep < 3 ? 'Loading...' : 'Creating Booking...') 
                : (currentStep < 3 ? 'Next' : 'Confirm Booking')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;