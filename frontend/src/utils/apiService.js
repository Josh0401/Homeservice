// apiService.js - Centralized API service for professionals
// Location: src/utils/apiService.js

const API_BASE_URL = 'http://localhost:5000/api'

// API endpoints
const ENDPOINTS = {
  PROFESSIONALS: '/auth/professionals',  // Correct endpoint path
  PROFESSIONAL_BY_ID: (id) => `/auth/professionals/${id}`,
  BOOKING: '/bookings',
  AVAILABILITY: (id) => `/professionals/${id}/availability`
}

// Generic fetch function with error handling
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error)
    throw error
  }
}

// Fetch all professionals
export const fetchProfessionals = async () => {
  console.log('Attempting to fetch professionals from:', `${API_BASE_URL}${ENDPOINTS.PROFESSIONALS}`)
  
  try {
    const response = await fetch(`${API_BASE_URL}${ENDPOINTS.PROFESSIONALS}`)
    
    console.log('Response status:', response.status)
    console.log('Response ok:', response.ok)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error Response:', errorText)
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }
    
    const data = await response.json()
    console.log('API Response data:', data)
    return data
  } catch (error) {
    console.error('Fetch error details:', error)
    throw error
  }
}

// Fetch a single professional by ID
export const fetchProfessionalById = async (id) => {
  return await apiRequest(ENDPOINTS.PROFESSIONAL_BY_ID(id))
}

// Fetch availability for a professional
export const fetchProfessionalAvailability = async (id, date) => {
  const params = date ? `?date=${date}` : ''
  return await apiRequest(`${ENDPOINTS.AVAILABILITY(id)}${params}`)
}

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getAuthToken()
  return !!token
}

// Get current user info (if you need it)
export const getCurrentUser = () => {
  try {
    const userInfo = localStorage.getItem('user') || localStorage.getItem('currentUser')
    return userInfo ? JSON.parse(userInfo) : null
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

const getAuthToken = () => {
  // Try to get token from localStorage
  const token = localStorage.getItem('authToken') || 
                localStorage.getItem('token') || 
                localStorage.getItem('accessToken')
  
  return token
}

// Create a booking
export const createBooking = async (bookingData) => {
  console.log('=== CREATE BOOKING DEBUG ===')
  console.log('Full booking data being sent:', JSON.stringify(bookingData, null, 2))
  
  // Check each required field specifically
  console.log('Required fields validation:')
  console.log('serviceId:', bookingData.serviceId, typeof bookingData.serviceId)
  console.log('title:', bookingData.title, typeof bookingData.title)
  console.log('description:', bookingData.description, typeof bookingData.description)
  console.log('preferredDate:', bookingData.preferredDate, typeof bookingData.preferredDate)
  console.log('time:', bookingData.time, typeof bookingData.time)
  console.log('location:', bookingData.location, typeof bookingData.location)
  
  try {
    const token = getAuthToken()
    console.log('Auth token found:', token ? 'Yes' : 'No')
    
    const headers = {
      'Content-Type': 'application/json',
    }
    
    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
      console.log('Added Authorization header')
    }
    
    console.log('Request headers:', headers)
    console.log('Request URL:', `${API_BASE_URL}/bookings`)
    
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers,
      body: JSON.stringify(bookingData)
    })
    
    console.log('Booking API response status:', response.status)
    console.log('Response headers:', response.headers)
    
    const responseText = await response.text()
    console.log('Raw response text:', responseText)
    
    if (!response.ok) {
      console.error('Booking API Error Response:', responseText)
      
      // Handle specific 401 error
      if (response.status === 401) {
        throw new Error('Authentication required. Please log in to create a booking.')
      }
      
      throw new Error(`HTTP error! status: ${response.status}, message: ${responseText}`)
    }
    
    const result = JSON.parse(responseText)
    console.log('Booking created successfully:', result)
    return result
  } catch (error) {
    console.error('Create booking error:', error)
    throw error
  }
}

