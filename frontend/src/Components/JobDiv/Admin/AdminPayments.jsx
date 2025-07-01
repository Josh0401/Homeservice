import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUserShield, 
  FaBell, 
  FaCog, 
  FaSearch,
  FaMoneyBillWave,
  FaCreditCard,
  FaPaypal,
  FaDollarSign,
  FaPercentage,
  FaExchangeAlt,
  FaFileInvoiceDollar,
  FaArrowLeft,
  FaDownload,
  FaExclamationTriangle,
  FaBan,
  FaCheck,
  FaFilter,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaEllipsisV
} from 'react-icons/fa';

const AdminPayments = () => {
  const navigate = useNavigate();

  // Sample data - in a real app, this would come from an API
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      name: 'Credit Card',
      provider: 'Stripe',
      status: 'active',
      fee: '2.9% + $0.30',
      icon: <FaCreditCard />
    },
    {
      id: 2,
      name: 'PayPal',
      provider: 'PayPal',
      status: 'active',
      fee: '3.5% + $0.45',
      icon: <FaPaypal />
    },
    {
      id: 3,
      name: 'Bank Transfer',
      provider: 'Plaid',
      status: 'inactive',
      fee: '1.0% + $0.25',
      icon: <FaExchangeAlt />
    }
  ]);

  const [platformFees, setPlatformFees] = useState({
    customerServiceFee: 5,
    providerCommission: 10,
    minimumPayout: 25
  });

  const [recentTransactions, setRecentTransactions] = useState([
    {
      id: 'TRX-001234',
      date: '2025-03-25',
      user: 'John Smith',
      service: 'Pipe Installation',
      amount: 120.00,
      fee: 8.40,
      status: 'completed'
    },
    {
      id: 'TRX-001235',
      date: '2025-03-25',
      user: 'Emily Clark',
      service: 'Water Heater Installation',
      amount: 225.50,
      fee: 15.79,
      status: 'completed'
    },
    {
      id: 'TRX-001236',
      date: '2025-03-24',
      user: 'Michael Johnson',
      service: 'Drain Cleaning',
      amount: 85.00,
      fee: 5.95,
      status: 'completed'
    },
    {
      id: 'TRX-001237',
      date: '2025-03-24',
      user: 'Sarah Thompson',
      service: 'Leak Repair',
      amount: 150.00,
      fee: 10.50,
      status: 'pending'
    },
    {
      id: 'TRX-001238',
      date: '2025-03-23',
      user: 'Robert Wilson',
      service: 'Toilet Repair',
      amount: 95.00,
      fee: 6.65,
      status: 'failed'
    }
  ]);

  const [pendingPayouts, setPendingPayouts] = useState([
    {
      id: 'PAY-00567',
      provider: 'John Smith',
      amount: 342.00,
      services: 3,
      requestDate: '2025-03-24',
      status: 'pending'
    },
    {
      id: 'PAY-00568',
      provider: 'Michael Johnson',
      amount: 178.50,
      services: 2,
      requestDate: '2025-03-23',
      status: 'pending'
    },
    {
      id: 'PAY-00569',
      provider: 'Robert Wilson',
      amount: 520.75,
      services: 5,
      requestDate: '2025-03-22',
      status: 'processing'
    }
  ]);

  // State for form inputs
  const [editingFees, setEditingFees] = useState(false);
  const [tempFees, setTempFees] = useState({...platformFees});
  
  // State for payment method toggle
  const [methodToToggle, setMethodToToggle] = useState(null);
  const [showConfirmToggle, setShowConfirmToggle] = useState(false);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // State for mobile menu
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // State for mobile action menus
  const [activeActionMenu, setActiveActionMenu] = useState(null);

  // Handle navigation to notifications page
  const handleNotificationClick = () => {
    navigate('/admin/notifications');
    setShowMobileMenu(false);
  };

  // Handle navigation to dashboard
  const handleBackToDashboard = () => {
    navigate('/admin/dashboard');
  };

  // Handle navigation to settings page
  const handleSettingsClick = () => {
    navigate('/admin/systems');
    setShowMobileMenu(false);
  };

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  // Handle edit platform fees
  const handleEditFees = () => {
    setEditingFees(true);
  };

  // Handle save platform fees
  const handleSaveFees = () => {
    setPlatformFees({...tempFees});
    setEditingFees(false);
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setTempFees({...platformFees});
    setEditingFees(false);
  };

  // Handle fee input change
  const handleFeeChange = (e) => {
    const { name, value } = e.target;
    setTempFees(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  // Handle payment method toggle
  const handleTogglePaymentMethod = (methodId) => {
    const method = paymentMethods.find(m => m.id === methodId);
    setMethodToToggle(method);
    setShowConfirmToggle(true);
  };

  // Execute payment method toggle
  const executeToggleMethod = () => {
    const updatedMethods = paymentMethods.map(method => {
      if (method.id === methodToToggle.id) {
        return {
          ...method,
          status: method.status === 'active' ? 'inactive' : 'active'
        };
      }
      return method;
    });
    
    setPaymentMethods(updatedMethods);
    setShowConfirmToggle(false);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };
  
  // Toggle action menu for mobile
  const toggleActionMenu = (id) => {
    if (activeActionMenu === id) {
      setActiveActionMenu(null);
    } else {
      setActiveActionMenu(id);
    }
  };
  
  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeActionMenu !== null && !event.target.closest('.action-menu-container')) {
        setActiveActionMenu(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeActionMenu]);

  // Filter transactions based on search term and filters
  const filteredTransactions = recentTransactions.filter(transaction => {
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.service.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || transaction.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-6 md:pb-8">
      {/* Header */}
      <header className="bg-indigo-700 shadow-lg">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold text-white">Admin Dashboard</h1>
            
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden text-white focus:outline-none"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {showMobileMenu ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
            
            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search transactions..."
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
              </Link>
              <Link to="/admin/create-service" className="flex items-center text-white hover:text-indigo-200">
              <FaClipboardList size={22} className="mr-2" />
              <span>Services</span>
            </Link>
            <Link to="/admin/create-service-category" className="flex items-center text-white hover:text-indigo-200">
              <FaClipboardList size={22} className="mr-2" />
              <span>Service Category</span>
            </Link>
            </div>
          </div>
          
          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="mt-4 lg:hidden">
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
              </div>
              <div className="flex flex-col space-y-3 pb-2">
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
                <Link 
                  to="/admin/profile" 
                  className="flex items-center text-white hover:text-indigo-200"
                  onClick={() => setShowMobileMenu(false)}
                >
                  <FaUserShield size={22} className="mr-2" />
                  <span>Admin Profile</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 pt-4 md:pt-8">
        {/* Back to Dashboard Link */}
        <div className="mb-4 md:mb-6">
          <button 
            onClick={handleBackToDashboard}
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <FaArrowLeft className="mr-2" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      
        {/* Page Title and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-0">Payment Settings</h2>
          
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-500" />
              <select 
                className="bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={statusFilter}
                onChange={handleStatusFilterChange}
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            
            <button 
              onClick={() => {/* In a real app, this would download transaction report */}}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm flex items-center justify-center"
            >
              <FaDownload className="mr-2" />
              Export Transactions
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
          {/* Left Column - Payment Methods & Platform Fees */}
          <div className="lg:col-span-1">
            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-semibold mb-4 flex items-center">
                <FaCreditCard className="mr-2 text-indigo-600" />
                Payment Methods
              </h3>
              
              <div className="space-y-3 md:space-y-4">
                {paymentMethods.map(method => (
                  <div key={method.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <div className={`p-2 mr-3 rounded-full ${method.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                        {method.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{method.name}</h4>
                        <div className="text-sm text-gray-500">Provider: {method.provider}</div>
                        <div className="text-xs text-gray-500">Fee: {method.fee}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleTogglePaymentMethod(method.id)}
                      className={`px-3 py-1 rounded-md text-sm ${
                        method.status === 'active' 
                          ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                      }`}
                    >
                      {method.status === 'active' ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                ))}

                <div className="mt-4 text-center">
                  <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    + Add New Payment Method
                  </button>
                </div>
              </div>
            </div>
            
            {/* Platform Fees */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-4 md:mb-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base md:text-lg font-semibold flex items-center">
                  <FaPercentage className="mr-2 text-indigo-600" />
                  Platform Fees
                </h3>
                {!editingFees ? (
                  <button 
                    onClick={handleEditFees}
                    className="text-indigo-600 hover:text-indigo-800 text-sm"
                  >
                    Edit
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button 
                      onClick={handleCancelEdit}
                      className="text-gray-600 hover:text-gray-800 text-sm"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveFees}
                      className="text-green-600 hover:text-green-800 text-sm"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
              
              <div className="space-y-3 md:space-y-4">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Customer Service Fee</h4>
                    <div className="text-sm text-gray-500">Applied to all bookings</div>
                  </div>
                  {!editingFees ? (
                    <div className="font-semibold">{platformFees.customerServiceFee}%</div>
                  ) : (
                    <div className="flex items-center">
                      <input 
                        type="number" 
                        name="customerServiceFee"
                        value={tempFees.customerServiceFee}
                        onChange={handleFeeChange}
                        className="w-16 p-1 border rounded text-right"
                        min="0"
                        step="0.1"
                      />
                      <span className="ml-1">%</span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Provider Commission</h4>
                    <div className="text-sm text-gray-500">Deducted from provider payments</div>
                  </div>
                  {!editingFees ? (
                    <div className="font-semibold">{platformFees.providerCommission}%</div>
                  ) : (
                    <div className="flex items-center">
                      <input 
                        type="number" 
                        name="providerCommission"
                        value={tempFees.providerCommission}
                        onChange={handleFeeChange}
                        className="w-16 p-1 border rounded text-right"
                        min="0"
                        step="0.1"
                      />
                      <span className="ml-1">%</span>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Minimum Payout</h4>
                    <div className="text-sm text-gray-500">Required balance for provider payouts</div>
                  </div>
                  {!editingFees ? (
                    <div className="font-semibold">${platformFees.minimumPayout}</div>
                  ) : (
                    <div className="flex items-center">
                      <span className="mr-1">$</span>
                      <input 
                        type="number" 
                        name="minimumPayout"
                        value={tempFees.minimumPayout}
                        onChange={handleFeeChange}
                        className="w-16 p-1 border rounded"
                        min="0"
                        step="1"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Transactions & Payouts */}
          <div className="lg:col-span-2">
            {/* Recent Transactions */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-4 md:mb-6">
              <h3 className="text-base md:text-lg font-semibold mb-4 flex items-center">
                <FaFileInvoiceDollar className="mr-2 text-indigo-600" />
                Recent Transactions
              </h3>
              
              {/* Mobile View of Transactions (Card Format) */}
              <div className="block lg:hidden space-y-4">
                {filteredTransactions.map(transaction => (
                  <div key={transaction.id} className="border rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{transaction.id}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(transaction.date)}</p>
                      </div>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(transaction.status)}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm"><span className="font-medium">User:</span> {transaction.user}</p>
                      <p className="text-sm mt-1"><span className="font-medium">Service:</span> {transaction.service}</p>
                      <div className="flex justify-between items-end mt-2 pt-2 border-t border-gray-100">
                        <div>
                          <p className="text-sm font-medium">${transaction.amount.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">Fee: ${transaction.fee.toFixed(2)}</p>
                        </div>
                        <button className="text-indigo-600 text-sm">Details</button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredTransactions.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    No transactions found matching your filters.
                  </div>
                )}
              </div>
              
              {/* Desktop View of Transactions (Table Format) */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Service
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTransactions.map(transaction => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction.id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(transaction.date)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {transaction.user}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {transaction.service}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm">
                          <div className="text-gray-900">${transaction.amount.toFixed(2)}</div>
                          <div className="text-xs text-gray-500">Fee: ${transaction.fee.toFixed(2)}</div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(transaction.status)}`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {filteredTransactions.length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                          No transactions found matching your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-center">
                <Link to="/admin/transactions" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  View All Transactions →
                </Link>
              </div>
            </div>
            
            {/* Pending Payouts */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold mb-4 flex items-center">
                <FaDollarSign className="mr-2 text-indigo-600" />
                Pending Provider Payouts
              </h3>
              
              {/* Mobile View of Payouts (Card Format) */}
              <div className="block md:hidden space-y-4">
                {pendingPayouts.map(payout => (
                  <div key={payout.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm text-gray-900">{payout.id}</span>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(payout.status)}`}>
                        {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm mb-1"><span className="text-gray-500">Services:</span> {payout.services}</p>
                    <p className="text-sm mb-3"><span className="text-gray-500">Requested:</span> {formatDate(payout.requestDate)}</p>
                    
                    <div className="flex justify-end space-x-3 mt-2 border-t border-gray-100 pt-3">
                      {payout.status === 'pending' && (
                        <>
                          <button className="text-green-600 hover:text-green-900 flex items-center text-sm" title="Approve Payout">
                            <FaCheck className="mr-1" /> Approve
                          </button>
                          <button className="text-red-600 hover:text-red-900 flex items-center text-sm" title="Reject Payout">
                            <FaBan className="mr-1" /> Reject
                          </button>
                        </>
                      )}
                      <button className="text-indigo-600 hover:text-indigo-900 text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
                
                {pendingPayouts.length === 0 && (
                  <div className="text-center text-gray-500 py-4">
                    No pending payouts at this time.
                  </div>
                )}
              </div>
              
              {/* Desktop View of Payouts (Table Format) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payout ID
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Provider
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Services
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Requested
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {pendingPayouts.map(payout => (
                      <tr key={payout.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {payout.id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          {payout.provider}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${payout.amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {payout.services} services
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(payout.requestDate)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(payout.status)}`}>
                            {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            {payout.status === 'pending' && (
                              <>
                                <button className="text-green-600 hover:text-green-900" title="Approve Payout">
                                  <FaCheck />
                                </button>
                                <button className="text-red-600 hover:text-red-900" title="Reject Payout">
                                  <FaBan />
                                </button>
                              </>
                            )}
                            <button className="text-indigo-600 hover:text-indigo-900" title="View Details">
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {pendingPayouts.length === 0 && (
                      <tr>
                        <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                          No pending payouts at this time.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-center">
                <Link to="/admin/payouts" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  View All Payouts →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Payment Method Toggle */}
      {showConfirmToggle && methodToToggle && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center mb-4">
                <div className="mb-3 md:mb-0 md:mr-4 flex justify-center">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <FaExclamationTriangle className="text-yellow-600" size={24} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 text-center md:text-left">Confirm Action</h3>
                  <p className="text-gray-600 text-center md:text-left mt-1">
                    {methodToToggle.status === 'active'
                      ? `Are you sure you want to disable ${methodToToggle.name} payments? This will prevent users from making new payments via this method.`
                      : `Are you sure you want to enable ${methodToToggle.name} payments? This will allow users to make payments via this method.`
                    }
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3 mt-6">
                <button 
                  onClick={() => setShowConfirmToggle(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button 
                  onClick={executeToggleMethod}
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 w-full sm:w-auto mb-2 sm:mb-0"
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

export default AdminPayments;