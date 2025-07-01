import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUserShield, 
  FaBell, 
  FaCog, 
  FaSearch,
  FaUserAlt,
  FaUserSlash,
  FaTrash,
  FaEye,
  FaEdit,
  FaCheckCircle,
  FaTimesCircle,
  FaFilter,
  FaUserCog,
  FaExclamationTriangle,
  FaArrowLeft,
  FaBars
} from 'react-icons/fa';

const AdminUsers = () => {
  const navigate = useNavigate();

  // Sample data - in a real app, this would come from an API
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@example.com',
      type: 'provider',
      registeredDate: '2024-12-15',
      status: 'active',
      verificationStatus: 'verified',
      lastActive: '2025-03-25'
    },
    {
      id: 2,
      name: 'Jane Adams',
      email: 'jane.adams@example.com',
      type: 'customer',
      registeredDate: '2025-01-03',
      status: 'active',
      verificationStatus: 'verified',
      lastActive: '2025-03-26'
    },
    {
      id: 3,
      name: 'Michael Johnson',
      email: 'michael.j@example.com',
      type: 'provider',
      registeredDate: '2024-11-28',
      status: 'suspended',
      verificationStatus: 'pending',
      lastActive: '2025-03-10'
    },
    {
      id: 4,
      name: 'Emily Clark',
      email: 'emily.clark@example.com',
      type: 'customer',
      registeredDate: '2025-02-17',
      status: 'active',
      verificationStatus: 'verified',
      lastActive: '2025-03-24'
    },
    {
      id: 5,
      name: 'Robert Wilson',
      email: 'robert.w@example.com',
      type: 'provider',
      registeredDate: '2025-01-22',
      status: 'inactive',
      verificationStatus: 'rejected',
      lastActive: '2025-02-10'
    },
    {
      id: 6,
      name: 'Sarah Thompson',
      email: 'sarah.t@example.com',
      type: 'customer',
      registeredDate: '2024-12-05',
      status: 'active',
      verificationStatus: 'verified',
      lastActive: '2025-03-26'
    },
    {
      id: 7,
      name: 'David Brown',
      email: 'david.b@example.com',
      type: 'provider',
      registeredDate: '2025-02-28',
      status: 'pending',
      verificationStatus: 'pending',
      lastActive: 'Never'
    },
    {
      id: 8,
      name: 'Lisa Rogers',
      email: 'lisa.r@example.com',
      type: 'customer',
      registeredDate: '2025-03-01',
      status: 'active',
      verificationStatus: 'verified',
      lastActive: '2025-03-25'
    },
  ]);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle navigation to notifications page
  const handleNotificationClick = () => {
    navigate('/admin/notifications');
  };

  // Handle navigation to dashboard
  const handleBackToDashboard = () => {
    navigate('/admin/dashboard');
  };

  // Handle navigation to settings page
  const handleSettingsClick = () => {
    navigate('/admin/systems');
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle filter changes
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleTypeFilterChange = (e) => {
    setTypeFilter(e.target.value);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatusFilter = 
      statusFilter === 'all' || user.status === statusFilter;
    
    const matchesTypeFilter = 
      typeFilter === 'all' || user.type === typeFilter;

    return matchesSearch && matchesStatusFilter && matchesTypeFilter;
  });

  // Handle view profile
  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
  };

  // Handle edit profile
  const handleEditProfile = (userId) => {
    navigate(`/admin/users/${userId}/edit`);
  };

  // Handle user status change confirmation
  const handleConfirmAction = (user, action) => {
    setSelectedUser(user);
    setActionType(action);
    setShowConfirmModal(true);
  };

  // Execute action after confirmation
  const executeAction = () => {
    const updatedUsers = [...users];
    const userIndex = updatedUsers.findIndex(u => u.id === selectedUser.id);
    
    if (userIndex !== -1) {
      if (actionType === 'suspend') {
        updatedUsers[userIndex].status = 'suspended';
      } else if (actionType === 'activate') {
        updatedUsers[userIndex].status = 'active';
      } else if (actionType === 'delete') {
        updatedUsers.splice(userIndex, 1);
      } else if (actionType === 'verify') {
        updatedUsers[userIndex].verificationStatus = 'verified';
      } else if (actionType === 'reject') {
        updatedUsers[userIndex].verificationStatus = 'rejected';
      }
    }
    
    setUsers(updatedUsers);
    setShowConfirmModal(false);
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get verification status badge color
  const getVerificationBadgeColor = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-8">
      {/* Header */}
      <header className="bg-indigo-700 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold text-white">Admin Dashboard</h1>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden text-white focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <FaBars size={24} />
            </button>
            
            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
              </div>
              <button 
                className="text-white hover:text-indigo-200" 
                onClick={handleNotificationClick}
              >
                <FaBell size={20} />
              </button>
              <button 
                className="text-white hover:text-indigo-200"
                onClick={handleSettingsClick}
              >
                <FaCog size={20} />
              </button>
              <Link to="/admin/profile" className="flex items-center text-white hover:text-indigo-200">
                <FaUserShield size={22} className="mr-2" />
                <span>Admin</span>
                <Link to="/admin/create-service" className="flex items-center text-white hover:text-indigo-200">
              <FaClipboardList size={22} className="mr-2" />
              <span>Services</span>
            </Link>
            <Link to="/admin/create-service-category" className="flex items-center text-white hover:text-indigo-200">
              <FaClipboardList size={22} className="mr-2" />
              <span>Service Category</span>
            </Link>
              </Link>
            </div>
          </div>
          
          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="mt-4 md:hidden">
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
              </div>
              <div className="flex justify-between">
                <button 
                  className="text-white hover:text-indigo-200 flex items-center" 
                  onClick={handleNotificationClick}
                >
                  <FaBell size={20} className="mr-2" />
                  <span>Notifications</span>
                </button>
                <button 
                  className="text-white hover:text-indigo-200 flex items-center"
                  onClick={handleSettingsClick}
                >
                  <FaCog size={20} className="mr-2" />
                  <span>Settings</span>
                </button>
                <Link to="/admin/profile" className="flex items-center text-white hover:text-indigo-200">
                  <FaUserShield size={22} className="mr-2" />
                  <span>Admin</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 pt-6 md:pt-8">
        {/* Back to Dashboard Link */}
        <div className="mb-6">
          <button 
            onClick={handleBackToDashboard}
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <FaArrowLeft className="mr-2" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      
        {/* Page Title and Filters */}
        <div className="flex flex-col mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">User Management</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-500" />
              <select 
                className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                value={statusFilter}
                onChange={handleStatusFilterChange}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <FaUserAlt className="text-gray-500" />
              <select 
                className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                value={typeFilter}
                onChange={handleTypeFilterChange}
              >
                <option value="all">All User Types</option>
                <option value="customer">Customer</option>
                <option value="provider">Provider</option>
              </select>
            </div>
          </div>
        </div>

        {/* User Count Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-500">Total Users</h3>
                <p className="text-lg md:text-xl font-bold text-indigo-600">{users.length}</p>
              </div>
              <div className="p-2 md:p-3 rounded-full bg-indigo-100">
                <FaUserAlt className="text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-500">Active Users</h3>
                <p className="text-lg md:text-xl font-bold text-green-600">{users.filter(user => user.status === 'active').length}</p>
              </div>
              <div className="p-2 md:p-3 rounded-full bg-green-100">
                <FaCheckCircle className="text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-500">Suspended Users</h3>
                <p className="text-lg md:text-xl font-bold text-red-600">{users.filter(user => user.status === 'suspended').length}</p>
              </div>
              <div className="p-2 md:p-3 rounded-full bg-red-100">
                <FaUserSlash className="text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-3 md:p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-500">Pending Verification</h3>
                <p className="text-lg md:text-xl font-bold text-yellow-600">{users.filter(user => user.verificationStatus === 'pending').length}</p>
              </div>
              <div className="p-2 md:p-3 rounded-full bg-yellow-100">
                <FaUserCog className="text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Users Table - Desktop Version */}
        <div className="hidden md:block bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registered
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Verification
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-700 font-medium">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">{user.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{new Date(user.registeredDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(user.status)}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getVerificationBadgeColor(user.verificationStatus)}`}>
                        {user.verificationStatus.charAt(0).toUpperCase() + user.verificationStatus.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastActive === 'Never' ? 'Never' : new Date(user.lastActive).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewProfile(user)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="View Profile"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEditProfile(user.id)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Edit Profile"
                        >
                          <FaEdit />
                        </button>
                        {user.status !== 'suspended' ? (
                          <button
                            onClick={() => handleConfirmAction(user, 'suspend')}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Suspend User"
                          >
                            <FaUserSlash />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleConfirmAction(user, 'activate')}
                            className="text-green-600 hover:text-green-900"
                            title="Activate User"
                          >
                            <FaCheckCircle />
                          </button>
                        )}
                        {user.verificationStatus === 'pending' && (
                          <>
                            <button
                              onClick={() => handleConfirmAction(user, 'verify')}
                              className="text-green-600 hover:text-green-900"
                              title="Verify User"
                            >
                              <FaCheckCircle />
                            </button>
                            <button
                              onClick={() => handleConfirmAction(user, 'reject')}
                              className="text-red-600 hover:text-red-900"
                              title="Reject Verification"
                            >
                              <FaTimesCircle />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleConfirmAction(user, 'delete')}
                          className="text-red-600 hover:text-red-900"
                          title="Delete User"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                      No users found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Users Cards - Mobile Version */}
        <div className="md:hidden space-y-4 mb-8">
          {filteredUsers.map(user => (
            <div key={user.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center mb-3">
                <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-700 font-medium">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900">{user.name}</h3>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div>
                  <span className="text-gray-500">Type:</span>
                  <span className="ml-1 capitalize">{user.type}</span>
                </div>
                <div>
                  <span className="text-gray-500">Registered:</span>
                  <span className="ml-1">{new Date(user.registeredDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${getStatusBadgeColor(user.status)}`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Verification:</span>
                  <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${getVerificationBadgeColor(user.verificationStatus)}`}>
                    {user.verificationStatus.charAt(0).toUpperCase() + user.verificationStatus.slice(1)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Last Active:</span>
                  <span className="ml-1">
                    {user.lastActive === 'Never' ? 'Never' : new Date(user.lastActive).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between border-t pt-3">
                <button
                  onClick={() => handleViewProfile(user)}
                  className="flex items-center text-xs text-indigo-600"
                >
                  <FaEye className="mr-1" /> View
                </button>
                <button
                  onClick={() => handleEditProfile(user.id)}
                  className="flex items-center text-xs text-blue-600"
                >
                  <FaEdit className="mr-1" /> Edit
                </button>
                {user.status !== 'suspended' ? (
                  <button
                    onClick={() => handleConfirmAction(user, 'suspend')}
                    className="flex items-center text-xs text-yellow-600"
                  >
                    <FaUserSlash className="mr-1" /> Suspend
                  </button>
                ) : (
                  <button
                    onClick={() => handleConfirmAction(user, 'activate')}
                    className="flex items-center text-xs text-green-600"
                  >
                    <FaCheckCircle className="mr-1" /> Activate
                  </button>
                )}
                <button
                  onClick={() => handleConfirmAction(user, 'delete')}
                  className="flex items-center text-xs text-red-600"
                >
                  <FaTrash className="mr-1" /> Delete
                </button>
              </div>
              
              {user.verificationStatus === 'pending' && (
                <div className="flex justify-between mt-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleConfirmAction(user, 'verify')}
                    className="flex items-center text-xs text-green-600"
                  >
                    <FaCheckCircle className="mr-1" /> Verify
                  </button>
                  <button
                    onClick={() => handleConfirmAction(user, 'reject')}
                    className="flex items-center text-xs text-red-600"
                  >
                    <FaTimesCircle className="mr-1" /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
          
          {filteredUsers.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-4 text-center text-gray-500">
              No users found matching your filters.
            </div>
          )}
        </div>
      </div>

      {/* User Profile Modal */}
      {showProfileModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900">User Profile Details</h3>
                <button 
                  onClick={() => setShowProfileModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row mb-4 md:mb-6">
                <div className="sm:w-1/3 mb-4 sm:mb-0 sm:pr-4 flex justify-center sm:justify-start">
                  <div className="h-24 w-24 md:h-32 md:w-32 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-indigo-700 font-bold text-2xl md:text-3xl">
                      {selectedUser.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
                
                <div className="sm:w-2/3">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2 text-center sm:text-left">{selectedUser.name}</h3>
                  <p className="text-gray-600 mb-2 text-center sm:text-left">{selectedUser.email}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-2 justify-center sm:justify-start">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(selectedUser.status)}`}>
                      {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                    </span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getVerificationBadgeColor(selectedUser.verificationStatus)}`}>
                      {selectedUser.verificationStatus.charAt(0).toUpperCase() + selectedUser.verificationStatus.slice(1)}
                    </span>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 capitalize">
                      {selectedUser.type}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    <div>
                      <p className="text-sm text-gray-500">Registered Date</p>
                      <p className="font-medium">{new Date(selectedUser.registeredDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Last Active</p>
                      <p className="font-medium">
                        {selectedUser.lastActive === 'Never' ? 'Never' : new Date(selectedUser.lastActive).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <h4 className="font-medium text-gray-900 mb-3">User Activity Summary</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Login Count</p>
                    <p className="font-semibold">27</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Bookings</p>
                    <p className="font-semibold">12</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Reviews</p>
                    <p className="font-semibold">8</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button 
                  onClick={() => {
                    setShowProfileModal(false);
                    handleEditProfile(selectedUser.id);
                  }}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-full sm:w-auto"
                >
                  Edit Profile
                </button>
                <button 
                  onClick={() => setShowProfileModal(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 w-full sm:w-auto"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 md:p-6">
              <div className="flex items-start md:items-center mb-4">
                <div className="mr-4 flex-shrink-0">
                  <div className="bg-yellow-100 p-2 md:p-3 rounded-full">
                    <FaExclamationTriangle className="text-yellow-600" size={20} />
                  </div>
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-semibold text-gray-900">Confirm Action</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {actionType === 'suspend' && `Are you sure you want to suspend ${selectedUser.name}'s account?`}
                    {actionType === 'activate' && `Are you sure you want to activate ${selectedUser.name}'s account?`}
                    {actionType === 'delete' && `Are you sure you want to delete ${selectedUser.name}'s account? This action cannot be undone.`}
                    {actionType === 'verify' && `Are you sure you want to verify ${selectedUser.name}'s account?`}
                    {actionType === 'reject' && `Are you sure you want to reject ${selectedUser.name}'s verification request?`}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3 mt-5">
                <button 
                  onClick={() => setShowConfirmModal(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeAction}
                  className={`text-white px-4 py-2 rounded w-full sm:w-auto ${
                    actionType === 'delete' ? 'bg-red-600 hover:bg-red-700' : 
                    actionType === 'suspend' ? 'bg-yellow-600 hover:bg-yellow-700' : 
                    'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;