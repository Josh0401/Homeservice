import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaUser, 
  FaTools, 
  FaMoneyBillWave, 
  FaImages, 
  FaCertificate,
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaPencilAlt,
  FaSave,
  FaTimes
} from 'react-icons/fa';

const ProviderProfileManagement = () => {
  // Profile information state
  const [profileInfo, setProfileInfo] = useState({
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    address: '123 Main St, Anytown',
    bio: 'Professional plumber with over 10 years of experience specializing in residential and commercial plumbing services.'
  });

  // Services state
  const [services, setServices] = useState([
    { id: 1, name: 'Pipe Installation', description: 'Installation of new pipes or replacement of old ones', price: 85, priceType: 'hourly' },
    { id: 2, name: 'Leak Repair', description: 'Identification and repair of leaks in pipes, fixtures, and appliances', price: 75, priceType: 'hourly' },
    { id: 3, name: 'Drain Cleaning', description: 'Removal of clogs and cleaning of drains', price: 120, priceType: 'flat' },
    { id: 4, name: 'Water Heater Services', description: 'Installation, repair, and maintenance of water heaters', price: 200, priceType: 'flat' }
  ]);

  // Portfolio state
  const [portfolio, setPortfolio] = useState([
    { id: 1, title: 'Complete Bathroom Renovation', description: 'Full plumbing renovation for a master bathroom', imageUrl: '/api/placeholder/400/300' },
    { id: 2, title: 'Commercial Kitchen Installation', description: 'Plumbing installation for a restaurant kitchen', imageUrl: '/api/placeholder/400/300' },
    { id: 3, title: 'Sewer Line Replacement', description: 'Complete replacement of damaged sewer line', imageUrl: '/api/placeholder/400/300' }
  ]);

  // Certifications state
  const [certifications, setCertifications] = useState([
    { id: 1, name: 'Master Plumber License', issuingAuthority: 'State Plumbing Board', issueDate: '2018-05-15', expiryDate: '2026-05-15', fileUrl: 'master_plumber_cert.pdf' },
    { id: 2, name: 'Backflow Prevention Certification', issuingAuthority: 'American Society of Plumbing Engineers', issueDate: '2020-03-10', expiryDate: '2025-03-10', fileUrl: 'backflow_cert.pdf' }
  ]);

  // Edit states
  const [editingService, setEditingService] = useState(null);
  const [editingPortfolio, setEditingPortfolio] = useState(null);
  const [editingCertification, setEditingCertification] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // New item states
  const [newService, setNewService] = useState({ name: '', description: '', price: '', priceType: 'hourly' });
  const [newPortfolio, setNewPortfolio] = useState({ title: '', description: '', imageFile: null });
  const [newCertification, setNewCertification] = useState({ name: '', issuingAuthority: '', issueDate: '', expiryDate: '', file: null });

  // File input refs
  const portfolioFileInputRef = useRef(null);
  const certificationFileInputRef = useRef(null);

  // Tab state
  const [activeTab, setActiveTab] = useState('profile');

  // Handle profile edit
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileInfo({
      ...profileInfo,
      [name]: value
    });
  };

  const saveProfileChanges = () => {
    // In a real app, you would send this data to your backend
    console.log('Saving profile changes:', profileInfo);
    setIsEditingProfile(false);
  };

  // Handle service functions
  const handleServiceChange = (e, isNew = false) => {
    const { name, value } = e.target;
    
    if (isNew) {
      setNewService({
        ...newService,
        [name]: name === 'price' ? parseFloat(value) || '' : value
      });
    } else {
      setEditingService({
        ...editingService,
        [name]: name === 'price' ? parseFloat(value) || 0 : value
      });
    }
  };

  const addService = () => {
    if (newService.name && newService.price) {
      const serviceToAdd = {
        ...newService,
        id: services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1
      };
      setServices([...services, serviceToAdd]);
      setNewService({ name: '', description: '', price: '', priceType: 'hourly' });
    }
  };

  const startEditService = (service) => {
    setEditingService({ ...service });
  };

  const saveServiceChanges = () => {
    if (editingService && editingService.name && editingService.price) {
      setServices(services.map(service => 
        service.id === editingService.id ? editingService : service
      ));
      setEditingService(null);
    }
  };

  const deleteService = (id) => {
    setServices(services.filter(service => service.id !== id));
    if (editingService && editingService.id === id) {
      setEditingService(null);
    }
  };

  // Handle portfolio functions
  const handlePortfolioChange = (e, isNew = false) => {
    const { name, value } = e.target;
    
    if (isNew) {
      setNewPortfolio({
        ...newPortfolio,
        [name]: value
      });
    } else {
      setEditingPortfolio({
        ...editingPortfolio,
        [name]: value
      });
    }
  };

  const handlePortfolioImageChange = (e, isNew = false) => {
    if (e.target.files && e.target.files[0]) {
      if (isNew) {
        setNewPortfolio({
          ...newPortfolio,
          imageFile: e.target.files[0]
        });
      } else {
        setEditingPortfolio({
          ...editingPortfolio,
          imageFile: e.target.files[0],
          imageUrl: URL.createObjectURL(e.target.files[0])
        });
      }
    }
  };

  const addPortfolioItem = () => {
    if (newPortfolio.title && newPortfolio.description) {
      const itemToAdd = {
        ...newPortfolio,
        id: portfolio.length > 0 ? Math.max(...portfolio.map(p => p.id)) + 1 : 1,
        imageUrl: newPortfolio.imageFile ? URL.createObjectURL(newPortfolio.imageFile) : '/api/placeholder/400/300'
      };
      setPortfolio([...portfolio, itemToAdd]);
      setNewPortfolio({ title: '', description: '', imageFile: null });
      if (portfolioFileInputRef.current) {
        portfolioFileInputRef.current.value = '';
      }
    }
  };

  const startEditPortfolio = (item) => {
    setEditingPortfolio({ ...item });
  };

  const savePortfolioChanges = () => {
    if (editingPortfolio && editingPortfolio.title) {
      setPortfolio(portfolio.map(item => 
        item.id === editingPortfolio.id ? editingPortfolio : item
      ));
      setEditingPortfolio(null);
    }
  };

  const deletePortfolioItem = (id) => {
    setPortfolio(portfolio.filter(item => item.id !== id));
    if (editingPortfolio && editingPortfolio.id === id) {
      setEditingPortfolio(null);
    }
  };

  // Handle certification functions
  const handleCertificationChange = (e, isNew = false) => {
    const { name, value } = e.target;
    
    if (isNew) {
      setNewCertification({
        ...newCertification,
        [name]: value
      });
    } else {
      setEditingCertification({
        ...editingCertification,
        [name]: value
      });
    }
  };

  const handleCertificationFileChange = (e, isNew = false) => {
    if (e.target.files && e.target.files[0]) {
      if (isNew) {
        setNewCertification({
          ...newCertification,
          file: e.target.files[0]
        });
      } else {
        setEditingCertification({
          ...editingCertification,
          file: e.target.files[0],
          fileUrl: e.target.files[0].name
        });
      }
    }
  };

  const addCertification = () => {
    if (newCertification.name && newCertification.issuingAuthority) {
      const certToAdd = {
        ...newCertification,
        id: certifications.length > 0 ? Math.max(...certifications.map(c => c.id)) + 1 : 1,
        fileUrl: newCertification.file ? newCertification.file.name : 'certificate.pdf'
      };
      setCertifications([...certifications, certToAdd]);
      setNewCertification({ name: '', issuingAuthority: '', issueDate: '', expiryDate: '', file: null });
      if (certificationFileInputRef.current) {
        certificationFileInputRef.current.value = '';
      }
    }
  };

  const startEditCertification = (cert) => {
    setEditingCertification({ ...cert });
  };

  const saveCertificationChanges = () => {
    if (editingCertification && editingCertification.name) {
      setCertifications(certifications.map(cert => 
        cert.id === editingCertification.id ? editingCertification : cert
      ));
      setEditingCertification(null);
    }
  };

  const deleteCertification = (id) => {
    setCertifications(certifications.filter(cert => cert.id !== id));
    if (editingCertification && editingCertification.id === id) {
      setEditingCertification(null);
    }
  };

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            
            {isEditingProfile ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Full Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={profileInfo.name} 
                    onChange={handleProfileChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={profileInfo.email} 
                    onChange={handleProfileChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Phone</label>
                  <input 
                    type="text" 
                    name="phone" 
                    value={profileInfo.phone} 
                    onChange={handleProfileChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Address</label>
                  <input 
                    type="text" 
                    name="address" 
                    value={profileInfo.address} 
                    onChange={handleProfileChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Bio</label>
                  <textarea 
                    name="bio" 
                    value={profileInfo.bio} 
                    onChange={handleProfileChange}
                    className="w-full p-2 border rounded"
                    rows="4"
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button 
                    onClick={() => setIsEditingProfile(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={saveProfileChanges}
                    className="bg-blueColor text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-gray-500">Full Name</p>
                    <p className="font-medium">{profileInfo.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium">{profileInfo.email}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium">{profileInfo.phone}</p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500">Address</p>
                    <p className="font-medium">{profileInfo.address}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-gray-500">Bio</p>
                  <p className="font-medium">{profileInfo.bio}</p>
                </div>
                
                <div className="flex justify-end">
                  <button 
                    onClick={() => setIsEditingProfile(true)}
                    className="bg-blueColor text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                  >
                    <FaPencilAlt className="mr-2" />
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        );
        
      case 'services':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Service Offerings</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Add New Service</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">Service Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={newService.name} 
                    onChange={(e) => handleServiceChange(e, true)}
                    className="w-full p-2 border rounded"
                    placeholder="e.g. Pipe Installation"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-gray-700 mb-2">Price ($)</label>
                    <input 
                      type="number" 
                      name="price" 
                      value={newService.price} 
                      onChange={(e) => handleServiceChange(e, true)}
                      className="w-full p-2 border rounded"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 mb-2">Price Type</label>
                    <select 
                      name="priceType" 
                      value={newService.priceType} 
                      onChange={(e) => handleServiceChange(e, true)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="flat">Flat Rate</option>
                      <option value="estimate">Estimate Required</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea 
                  name="description" 
                  value={newService.description} 
                  onChange={(e) => handleServiceChange(e, true)}
                  className="w-full p-2 border rounded"
                  rows="2"
                  placeholder="Describe the service you offer..."
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={addService}
                  className="bg-blueColor text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                  disabled={!newService.name || !newService.price}
                >
                  <FaPlus className="mr-2" />
                  Add Service
                </button>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-2">Your Services</h3>
              
              {services.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Service</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Description</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Price</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {services.map(service => (
                        <tr key={service.id} className="hover:bg-gray-50">
                          {editingService && editingService.id === service.id ? (
                            <>
                              <td className="py-4 px-4">
                                <input 
                                  type="text" 
                                  name="name" 
                                  value={editingService.name} 
                                  onChange={handleServiceChange}
                                  className="w-full p-1 border rounded"
                                />
                              </td>
                              <td className="py-4 px-4">
                                <input 
                                  type="text" 
                                  name="description" 
                                  value={editingService.description} 
                                  onChange={handleServiceChange}
                                  className="w-full p-1 border rounded"
                                />
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex items-center space-x-2">
                                  <input 
                                    type="number" 
                                    name="price" 
                                    value={editingService.price} 
                                    onChange={handleServiceChange}
                                    className="w-20 p-1 border rounded"
                                    min="0"
                                    step="0.01"
                                  />
                                  <select 
                                    name="priceType" 
                                    value={editingService.priceType} 
                                    onChange={handleServiceChange}
                                    className="p-1 border rounded"
                                  >
                                    <option value="hourly">Hourly</option>
                                    <option value="flat">Flat</option>
                                    <option value="estimate">Estimate</option>
                                  </select>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex space-x-2">
                                  <button 
                                    onClick={saveServiceChanges}
                                    className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
                                    title="Save"
                                  >
                                    <FaSave />
                                  </button>
                                  <button 
                                    onClick={() => setEditingService(null)}
                                    className="bg-gray-500 text-white p-1 rounded hover:bg-gray-600"
                                    title="Cancel"
                                  >
                                    <FaTimes />
                                  </button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="py-4 px-4">{service.name}</td>
                              <td className="py-4 px-4">{service.description}</td>
                              <td className="py-4 px-4">
                                ${service.price} {service.priceType === 'hourly' ? '/hour' : 
                                  service.priceType === 'flat' ? ' flat rate' : 
                                  ' (estimate required)'}
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex space-x-2">
                                  <button 
                                    onClick={() => startEditService(service)}
                                    className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                                    title="Edit"
                                  >
                                    <FaPencilAlt />
                                  </button>
                                  <button 
                                    onClick={() => deleteService(service.id)}
                                    className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                                    title="Delete"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No services added yet. Add your first service above.
                </div>
              )}
            </div>
          </div>
        );
        
      case 'portfolio':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Portfolio & Work Samples</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Add New Project</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">Project Title</label>
                  <input 
                    type="text" 
                    name="title" 
                    value={newPortfolio.title} 
                    onChange={(e) => handlePortfolioChange(e, true)}
                    className="w-full p-2 border rounded"
                    placeholder="e.g. Complete Bathroom Renovation"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Project Image</label>
                  <input 
                    type="file" 
                    ref={portfolioFileInputRef}
                    onChange={(e) => handlePortfolioImageChange(e, true)}
                    className="w-full p-2 border rounded"
                    accept="image/*"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Description</label>
                <textarea 
                  name="description" 
                  value={newPortfolio.description} 
                  onChange={(e) => handlePortfolioChange(e, true)}
                  className="w-full p-2 border rounded"
                  rows="2"
                  placeholder="Describe the project..."
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={addPortfolioItem}
                  className="bg-blueColor text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                  disabled={!newPortfolio.title}
                >
                  <FaPlus className="mr-2" />
                  Add Project
                </button>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-4">Your Projects</h3>
              
              {portfolio.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {portfolio.map(item => (
                    <div key={item.id} className="border rounded shadow-sm overflow-hidden">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title} 
                        className="w-full h-48 object-cover"
                      />
                      
                      {editingPortfolio && editingPortfolio.id === item.id ? (
                        <div className="p-4">
                          <input 
                            type="text" 
                            name="title" 
                            value={editingPortfolio.title} 
                            onChange={handlePortfolioChange}
                            className="w-full p-1 border rounded mb-2"
                          />
                          <textarea 
                            name="description" 
                            value={editingPortfolio.description} 
                            onChange={handlePortfolioChange}
                            className="w-full p-1 border rounded mb-2"
                            rows="2"
                          ></textarea>
                          <input 
                            type="file" 
                            onChange={(e) => handlePortfolioImageChange(e)}
                            className="w-full p-1 border rounded mb-2"
                            accept="image/*"
                          />
                          <div className="flex justify-end space-x-2 mt-2">
                            <button 
                              onClick={() => setEditingPortfolio(null)}
                              className="bg-gray-500 text-white p-1 rounded hover:bg-gray-600"
                              title="Cancel"
                            >
                              <FaTimes />
                            </button>
                            <button 
                              onClick={savePortfolioChanges}
                              className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
                              title="Save"
                            >
                              <FaSave />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4">
                          <h4 className="font-medium text-lg mb-1">{item.title}</h4>
                          <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                          <div className="flex justify-end space-x-2">
                            <button 
                              onClick={() => startEditPortfolio(item)}
                              className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                              title="Edit"
                            >
                              <FaPencilAlt />
                            </button>
                            <button 
                              onClick={() => deletePortfolioItem(item.id)}
                              className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No portfolio items yet. Add your first project above.
                </div>
              )}
            </div>
          </div>
        );
        
      case 'certifications':
        return (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Certifications & Licenses</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Add New Certification</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">Certification Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={newCertification.name} 
                    onChange={(e) => handleCertificationChange(e, true)}
                    className="w-full p-2 border rounded"
                    placeholder="e.g. Master Plumber License"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Issuing Authority</label>
                  <input 
                    type="text" 
                    name="issuingAuthority" 
                    value={newCertification.issuingAuthority} 
                    onChange={(e) => handleCertificationChange(e, true)}
                    className="w-full p-2 border rounded"
                    placeholder="e.g. State Plumbing Board"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 mb-2">Issue Date</label>
                  <input 
                    type="date" 
                    name="issueDate" 
                    value={newCertification.issueDate} 
                    onChange={(e) => handleCertificationChange(e, true)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Expiry Date</label>
                  <input 
                    type="date" 
                    name="expiryDate" 
                    value={newCertification.expiryDate} 
                    onChange={(e) => handleCertificationChange(e, true)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Certification Document</label>
                <input 
                  type="file" 
                  ref={certificationFileInputRef}
                  onChange={(e) => handleCertificationFileChange(e, true)}
                  className="w-full p-2 border rounded"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <p className="text-xs text-gray-500 mt-1">Upload PDF or image of your certification document</p>
              </div>
              
              <div className="flex justify-end">
                <button 
                  onClick={addCertification}
                  className="bg-blueColor text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                  disabled={!newCertification.name || !newCertification.issuingAuthority}
                >
                  <FaPlus className="mr-2" />
                  Add Certification
                </button>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-2">Your Certifications</h3>
              
              {certifications.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Certification</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Issuing Authority</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Validity</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Document</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {certifications.map(cert => (
                        <tr key={cert.id} className="hover:bg-gray-50">
                          {editingCertification && editingCertification.id === cert.id ? (
                            <>
                              <td className="py-4 px-4">
                                <input 
                                  type="text" 
                                  name="name" 
                                  value={editingCertification.name} 
                                  onChange={handleCertificationChange}
                                  className="w-full p-1 border rounded"
                                />
                              </td>
                              <td className="py-4 px-4">
                                <input 
                                  type="text" 
                                  name="issuingAuthority" 
                                  value={editingCertification.issuingAuthority} 
                                  onChange={handleCertificationChange}
                                  className="w-full p-1 border rounded"
                                />
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex space-x-2">
                                  <input 
                                    type="date" 
                                    name="issueDate" 
                                    value={editingCertification.issueDate} 
                                    onChange={handleCertificationChange}
                                    className="w-32 p-1 border rounded"
                                  />
                                  -
                                  <input 
                                    type="date" 
                                    name="expiryDate" 
                                    value={editingCertification.expiryDate} 
                                    onChange={handleCertificationChange}
                                    className="w-32 p-1 border rounded"
                                  />
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <input 
                                  type="file" 
                                  onChange={(e) => handleCertificationFileChange(e)}
                                  className="w-full p-1 border rounded"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                />
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex space-x-2">
                                  <button 
                                    onClick={saveCertificationChanges}
                                    className="bg-green-500 text-white p-1 rounded hover:bg-green-600"
                                    title="Save"
                                  >
                                    <FaSave />
                                  </button>
                                  <button 
                                    onClick={() => setEditingCertification(null)}
                                    className="bg-gray-500 text-white p-1 rounded hover:bg-gray-600"
                                    title="Cancel"
                                  >
                                    <FaTimes />
                                  </button>
                                </div>
                              </td>
                            </>
                          ) : (
                            <>
                              <td className="py-4 px-4">{cert.name}</td>
                              <td className="py-4 px-4">{cert.issuingAuthority}</td>
                              <td className="py-4 px-4">
                                {new Date(cert.issueDate).toLocaleDateString()} - {new Date(cert.expiryDate).toLocaleDateString()}
                              </td>
                              <td className="py-4 px-4">
                                <a href="#" className="text-blueColor hover:underline">
                                  {cert.fileUrl}
                                </a>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex space-x-2">
                                  <button 
                                    onClick={() => startEditCertification(cert)}
                                    className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                                    title="Edit"
                                  >
                                    <FaPencilAlt />
                                  </button>
                                  <button 
                                    onClick={() => deleteCertification(cert.id)}
                                    className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                                    title="Delete"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No certifications added yet. Add your first certification above.
                </div>
              )}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="bg-greyIsh-50 min-h-screen pb-8">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/provider/dashboard" className="mr-4">
              <FaArrowLeft className="text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-blueColor">Profile Management</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pt-8">
        {/* Tabs */}
        <div className="flex border-b mb-8">
          <button 
            className={`py-3 px-6 ${activeTab === 'profile' ? 'border-b-2 border-blueColor text-blueColor font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('profile')}
          >
            <FaUser className="inline mr-2" />
            Basic Info
          </button>
          <button 
            className={`py-3 px-6 ${activeTab === 'services' ? 'border-b-2 border-blueColor text-blueColor font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('services')}
          >
            <FaTools className="inline mr-2" />
            Services
          </button>
          <button 
            className={`py-3 px-6 ${activeTab === 'portfolio' ? 'border-b-2 border-blueColor text-blueColor font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('portfolio')}
          >
            <FaImages className="inline mr-2" />
            Portfolio
          </button>
          <button 
            className={`py-3 px-6 ${activeTab === 'certifications' ? 'border-b-2 border-blueColor text-blueColor font-medium' : 'text-gray-500'}`}
            onClick={() => setActiveTab('certifications')}
          >
            <FaCertificate className="inline mr-2" />
            Certifications
          </button>
        </div>
        
        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
};

export default ProviderProfileManagement;