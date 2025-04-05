import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

// Modified Data with individual providers instead of companies
const Data = [
  {
    id: 1,
    image: logo1,
    title: 'Michael Johnson',
    profession: 'Carpenter',
    time: 'Now', 
    location: 'Canada',
    desc: 'Professional carpenter with 8+ years experience in furniture repair and custom woodworking.',
    company: 'Novac Linus Co.',
    rating: '4.8 (124)',
    price: 45,
    qualifications: ['Certified Master Carpenter', 'Custom Furniture Specialist', 'Restoration Expert'],
    previousWorks: [
      { title: 'Custom Kitchen Renovation', description: 'Complete kitchen cabinets and island installation' },
      { title: 'Antique Table Restoration', description: 'Restored 19th century oak dining table' },
      { title: 'Built-in Bookcase', description: 'Floor-to-ceiling custom bookcase with integrated lighting' }
    ]
  },
  {
    id: 2,
    image: logo2,
    title: 'Sarah Williams',
    profession: 'Plumber',
    time: '2Hrs', 
    location: 'Manchester',
    desc: 'Emergency plumbing specialist with expertise in leak repairs and pipe installations.',
    company: 'Liquid Accessments',
    rating: '4.7 (98)',
    price: 65,
    qualifications: ['Licensed Master Plumber', 'Emergency Response Certified', 'Green Plumbing Specialist'],
    previousWorks: [
      { title: 'Commercial Bathroom Remodel', description: 'Complete plumbing installation for office building' },
      { title: 'Emergency Pipe Burst Repair', description: 'After-hours emergency repair preventing water damage' },
      { title: 'Tankless Water Heater Installation', description: 'Energy-efficient system installation' }
    ]
  },
  {
    id: 3,
    image: logo3,
    title: 'David Miller',
    profession: 'Electrician',
    time: '1Hr', 
    location: 'Austria',
    desc: 'Licensed electrician offering residential wiring, lighting installation, and safety inspections.',
    company: 'PowerTech',
    rating: '4.9 (156)',
    price: 70,
    qualifications: ['Master Electrician License', 'Residential & Commercial Certified', 'Smart Home Specialist'],
    previousWorks: [
      { title: 'Home Rewiring Project', description: 'Complete electrical system upgrade for 1950s home' },
      { title: 'Smart Lighting Installation', description: 'Automated lighting system throughout luxury home' },
      { title: 'Electrical Safety Audit', description: 'Comprehensive inspection for commercial property' }
    ]
  },
  {
    id: 4,
    image: logo4,
    title: 'Emma Rodriguez',
    profession: 'Interior Designer',
    time: 'Same Day',
    location: 'Germany',
    desc: 'Creative designer specializing in modern and minimalist home transformations.',
    company: 'Design Hub',
    rating: '4.6 (87)',
    price: 85,
    qualifications: ['Bachelor of Interior Design', 'NCIDQ Certified', 'Sustainable Design Specialist'],
    previousWorks: [
      { title: 'Modern Apartment Redesign', description: 'Complete redesign of 1200 sq ft urban apartment' },
      { title: 'Minimalist Home Office', description: 'Functional and aesthetic workspace conversion' },
      { title: 'Restaurant Interior Concept', description: 'Award-winning design for local bistro' }
    ]
  },
  {
    id: 5,
    image: logo5,
    title: 'James Wilson',
    profession: 'Painter',
    time: 'Now',
    location: 'Manchester',
    desc: 'Professional painter with expertise in interior and exterior painting using premium materials.',
    company: 'ColorWorks',
    rating: '4.5 (112)',
    price: 40,
    qualifications: ['Professional Painters Association Member', 'Specialty Finish Expert', 'Lead-Safe Certified'],
    previousWorks: [
      { title: 'Historic Home Exterior', description: 'Period-accurate restoration of Victorian facade' },
      { title: 'Commercial Office Complex', description: 'Interior painting for 50,000 sq ft office space' },
      { title: 'Decorative Wall Murals', description: 'Custom children\'s bedroom murals' }
    ]
  },
  {
    id: 6,
    image: logo6,
    title: 'Robert Garcia',
    profession: 'Landscaper',
    time: '3Hrs',
    location: 'Norway',
    desc: 'Experienced landscaper providing lawn maintenance, garden design, and outdoor renovation.',
    company: 'Green Thumbs',
    rating: '4.7 (76)',
    price: 35,
    qualifications: ['Certified Landscape Designer', 'Horticulture Degree', 'Irrigation Specialist'],
    previousWorks: [
      { title: 'Backyard Transformation', description: 'Complete redesign with water features and native plants' },
      { title: 'Commercial Property Maintenance', description: 'Ongoing maintenance for business park' },
      { title: 'Rooftop Garden Installation', description: 'Urban garden design for apartment complex' }
    ]
  },
  {
    id: 7,
    image: logo7,
    title: 'Thomas Anderson',
    profession: 'HVAC Technician',
    time: '4Hrs',
    location: 'Leeds',
    desc: 'Certified HVAC specialist with experience in installation, repairs, and maintenance.',
    company: 'Climate Control',
    rating: '4.8 (132)',
    price: 75,
    qualifications: ['HVAC Certified Technician', 'EPA Section 608 Certified', 'Commercial Systems Specialist'],
    previousWorks: [
      { title: 'Whole-Home HVAC Replacement', description: 'Complete system upgrade for 3500 sq ft home' },
      { title: 'Commercial Refrigeration Install', description: 'Restaurant cooling system installation' },
      { title: 'Ductwork Redesign', description: 'Efficiency improvement for older home' }
    ]
  },
  {
    id: 8,
    image: logo8,
    title: 'Lisa Thompson',
    profession: 'Security Specialist',
    time: 'Next Day',
    location: 'Turkey',
    desc: 'Home security expert specializing in system installation, camera setup, and security planning.',
    company: 'Safe & Sound',
    rating: '4.9 (93)',
    price: 95,
    qualifications: ['Certified Security Consultant', 'Smart Home Security Expert', 'Former Law Enforcement'],
    previousWorks: [
      { title: 'Comprehensive Home Security', description: 'Integrated cameras, alarms, and smart monitoring' },
      { title: 'Small Business Security System', description: 'Complete retail store protection solution' },
      { title: 'Estate Security Planning', description: 'Multi-layered security for luxury property' }
    ]
  }
];

