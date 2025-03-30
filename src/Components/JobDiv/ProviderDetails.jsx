import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaUserCircle, FaStar, FaRegStar, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa'
import { Data } from './Jobs'

const ProviderDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [provider, setProvider] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [availableTimeSlots, setAvailableTimeSlots] = useState([])

  useEffect(() => {
    // Find the provider by id from the Data array
    const foundProvider = Data.find(item => item.id === parseInt(id))
    
    if (foundProvider) {
      setProvider(foundProvider)
    }
    
    setLoading(false)
  }, [id])

  // Generate calendar data for the current month view
  const getCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    
    // Get first day of the month
    const firstDayOfMonth = new Date(year, month, 1)
    // Get last day of the month
    const lastDayOfMonth = new Date(year, month + 1, 0)
    
    // Get day of week for first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDayOfMonth.getDay()
    
    // Array to hold all the days we'll display
    const calendarDays = []
    
    // Add previous month's days to fill first week
    for (let i = firstDayOfWeek; i > 0; i--) {
      const prevMonthDay = new Date(year, month, 1 - i)
      calendarDays.push({
        date: prevMonthDay,
        isCurrentMonth: false,
        isSelectable: false
      })
    }
    
    // Add current month's days
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(year, month, day)
      // Check if date is in the past
      const isPast = date < today
      // Check if it's a weekend
      const isWeekend = date.getDay() === 0 || date.getDay() === 6
      
      calendarDays.push({
        date,
        isCurrentMonth: true,
        isSelectable: !isPast && !isWeekend,
        isToday: date.toDateString() === today.toDateString()
      })
    }
    
    // Add next month's days to complete the calendar grid (to make 6 rows of 7 days)
    const daysToAdd = 42 - calendarDays.length
    for (let day = 1; day <= daysToAdd; day++) {
      const nextMonthDay = new Date(year, month + 1, day)
      calendarDays.push({
        date: nextMonthDay,
        isCurrentMonth: false,
        isSelectable: false
      })
    }
    
    return calendarDays
  }
  
  // Go to previous month
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
    setSelectedDate(null)
    setSelectedTimeSlot(null)
  }
  
  // Go to next month
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
    setSelectedDate(null)
    setSelectedTimeSlot(null)
  }
  
  // Format date for display and for the booking form
  const formatDateForDisplay = (date) => {
    return date.toLocaleDateString() // Returns date in local format (e.g., MM/DD/YYYY)
  }
  
  // Format date as "YYYY-MM-DD" for HTML date inputs
  const formatDateForInput = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  
  // Handle date selection
  const handleDateSelect = (day) => {
    if (!day.isSelectable) return
    
    setSelectedDate(day.date)
    
    // Generate random available time slots for the selected date
    // This would normally come from your backend API
    generateAvailableTimeSlots(day.date)
  }
  
  // Generate random time slots for demo purposes
  // In a real app, you would fetch this from your backend
  const generateAvailableTimeSlots = (date) => {
    const slots = []
    const baseSlots = [
      '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', 
      '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', 
      '4:00 PM', '5:00 PM', '6:00 PM'
    ]
    
    // Generate a somewhat random but consistent pattern based on the date
    const dateHash = date.getDate() + date.getMonth()
    
    baseSlots.forEach((slot, index) => {
      // Use the dateHash to determine if the slot is available
      const isAvailable = (dateHash + index) % 3 !== 0
      if (isAvailable) {
        slots.push(slot)
      }
    })
    
    setAvailableTimeSlots(slots)
    setSelectedTimeSlot(null)
  }
  
  // Handle time slot selection
  const handleTimeSlotSelect = (slot) => {
    setSelectedTimeSlot(slot)
  }
  
  // Handle proceed to booking
  const proceedToBooking = () => {
    if (selectedDate && selectedTimeSlot) {
      // In a real app, you'd save this selection to state or context
      // For now, we'll just navigate to the booking page
      navigate(`/provider/${id}/book`, {
        state: {
          selectedDate: formatDateForInput(selectedDate),
          selectedTime: selectedTimeSlot
        }
      })
    }
  }

  // Render star ratings
  const renderStars = (ratingString) => {
    if (!ratingString) return null
    
    // Extract the numeric part of the rating (e.g., "4.8" from "4.8 (124)")
    const ratingValue = parseFloat(ratingString.split(' ')[0])
    const fullStars = Math.floor(ratingValue)
    const hasHalfStar = ratingValue - fullStars >= 0.5
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return <FaStar key={index} className="text-yellow-400" />
          } else if (index === fullStars && hasHalfStar) {
            return <FaStar key={index} className="text-yellow-400" />
          } else {
            return <FaRegStar key={index} className="text-gray-300" />
          }
        })}
        <span className="ml-2 text-gray-600">{ratingString}</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p>Loading provider details...</p>
        </div>
      </div>
    )
  }

  if (!provider) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center text-blueColor mb-6 hover:underline"
        >
          <FaArrowLeft className="mr-2" /> Back to results
        </button>
        
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Provider Not Found</h1>
          <p>We couldn't find a provider with ID: {id}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <button 
        onClick={() => navigate('/')}
        className="flex items-center text-blueColor mb-6 hover:underline"
      >
        <FaArrowLeft className="mr-2" /> Back to results
      </button>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Provider header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-greyIsh-100 rounded-full flex items-center justify-center">
            {provider.image ? (
              <img src={provider.image} alt={provider.title} className="w-full h-full rounded-full object-cover" />
            ) : (
              <FaUserCircle className="text-6xl text-gray-400" />
            )}
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-1">{provider.title}</h1>
            <h2 className="text-xl text-greyIsh-600 mb-2">{provider.profession}</h2>
            
            <div className="flex flex-wrap gap-4 items-center text-greyIsh-600">
              <div className="flex items-center gap-1">
                <FaMapMarkerAlt className="text-blueColor" />
                <span>{provider.location}</span>
              </div>
              
              {provider.company && (
                <div className="flex items-center gap-1">
                  <span>Works with:</span>
                  <span className="font-medium">{provider.company}</span>
                </div>
              )}
              
              {provider.rating && (
                <div>
                  {renderStars(provider.rating)}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <div className="text-2xl font-bold text-blueColor">
              ${provider.price}/hr
            </div>
            <button 
              className="bg-blueColor text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-600 w-full"
              onClick={() => navigate(`/provider/${id}/book`)}
            >
              Book Now
            </button>
          </div>
        </div>
        
        {/* Provider details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column - About & Services */}
          <div className="md:col-span-2 space-y-8">
            {/* About section */}
            <section>
              <h3 className="text-xl font-semibold mb-4 pb-2 border-b">About</h3>
              <p className="text-greyIsh-600 leading-relaxed">{provider.desc}</p>
            </section>
            
            {/* Availability Calendar Section */}
            <section className="border rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaCalendarAlt className="text-blueColor mr-2" />
                Availability
              </h3>
              
              <div className="mb-4">
                {/* Calendar navigation */}
                <div className="flex justify-between items-center mb-4">
                  <button 
                    onClick={prevMonth}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    &lt;
                  </button>
                  
                  <h4 className="text-lg font-medium">
                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </h4>
                  
                  <button 
                    onClick={nextMonth}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    &gt;
                  </button>
                </div>
                
                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Day labels */}
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center font-medium text-sm py-2">
                      {day}
                    </div>
                  ))}
                  
                  {/* Calendar days */}
                  {getCalendarDays().map((day, index) => (
                    <div 
                      key={index}
                      onClick={() => handleDateSelect(day)}
                      className={`
                        text-center py-2 rounded-md cursor-pointer transition-colors
                        ${!day.isCurrentMonth ? 'text-gray-300' : ''}
                        ${day.isToday ? 'border border-blue-200' : ''}
                        ${day.isSelectable 
                          ? 'hover:bg-blue-50' 
                          : 'cursor-not-allowed opacity-50'}
                        ${selectedDate && day.date.toDateString() === selectedDate.toDateString() 
                          ? 'bg-blueColor text-white' 
                          : ''}
                      `}
                    >
                      {day.date.getDate()}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Time slot selection */}
              {selectedDate && (
                <div>
                  <h4 className="text-lg font-medium mb-2">
                    Available Times for {selectedDate.toLocaleDateString()}
                  </h4>
                  
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-4">
                    {availableTimeSlots.length > 0 ? (
                      availableTimeSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => handleTimeSlotSelect(slot)}
                          className={`
                            py-2 px-3 rounded-md text-center transition-colors
                            ${selectedTimeSlot === slot 
                              ? 'bg-blueColor text-white' 
                              : 'bg-gray-100 hover:bg-gray-200'}
                          `}
                        >
                          {slot}
                        </button>
                      ))
                    ) : (
                      <p className="col-span-4 text-gray-500">No available slots for this date.</p>
                    )}
                  </div>
                  
                  {selectedTimeSlot && (
                    <div className="mt-4 text-center">
                      <button 
                        onClick={proceedToBooking}
                        className="bg-blueColor text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-600"
                      >
                        Book for {selectedDate.toLocaleDateString()} at {selectedTimeSlot}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </section>
            
            {/* Services & Previous Work */}
            {provider.previousWorks && provider.previousWorks.length > 0 && (
              <section>
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b">Previous Work</h3>
                <div className="space-y-4">
                  {provider.previousWorks.map((work, index) => (
                    <div key={index} className="bg-greyIsh-50 p-4 rounded-lg">
                      <h4 className="font-medium text-lg mb-1">{work.title}</h4>
                      <p className="text-greyIsh-600">{work.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
          
          {/* Right column - Qualifications & Booking info */}
          <div className="space-y-8">
            {/* Qualifications */}
            {provider.qualifications && provider.qualifications.length > 0 && (
              <section>
                <h3 className="text-xl font-semibold mb-4 pb-2 border-b">Qualifications</h3>
                <ul className="space-y-2">
                  {provider.qualifications.map((qualification, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blueColor mr-2">•</span>
                      <span>{qualification}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            
            {/* Availability info box */}
            <section className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="text-lg font-semibold mb-4 text-blueColor">Ready to book?</h3>
              <p className="mb-4 text-greyIsh-600">
                This provider typically responds within {provider.time || 'a few hours'}.
              </p>
              <div className="flex items-center gap-2 text-greyIsh-600 mb-4">
                <FaClock className="text-blueColor" />
                <span>Hourly rate: ${provider.price}</span>
              </div>
              
              {selectedDate && selectedTimeSlot ? (
                <div className="mb-4 p-3 bg-green-50 rounded-md border border-green-100">
                  <div className="flex items-center mb-2">
                    <FaCheckCircle className="text-green-500 mr-2" />
                    <span className="font-medium">Selected Appointment</span>
                  </div>
                  <p className="text-gray-700">
                    {selectedDate.toLocaleDateString()} at {selectedTimeSlot}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-600 mb-4">
                  Select a date and time from the calendar to book this provider.
                </p>
              )}
              
              <button 
                className={`w-full py-3 px-6 rounded-md font-semibold ${
                  selectedDate && selectedTimeSlot 
                    ? 'bg-blueColor text-white hover:bg-blue-600' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
                onClick={selectedDate && selectedTimeSlot ? proceedToBooking : undefined}
              >
                {selectedDate && selectedTimeSlot ? 'Confirm & Book' : 'Select a Date & Time'}
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProviderDetails