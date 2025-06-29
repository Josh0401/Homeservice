import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaClock,
  FaSave,
  FaPlusCircle,
  FaTimesCircle
} from 'react-icons/fa';

const AvailabilityPage = () => {
  // Sample data for weekly availability
  const [weeklyAvailability, setWeeklyAvailability] = useState({
    monday: [
      { id: 1, start: '09:00', end: '12:00' },
      { id: 2, start: '13:00', end: '17:00' }
    ],
    tuesday: [
      { id: 3, start: '09:00', end: '12:00' },
      { id: 4, start: '13:00', end: '17:00' }
    ],
    wednesday: [
      { id: 5, start: '09:00', end: '12:00' },
      { id: 6, start: '13:00', end: '17:00' }
    ],
    thursday: [
      { id: 7, start: '09:00', end: '12:00' },
      { id: 8, start: '13:00', end: '17:00' }
    ],
    friday: [
      { id: 9, start: '09:00', end: '12:00' },
      { id: 10, start: '13:00', end: '16:00' }
    ],
    saturday: [
      { id: 11, start: '10:00', end: '14:00' }
    ],
    sunday: []
  });

  // Sample data for special dates (unavailable)
  const [specialDates, setSpecialDates] = useState([
    { id: 1, date: '2025-04-15', reason: 'Personal Day' },
    { id: 2, date: '2025-05-01', reason: 'Holiday' }
  ]);

  // Add new time slot to a day
  const addTimeSlot = (day) => {
    const newTimeSlot = {
      id: Date.now(), // Simple way to generate unique id
      start: '09:00',
      end: '17:00'
    };
    
    setWeeklyAvailability({
      ...weeklyAvailability,
      [day]: [...weeklyAvailability[day], newTimeSlot]
    });
  };

  // Remove time slot from a day
  const removeTimeSlot = (day, id) => {
    setWeeklyAvailability({
      ...weeklyAvailability,
      [day]: weeklyAvailability[day].filter(slot => slot.id !== id)
    });
  };

  // Update time slot
  const updateTimeSlot = (day, id, field, value) => {
    setWeeklyAvailability({
      ...weeklyAvailability,
      [day]: weeklyAvailability[day].map(slot => 
        slot.id === id ? { ...slot, [field]: value } : slot
      )
    });
  };

  // Add special date (unavailable)
  const addSpecialDate = () => {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    
    const newDate = {
      id: Date.now(),
      date: formattedDate,
      reason: ''
    };
    
    setSpecialDates([...specialDates, newDate]);
  };

  // Remove special date
  const removeSpecialDate = (id) => {
    setSpecialDates(specialDates.filter(date => date.id !== id));
  };

  // Update special date
  const updateSpecialDate = (id, field, value) => {
    setSpecialDates(specialDates.map(date => 
      date.id === id ? { ...date, [field]: value } : date
    ));
  };

  // Get formatted day name
  const formatDayName = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  // Save availability settings
  const saveAvailability = () => {
    // In a real app, this would send data to an API
    alert('Availability settings saved!');
  };

  return (
    <div className="bg-greyIsh-50 min-h-screen pb-8">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link to="/provider/dashboard" className="text-gray-600 hover:text-blueColor mr-4">
            <FaArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-blueColor">Manage Availability</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 pt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Weekly Availability */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <FaCalendarAlt className="mr-2 text-blueColor" />
                  Weekly Availability
                </h2>
                <button 
                  onClick={saveAvailability}
                  className="px-4 py-2 bg-blueColor text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
                >
                  <FaSave className="mr-2" /> Save Changes
                </button>
              </div>
              
              <div className="space-y-6">
                {Object.keys(weeklyAvailability).map(day => (
                  <div key={day} className="border-b pb-4 last:border-b-0">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium">{formatDayName(day)}</h3>
                      <button 
                        onClick={() => addTimeSlot(day)}
                        className="text-sm text-blueColor hover:underline flex items-center"
                      >
                        <FaPlusCircle className="mr-1" /> Add Time Slot
                      </button>
                    </div>
                    
                    {weeklyAvailability[day].length > 0 ? (
                      <div className="space-y-3">
                        {weeklyAvailability[day].map(slot => (
                          <div key={slot.id} className="flex items-center space-x-2">
                            <div className="flex items-center">
                              <FaClock className="text-gray-400 mr-2" />
                              <select
                                value={slot.start}
                                onChange={(e) => updateTimeSlot(day, slot.id, 'start', e.target.value)}
                                className="border p-2 rounded"
                              >
                                {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                                  <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                                    {hour.toString().padStart(2, '0')}:00
                                  </option>
                                ))}
                              </select>
                              <span className="mx-2">to</span>
                              <select
                                value={slot.end}
                                onChange={(e) => updateTimeSlot(day, slot.id, 'end', e.target.value)}
                                className="border p-2 rounded"
                              >
                                {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                                  <option key={hour} value={`${hour.toString().padStart(2, '0')}:00`}>
                                    {hour.toString().padStart(2, '0')}:00
                                  </option>
                                ))}
                              </select>
                            </div>
                            <button 
                              onClick={() => removeTimeSlot(day, slot.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTimesCircle />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 italic">Not available</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Special Dates */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold flex items-center">
                  <FaCalendarAlt className="mr-2 text-blueColor" />
                  Special Dates
                </h2>
                <button 
                  onClick={addSpecialDate}
                  className="px-3 py-1 text-sm bg-blueColor text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
                >
                  <FaPlusCircle className="mr-1" /> Add Date
                </button>
              </div>
              
              <div className="space-y-4">
                {specialDates.length > 0 ? (
                  specialDates.map(specialDate => (
                    <div key={specialDate.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex flex-1">
                          <input
                            type="date"
                            value={specialDate.date}
                            onChange={(e) => updateSpecialDate(specialDate.id, 'date', e.target.value)}
                            className="border p-2 rounded w-full"
                          />
                        </div>
                        <button 
                          onClick={() => removeSpecialDate(specialDate.id)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <FaTimesCircle />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Reason (optional)"
                        value={specialDate.reason}
                        onChange={(e) => updateSpecialDate(specialDate.id, 'reason', e.target.value)}
                        className="border p-2 rounded w-full"
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No special dates added
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Add dates when you're unavailable or have limited hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityPage;