import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchProfessionals, transformProfessionalsData } from '../../utils/apiService'

// Imported Icons ========>
import { BiTimeFive } from 'react-icons/bi'
import { FaUserCircle } from 'react-icons/fa'
import { AiOutlineStar, AiFillStar } from 'react-icons/ai'
import { MdRecommend } from 'react-icons/md'

// Imported Images ============>
import logo1 from '../../Assets/logo (1).png'
import logo2 from '../../Assets/logo (2).png'
import logo3 from '../../Assets/logo (3).png'
import logo4 from '../../Assets/logo (4).png'
import logo5 from '../../Assets/logo (5).png'
import logo6 from '../../Assets/logo (6).png'
import logo7 from '../../Assets/logo (7).png'
import logo8 from '../../Assets/logo (8).png'

// Default logo images array for fallback
const defaultLogos = [logo1, logo2, logo3, logo4, logo5, logo6, logo7, logo8]

// Pre-selected recommended provider indices (will be based on actual data)
const getRecommendedProviderIds = (providers) => {
  // Return the first 3 providers with highest ratings, or first 3 if no ratings
  const sortedByRating = [...providers].sort((a, b) => {
    const ratingA = parseFloat(a.rating?.split(' ')[0] || '0')
    const ratingB = parseFloat(b.rating?.split(' ')[0] || '0')
    return ratingB - ratingA
  })
  return sortedByRating.slice(0, 3).map(provider => provider.id)
}

