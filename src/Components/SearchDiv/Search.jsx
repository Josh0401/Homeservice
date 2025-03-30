import React, { useState, useEffect } from 'react'

// Imported Icons from React Icons ====>
import {AiOutlineSearch} from 'react-icons/ai'
import {AiOutlineCloseCircle} from 'react-icons/ai'
import {BsHouseDoor} from 'react-icons/bs'
import {CiLocationOn} from 'react-icons/ci'
import {FaTools} from 'react-icons/fa'

const Search = ({ setFilteredJobs, originalJobs }) => {
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

  // Perform search and filtering
  const performSearch = (e) => {
    if (e) e.preventDefault()
    
    // If no originalJobs provided (when component is used standalone), return
    if (!originalJobs || !setFilteredJobs) return
    
    // Filter services based on search inputs
    let results = [...originalJobs]
    
    // Filter by service title
    if (search.title) {
      results = results.filter(service => 
        service.title.toLowerCase().includes(search.title.toLowerCase())
      )
    }
    
    // Filter by company
    if (search.company) {
      results = results.filter(service => 
        service.company.toLowerCase().includes(search.company.toLowerCase())
      )
    }
    
    // Filter by location
    if (search.location) {
      results = results.filter(service => 
        service.location.toLowerCase().includes(search.location.toLowerCase())
      )
    }
    
    // Apply type filter if not 'all'
    if (filters.type !== 'all') {
      results = results.filter(service => 
        service.type && service.type.toLowerCase() === filters.type.toLowerCase()
      )
    }
    
    // Apply level filter if not 'all'
    if (filters.level !== 'all') {
      results = results.filter(service => 
        service.level && service.level.toLowerCase() === filters.level.toLowerCase()
      )
    }
    
    // Apply sorting
    if (filters.sort === 'relevance') {
      // Keep current order for relevance
    } else if (filters.sort === 'newest') {
      // Sort by date if available
      results.sort((a, b) => {
        if (a.availableDate && b.availableDate) {
          return new Date(b.availableDate) - new Date(a.availableDate)
        }
        return 0
      })
    } else if (filters.sort === 'price-high') {
      // Sort by price high to low if available
      results.sort((a, b) => {
        if (a.price && b.price) {
          return b.price - a.price
        }
        return 0
      })
    } else if (filters.sort === 'price-low') {
      // Sort by price low to high if available
      results.sort((a, b) => {
        if (a.price && b.price) {
          return a.price - b.price
        }
        return 0
      })
    }
    
    // Update filtered services
    setFilteredJobs(results)
  }

  // Effect to perform search when filters change
  useEffect(() => {
    performSearch()
  }, [filters]) // Only re-run when filters change, not search inputs

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
              className='bg-transparent text-blue-500 focus:outline-none w-[100%]' 
              placeholder='Search for services...' 
            />
            {search.title && (
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
              className='bg-transparent text-blue-500 focus:outline-none w-[100%]' 
              placeholder='Search by provider...' 
            />
            {search.company && (
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
              className='bg-transparent text-blue-500 focus:outline-none w-[100%]' 
              placeholder='Enter your location...' 
            />
            {search.location && (
              <AiOutlineCloseCircle 
                className='text-[30px] text-[#a5a6a6] hover:text-textColor icon cursor-pointer'
                onClick={() => clearSearchField('location')}
              />
            )}
          </div>

          <button 
            type="submit"
            className='bg-blueColor h-full p-5 px-10 rounded-[10px] text-white cursor-pointer hover:bg-blue-300'
          >
            Search
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
            className='bg-white rounded-[3px] px-4 py-1'
          >
             <option value="relevance">Relevance</option>
             <option value="newest">Newest</option>
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
            className='bg-white rounded-[3px] px-4 py-1'
          >
             <option value="all">All Types</option>
             <option value="in-home">In-Home</option>
             <option value="emergency">Emergency</option>
             <option value="scheduled">Scheduled</option>
             <option value="consultation">Consultation</option>
             <option value="installation">Installation</option>
             <option value="recurring">Recurring</option>
          </select>

        </div>

        <div className='singleSearch flex items-center gap-2'>
          <label htmlFor="level" className='text-[#808080] font-semibold'>Provider Level:</label>

          <select 
            name="level" 
            id="level" 
            value={filters.level}
            onChange={handleFilterChange}
            className='bg-white rounded-[3px] px-4 py-1'
          >
             <option value="all">All Levels</option>
             <option value="professional">Professional</option>
             <option value="certified">Certified</option>
             <option value="licensed">Licensed</option>
             <option value="expert">Expert</option>
          </select>

        </div>

        <span 
          className='text-[#a1a1a1] cursor-pointer hover:text-blueColor'
          onClick={clearAll}
        >
          Clear All
        </span>

      </div>
 
    </div>
  )
}

export default Search