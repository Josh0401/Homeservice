import React, { useState, useEffect } from 'react'

// Imported Icons from React Icons ====>
import {AiOutlineSearch} from 'react-icons/ai'
import {AiOutlineCloseCircle} from 'react-icons/ai'
import {BsHouseDoor} from 'react-icons/bs'
import {CiLocationOn} from 'react-icons/ci'
import {FaTools} from 'react-icons/fa'

const Search = ({ setFilteredJobs, originalJobs, loading = false }) => {
  // State for search inputs
  const [search, setSearch] = useState({
    title: '',
    company: '',
    location: ''
  })

  // State for filters
  const [filters, setFilters] = useState({
    sort: 'relevance',
    type: 'all',
    level: 'all'
  })

  // Handle search input changes
  const handleSearchChange = (e) => {
    const { name, value } = e.target
    setSearch({
      ...search,
      [name]: value
    })
  }

  // Clear individual search field
  const clearSearchField = (field) => {
    setSearch({
      ...search,
      [field]: ''
    })
  }

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({
      ...filters,
      [name]: value
    })
  }

  // Clear all filters and search
  const clearAll = () => {
    setSearch({
      title: '',
      company: '',
      location: ''
    })
    setFilters({
      sort: 'relevance',
      type: 'all',
      level: 'all'
    })
  }

  // Helper function to safely extract text from various field structures
  const extractText = (field) => {
    if (!field) return ''
    if (typeof field === 'string') return field.toLowerCase()
    if (typeof field === 'object' && field.name) return field.name.toLowerCase()
    if (typeof field === 'object' && field.title) return field.title.toLowerCase()
    return String(field).toLowerCase()
  }

  // Helper function to get rating value from different formats
  const getRatingValue = (rating) => {
    if (!rating) return 0
    if (typeof rating === 'number') return rating
    if (typeof rating === 'object' && rating.average !== undefined) return rating.average
    if (typeof rating === 'string') {
      const ratingMatch = rating.match(/(\d+\.?\d*)/)
      return ratingMatch ? parseFloat(ratingMatch[1]) : 0
    }
    return 0
  }

  // Helper function to get price value from different formats
  const getPriceValue = (service) => {
    if (!service) return 0
    
    // Handle pricing object structure from API
    if (service.pricing && service.pricing.amount) return service.pricing.amount
    if (service.price) return service.price
    if (service.hourlyRate) return service.hourlyRate
    
    return 0
  }

  // Get service category from the actual category field OR profession/services array
  const getServiceCategory = (service) => {
    // Handle services API structure
    if (service.category && service.category.name) {
      const categoryName = extractText(service.category.name)
      console.log('Service category for:', service.title, 'Category:', categoryName)
      return categoryName
    }
    
    // Handle transformed professionals data structure
    if (service.profession) {
      const profession = extractText(service.profession)
      console.log('Service category for:', service.title, 'Profession:', profession)
      return profession
    }
    
    // Handle services array from professionals
    if (service.services && Array.isArray(service.services)) {
      console.log('Service category for:', service.title, 'Services array:', service.services)
      // Return the first service category, converted to lowercase
      if (service.services.length > 0) {
        return service.services[0].toLowerCase()
      }
    }
    
    // Fallback - try to infer from title
    const title = extractText(service.title || '')
    console.log('Service category for:', service.title, 'Inferring from title:', title)
    
    if (title.includes('plumbing') || title.includes('plumber')) return 'plumbing'
    if (title.includes('electrical') || title.includes('electrician')) return 'electrical'
    if (title.includes('hvac') || title.includes('heating') || title.includes('cooling')) return 'hvac'
    if (title.includes('carpentry') || title.includes('carpenter')) return 'carpentry'
    if (title.includes('cleaning') || title.includes('cleaner')) return 'cleaning'
    if (title.includes('painting') || title.includes('painter')) return 'painting'
    if (title.includes('roofing') || title.includes('roofer')) return 'roofing'
    if (title.includes('flooring')) return 'flooring'
    if (title.includes('appliance')) return 'appliance repair'
    
    console.log('Service category for:', service.title, 'Defaulting to general')
    return 'general'
  }

  // Check if service is available for emergency/immediate booking
  const isEmergencyService = (service) => {
    const category = getServiceCategory(service)
    const title = extractText(service.title || '')
    const description = extractText(service.description || service.desc || '')
    
    console.log('Checking emergency for:', service.title, 'Category:', category)
    
    // Emergency service types based on category names
    const emergencyCategories = ['plumbing', 'electrical', 'hvac', 'appliance repair', 'security']
    const isEmergency = emergencyCategories.includes(category) || 
                       title.includes('emergency') || 
                       description.includes('emergency') ||
                       title.includes('urgent') ||
                       (service.time && extractText(service.time).includes('now'))
    
    console.log('Is emergency:', isEmergency)
    return isEmergency
  }

  // Check if service offers in-home services
  const isInHomeService = (service) => {
    const category = getServiceCategory(service)
    const title = extractText(service.title || '')
    
    console.log('Checking in-home for:', service.title, 'Category:', category)
    
    // Most services are in-home services - be very inclusive
    const inHomeCategories = [
      'plumbing', 'electrical', 'carpentry', 'painting', 
      'cleaning', 'appliance repair', 'flooring', 'hvac', 
      'roofing', 'landscaping', 'handyman', 'maintenance',
      'general' // Include general category as well
    ]
    const isInHome = inHomeCategories.includes(category) || 
                     title.includes('home') || 
                     title.includes('house') ||
                     title.includes('residential') ||
                     title.includes('indoor') ||
                     category !== 'automotive' // Exclude only clearly non-home services
    
    console.log('Is in-home:', isInHome)
    return isInHome
  }

  // Check if service offers installation services
  const isInstallationService = (service) => {
    const category = getServiceCategory(service)
    const title = extractText(service.title || '')
    const description = extractText(service.description || service.desc || '')
    
    console.log('Checking installation for:', service.title, 'Category:', category)
    
    // Installation service types - be more inclusive
    const installationCategories = [
      'electrical', 'hvac', 'appliance repair', 'flooring', 
      'roofing', 'security', 'plumbing', 'carpentry'
    ]
    const isInstallation = installationCategories.includes(category) || 
                          title.includes('installation') || 
                          title.includes('install') ||
                          description.includes('installation') ||
                          title.includes('setup') ||
                          title.includes('repair') // Many repair services also do installation
    
    console.log('Is installation:', isInstallation)
    return isInstallation
  }

  // Check if service offers recurring services
  const isRecurringService = (service) => {
    const category = getServiceCategory(service)
    const title = extractText(service.title || '')
    const description = extractText(service.description || service.desc || '')
    
    console.log('Checking recurring for:', service.title, 'Category:', category)
    
    // Recurring service types
    const recurringCategories = ['cleaning', 'landscaping', 'gardening', 'maintenance']
    const isRecurring = recurringCategories.includes(category) || 
                       title.includes('recurring') || 
                       title.includes('regular') ||
                       title.includes('weekly') ||
                       title.includes('monthly') ||
                       title.includes('maintenance') ||
                       description.includes('recurring')
    
    console.log('Is recurring:', isRecurring)
    return isRecurring
  }

  // Check if service offers consultation
  const isConsultationService = (service) => {
    const category = getServiceCategory(service)
    const title = extractText(service.title || '')
    const description = extractText(service.description || service.desc || '')
    
    console.log('Checking consultation for:', service.title, 'Category:', category)
    
    // Services that typically offer consultation - be very inclusive
    const consultationCategories = [
      'roofing', 'flooring', 'electrical', 'hvac', 
      'plumbing', 'carpentry', 'landscaping', 'general'
    ]
    const isConsultation = consultationCategories.includes(category) || 
                          title.includes('consultation') || 
                          title.includes('estimate') ||
                          title.includes('assessment') ||
                          title.includes('advice') ||
                          title.includes('planning') ||
                          description.includes('consultation') ||
                          category !== 'simple-task' // Most professional services offer consultation
    
    console.log('Is consultation:', isConsultation)
    return isConsultation
  }

  // Perform search and filtering
  const performSearch = (e) => {
    if (e) e.preventDefault()
    
    // Don't search if data is still loading or not available
    if (loading || !originalJobs || !setFilteredJobs || originalJobs.length === 0) {
      return
    }
    
    console.log('Performing search with data:', originalJobs.length, 'services')
    console.log('Original jobs structure:', originalJobs[0])
    
    // Filter services based on search inputs
    let results = [...originalJobs]
    
    // Filter by service title/description
    if (search.title.trim()) {
      const searchTerm = search.title.toLowerCase().trim()
      results = results.filter(service => {
        const title = extractText(service.title || '')
        const description = extractText(service.description || service.desc || '')
        const category = extractText(service.category?.name || '')
        const profession = extractText(service.profession || '')
        
        // Also search in services array if it exists (for transformed professional data)
        let servicesMatch = false
        if (service.services && Array.isArray(service.services)) {
          servicesMatch = service.services.some(s => s.toLowerCase().includes(searchTerm))
        }
        
        return title.includes(searchTerm) || 
               description.includes(searchTerm) || 
               category.includes(searchTerm) ||
               profession.includes(searchTerm) ||
               servicesMatch
      })
    }
    
    // Filter by provider/company name
    if (search.company.trim()) {
      const searchTerm = search.company.toLowerCase().trim()
      results = results.filter(service => {
        const providerName = extractText(service.provider?.fullName || service.fullName || '')
        const businessName = extractText(service.provider?.businessName || service.businessName || service.company || '')
        
        return providerName.includes(searchTerm) || businessName.includes(searchTerm)
      })
    }
    
    // Filter by location (service area)
    if (search.location.trim()) {
      const searchTerm = search.location.toLowerCase().trim()
      results = results.filter(service => {
        // Handle different location structures
        const city = extractText(service.address?.city || service.city || '')
        const state = extractText(service.address?.state || service.state || '')
        const location = extractText(service.location || '')
        
        // Handle serviceArea.locations array
        const locations = service.serviceArea?.locations || []
        let locationsMatch = false
        if (locations.length === 0) {
          locationsMatch = true // Show all if no specific locations set
        } else {
          locationsMatch = locations.some(location => 
            extractText(location).includes(searchTerm)
          )
        }
        
        return city.includes(searchTerm) || 
               state.includes(searchTerm) || 
               location.includes(searchTerm) ||
               locationsMatch
      })
    }
    
    // Apply type filter based on service categories from database
    if (filters.type !== 'all') {
      console.log('Applying filter:', filters.type, 'to', results.length, 'services')
      
      switch (filters.type) {
        case 'in-home':
          results = results.filter(service => {
            const isInHome = isInHomeService(service)
            console.log('In-home filter result for', service.title, ':', isInHome)
            return isInHome
          })
          break
        case 'emergency':
          results = results.filter(service => {
            const isEmergency = isEmergencyService(service)
            console.log('Emergency filter result for', service.title, ':', isEmergency)
            return isEmergency
          })
          break
        case 'scheduled':
          results = results.filter(service => {
            const isEmergency = isEmergencyService(service)
            const isScheduled = !isEmergency
            console.log('Scheduled filter result for', service.title, ':', isScheduled)
            return isScheduled
          })
          break
        case 'consultation':
          results = results.filter(service => {
            const isConsultation = isConsultationService(service)
            console.log('Consultation filter result for', service.title, ':', isConsultation)
            return isConsultation
          })
          break
        case 'installation':
          results = results.filter(service => {
            const isInstallation = isInstallationService(service)
            console.log('Installation filter result for', service.title, ':', isInstallation)
            return isInstallation
          })
          break
        case 'recurring':
          results = results.filter(service => {
            const isRecurring = isRecurringService(service)
            console.log('Recurring filter result for', service.title, ':', isRecurring)
            return isRecurring
          })
          break
        default:
          break
      }
      
      console.log('After', filters.type, 'filter:', results.length, 'services remain')
    }
    
    // Apply level filter based on ratings and verification status
    if (filters.level !== 'all') {
      switch (filters.level) {
        case 'professional':
          results = results.filter(service => {
            const rating = getRatingValue(service.rating)
            return rating >= 3.0 || service.isActive === true
          })
          break
        case 'certified':
          results = results.filter(service => {
            const rating = getRatingValue(service.rating)
            return rating >= 4.0 || service.isPromoted === true
          })
          break
        case 'licensed':
          results = results.filter(service => {
            const rating = getRatingValue(service.rating)
            return rating >= 4.0 && service.isActive === true
          })
          break
        case 'expert':
          const expertRating = 4.5
          results = results.filter(service => {
            const rating = getRatingValue(service.rating)
            return rating >= expertRating
          })
          break
        default:
          break
      }
    }
    
    // Apply sorting based on actual database fields
    if (filters.sort === 'relevance') {
      // Sort by rating for relevance (higher rating = more relevant)
      results.sort((a, b) => {
        const ratingA = getRatingValue(a.rating)
        const ratingB = getRatingValue(b.rating)
        
        // If ratings are equal, prefer promoted services
        if (ratingA === ratingB) {
          if (a.isPromoted && !b.isPromoted) return -1
          if (!a.isPromoted && b.isPromoted) return 1
          return 0
        }
        
        return ratingB - ratingA
      })
    } else if (filters.sort === 'newest') {
      // Sort by created date (newest first)
      results.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0)
        const dateB = new Date(b.createdAt || 0)
        return dateB - dateA
      })
    } else if (filters.sort === 'price-high') {
      // Sort by price high to low
      results.sort((a, b) => {
        const priceA = getPriceValue(a)
        const priceB = getPriceValue(b)
        return priceB - priceA
      })
    } else if (filters.sort === 'price-low') {
      // Sort by price low to high
      results.sort((a, b) => {
        const priceA = getPriceValue(a)
        const priceB = getPriceValue(b)
        return priceA - priceB
      })
    }
    
    console.log('Search results:', results.length, 'services found')
    
    // If no results found after filtering, show a helpful message but still return results
    if (results.length === 0 && originalJobs.length > 0) {
      console.warn('No services found with current filters. Consider broadening your search.')
    }
    
    // Update filtered services
    setFilteredJobs(results)
  }

  // Effect to perform search when filters change
  useEffect(() => {
    // Only perform search if we have data and it's not loading
    if (!loading && originalJobs && originalJobs.length > 0) {
      performSearch()
    }
  }, [filters, originalJobs, loading]) // Re-run when filters, data, or loading state changes

  // Reset search when originalJobs changes (new data loaded)
  useEffect(() => {
    if (!loading && originalJobs && originalJobs.length > 0) {
      // Reset filters and search when new data is loaded
      if (setFilteredJobs) {
        setFilteredJobs(originalJobs)
      }
    }
  }, [originalJobs, loading])

  return (
    <div className='searchDiv grid gap-10 bg-greyIsh rounded-[10px] p-[3rem]'>

      <form onSubmit={performSearch}>

        <div className='firstDiv flex justify-between items-center rounded-[8px] gap-[10px] bg-white p-5 shadow-lg shadow-greyIsh-700'>
          
          <div className='flex gap-2 items-center'>
            <AiOutlineSearch className='text-[25px] icon'/>
            <input 
              type="text" 
              name="title"
              value={search.title}
              onChange={handleSearchChange}
              disabled={loading}
              className={`bg-transparent text-blue-500 focus:outline-none w-[100%] ${loading ? 'opacity-50' : ''}`}
              placeholder={loading ? 'Loading services...' : 'Search for services (e.g., plumbing, electrical)...'} 
            />
            {search.title && !loading && (
              <AiOutlineCloseCircle 
                className='text-[30px] text-[#a5a6a6] hover:text-textColor icon cursor-pointer'
                onClick={() => clearSearchField('title')}
              />
            )}
          </div>

          <div className='flex gap-2 items-center'>
            <FaTools className='text-[25px] icon'/>
            <input 
              type="text" 
              name="company"
              value={search.company}
              onChange={handleSearchChange}
              disabled={loading}
              className={`bg-transparent text-blue-500 focus:outline-none w-[100%] ${loading ? 'opacity-50' : ''}`}
              placeholder={loading ? 'Loading providers...' : 'Search by provider (e.g., Norman Chapman)...'} 
            />
            {search.company && !loading && (
              <AiOutlineCloseCircle 
                className='text-[30px] text-[#a5a6a6] hover:text-textColor icon cursor-pointer'
                onClick={() => clearSearchField('company')}
              />
            )}
          </div>

          <div className='flex gap-2 items-center'>
            <CiLocationOn className='text-[25px] icon'/>
            <input 
              type="text" 
              name="location"
              value={search.location}
              onChange={handleSearchChange}
              disabled={loading}
              className={`bg-transparent text-blue-500 focus:outline-none w-[100%] ${loading ? 'opacity-50' : ''}`}
              placeholder={loading ? 'Loading locations...' : 'Enter your location...'} 
            />
            {search.location && !loading && (
              <AiOutlineCloseCircle 
                className='text-[30px] text-[#a5a6a6] hover:text-textColor icon cursor-pointer'
                onClick={() => clearSearchField('location')}
              />
            )}
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`bg-blueColor h-full p-5 px-10 rounded-[10px] text-white cursor-pointer hover:bg-blue-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Loading...' : 'Search'}
          </button>

        </div>

      </form>

      <div className='secDiv flex items-center gap-10 justify-center flex-wrap'>

        <div className='singleSearch flex items-center gap-2'>
          <label htmlFor="sort" className='text-[#808080] font-semibold'>Sort by:</label>

          <select 
            name="sort" 
            id="sort" 
            value={filters.sort}
            onChange={handleFilterChange}
            disabled={loading}
            className={`bg-white rounded-[3px] px-4 py-1 ${loading ? 'opacity-50' : ''}`}
          >
             <option value="relevance">Rating (Best First)</option>
             <option value="newest">Newest Services</option>
             <option value="price-high">Price: High to Low</option>
             <option value="price-low">Price: Low to High</option>
          </select>

        </div>

        <div className='singleSearch flex items-center gap-2'>
          <label htmlFor="type" className='text-[#808080] font-semibold'>Service Type:</label>

          <select 
            name="type" 
            id="type" 
            value={filters.type}
            onChange={handleFilterChange}
            disabled={loading}
            className={`bg-white rounded-[3px] px-4 py-1 ${loading ? 'opacity-50' : ''}`}
          >
             <option value="all">All Types</option>
             <option value="in-home">In-Home Services</option>
             <option value="emergency">Emergency Services</option>
             <option value="scheduled">Scheduled Services</option>
             <option value="consultation">Consultation</option>
             <option value="installation">Installation</option>
             <option value="recurring">Recurring Services</option>
          </select>

        </div>

        <div className='singleSearch flex items-center gap-2'>
          <label htmlFor="level" className='text-[#808080] font-semibold'>Service Level:</label>

          <select 
            name="level" 
            id="level" 
            value={filters.level}
            onChange={handleFilterChange}
            disabled={loading}
            className={`bg-white rounded-[3px] px-4 py-1 ${loading ? 'opacity-50' : ''}`}
          >
             <option value="all">All Levels</option>
             <option value="professional">Professional (3.0+ Rating)</option>
             <option value="certified">Certified (4.0+ Rating)</option>
             <option value="licensed">Licensed</option>
             <option value="expert">Expert (4.5+ Rating)</option>
          </select>

        </div>

        {!loading && (
          <span 
            className='text-[#a1a1a1] cursor-pointer hover:text-blueColor'
            onClick={clearAll}
          >
            Clear All
          </span>
        )}

        {loading && (
          <span className='text-[#a1a1a1]'>
            Loading filters...
          </span>
        )}

      </div>

      {/* Results count and search status */}
      {!loading && originalJobs && (
        <div className='text-center text-[#808080] text-sm space-y-1'>
          <div>
            {originalJobs.length} service{originalJobs.length !== 1 ? 's' : ''} available
          </div>
          {(search.title || search.company || search.location || filters.type !== 'all' || filters.level !== 'all') && (
            <div className='text-xs'>
              Filters active: {[
                search.title && `Service: "${search.title}"`,
                search.company && `Provider: "${search.company}"`,
                search.location && `Location: "${search.location}"`,
                filters.type !== 'all' && `Type: ${filters.type}`,
                filters.level !== 'all' && `Level: ${filters.level}`
              ].filter(Boolean).join(', ')}
            </div>
          )}
        </div>
      )}
 
    </div>
  )
}

export default Search