// Pre-selected recommended providers (simpler than dynamic calculation)
const recommendedProviderIds = [3, 5, 7]; // Electrician, Painter, HVAC Technician

// Updated component with AI recommendations
const Jobs = ({ filteredJobs = Data }) => {
  const navigate = useNavigate();
  const [showRecommendations, setShowRecommendations] = useState(true);

  // Filter out the recommended providers
  const recommendedProviders = Data.filter(provider => 
    recommendedProviderIds.includes(provider.id)
  );

  // Render a single provider card
  const renderProviderCard = (provider, isRecommended = false) => {
    const {id, image, title, profession, time, location, desc, company, rating, price} = provider;
    
    return (
      <div 
        key={id} 
        className={`group group/item singleJob w-[250px] p-[20px] bg-white rounded-[10px] hover:bg-blueColor shadow-lg shadow-greyIsh-400/700 hover:shadow-lg cursor-pointer ${isRecommended ? 'border-2 border-blueColor' : ''}`}
        onClick={() => navigate(`/provider/${id}`)}
      >
        <div className='flex items-center gap-3 mb-2'>
          <FaUserCircle className='text-[24px] text-gray-400 group-hover:text-white'/>
          <div>
            <h1 className='text-[16px] font-semibold text-textColor group-hover:text-white'>{title}</h1>
            <h2 className='text-[14px] text-textColor group-hover:text-white'>{profession}</h2>
          </div>
        </div>
        
        <span className='flex justify-end items-center text-[#ccc] gap-1 mb-1'>
          <BiTimeFive/>{time}
        </span>
        <h6 className='text-[#ccc]'>{location}</h6>
        
        {/* Rating display */}
        <div className='text-[#ccc] mt-2'>★ {rating}</div>
        
        <p className='text-[13px] text-[#959595] pt-[20px] border-t-[2px] mt-[20px] group-hover:text-white'>
          {desc}
        </p>
        
        <div className='company flex items-center gap-2'>
          <img src={image} alt="Provider" className='w-[10%]' />
          <span className='text-[14px] py-[1rem] block group-hover:text-white'>${price}/hr</span>
        </div>
        
        <button 
          className='border-[2px] rounded-[10px] block p-[10px] w-full text-[14px] font-semibold text-textColor hover:bg-white group-hover/item:text-textColor group-hover:text-white'
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the card click
            navigate(`/provider/${id}/book`);
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
    );
  };

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
        {filteredJobs.length > 0 ? (
          filteredJobs.map(provider => renderProviderCard(provider))
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
export { Data }