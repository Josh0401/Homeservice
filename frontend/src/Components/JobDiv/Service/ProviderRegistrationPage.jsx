import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaTools, FaClipboardCheck, FaIdCard, FaShieldAlt, FaCheck } from 'react-icons/fa';

const ProviderRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    bio: '',
    profileImage: null,
    
    // Service Details
    serviceCategory: '',
    otherCategory: '',
    serviceDescription: '',
    yearsExperience: '',
    
    // Skills and Expertise
    skills: [],
    specializations: [],
    certifications: [],
    
    // Background Check
    agreeToBgCheck: false,
    legalName: '',
    dateOfBirth: '',
    ssn: '',
    driverLicense: '',
    criminalHistory: false,
    criminalHistoryExplanation: '',
    
    // Account Details
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  
  // Service categories
  const serviceCategories = [
    "Plumbing",
    "Electrical",
    "Carpentry",
    "Painting",
    "HVAC",
    "Landscaping",
    "Cleaning",
    "Interior Design",
    "Security Installation",
    "Other"
  ];
  
  // Skills options based on category
  const getSkillsByCategory = (category) => {
    switch(category) {
      case "Plumbing":
        return ["Pipe Installation", "Leak Repair", "Fixture Installation", "Drain Cleaning", "Water Heater Services", "Sewer Line Services"];
      case "Electrical":
        return ["Wiring Installation", "Lighting Installation", "Electrical Panel Upgrades", "Outlet Installation", "Ceiling Fan Installation", "Smart Home Installation"];
      case "Carpentry":
        return ["Custom Furniture Building", "Cabinet Installation", "Framing", "Trim Work", "Deck Building", "Shelving Installation"];
      case "Painting":
        return ["Interior Painting", "Exterior Painting", "Cabinet Refinishing", "Deck Staining", "Wallpaper Installation", "Texture Application"];
      case "HVAC":
        return ["System Installation", "Maintenance & Repair", "Duct Cleaning", "System Inspection", "Thermostat Installation", "Air Quality Improvement"];
      case "Landscaping":
        return ["Lawn Maintenance", "Garden Design", "Irrigation Installation", "Tree Trimming", "Hardscaping", "Outdoor Lighting"];
      case "Cleaning":
        return ["Deep Cleaning", "Regular Maintenance", "Move-in/Move-out Cleaning", "Window Cleaning", "Carpet Cleaning", "Commercial Cleaning"];
      case "Interior Design":
        return ["Space Planning", "Color Consultation", "Furniture Selection", "Lighting Design", "Home Staging", "Renovation Planning"];
      case "Security Installation":
        return ["Camera Installation", "Alarm System Installation", "Access Control Systems", "Smart Lock Installation", "Security Assessment", "Monitoring Setup"];
      default:
        return [];
    }
  };
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  // Handle skills selection
  const handleSkillsChange = (skill) => {
    const updatedSkills = formData.skills.includes(skill)
      ? formData.skills.filter(s => s !== skill)
      : [...formData.skills, skill];
    
    setFormData({ ...formData, skills: updatedSkills });
  };
  
  // Next step handler
  const handleNextStep = (e) => {
    e.preventDefault();
    setCurrentStep(prev => prev + 1);
    window.scrollTo(0, 0);
  };
  
  // Previous step handler
  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0, 0);
  };
  
  // Final submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, you would send this data to your backend
    console.log('Provider registration submitted:', formData);
    
    // Navigate to success page
    navigate('/provider-registration-success');
  };
  
  // Render form based on current step
  const renderForm = () => {
    switch(currentStep) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaUser className="mr-2 text-blueColor" />
              Basic Information
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
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
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
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
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blueColor"
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
            
            <div className="mt-6">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Professional Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blueColor"
                placeholder="Tell customers about your professional experience and what makes your service special..."
              ></textarea>
            </div>
            
            <div className="mt-6">
              <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 mb-1">
                Profile Photo (optional)
              </label>
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                onChange={handleInputChange}
                accept="image/*"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blueColor"
              />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaTools className="mr-2 text-blueColor" />
              Service Details
            </h2>
            
            <div className="mb-6">
              <label htmlFor="serviceCategory" className="block text-sm font-medium text-gray-700 mb-1">
                Service Category
              </label>
              <select
                id="serviceCategory"
                name="serviceCategory"
                value={formData.serviceCategory}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blueColor"
              >
                <option value="">Select a service category</option>
                {serviceCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            {formData.serviceCategory === 'Other' && (
              <div className="mb-6">
                <label htmlFor="otherCategory" className="block text-sm font-medium text-gray-700 mb-1">
                  Please specify service category
                </label>
                <input
                  type="text"
                  id="otherCategory"
                  name="otherCategory"
                  value={formData.otherCategory}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blueColor"
                />
              </div>
            )}
            
            <div className="mb-6">
              <label htmlFor="serviceDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Service Description
              </label>
              <textarea
                id="serviceDescription"
                name="serviceDescription"
                value={formData.serviceDescription}
                onChange={handleInputChange}
                required
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blueColor"
                placeholder="Describe the services you offer in detail..."
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label htmlFor="yearsExperience" className="block text-sm font-medium text-gray-700 mb-1">
                Years of Experience
              </label>
              <select
                id="yearsExperience"
                name="yearsExperience"
                value={formData.yearsExperience}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blueColor"
              >
                <option value="">Select years of experience</option>
                <option value="Less than 1 year">Less than 1 year</option>
                <option value="1-2 years">1-2 years</option>
                <option value="3-5 years">3-5 years</option>
                <option value="5-10 years">5-10 years</option>
                <option value="10+ years">10+ years</option>
              </select>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaClipboardCheck className="mr-2 text-blueColor" />
              Skills and Expertise
            </h2>
            
            {formData.serviceCategory && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Your Skills
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {getSkillsByCategory(formData.serviceCategory).map(skill => (
                    <div key={skill} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`skill-${skill}`}
                        checked={formData.skills.includes(skill)}
                        onChange={() => handleSkillsChange(skill)}
                        className="h-4 w-4 text-blueColor focus:ring-blueColor border-gray-300 rounded"
                      />
                      <label htmlFor={`skill-${skill}`} className="ml-2 block text-sm text-gray-700">
                        {skill}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="mb-6">
              <label htmlFor="specializations" className="block text-sm font-medium text-gray-700 mb-1">
                Specializations
              </label>
              <input
                type="text"
                id="specializations"
                name="specializations"
                value={formData.specializations}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blueColor"
                placeholder="E.g. Victorian homes, energy-efficient systems, etc. (comma separated)"
              />
              <p className="mt-1 text-sm text-gray-500">Add any specializations or areas of expertise, separated by commas</p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="certifications" className="block text-sm font-medium text-gray-700 mb-1">
                Licenses & Certifications
              </label>
              <input
                type="text"
                id="certifications"
                name="certifications"
                value={formData.certifications}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blueColor"
                placeholder="E.g. Master Plumber License, EPA Certification, etc. (comma separated)"
              />
              <p className="mt-1 text-sm text-gray-500">Add any relevant licenses or certifications, separated by commas</p>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaShieldAlt className="mr-2 text-blueColor" />
              Background Check
            </h2>
            
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-gray-700">
                To ensure trust and safety on our platform, we require all service providers to authorize a background check.
                This information will be kept secure and confidential.
              </p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="legalName" className="block text-sm font-medium text-gray-700 mb-1">
                Legal Full Name
              </label>
              <input
                type="text"
                id="legalName"
                name="legalName"
                value={formData.legalName}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blueColor"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blueColor"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="ssn" className="block text-sm font-medium text-gray-700 mb-1">
                Last 4 Digits of SSN
              </label>
              <input
                type="text"
                id="ssn"
                name="ssn"
                value={formData.ssn}
                onChange={handleInputChange}
                required
                maxLength="4"
                pattern="[0-9]{4}"
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blueColor"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="driverLicense" className="block text-sm font-medium text-gray-700 mb-1">
                Driver's License Number
              </label>
              <input
                type="text"
                id="driverLicense"
                name="driverLicense"
                value={formData.driverLicense}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blueColor"
              />
            </div>
            
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="criminalHistory"
                  name="criminalHistory"
                  checked={formData.criminalHistory}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blueColor focus:ring-blueColor border-gray-300 rounded"
                />
                <label htmlFor="criminalHistory" className="ml-2 block text-sm text-gray-700">
                  I have a criminal history or pending charges
                </label>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Having a criminal history doesn't automatically disqualify you. We review each case individually.
              </p>
            </div>
            
            {formData.criminalHistory && (
              <div className="mb-6">
                <label htmlFor="criminalHistoryExplanation" className="block text-sm font-medium text-gray-700 mb-1">
                  Please provide details
                </label>
                <textarea
                  id="criminalHistoryExplanation"
                  name="criminalHistoryExplanation"
                  value={formData.criminalHistoryExplanation}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blueColor"
                ></textarea>
              </div>
            )}
            
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="agreeToBgCheck"
                  name="agreeToBgCheck"
                  checked={formData.agreeToBgCheck}
                  onChange={handleInputChange}
                  required
                  className="h-4 w-4 text-blueColor focus:ring-blueColor border-gray-300 rounded"
                />
                <label htmlFor="agreeToBgCheck" className="ml-2 block text-sm text-gray-700">
                  I authorize a background check and verify that all information provided is accurate
                </label>
              </div>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <FaIdCard className="mr-2 text-blueColor" />
              Account Setup
            </h2>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Create Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blueColor"
              />
              <p className="mt-1 text-sm text-gray-500">
                Must be at least 8 characters with a mix of letters, numbers, and symbols
              </p>
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blueColor"
              />
            </div>
            
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  required
                  className="h-4 w-4 text-blueColor focus:ring-blueColor border-gray-300 rounded"
                />
                <label htmlFor="agreeToTerms" className="ml-2 block text-sm text-gray-700">
                  I agree to the <a href="#" className="text-blueColor hover:underline">Terms of Service</a>, <a href="#" className="text-blueColor hover:underline">Privacy Policy</a>, and <a href="#" className="text-blueColor hover:underline">Provider Agreement</a>
                </label>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-medium text-green-800 mb-2 flex items-center">
                <FaCheck className="mr-2" />
                Almost Done!
              </h3>
              <p className="text-green-700">
                After submitting your application, our team will review your information, typically within 1-3 business days.
                You'll receive email updates on your application status.
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-greyIsh-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center text-blueColor mb-8">Service Provider Registration</h1>
          
          {/* Progress Steps */}
          <div className="flex justify-between items-center mb-8">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step 
                    ? 'border-blueColor bg-blueColor text-white' 
                    : 'border-gray-300 bg-white text-gray-500'
                }`}>
                  {step}
                </div>
                <div className={`text-xs mt-2 ${
                  currentStep >= step ? 'text-blueColor' : 'text-gray-500'
                }`}>
                  {step === 1 && 'Basic Info'}
                  {step === 2 && 'Services'}
                  {step === 3 && 'Skills'}
                  {step === 4 && 'Verification'}
                  {step === 5 && 'Account'}
                </div>
              </div>
            ))}
          </div>
          
          <form onSubmit={currentStep === 5 ? handleSubmit : handleNextStep}>
            {renderForm()}
            
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
                {currentStep < 5 ? 'Continue' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProviderRegistration;