import React, { useState } from 'react'
import { FaChevronDown, FaChevronUp, FaSearch } from 'react-icons/fa'
import { Link } from 'react-router-dom'

const FAQ = () => {
  // State for search query
  const [searchQuery, setSearchQuery] = useState('')
  
  // State to track which FAQ items are expanded
  const [expandedItems, setExpandedItems] = useState({})
  
  // FAQ data organized by categories
  const faqData = {
    general: {
      title: 'General Questions',
      items: [
        {
          id: 'general-1',
          question: 'What is HomeServices?',
          answer: 'HomeServices is an online platform that connects homeowners with trusted service professionals. We provide a convenient way to find, book, and manage home services all in one place.'
        },
        {
          id: 'general-2',
          question: 'Is HomeServices free to use?',
          answer: 'Yes, HomeServices is completely free for homeowners to use. Service professionals can list their basic services for free, with premium plans available for additional features and increased visibility.'
        },
        {
          id: 'general-3',
          question: 'How do I create an account?',
          answer: 'You can create an account by clicking on the "Register" button in the top right corner of the page. You\'ll need to provide your email address and create a password. You can also sign up using your Google or Facebook account.'
        }
      ]
    },
    homeowners: {
      title: 'For Homeowners',
      items: [
        {
          id: 'homeowner-1',
          question: 'How do I search for services?',
          answer: 'You can search for services using the search bar on the homepage. Enter the type of service you need (like "plumbing" or "lawn care"), along with your location. You can also browse services by category on our Categories page.'
        },
        {
          id: 'homeowner-2',
          question: 'How do I book a service?',
          answer: 'To book a service, simply click on the "Book Now" button on the service listing. You\'ll be able to select your preferred date and time, provide details about your needs, and confirm your booking.'
        },
        {
          id: 'homeowner-3',
          question: 'Can I read reviews of service providers?',
          answer: 'Yes, each service provider has a profile with ratings and reviews from other homeowners. This helps you make an informed decision before booking.'
        },
        {
          id: 'homeowner-4',
          question: 'What if I\'m not satisfied with the service?',
          answer: 'We stand behind all services booked through our platform. If you\'re not completely satisfied, please contact us within 48 hours of service completion, and we\'ll work to resolve the issue.'
        },
        {
          id: 'homeowner-5',
          question: 'How do I pay for services?',
          answer: 'Payments are handled securely through our platform. You can pay using credit/debit cards or other supported payment methods. Your payment is held in escrow until the service is completed to your satisfaction.'
        }
      ]
    },
    professionals: {
      title: 'For Service Professionals',
      items: [
        {
          id: 'professional-1',
          question: 'How do I list my services?',
          answer: 'To list your services, first create a service provider account. Then click on "Add Service" from your dashboard. Fill out the service details form including description, pricing, availability, and service area.'
        },
        {
          id: 'professional-2',
          question: 'How much does it cost to list my services?',
          answer: 'Service professionals can list basic services for free. For premium features like featured listings, priority placement, and advanced booking tools, we offer various subscription plans starting at $39/month.'
        },
        {
          id: 'professional-3',
          question: 'How do I receive payment for my services?',
          answer: 'When a customer books and pays for your service, the payment is held in escrow. Once the service is completed and the customer confirms satisfaction, the payment is released to your account and can be withdrawn to your bank account.'
        },
        {
          id: 'professional-4',
          question: 'Do I need to provide my own tools and materials?',
          answer: 'Yes, service professionals are expected to provide their own tools and equipment. For materials, you can either include them in your service price or itemize them separately for customer approval before purchase.'
        }
      ]
    },
    technical: {
      title: 'Technical Support',
      items: [
        {
          id: 'tech-1',
          question: 'I forgot my password. How do I reset it?',
          answer: 'Click on the "Login" button, then select "Forgot Password". Enter the email address associated with your account, and we\'ll send you instructions to reset your password.'
        },
        {
          id: 'tech-2',
          question: 'Is my personal information secure on HomeServices?',
          answer: 'Yes, we take data security seriously. We use industry-standard encryption to protect your personal information and comply with relevant data protection regulations. You can read more about our security practices in our Privacy Policy.'
        },
        {
          id: 'tech-3',
          question: 'The site isn\'t working properly. What should I do?',
          answer: 'Try clearing your browser cache and cookies, then reload the page. If problems persist, please contact our support team through the Contact page with details about the issue, including which browser and device you\'re using.'
        }
      ]
    }
  }

  // Toggle FAQ item expansion
  const toggleItem = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
  }

  // Filter FAQ items based on search query
  const filterFaqItems = () => {
    if (!searchQuery.trim()) {
      return faqData
    }

    const query = searchQuery.toLowerCase()
    const filteredData = {}

    Object.keys(faqData).forEach(category => {
      const filteredItems = faqData[category].items.filter(
        item => 
          item.question.toLowerCase().includes(query) || 
          item.answer.toLowerCase().includes(query)
      )

      if (filteredItems.length > 0) {
        filteredData[category] = {
          title: faqData[category].title,
          items: filteredItems
        }
      }
    })

    return filteredData
  }

  const filteredFaq = filterFaqItems()
  const hasResults = Object.keys(filteredFaq).length > 0

  return (
    <div className="w-full">
      {/* Page Header */}
      <div className="pageHeader flex flex-col items-center justify-center py-10 bg-greyIsh">
        <h1 className="text-[32px] text-textColor font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-[16px] text-[#959595] max-w-[600px] text-center mb-8">
          Find answers to common questions about using our home services platform.
        </p>
        
        {/* Search Bar */}
        <div className="search-wrapper w-full max-w-[600px]">
          <div className="relative">
            <input 
              type="text"
              placeholder="Search FAQ..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full p-4 pl-12 rounded-full border border-[#e7e7e7] focus:border-blueColor focus:outline-none shadow-sm"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#959595]" />
          </div>
        </div>
      </div>

      <div className="faqWrapper py-16 px-4 md:px-0">
        <div className="container mx-auto max-w-[900px]">
          {/* FAQ Categories */}
          {hasResults ? (
            Object.keys(filteredFaq).map(category => (
              <div key={category} className="mb-12">
                <h2 className="text-2xl font-semibold text-textColor mb-6">{filteredFaq[category].title}</h2>
                
                <div className="faq-items space-y-4">
                  {filteredFaq[category].items.map(item => (
                    <div 
                      key={item.id} 
                      className="faq-item border border-[#e7e7e7] rounded-lg overflow-hidden bg-white"
                    >
                      <button 
                        className={`w-full text-left p-6 flex justify-between items-center hover:bg-[#f9f9f9] transition-all ${expandedItems[item.id] ? 'bg-[#f9f9f9]' : ''}`}
                        onClick={() => toggleItem(item.id)}
                      >
                        <h3 className="text-lg font-medium text-textColor">{item.question}</h3>
                        {expandedItems[item.id] ? (
                          <FaChevronUp className="text-blueColor" />
                        ) : (
                          <FaChevronDown className="text-[#959595]" />
                        )}
                      </button>
                      
                      {expandedItems[item.id] && (
                        <div className="p-6 pt-0 border-t border-[#e7e7e7] text-[#666] leading-relaxed">
                          <p>{item.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-textColor mb-2">No results found</h3>
              <p className="text-[#959595] mb-8">
                We couldn't find any FAQ items matching your search query.
              </p>
              <button 
                className="text-blueColor hover:underline"
                onClick={() => setSearchQuery('')}
              >
                Clear search and show all FAQs
              </button>
            </div>
          )}
          
          {/* Still Need Help Section */}
          <div className="still-need-help mt-16 p-8 bg-[#f7f7f7] rounded-lg text-center border border-[#e7e7e7]">
            <h2 className="text-xl font-semibold text-textColor mb-4">Still Have Questions?</h2>
            <p className="text-[#959595] mb-6">
              If you couldn't find the answer you're looking for, our support team is here to help.
            </p>
            <Link 
              to="/contact" 
              className="inline-block bg-blueColor text-white py-3 px-8 rounded-md hover:bg-opacity-90 transition-all"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQