import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

// Imported Images ============>
import simple from '../../Assets/simple.png'
import valentines from '../../Assets/valentines.png'
import shield from '../../Assets/shield.png'

const Value = () => {
  // Testimonial data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      service: "Kitchen Renovation",
      text: "The professionals were punctual, respectful, and did exceptional work on our kitchen. We couldn't be happier with the results!",
      rating: 5
    },
    {
      id: 2,
      name: "Michael Roberts",
      service: "Plumbing Services",
      text: "I had an emergency plumbing issue and they responded within the hour. Excellent service and very reasonable pricing.",
      rating: 5
    },
    {
      id: 3,
      name: "Jessica Thompson",
      service: "Electrical Work",
      text: "Very professional and knowledgeable. They explained everything clearly and fixed our electrical issues quickly.",
      rating: 4
    },
    {
      id: 4,
      name: "David Wilson",
      service: "House Cleaning",
      text: "The cleaning service exceeded my expectations. My home has never looked better!",
      rating: 5
    },
    {
      id: 5,
      name: "Emily Parker",
      service: "Lawn Care",
      text: "Consistent quality and attention to detail. My yard is the envy of the neighborhood now!",
      rating: 5
    }
  ];

  // State for current testimonial
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slider functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // Change testimonial every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Function to manually navigate
  const goToTestimonial = (index) => {
    setCurrentIndex(index);
  };

  // Function to render stars based on rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={`text-xl ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className='mb-[4rem] mt-[6rem]'>
      <h1 className='text-textColor text-[25px] py-[2rem] pb-[3rem] 
      font-bold w-[400px] block'>The values that guide our home service professionals</h1>
      
      <div className='grid gap-[10rem] grid-cols-3 items-center'>

        <div className='singleGrid rounded-[10px] hover:bg-[#eeedf7] p-[1.5rem]'>
           <div className='flex items-center gap-3'>
              <div className='imgDiv p-[4px] rounded-[.8rem] bg-[#dedef8] h-[40px] w-[40px] flex items-center justify-center'>
               <img src={simple} alt=""  className='w-[70%]'/>
              </div> 

              <span className='font-semibold text-textColor text-[18px]'>
                Quality
              </span>
           </div>
           <p className='text-[13px] text-textColor opacity-[.7] py-[1rem] font-semibold'>
           We believe in delivering exceptional craftsmanship and attention to detail in every home service we provide.
           </p>
        </div>

        <div className='singleGrid rounded-[10px] hover:bg-[#f7edf5] p-[1.5rem]'>
           <div className='flex items-center gap-3'>
              <div className='imgDiv p-[4px] rounded-[.8rem] bg-[#f7d1e1] h-[40px] w-[40px] flex items-center justify-center'>
               <img src={valentines} alt=""  className='w-[70%]'/>
              </div> 

              <span className='font-semibold text-textColor text-[18px]'>
                Reliability
              </span>
           </div>
           <p className='text-[13px] text-textColor opacity-[.7] py-[1rem] font-semibold'>
           Our professionals arrive on time, complete work as promised, and stand behind every service with a satisfaction guarantee.
           </p>
        </div>

        <div className='singleGrid rounded-[10px] hover:bg-[#fcfae3] p-[1.5rem]'>
           <div className='flex items-center gap-3'>
              <div className='imgDiv p-[4px] rounded-[.8rem] bg-[#f3f2ad] h-[40px] w-[40px] flex items-center justify-center'>
               <img src={shield} alt=""  className='w-[70%]'/>
              </div> 

              <span className='font-semibold text-textColor text-[18px]'>
                Trust
              </span>
           </div>
           <p className='text-[13px] text-textColor opacity-[.7] py-[1rem] font-semibold'>
           Every professional in our network is thoroughly vetted, background-checked, and committed to respecting your home and privacy.
           </p>
        </div>

      </div>

      {/* Testimonial Slider Section */}
      <div className="mt-[6rem] mb-[4rem]">
        <h2 className='text-textColor text-[25px] py-[1rem] font-bold'>What Our Customers Say</h2>
        
        <div className="relative bg-white rounded-[12px] shadow-lg p-[2rem] border border-gray-200">
          {/* Testimonial content */}
          <div className="min-h-[220px] flex flex-col justify-between">
            <div>
              <div className="flex mb-2">
                {renderStars(testimonials[currentIndex].rating)}
              </div>
              <p className="text-[16px] text-gray-700 italic mb-6">"{testimonials[currentIndex].text}"</p>
            </div>
            <div>
              <p className="font-bold text-[18px] text-textColor">{testimonials[currentIndex].name}</p>
              <p className="text-[14px] text-gray-500">{testimonials[currentIndex].service}</p>
            </div>
          </div>
          
          {/* Navigation arrows */}
          <div className="absolute left-0 right-0 flex justify-between top-1/2 transform -translate-y-1/2 px-4">
            <button 
              onClick={() => setCurrentIndex(prevIndex => prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1)}
              className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blueColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={() => setCurrentIndex(prevIndex => prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1)}
              className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blueColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          {/* Dots indicator */}
          <div className="flex justify-center mt-4">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                className={`mx-1 h-3 w-3 rounded-full ${
                  currentIndex === index ? 'bg-blueColor' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="card mt-[2rem] flex justify-between bg-blueColor p-[5rem] rounded-[10px]">
        <div>
          <h1 className='text-blueColor text-[30px] font-bold'>Need help with your home?</h1>
          <h2 className='text-textColor text-[25px] font-bold'>Book a service today!</h2>
        </div>

        <Link to="/book-service">
          <button className='border-[2px] rounded-[10px] py-[24px] px-[50px] text-[22px] font-semibold text-blueColor hover:bg-white border-blueColor'>
            Book Now
          </button>
        </Link>
      </div>

    </div>
  )
}

export default Value