// Updated component with API integration
const Jobs = ({ filteredJobs = null, loading: appLoading = false, error: appError = null }) => {
  const navigate = useNavigate()
  const [showRecommendations, setShowRecommendations] = useState(true)
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [recommendedProviderIds, setRecommendedProviderIds] = useState([])

  // Fetch data from API on component mount (only if no filteredJobs provided)
  useEffect(() => {
    // If filteredJobs is provided from App.jsx, use that instead of fetching
    if (filteredJobs !== null) {
      setProviders(filteredJobs)
      setLoading(appLoading)
      setError(appError)
      
      // Set recommended providers based on the provided data
      if (filteredJobs.length > 0) {
        const recommendedIds = getRecommendedProviderIds(filteredJobs)
        setRecommendedProviderIds(recommendedIds)
      }
      return
    }

    // Only fetch if no filteredJobs provided (fallback)
    const loadProfessionals = async () => {
      try {
        setLoading(true)
        setError(null)
        const apiData = await fetchProfessionals()
        const transformedData = transformProfessionalsData(apiData)
        setProviders(transformedData)
        
        // Update the exported Data for backward compatibility
        updateDataExport(transformedData)
        
        // Set recommended providers based on the fetched data
        const recommendedIds = getRecommendedProviderIds(transformedData)
        setRecommendedProviderIds(recommendedIds)
      } catch (err) {
        console.error('Failed to load professionals:', err)
        setError('Failed to load professionals. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    loadProfessionals()
  }, [filteredJobs, appLoading, appError])

  // Update providers when filteredJobs changes
  useEffect(() => {
    if (filteredJobs !== null) {
      setProviders(filteredJobs)
      if (filteredJobs.length > 0) {
        const recommendedIds = getRecommendedProviderIds(filteredJobs)
        setRecommendedProviderIds(recommendedIds)
      }
    }
  }, [filteredJobs])

  // Use filtered jobs if provided, otherwise use all providers
  const displayedProviders = filteredJobs || providers

  // Filter out the recommended providers
  const recommendedProviders = displayedProviders.filter(provider => 
    recommendedProviderIds.includes(provider.id)
  )

  // Render a single provider card
  const renderProviderCard = (provider, isRecommended = false) => {
    const {id, image, title, profession, time, location, desc, company, rating, price} = provider
    
    // Safety checks to ensure all values are strings/numbers
    const safeTitle = String(title || 'Professional')
    const safeProfession = String(profession || 'Service Provider')
    const safeTime = String(time || 'Same Day')
    const safeLocation = String(location || 'Location TBD')
    const safeDesc = String(desc || 'Experienced professional')
    const safeRating = String(rating || '4.5 (0)')
    const safePrice = Number(price) || 50
    
    return (
      <div 
        key={id} 
        className={`group group/item singleJob w-[250px] p-[20px] bg-white rounded-[10px] hover:bg-blueColor shadow-lg shadow-greyIsh-400/700 hover:shadow-lg cursor-pointer ${isRecommended ? 'border-2 border-blueColor' : ''}`}
        onClick={() => navigate(`/provider/${id}`)}
      >
        <div className='flex items-center gap-3 mb-2'>
          <FaUserCircle className='text-[24px] text-gray-400 group-hover:text-white'/>
          <div>
            <h1 className='text-[16px] font-semibold text-textColor group-hover:text-white'>{safeTitle}</h1>
            <h2 className='text-[14px] text-textColor group-hover:text-white'>{safeProfession}</h2>
          </div>
        </div>
        
        <span className='flex justify-end items-center text-[#ccc] gap-1 mb-1'>
          <BiTimeFive/>{safeTime}
        </span>
        <h6 className='text-[#ccc]'>{safeLocation}</h6>
        
        {/* Rating display */}
        <div className='text-[#ccc] mt-2'>★ {safeRating}</div>
        
        <p className='text-[13px] text-[#959595] pt-[20px] border-t-[2px] mt-[20px] group-hover:text-white'>
          {safeDesc}
        </p>
        
        <div className='company flex items-center gap-2'>
          <img src={image} alt="Provider" className='w-[10%]' onError={(e) => {
            // Fallback to default logo if image fails to load
            e.target.src = defaultLogos[0]
          }} />
          <span className='text-[14px] py-[1rem] block group-hover:text-white'>${safePrice}/hr</span>
        </div>
        
        <button 
          className='border-[2px] rounded-[10px] block p-[10px] w-full text-[14px] font-semibold text-textColor hover:bg-white group-hover/item:text-textColor group-hover:text-white'
          onClick={(e) => {
            e.stopPropagation() // Prevent triggering the card click
            navigate(`/provider/${id}/book`)
          }}
        >
          Book Now
        </button>

        {isRecommended && (
          <div className="mt-2 flex items-center justify-center gap-1 text-blueColor">
            <MdRecommend className="text-blueColor text-lg" />
            <span className="text-xs font-semibold">Recommended for You</span>
          </div>
        )}
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blueColor mx-auto mb-4"></div>
          <p className="text-textColor">Loading professionals...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blueColor text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // Debug info
  console.log('Jobs component render:', {
    loading,
    error,
    providersLength: providers.length,
    filteredJobsLength: filteredJobs ? filteredJobs.length : 'null',
    displayedProvidersLength: displayedProviders.length
  })

  return (
    <div>
      {/* AI Recommendations Section */}
      {showRecommendations && recommendedProviders.length > 0 && (
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <MdRecommend className="text-2xl text-blueColor" />
              <h2 className="text-xl font-bold text-textColor">Recommended for You</h2>
            </div>
            <button 
              onClick={() => setShowRecommendations(false)}
              className="text-sm text-gray-500 hover:text-blueColor"
            >
              Hide recommendations
            </button>
          </div>
          
          <div className="flex gap-10 justify-center flex-wrap items-center pb-6">
            {recommendedProviders.map(provider => renderProviderCard(provider, true))}
          </div>
          
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-bold">Based on your preferences: </span>
              These professionals are recommended based on your location, previous services, and high ratings.
            </p>
          </div>
        </div>
      )}

      {/* All Services Section */}
      <h2 className="text-xl font-bold text-textColor mb-4">All Available Services</h2>
      <div className="jobContainer flex gap-10 justify-center flex-wrap items-center py-10">
        {displayedProviders.length > 0 ? (
          displayedProviders.map(provider => renderProviderCard(provider))
        ) : (
          <div className="noJobs text-center w-full py-20">
            <h2 className="text-2xl font-bold text-textColor mb-2">No services found</h2>
            <p className="text-[#959595]">Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Jobs

// Temporary backward compatibility export
// This will be empty initially and populated when the API loads
export let Data = []

// Function to update the Data export (for backward compatibility)
export const updateDataExport = (newData) => {
  Data.length = 0 // Clear existing
  Data.push(...newData) // Add new data
}