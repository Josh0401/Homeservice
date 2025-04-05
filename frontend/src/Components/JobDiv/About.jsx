import React from 'react'
import { FaUsers, FaHome, FaTools, FaRegLightbulb, FaUserAlt } from 'react-icons/fa'
import { BsGraphUp, BsShieldCheck } from 'react-icons/bs'
import { MdHomeRepairService, MdSecurity } from 'react-icons/md'
import { Link } from 'react-router-dom'

const About = () => {
  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      bio: 'With over 15 years of experience in home services, Sarah founded HomeServices to connect homeowners with trusted service professionals.'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'CTO',
      bio: 'Michael brings 12+ years of tech leadership experience, ensuring our platform delivers an exceptional user experience for homeowners and service providers.'
    },
    {
      id: 3,
      name: 'Priya Patel',
      role: 'Head of Operations',
      bio: 'Priya oversees the day-to-day operations, making sure our platform connects homeowners with the right service professionals efficiently.'
    },
    {
      id: 4,
      name: 'David Wilson',
      role: 'Marketing Director',
      bio: 'David leads our marketing initiatives, helping both homeowners and service providers discover the full potential of our platform.'
    }
  ]

  // Company metrics
  const metrics = [
    { id: 1, value: '500K+', label: 'Happy Homeowners', icon: <FaUsers className="text-2xl" /> },
    { id: 2, value: '25K+', label: 'Service Providers', icon: <FaTools className="text-2xl" /> },
    { id: 3, value: '150K+', label: 'Services Completed', icon: <MdHomeRepairService className="text-2xl" /> },
    { id: 4, value: '92%', label: 'Satisfaction Rate', icon: <BsGraphUp className="text-2xl" /> }
  ]

  return (
    <div className="w-full">
      {/* Hero Section */}
      <div className="hero bg-greyIsh py-20 px-4">
        <div className="container mx-auto max-w-[1000px] text-center">
          <h1 className="text-4xl md:text-5xl text-textColor font-bold mb-6">About HomeServices</h1>
          <p className="text-lg text-[#6f6f6f] max-w-[800px] mx-auto">
            Connecting homeowners with reliable professionals for all their home maintenance, repair, and improvement needs since 2015.
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="our-story py-16 px-4">
        <div className="container mx-auto max-w-[1000px]">
          <div className="section-header text-center mb-12">
            <h2 className="text-3xl font-bold text-textColor mb-4">Our Story</h2>
            <div className="w-20 h-1 bg-blueColor mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-[#6f6f6f] mb-4">
                HomeServices was founded in 2015 with a simple mission: to make home maintenance and improvement easier, more reliable, and more accessible for homeowners.
              </p>
              <p className="text-[#6f6f6f] mb-4">
                Our founder, Sarah Johnson, experienced firsthand the challenges of finding trustworthy service providers during her home renovation. She envisioned a platform that would connect homeowners with qualified professionals for all their home service needs.
              </p>
              <p className="text-[#6f6f6f]">
                Today, HomeServices has grown into one of the leading home service platforms, serving over 500,000 homeowners and 25,000+ service providers nationwide. We continue to innovate and improve our services, always keeping our core mission in mind.
              </p>
            </div>
            <div className="bg-[#f3f4f6] p-8 rounded-lg">
              <h3 className="text-xl font-semibold text-textColor mb-4">Our Mission</h3>
              <p className="text-[#6f6f6f] mb-6">
                To transform home maintenance by connecting homeowners with skilled professionals, making home care accessible, reliable, and hassle-free.
              </p>
              <h3 className="text-xl font-semibold text-textColor mb-4">Our Vision</h3>
              <p className="text-[#6f6f6f]">
                To become the most trusted platform for home services, where every homeowner can find the perfect professional for any home-related need, and where service providers can grow their businesses with quality clients.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="metrics-section py-16 px-4 bg-greyIsh">
        <div className="container mx-auto max-w-[1000px]">
          <div className="section-header text-center mb-12">
            <h2 className="text-3xl font-bold text-textColor mb-4">Our Impact</h2>
            <div className="w-20 h-1 bg-blueColor mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {metrics.map(metric => (
              <div key={metric.id} className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="icon-container w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center text-blueColor">
                  {metric.icon}
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-blueColor mb-2">{metric.value}</h3>
                <p className="text-[#6f6f6f]">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="values-section py-16 px-4">
        <div className="container mx-auto max-w-[1000px]">
          <div className="section-header text-center mb-12">
            <h2 className="text-3xl font-bold text-textColor mb-4">Our Core Values</h2>
            <div className="w-20 h-1 bg-blueColor mx-auto mb-6"></div>
            <p className="text-[#6f6f6f] max-w-[700px] mx-auto">
              These principles guide our decisions and define our company culture
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="value-card p-6 border border-[#e7e7e7] rounded-lg hover:border-blueColor transition-all">
              <div className="icon-container w-12 h-12 mb-4 bg-blue-50 rounded-full flex items-center justify-center text-blueColor">
                <FaHome />
              </div>
              <h3 className="text-xl font-semibold text-textColor mb-2">Customer Satisfaction</h3>
              <p className="text-[#6f6f6f]">
                We prioritize the needs of homeowners, ensuring they receive exceptional service and support for all their home maintenance needs.
              </p>
            </div>

            <div className="value-card p-6 border border-[#e7e7e7] rounded-lg hover:border-blueColor transition-all">
              <div className="icon-container w-12 h-12 mb-4 bg-blue-50 rounded-full flex items-center justify-center text-blueColor">
                <FaRegLightbulb />
              </div>
              <h3 className="text-xl font-semibold text-textColor mb-2">Innovation</h3>
              <p className="text-[#6f6f6f]">
                We continuously seek better ways to connect homeowners with service professionals through technology and creative solutions.
              </p>
            </div>

            <div className="value-card p-6 border border-[#e7e7e7] rounded-lg hover:border-blueColor transition-all">
              <div className="icon-container w-12 h-12 mb-4 bg-blue-50 rounded-full flex items-center justify-center text-blueColor">
                <MdSecurity />
              </div>
              <h3 className="text-xl font-semibold text-textColor mb-2">Trust & Safety</h3>
              <p className="text-[#6f6f6f]">
                We thoroughly vet our service providers and prioritize the safety and security of our users' homes and personal information.
              </p>
            </div>

            <div className="value-card p-6 border border-[#e7e7e7] rounded-lg hover:border-blueColor transition-all">
              <div className="icon-container w-12 h-12 mb-4 bg-blue-50 rounded-full flex items-center justify-center text-blueColor">
                <FaTools />
              </div>
              <h3 className="text-xl font-semibold text-textColor mb-2">Quality Craftsmanship</h3>
              <p className="text-[#6f6f6f]">
                We're committed to connecting homeowners with professionals who deliver exceptional workmanship and attention to detail.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Meet the Team Section */}
      <div className="team-section py-16 px-4 bg-greyIsh">
        <div className="container mx-auto max-w-[1000px]">
          <div className="section-header text-center mb-12">
            <h2 className="text-3xl font-bold text-textColor mb-4">Meet Our Team</h2>
            <div className="w-20 h-1 bg-blueColor mx-auto mb-6"></div>
            <p className="text-[#6f6f6f] max-w-[700px] mx-auto">
              The passionate individuals behind HomeServices dedicated to improving your home maintenance experience
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map(member => (
              <div key={member.id} className="team-card bg-white rounded-lg overflow-hidden shadow-sm">
                <div className="img-container h-64 bg-blue-50 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-blueColor bg-opacity-10 flex items-center justify-center">
                    <FaUserAlt className="text-blueColor text-5xl" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-textColor">{member.name}</h3>
                  <p className="text-blueColor mb-3">{member.role}</p>
                  <p className="text-[#6f6f6f] text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Join Us Section */}
      <div className="join-us-section py-16 px-4">
        <div className="container mx-auto max-w-[1000px] text-center">
          <h2 className="text-3xl font-bold text-textColor mb-6">Join Our Growing Community</h2>
          <p className="text-[#6f6f6f] max-w-[700px] mx-auto mb-8">
            Whether you're a homeowner looking for reliable service professionals or a skilled provider looking to grow your business, 
            HomeServices is here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="py-3 px-8 bg-blueColor text-white rounded-md hover:bg-opacity-90 transition-all"
            >
              Create Account
            </Link>
            <Link 
              to="/contact" 
              className="py-3 px-8 border border-blueColor text-blueColor rounded-md hover:bg-blue-50 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default About