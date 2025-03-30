import React, { useState } from 'react'
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

// Using the same data structure as in Jobs.jsx but modified for home services
const Data = [
  {
    id:1,
    image: logo1,
    title: 'Carpenter Services',
    time: 'Now', 
    location: 'Canada',
    desc: 'Professional carpentry services for furniture repair, installation, and custom woodworking.',
    company: 'Novac Linus Co.'
  },
  {
    id:2,
    image: logo2,
    title: 'Plumbing Services',
    time: '2Hrs', 
    location: 'Manchester',
    desc: 'Emergency plumbing repairs, installation, and maintenance for residential properties.',
    company: 'Liquid Accessments'
  },
  {
    id:3,
    image: logo3,
    title: 'Electrical Services',
    time: '1Hr', 
    location: 'Austria',
    desc: 'Licensed electricians offering installations, repairs, and safety inspections for your home.',
    company: 'PowerTech'
  },
  {
    id: 4,
    image: logo4,
    title: 'Interior Design',
    time: 'Same Day',
    location: 'Germany',
    desc: 'Transform your living spaces with our professional interior design and decorating services.',
    company: 'Design Hub',
  },
  {
    id: 5,
    image: logo5,
    title: 'House Painting',
    time: 'Now',
    location: 'Manchester',
    desc: 'Quality interior and exterior painting services with premium materials and expert techniques.',
    company: 'ColorWorks',
  },
  {
    id: 6,
    image: logo6,
    title: 'Lawn Care',
    time: '3Hrs',
    location: 'Norway',
    desc: 'Complete lawn maintenance including mowing, fertilization, weed control, and landscaping.',
    company: 'Green Thumbs',
  },
  {
    id: 7,
    image: logo7,
    title: 'HVAC Services',
    time: '4Hrs',
    location: 'Leeds',
    desc: 'Heating, ventilation, and air conditioning installation, repair, and maintenance services.',
    company: 'Climate Control',
  },
  {
    id: 8,
    image: logo8,
    title: 'Home Security',
    time: 'Next Day',
    location: 'Turkey',
    desc: 'Professional installation of security systems, cameras, and monitoring services for your home.',
    company: 'Safe & Sound',
  }
]

const Categories = () => {
  // Define home service categories with icons
  // Using only the icons that were already imported in the original file
  const categories = [
    { id: 1, name: 'Carpentry', icon: <FaTools />, color: '#FF9800' },
    { id: 2, name: 'Plumbing', icon: <FaTools />, color: '#4CAF50' },
    { id: 3, name: 'Electrical', icon: <FaTools />, color: '#2196F3' },
    { id: 4, name: 'Interior Design', icon: <FaPaintBrush />, color: '#E91E63' },
    { id: 5, name: 'Painting', icon: <FaPaintBrush />, color: '#9C27B0' },
    { id: 6, name: 'HVAC', icon: <FaServer />, color: '#607D8B' },
    { id: 7, name: 'Landscaping', icon: <MdOutlineEngineering />, color: '#3F51B5' },
    { id: 8, name: 'All Services', icon: <BiCategory />, color: '#795548' },
  ]

  // State to track selected category
  const [selectedCategory, setSelectedCategory] = useState('All Services')

  // Helper function to categorize services
  const getCategoryForService = (title) => {
    const titleLower = title.toLowerCase()
    
    if (titleLower.includes('carpenter')) {
      return 'Carpentry'
    } else if (titleLower.includes('plumbing')) {
      return 'Plumbing'
    } else if (titleLower.includes('electrical')) {
      return 'Electrical'
    } else if (titleLower.includes('interior design')) {
      return 'Interior Design'
    } else if (titleLower.includes('paint')) {
      return 'Painting'
    } else if (titleLower.includes('lawn') || titleLower.includes('landscap')) {
      return 'Landscaping'
    } else if (titleLower.includes('hvac') || titleLower.includes('air conditioning')) {
      return 'HVAC'
    } else {
      return 'All Services' // Default category for other services
    }
  }

  // Filter services based on selected category
  const filteredServices = selectedCategory === 'All Services' 
    ? Data 
    : Data.filter(service => getCategoryForService(service.title) === selectedCategory)

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
          filteredServices.map(({id, image, title, time, location, desc, company}) => (
            <div key={id} className="group group/item singleJob w-[250px] p-[20px] bg-white rounded-[10px] hover:bg-blueColor shadow-lg shadow-greyIsh-400/700 hover:shadow-lg">
              {/* Category Badge */}
              <div className="category mb-2">
                <span className="text-[12px] font-medium py-1 px-2 rounded-full bg-opacity-20" 
                  style={{ 
                    backgroundColor: `${categories.find(c => c.name === getCategoryForService(title))?.color}20`,
                    color: categories.find(c => c.name === getCategoryForService(title))?.color
                  }}>
                  {getCategoryForService(title)}
                </span>
              </div>

              <span className='flex justify-between items-center gap-4'>
                <h1 className='text-[16px] font-semibold text-textColor group-hover:text-white'>{title}</h1>
                <span className='flex items-center text-[#ccc] gap-1'>
                  <BiTimeFive/>{time}
                </span>
              </span>
              <h6 className='text-[#ccc]'>{location}</h6>
  
              <p className='text-[13px] text-[#959595] pt-[20px] border-t-[2px] mt-[20px] group-hover:text-white'>
                {desc}
              </p>
  
              <div className='company flex items-center gap-2'>
                <img src={image} alt="Company Logo" className='w-[10%]' />
                <span className='text-[14px] py-[1rem] block group-hover:text-white'>{company}</span>
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