// Transform API data to match component structure
export const transformProfessionalData = (professional, index = 0) => {
  console.log('Transforming professional:', professional)
  
  // Default logo images
  const defaultLogos = [
    '/src/Assets/logo (1).png',
    '/src/Assets/logo (2).png',
    '/src/Assets/logo (3).png',
    '/src/Assets/logo (4).png',
    '/src/Assets/logo (5).png',
    '/src/Assets/logo (6).png',
    '/src/Assets/logo (7).png',
    '/src/Assets/logo (8).png'
  ]

  // Handle location from address object
  let locationString = 'Location TBD'
  if (professional.address) {
    const { city, state } = professional.address
    const parts = []
    if (city) parts.push(city)
    if (state) parts.push(state)
    locationString = parts.join(', ') || 'Location TBD'
  }

  // Handle services array - join them or take first one
  let professionString = 'Service Provider'
  if (professional.services && Array.isArray(professional.services) && professional.services.length > 0) {
    // Take first service or join multiple services
    professionString = professional.services.length === 1 
      ? professional.services[0] 
      : professional.services.slice(0, 2).join(' & ') // Take first 2 services
  }

  // Determine availability/response time
  let availabilityString = 'Same Day'
  if (professional.isActive) {
    availabilityString = 'Available Now'
  } else {
    availabilityString = 'Contact for Availability'
  }

  const transformed = {
    id: professional._id || professional.id || `prof-${index + 1}`,
    
    // Use a default professional image icon (string, not object)
    image: professional.profileImage || 
           professional.avatar || 
           defaultLogos[index % defaultLogos.length],
    
    // Use fullName as title
    title: professional.fullName || 'Professional',
    
    // Use services array for profession
    profession: professionString,
    
    // Set availability based on isActive status
    time: availabilityString,
    
    // Location from address object
    location: locationString,
    
    // Description - create one if not available
    desc: professional.bio || 
          professional.description || 
          `Experienced ${professionString.toLowerCase()} professional ready to help with your needs.`,
    
    // Use businessName as company (string, not object)
    company: professional.businessName || 'Independent Professional',
    
    // Format rating properly
    rating: professional.rating > 0 
      ? `${professional.rating} (0)` // No review count in your data yet
      : '0 (0)',
    
    // Use hourlyRate for price
    price: professional.hourlyRate || 50,
    
    // Additional fields
    qualifications: professional.certifications || [],
    previousWorks: professional.portfolio || [],
    isVerified: professional.isVerified || false,
    isActive: professional.isActive || false,
    services: professional.services || [],
    // Keep original data for reference
    originalData: professional
  }

  console.log('Transformed professional:', transformed)
  return transformed
}

// Transform array of professionals
export const transformProfessionalsData = (responseData) => {
  console.log('transformProfessionalsData: Input data:', responseData)
  
  // Handle the API response format: {success: true, count: 1, professionals: Array(1)}
  let professionalsArray = responseData
  
  // Extract the professionals array from the response
  if (responseData && typeof responseData === 'object') {
    if (responseData.professionals && Array.isArray(responseData.professionals)) {
      professionalsArray = responseData.professionals
      console.log('transformProfessionalsData: Found professionals array with', professionalsArray.length, 'items')
    } else if (responseData.data && Array.isArray(responseData.data)) {
      professionalsArray = responseData.data
      console.log('transformProfessionalsData: Found data array with', professionalsArray.length, 'items')
    } else if (Array.isArray(responseData)) {
      professionalsArray = responseData
      console.log('transformProfessionalsData: Input is already an array with', professionalsArray.length, 'items')
    } else {
      console.error('transformProfessionalsData: Could not find professionals array in response:', responseData)
      return []
    }
  }
  
  // Ensure we have an array to work with
  if (!Array.isArray(professionalsArray)) {
    console.error('transformProfessionalsData: Expected array but got:', typeof professionalsArray)
    return []
  }
  
  // Transform each professional
  const transformedData = professionalsArray.map((professional, index) => 
    transformProfessionalData(professional, index)
  )
  
  console.log('transformProfessionalsData: Successfully transformed', transformedData.length, 'professionals')
  return transformedData
}

// Error handling utility
export const handleApiError = (error) => {
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return 'Network error. Please check your connection and try again.'
  }
  
  if (error.message.includes('404')) {
    return 'The requested resource was not found.'
  }
  
  if (error.message.includes('500')) {
    return 'Server error. Please try again later.'
  }
  
  return error.message || 'An unexpected error occurred.'
}

// Cache management (optional - for better performance)
class ApiCache {
  constructor(ttl = 5 * 60 * 1000) { // 5 minutes default TTL
    this.cache = new Map()
    this.ttl = ttl
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  get(key) {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  clear() {
    this.cache.clear()
  }
}

export const apiCache = new ApiCache()

// Cached fetch functions
export const fetchProfessionalsWithCache = async () => {
  const cacheKey = 'professionals'
  const cached = apiCache.get(cacheKey)
  
  if (cached) {
    return cached
  }

  const data = await fetchProfessionals()
  apiCache.set(cacheKey, data)
  return data
}

export const fetchProfessionalByIdWithCache = async (id) => {
  const cacheKey = `professional_${id}`
  const cached = apiCache.get(cacheKey)
  
  if (cached) {
    return cached
  }

  const data = await fetchProfessionalById(id)
  apiCache.set(cacheKey, data)
  return data
}