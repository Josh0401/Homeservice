import React, { useState, useEffect } from 'react'
import { BiTimeFive } from 'react-icons/bi'

// Import your logo images
import logo1 from '../../Assets/logo (1).png'
import logo2 from '../../Assets/logo (2).png'
import logo3 from '../../Assets/logo (3).png'
import logo4 from '../../Assets/logo (4).png'
import logo5 from '../../Assets/logo (5).png'
import logo6 from '../../Assets/logo (6).png'
import logo7 from '../../Assets/logo (7).png'
import logo8 from '../../Assets/logo (8).png'

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('All Services')

  // Category definitions with colors only (no icons)
  const categoryConfig = {
    'Carpentry': { color: '#FF9800' },
    'Plumbing': { color: '#4CAF50' },
    'Electrical': { color: '#2196F3' },
    'Interior Design': { color: '#E91E63' },
    'Painting': { color: '#9C27B0' },
    'HVAC': { color: '#607D8B' },
    'Landscaping': { color: '#3F51B5' },
    'All Services': { color: '#795548' },
  }

  // Helper function to get logo image
  const getLogoImage = (logoId) => {
    const logos = [logo1, logo2, logo3, logo4, logo5, logo6, logo7, logo8]
    const index = (logoId - 1) % logos.length
    return logos[index] || logo1
  }

  // Convert any value to safe string
  const toSafeString = (value, fallback = '') => {
    if (value === null || value === undefined) return fallback
    if (typeof value === 'string') return value
    if (typeof value === 'object' && value.name) return String(value.name)
    if (typeof value === 'object' && value.title) return String(value.title)
    return String(value)
  }

  // Simple category matching
  const getCategoryFromName = (name) => {
    if (!name) return 'General'
    const nameLower = String(name).toLowerCase()
    
    if (nameLower.includes('plumb')) return 'Plumbing'
    if (nameLower.includes('electric')) return 'Electrical'
    if (nameLower.includes('carpent') || nameLower.includes('wood')) return 'Carpentry'
    if (nameLower.includes('paint')) return 'Painting'
    if (nameLower.includes('hvac') || nameLower.includes('air')) return 'HVAC'
    if (nameLower.includes('landscap') || nameLower.includes('garden')) return 'Landscaping'
    if (nameLower.includes('design') || nameLower.includes('interior')) return 'Interior Design'
    if (nameLower.includes('security')) return 'Security'
    if (nameLower.includes('clean')) return 'Cleaning'
    
    return 'General'
  }

  // Fetch services
  const fetchServices = async () => {
    try {
      console.log('🔍 Fetching services from API...')
      const response = await fetch('http://localhost:5000/api/services')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('✅ API Response:', data)
      
      let rawServices = []
      if (data.services && Array.isArray(data.services)) {
        rawServices = data.services
      } else if (Array.isArray(data)) {
        rawServices = data
      }
      
      console.log(`📦 Found ${rawServices.length} raw services`)
      console.log('📋 Raw services:', rawServices)
      
      // Transform each service safely
      const transformedServices = rawServices.map((service, index) => {
        console.log(`\n🔄 Processing service ${index + 1}:`, service)
        
        // Extract safe strings
        const serviceName = toSafeString(service.name || service.title, `Service ${index + 1}`)
        const serviceDesc = toSafeString(service.description, 'Professional service')
        const categoryName = toSafeString(service.category, getCategoryFromName(serviceName))
        
        console.log(`📝 Service: "${serviceName}" → Category: "${categoryName}"`)
        
        // Get category styling
        const categoryStyle = categoryConfig[categoryName] || { color: '#666666' }
        
        // Create safe service object
        const safeService = {
          id: toSafeString(service._id, `service-${index}`),
          title: serviceName,
          time: 'Available',
          location: toSafeString(service.location, 'Location varies'),
          desc: serviceDesc,
          company: toSafeString(service.professionalName || service.businessName, 'Professional'),
          category: categoryName,
          categoryColor: categoryStyle.color,
          image: getLogoImage((index % 8) + 1),
          phone: toSafeString(service.phone),
          email: toSafeString(service.email),
          price: toSafeString(service.price),
          isActive: true
        }
        
        console.log(`✅ Safe service created:`, safeService)
        return safeService
      })
      
      console.log(`🎉 Successfully processed ${transformedServices.length} services`)
      setServices(transformedServices)
      
    } catch (err) {
      console.error('❌ Error fetching services:', err)
      setError(err.message)
    }
  }

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories')
      if (response.ok) {
        const data = await response.json()
        const categoryList = data.categories || data || []
        
        // Create category buttons
        const categoryButtons = categoryList.map((cat, index) => {
          const name = toSafeString(cat.name || cat.title || cat, `Category ${index}`)
          const style = categoryConfig[name] || { color: '#666666' }
          
          return {
            id: index,
            name: name,
            color: style.color
          }
        })
        
        // Add "All Services" at the beginning
        categoryButtons.unshift({
          id: 'all',
          name: 'All Services',
          color: '#795548'
        })
        
        setCategories(categoryButtons)
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
      // Set default categories
      setCategories([
        { id: 'all', name: 'All Services', color: '#795548' },
        { id: 1, name: 'Carpentry', color: '#FF9800' },
        { id: 2, name: 'Plumbing', color: '#4CAF50' },
        { id: 3, name: 'Electrical', color: '#2196F3' },
        { id: 4, name: 'Interior Design', color: '#E91E63' },
        { id: 5, name: 'Painting', color: '#9C27B0' },
        { id: 6, name: 'HVAC', color: '#607D8B' },
        { id: 7, name: 'Landscaping', color: '#3F51B5' },
      ])
    }
  }

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        await Promise.all([fetchCategories(), fetchServices()])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Filter services by category
  const filteredServices = selectedCategory === 'All Services' 
    ? services 
    : services.filter(service => service.category === selectedCategory)

  console.log(`🎯 Showing ${filteredServices.length} services for category: ${selectedCategory}`)

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading services...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full flex justify-center items-center py-20">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="pageHeader flex flex-col items-center justify-center py-10 bg-gray-100">
        <h1 className="text-[32px] text-gray-800 font-bold mb-4">Categories</h1>
        <p className="text-[16px] text-gray-600 max-w-[600px] text-center">
          Find reliable professionals for all your home maintenance and improvement needs.
        </p>
      </div>

      {/* Category Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-4 py-8 px-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.name)}
            className={`p-3 rounded-full transition-all duration-300 ${
              selectedCategory === category.name 
                ? 'bg-blue-500 text-white' 
                : 'bg-white text-gray-800 hover:bg-gray-100'
            } shadow-sm border`}
            style={{
              borderColor: selectedCategory === category.name ? '#3b82f6' : category.color
            }}
          >
            <span className="text-[14px] font-medium" style={{
              color: selectedCategory === category.name ? 'white' : category.color
            }}>
              {category.name}
            </span>
          </button>
        ))}
      </div>

      {/* Services Grid */}
      <div className="flex gap-6 justify-center flex-wrap py-10 px-4">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div 
              key={service.id} 
              className="w-[280px] p-5 bg-white rounded-lg hover:bg-blue-500 shadow-lg transition-all duration-300 group"
            >
              {/* Category Badge */}
              <div className="mb-3">
                <span 
                  className="text-[12px] font-medium py-1 px-3 rounded-full w-fit block" 
                  style={{ 
                    backgroundColor: `${service.categoryColor}20`,
                    color: service.categoryColor
                  }}
                >
                  {service.category}
                </span>
              </div>

              {/* Service Info */}
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-[18px] font-semibold text-gray-800 group-hover:text-white">
                  {service.title}
                </h2>
                <span className="flex items-center text-gray-400 gap-1 text-sm">
                  <BiTimeFive />
                  {service.time}
                </span>
              </div>

              <p className="text-gray-500 mb-1 group-hover:text-gray-200">
                📍 {service.location}
              </p>

              <p className="text-[14px] text-gray-600 pt-4 border-t-2 mt-4 group-hover:text-gray-200">
                {service.desc}
              </p>

              <div className="flex items-center gap-3 mt-4">
                <img src={service.image} alt="Logo" className="w-8 h-8 rounded" />
                <span className="text-[14px] text-gray-700 group-hover:text-gray-200">
                  {service.company}
                </span>
              </div>

              <button className="w-full mt-4 p-3 border-2 border-gray-300 rounded-lg text-[14px] font-semibold text-gray-700 hover:bg-white hover:text-gray-700 group-hover:border-white group-hover:text-gray-700 transition-all">
                Book Now
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <h3 className="text-[20px] text-gray-700 font-semibold mb-2">No services found</h3>
            <p className="text-gray-500">Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Categories