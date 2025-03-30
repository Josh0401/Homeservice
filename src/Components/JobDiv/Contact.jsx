import React, { useState } from 'react'
import { AiOutlineMail } from 'react-icons/ai'
import { FiPhone, FiMapPin } from 'react-icons/fi'
import { BsQuestionCircle, BsClipboardCheck } from 'react-icons/bs'
import { FaDirections, FaTools, FaHome } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const [formStatus, setFormStatus] = useState({
    message: '',
    isError: false,
    isSubmitted: false
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setFormStatus({
        message: 'Please fill in all required fields',
        isError: true,
        isSubmitted: false
      })
      return
    }
    
    // In a real application, you would send the form data to your backend
    // For now, we'll just simulate a successful submission
    setFormStatus({
      message: 'Thank you for your message! We will get back to you soon.',
      isError: false,
      isSubmitted: true
    })
    
    // Reset form after successful submission
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    })
  }

  return (
    <div className="w-full bg-white">
      {/* Page Header */}
      <div className="pageHeader flex flex-col items-center justify-center py-12 bg-greyIsh">
        <h1 className="text-[32px] text-textColor font-bold mb-4">Contact Us</h1>
        <p className="text-[16px] text-[#959595] max-w-[600px] text-center">
          Have questions about our home services or need assistance booking a professional? 
          Our customer support team is here to help!
        </p>
      </div>

      <div className="contactWrapper py-16 px-4 md:px-0">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            
            {/* Contact Information */}
            <div className="contactInfo flex flex-col gap-8">
              <h2 className="text-2xl font-semibold text-textColor">Get In Touch</h2>
              
              <div className="infoCard p-6 rounded-lg shadow-md bg-white border border-[#e7e7e7] hover:border-blueColor transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="icon p-3 bg-blueColor bg-opacity-10 rounded-full">
                    <AiOutlineMail className="text-blueColor text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-textColor mb-1">Email Us</h3>
                    <p className="text-[#959595]">Our team will get back to you within 24 hours</p>
                    <a href="mailto:support@homeservices.com" className="text-blueColor hover:underline mt-2 inline-block">
                      support@homeservices.com
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="infoCard p-6 rounded-lg shadow-md bg-white border border-[#e7e7e7] hover:border-blueColor transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="icon p-3 bg-blueColor bg-opacity-10 rounded-full">
                    <FiPhone className="text-blueColor text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-textColor mb-1">Call Us</h3>
                    <p className="text-[#959595]">Available 7 days a week, 8am-8pm</p>
                    <a href="tel:+1234567890" className="text-blueColor hover:underline mt-2 inline-block">
                      +1 (234) 567-890
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="infoCard p-6 rounded-lg shadow-md bg-white border border-[#e7e7e7] hover:border-blueColor transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="icon p-3 bg-blueColor bg-opacity-10 rounded-full">
                    <FaHome className="text-blueColor text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-textColor mb-1">For Homeowners</h3>
                    <p className="text-[#959595]">Need help with booking or service issues?</p>
                    <Link to="/homeowner-support" className="text-blueColor hover:underline mt-2 inline-block">
                      Homeowner Support
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="infoCard p-6 rounded-lg shadow-md bg-white border border-[#e7e7e7] hover:border-blueColor transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="icon p-3 bg-blueColor bg-opacity-10 rounded-full">
                    <FaTools className="text-blueColor text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-textColor mb-1">For Service Providers</h3>
                    <p className="text-[#959595]">Questions about joining our network?</p>
                    <Link to="/provider-support" className="text-blueColor hover:underline mt-2 inline-block">
                      Provider Support
                    </Link>
                  </div>
                </div>
              </div>
              
              <div className="infoCard p-6 rounded-lg shadow-md bg-white border border-[#e7e7e7] hover:border-blueColor transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="icon p-3 bg-blueColor bg-opacity-10 rounded-full">
                    <BsQuestionCircle className="text-blueColor text-xl" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-textColor mb-1">FAQ</h3>
                    <p className="text-[#959595]">Check our frequently asked questions</p>
                    <Link to="/faq" className="text-blueColor hover:underline mt-2 inline-block">
                      View FAQ
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="contactForm">
              <h2 className="text-2xl font-semibold text-textColor mb-8">Send a Message</h2>
              
              {formStatus.isSubmitted ? (
                <div className="successMessage p-6 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="text-lg font-medium text-green-700 mb-2">Message Sent!</h3>
                  <p className="text-green-600">{formStatus.message}</p>
                  <button 
                    onClick={() => setFormStatus({message: '', isError: false, isSubmitted: false})}
                    className="mt-4 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="formWrapper bg-white rounded-lg p-6 shadow-md border border-[#e7e7e7]">
                  {formStatus.message && formStatus.isError && (
                    <div className="errorMessage p-4 mb-6 bg-red-50 border border-red-200 rounded-md text-red-600">
                      {formStatus.message}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="inputGroup">
                      <label htmlFor="name" className="block text-textColor mb-2">Your Name *</label>
                      <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 rounded-md border border-[#e7e7e7] focus:border-blueColor focus:outline-none"
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    
                    <div className="inputGroup">
                      <label htmlFor="email" className="block text-textColor mb-2">Your Email *</label>
                      <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-3 rounded-md border border-[#e7e7e7] focus:border-blueColor focus:outline-none"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="inputGroup mb-6">
                    <label htmlFor="subject" className="block text-textColor mb-2">Subject</label>
                    <select
                      id="subject" 
                      name="subject" 
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full p-3 rounded-md border border-[#e7e7e7] focus:border-blueColor focus:outline-none"
                    >
                      <option value="">Select a topic</option>
                      <option value="Service Booking">Service Booking</option>
                      <option value="Service Quality">Service Quality</option>
                      <option value="Provider Application">Provider Application</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Billing Question">Billing Question</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div className="inputGroup mb-6">
                    <label htmlFor="message" className="block text-textColor mb-2">Your Message *</label>
                    <textarea 
                      id="message" 
                      name="message" 
                      value={formData.message}
                      onChange={handleChange}
                      rows="6" 
                      className="w-full p-3 rounded-md border border-[#e7e7e7] focus:border-blueColor focus:outline-none resize-none"
                      placeholder="How can we help you with your home service needs?"
                      required
                    ></textarea>
                  </div>
                  
                  <button 
                    type="submit"
                    className="py-3 px-6 bg-blueColor text-white rounded-md hover:bg-opacity-90 transition-all"
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Google Maps */}
      <div className="mapContainer mb-16">
        <h2 className="text-2xl font-semibold text-textColor mb-6 text-center">Find Us</h2>
        <div className="h-[400px] w-full relative overflow-hidden rounded-lg shadow-md">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3742.1969104712013!2d57.35996801531879!3d-20.296126986395803!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x217c5a0fb5806a63%3A0xb5a4f8d9b5f714ab!2sMiddlesex%20University%20Mauritius%20-%20Uniciti!5e0!3m2!1sen!2smu!4v1678303845174!5m2!1sen!2smu" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="HomeServices Office Location"
            className="absolute top-0 left-0"
          ></iframe>
          <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-md border border-[#e7e7e7] max-w-[300px]">
            <h3 className="font-semibold text-textColor">HomeServices Headquarters</h3>
            <p className="text-sm text-[#959595]">Middlesex University Mauritius - Uniciti</p>
            <p className="text-sm text-[#959595]">Coastal Road, Flic-en-Flac, Mauritius</p>
            <p className="text-sm text-[#959595]">Customer Support: 8am-8pm, 7 days a week</p>
            <a 
              href="https://maps.google.com/maps?daddr=Middlesex+University+Mauritius+Uniciti" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blueColor hover:underline mt-2 inline-flex items-center gap-1"
            >
              <FaDirections /> Get Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact