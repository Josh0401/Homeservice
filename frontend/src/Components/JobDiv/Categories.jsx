import React, { useState, useEffect } from 'react'
import { BiCategory, BiTimeFive } from 'react-icons/bi'
// Keeping the original MdOutlineEngineering icon in case it's required elsewhere
import { MdOutlineEngineering } from 'react-icons/md'
import { FaTools, FaPaintBrush, FaLaptopCode, FaServer, FaChartLine, FaBuilding } from 'react-icons/fa'

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
  // State for API data
  const [categories, setCategories] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('All Services')

  // Default categories with icons (using exact colors and icons from your original code)
  const defaultCategoryIcons = {
    'Carpentry': { icon: <FaTools />, color: '#FF9800' },
    'Plumbing': { icon: <FaTools />, color: '#4CAF50' },
    'Electrical': { icon: <FaTools />, color: '#2196F3' },
    'Interior Design': { icon: <FaPaintBrush />, color: '#E91E63' },
    'Painting': { icon: <FaPaintBrush />, color: '#9C27B0' },
    'HVAC': { icon: <FaServer />, color: '#607D8B' },
    'Landscaping': { icon: <MdOutlineEngineering />, color: '#3F51B5' },
    'Security': { icon: <FaBuilding />, color: '#FF5722' },
    'Cleaning': { icon: <FaTools />, color: '#00BCD4' },
    'All Services': { icon: <BiCategory />, color: '#795548' },
  }

  // Helper function to categorize services - FIXED VERSION
  const getCategoryForService = (title, serviceData = {}) => {
    // First check if the service has a category property from API
    if (serviceData.category && defaultCategoryIcons[serviceData.category]) {
      return serviceData.category
    }
    
    // Check profession field from API
    if (serviceData.profession) {
      const professionLower = serviceData.profession.toLowerCase()
      if (professionLower.includes('carpenter') || professionLower.includes('carpentry')) {
        return 'Carpentry'
      } else if (professionLower.includes('plumb')) {
        return 'Plumbing'
      } else if (professionLower.includes('electric')) {
        return 'Electrical'
      } else if (professionLower.includes('hvac')) {
        return 'HVAC'
      } else if (professionLower.includes('paint')) {
        return 'Painting'
      } else if (professionLower.includes('landscap') || professionLower.includes('lawn')) {
        return 'Landscaping'
      } else if (professionLower.includes('design')) {
        return 'Interior Design'
      } else if (professionLower.includes('security')) {
        return 'Security'
      } else if (professionLower.includes('clean')) {
        return 'Cleaning'
      }
    }
    
    const titleLower = (title || '').toLowerCase()
    
    // Using exact matching logic but returning specific categories
    if (titleLower.includes('carpenter') || titleLower.includes('carpentry')) {
      return 'Carpentry'
    } else if (titleLower.includes('plumb')) {
      return 'Plumbing'
    } else if (titleLower.includes('electric')) {
      return 'Electrical'
    } else if (titleLower.includes('interior design') || titleLower.includes('design')) {
      return 'Interior Design'
    } else if (titleLower.includes('paint')) {
      return 'Painting'
    } else if (titleLower.includes('lawn') || titleLower.includes('landscap')) {
      return 'Landscaping'
    } else if (titleLower.includes('hvac') || titleLower.includes('air conditioning')) {
      return 'HVAC'
    } else if (titleLower.includes('security')) {
      return 'Security'
    } else if (titleLower.includes('clean')) {
      return 'Cleaning'
    } else {
      // Instead of 'All Services', return a specific category for better visual variety
      const categories = ['Carpentry', 'Plumbing', 'Electrical', 'Painting', 'HVAC']
      const randomIndex = Math.abs(titleLower.length) % categories.length
      return categories[randomIndex]
    }
  }

  // Get category info (color and icon) for a service
  const getCategoryInfo = (title, serviceData = {}) => {
    const category = getCategoryForService(title, serviceData)
    return {
      category,
      ...defaultCategoryIcons[category] || defaultCategoryIcons['Carpentry'] // fallback
    }
  }

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Categories API Response:', data)
      
      // Handle different possible response structures
      let categoriesData = []
      if (Array.isArray(data)) {
        categoriesData = data
      } else if (data.categories && Array.isArray(data.categories)) {
        categoriesData = data.categories
      } else if (data.data && Array.isArray(data.data)) {
        categoriesData = data.data
      } else {
        console.warn('Unexpected categories API response structure:', data)
        throw new Error('Invalid categories data structure')
      }
      
      // Transform categories data to match your component structure
      const categoriesWithIcons = categoriesData.map((category, index) => {
        // Handle different possible category object structures
        const categoryName = category.name || category.title || category.category || category
        const categoryId = category.id || category._id || index + 1
        
        return {
          id: categoryId,
          name: categoryName,
          icon: defaultCategoryIcons[categoryName]?.icon || <FaTools />,
          color: defaultCategoryIcons[categoryName]?.color || '#666666'
        }
      })
      
      // Add "All Services" category at the beginning (using original structure)
      categoriesWithIcons.unshift({
        id: 8,
        name: 'All Services',
        icon: <BiCategory />,
        color: '#795548'
      })
      
      setCategories(categoriesWithIcons)
      console.log('Processed categories:', categoriesWithIcons)
      
    } catch (err) {
      console.error('Error fetching categories:', err)
      // Set default categories on error
      setCategories([
        { id: 0, name: 'All Services', icon: <BiCategory />, color: '#795548' },
        { id: 1, name: 'Carpentry', icon: <FaTools />, color: '#FF9800' },
        { id: 2, name: 'Plumbing', icon: <FaTools />, color: '#4CAF50' },
        { id: 3, name: 'Electrical', icon: <FaTools />, color: '#2196F3' },
        { id: 4, name: 'Interior Design', icon: <FaPaintBrush />, color: '#E91E63' },
        { id: 5, name: 'Painting', icon: <FaPaintBrush />, color: '#9C27B0' },
        { id: 6, name: 'HVAC', icon: <FaServer />, color: '#607D8B' },
        { id: 7, name: 'Landscaping', icon: <MdOutlineEngineering />, color: '#3F51B5' },
        { id: 8, name: 'Security', icon: <FaBuilding />, color: '#FF5722' },
        { id: 9, name: 'Cleaning', icon: <FaTools />, color: '#00BCD4' },
      ])
      throw err // Re-throw to be caught by the main useEffect
    }
  }

  // Fetch professionals from API
  const fetchProfessionals = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/professionals')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Professionals API Response:', data)
      
      // Process the professionals data
      if (data.professionals && Array.isArray(data.professionals)) {
        console.log('Processing', data.professionals.length, 'professionals')
        
        // Transform professionals data to match your component structure
        const servicesWithLogos = data.professionals.map((professional, index) => {
          // Handle location object - convert to string
          let locationString = 'Location not specified'
          if (professional.address && typeof professional.address === 'object') {
            const { city, state } = professional.address
            locationString = [city, state].filter(Boolean).join(', ')
          } else if (professional.address && typeof professional.address === 'string') {
            locationString = professional.address
          } else if (professional.location) {
            if (typeof professional.location === 'string') {
              locationString = professional.location
            } else if (typeof professional.location === 'object') {
              const { city, state } = professional.location
              locationString = [city, state].filter(Boolean).join(', ')
            }
          }

          // Get category info for this professional
          const categoryInfo = getCategoryInfo(
            professional.businessName || professional.fullName || professional.name || '', 
            professional
          )

          const transformedService = {
            id: professional._id || professional.id || index + 1,
            title: professional.businessName || professional.fullName || professional.name || 'Professional Service',
            time: 'Now',
            location: String(locationString),
            desc: professional.bio || professional.description || 'Professional service provider',
            company: professional.businessName || professional.fullName || professional.name,
            category: categoryInfo.category,
            categoryColor: categoryInfo.color,
            categoryIcon: categoryInfo.icon,
            image: getLogoImage((index % 8) + 1),
            phone: professional.phone,
            email: professional.email,
            rating: professional.rating,
            isVerified: professional.isVerified
          }
          
          console.log(`Transformed: ${transformedService.title} → Category: ${transformedService.category} (${transformedService.categoryColor})`)
          return transformedService
        })
        
        setServices(servicesWithLogos)
      } else {
        console.warn('No professionals found in API response')
        setServices([])
      }
      
    } catch (err) {
      console.error('Error fetching professionals:', err)
      setServices([])
      throw err // Re-throw to be caught by the main useEffect
    }
  }

  // Main useEffect to fetch both categories and professionals
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch both categories and professionals in parallel
        await Promise.all([
          fetchCategories(),
          fetchProfessionals()
        ])
        
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Helper function to get logo image based on ID
  const getLogoImage = (logoId) => {
    const logos = [logo1, logo2, logo3, logo4, logo5, logo6, logo7, logo8]
    const index = (logoId - 1) % logos.length
    return logos[index] || logo1
  }

  // Filter services based on selected category
  const filteredServices = selectedCategory === 'All Services' 
    ? services 
    : services.filter(service => {
        // Use the stored category from the service object
        return service.category.toLowerCase() === selectedCategory.toLowerCase()
      })

  // Debug logging for filtered results (simplified)
  console.log('Selected Category:', selectedCategory, '| Services found:', filteredServices.length)

  // Loading state
  if (loading) {
    return (
      <div className="w-full">
        <div className="pageHeader flex flex-col items-center justify-center py-10 bg-greyIsh">
          <h1 className="text-[32px] text-textColor font-bold mb-4">Categories</h1>
          <p className="text-[16px] text-[#959595] max-w-[600px] text-center">
            Loading categories and professionals...
          </p>
        </div>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blueColor"></div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="w-full">
        <div className="pageHeader flex flex-col items-center justify-center py-10 bg-greyIsh">
          <h1 className="text-[32px] text-textColor font-bold mb-4">Categories</h1>
          <p className="text-[16px] text-red-500 max-w-[600px] text-center">
            Error loading data: {error}
          </p>
        </div>
        <div className="flex justify-center items-center py-10">
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blueColor text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="pageHeader flex flex-col items-center justify-center py-10 bg-greyIsh">
        <h1 className="text-[32px] text-textColor font-bold mb-4">Categories</h1>
        <p className="text-[16px] text-[#959595] max-w-[600px] text-center">
          Find reliable professionals for all your home maintenance and improvement needs.
        </p>
      </div>

      {/* Categories Selector */}
      <div className="flex flex-wrap justify-center gap-4 py-8 px-4">
        {categories.map((category) => (
          <div 
            key={category.id}
            onClick={() => setSelectedCategory(category.name)}
            className={`flex items-center gap-2 p-3 rounded-full cursor-pointer transition-all duration-300 ${
              selectedCategory === category.name 
                ? 'bg-blueColor text-white' 
                : 'bg-white text-textColor hover:bg-[#f7f7f7]'
            } shadow-sm`}
          >
            <span style={{ color: selectedCategory === category.name ? 'white' : category.color }}>
              {category.icon}
            </span>
            <span className="text-[14px] font-medium">{category.name}</span>
          </div>
        ))}
      </div>

      {/* Service Listings Section */}
      <div className="jobContainer flex gap-10 justify-center flex-wrap items-center py-10 px-4">
        {filteredServices.length > 0 ? (
          filteredServices.map((service) => (
            <div key={service.id} className="group group/item singleJob w-[250px] p-[20px] bg-white rounded-[10px] hover:bg-blueColor shadow-lg shadow-greyIsh-400/700 hover:shadow-lg">
              {/* Category Badge - FIXED */}
              <div className="category mb-2">
                <span 
                  className="text-[12px] font-medium py-1 px-2 rounded-full flex items-center gap-1" 
                  style={{ 
                    backgroundColor: `${service.categoryColor}20`,
                    color: service.categoryColor
                  }}
                >
                  <span style={{ color: service.categoryColor, fontSize: '10px' }}>
                    {service.categoryIcon}
                  </span>
                  {service.category}
                </span>
              </div>

              <span className='flex justify-between items-center gap-4'>
                <h1 className='text-[16px] font-semibold text-textColor group-hover:text-white'>{service.title || 'Professional Service'}</h1>
                <span className='flex items-center text-[#ccc] gap-1'>
                  <BiTimeFive/>{service.time || 'Now'}
                </span>
              </span>
              <h6 className='text-[#ccc]'>{service.location || 'Location not specified'}</h6>
  
              <p className='text-[13px] text-[#959595] pt-[20px] border-t-[2px] mt-[20px] group-hover:text-white'>
                {service.desc || 'Professional service provider'}
              </p>
  
              <div className='company flex items-center gap-2'>
                <img src={service.image} alt="Company Logo" className='w-[10%]' />
                <span className='text-[14px] py-[1rem] block group-hover:text-white'>{service.company || 'Professional'}</span>
              </div>
  
              <button className='border-[2px] rounded-[10px] block p-[10px] w-full text-[14px] font-semibold text-textColor hover:bg-white group-hover/item:text-textColor group-hover:text-white'>
                Book Now
              </button>
            </div>
          ))
        ) : (
          <div className="emptyResults flex flex-col items-center py-10">
            <h3 className="text-[20px] text-textColor font-semibold mb-2">No services found</h3>
            <p className="text-[#959595]">Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Categories