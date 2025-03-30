import React from 'react'
import { Link } from 'react-router-dom'

// Imported Icons ========>
import {AiFillInstagram} from 'react-icons/ai'
import {BsFacebook} from 'react-icons/bs'
import {AiOutlineTwitter} from 'react-icons/ai'

const Footer = () => {
  return (
    <div className='footer p-4 md:p-8 lg:p-[5rem] mb-4 bg-blueColor rounded-[10px] gap-6 md:gap-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 m-auto items-start justify-center'>

      <div className="mb-6 sm:mb-0">
        <div className="logoDiv">
            <Link to="/" className="logo text-xl md:text-[25px] text-white pb-4 md:pb-[1.5rem] inline-block no-underline">
              <strong>Home</strong>Services
            </Link>
        </div>
        <p className='text-white pb-[13px] opacity-70 leading-7'>
        We connect homeowners with trusted professionals to handle all your home maintenance, repair, and improvement needs.
        </p>
      </div>

      <div className='grid mb-6 sm:mb-0'>
        <span className='divTitle text-base md:text-[18px] font-semibold pb-3 md:pb-[1.5rem] text-white'>
          Company
        </span>
        <div className='grid gap-2 md:gap-3'>
          <li className='text-white opacity-[.7] hover:opacity-[1] cursor-pointer'>
            <Link to="/about" className="text-white no-underline">About Us</Link>
          </li>
          <li className='text-white opacity-[.7] hover:opacity-[1] cursor-pointer'>
            <Link to="/categories" className="text-white no-underline">Services</Link>
          </li>
          <li className='text-white opacity-[.7] hover:opacity-[1] cursor-pointer'>
            <Link to="/faq" className="text-white no-underline">FAQ</Link>
          </li>
        </div>
      </div>

      <div className='grid mb-6 sm:mb-0'>
        <span className='divTitle text-base md:text-[18px] font-semibold pb-3 md:pb-[1.5rem] text-white'>
          Resources
        </span>
        <div className='grid gap-2 md:gap-3'>
          <li className='text-white opacity-[.7] hover:opacity-[1] cursor-pointer'>
            <Link to="/login" className="text-white no-underline">My Account</Link>
          </li>
          <li className='text-white opacity-[.7] hover:opacity-[1] cursor-pointer'>
            <Link to="/contact" className="text-white no-underline">Help Center</Link>
          </li>
          <li className='text-white opacity-[.7] hover:opacity-[1] cursor-pointer'>
            <Link to="/contact" className="text-white no-underline">Service Guarantee</Link>
          </li>
          <li className='text-white opacity-[.7] hover:opacity-[1] cursor-pointer'>
            <Link to="/contact" className="text-white no-underline">Contact Us</Link>
          </li>
        </div>
      </div>

      <div className='grid mb-6 sm:mb-0'>
        <span className='divTitle text-base md:text-[18px] font-semibold pb-3 md:pb-[1.5rem] text-white'>
          For Professionals
        </span>
        <div className='grid gap-2 md:gap-3'>
          <li className='text-white opacity-[.7] hover:opacity-[1] cursor-pointer'>
            <Link to="/join" className="text-white no-underline">Join Our Network</Link>
          </li>
          <li className='text-white opacity-[.7] hover:opacity-[1] cursor-pointer'>
            <Link to="/pro-resources" className="text-white no-underline">Pro Resources</Link>
          </li>
          <li className='text-white opacity-[.7] hover:opacity-[1] cursor-pointer'>
            <Link to="/success-stories" className="text-white no-underline">Success Stories</Link>
          </li>
        </div>
      </div>

      <div className='grid mb-6 sm:mb-0 sm:col-span-2 md:col-span-1'>
        <span className='divTitle text-base md:text-[18px] font-semibold pb-3 md:pb-[1.5rem] text-white'>
          Contact Info
        </span>
        <div>
         <small className='text-[14px] text-white'>
          <a href="mailto:support@homeservices.com" className="text-white no-underline">
            support@homeservices.com
          </a>
         </small>
         <div className='icons flex gap-4 py-4 md:py-[1rem]'>
           <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
             <AiFillInstagram className='bg-white p-[8px] h-[35px] w-[35px] rounded-full icon text-blueColor'/>
           </a>
           <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
             <BsFacebook className='bg-white p-[8px] h-[35px] w-[35px] rounded-full icon text-blueColor'/>
           </a>
           <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
             <AiOutlineTwitter className='bg-white p-[8px] h-[35px] w-[35px] rounded-full icon text-blueColor'/>
           </a>
         </div>
        </div>
      </div>
      
      <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-5 text-white text-center text-sm opacity-70 mt-4 pt-4 border-t border-white/20">
        <p>© {new Date().getFullYear()} HomeServices. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Footer