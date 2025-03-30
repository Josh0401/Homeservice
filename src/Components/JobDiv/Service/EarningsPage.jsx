import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaMoneyBillWave, 
  FaCalendarAlt,
  FaFileDownload,
  FaChartLine,
  FaChevronDown,
  FaChevronUp,
  FaFilter,
  FaSearch,
  FaExclamationCircle,
  FaTimes,
  FaUser,
  FaTools,
  FaCalendarDay,
  FaDollarSign,
  FaCheckCircle,
  FaClock,
  FaReceipt,
  FaMapMarkerAlt
} from 'react-icons/fa';


const EarningsPage = () => {
  // Filter states
  const [timeFilter, setTimeFilter] = useState('thisMonth');
  const [showTimeFilter, setShowTimeFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Transaction detail modal state
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(5);
  
  // Sample data - in a real app, this would come from an API
  const [earningsSummary, setEarningsSummary] = useState({
    thisMonth: {
      total: 2450,
      completed: 770,
      pending: 325,
      jobs: 31,
      average: 79
    },
    lastMonth: {
      total: 2150,
      completed: 2150,
      pending: 0,
      jobs: 28,
      average: 77
    },
    lastThreeMonths: {
      total: 6300,
      completed: 5850,
      pending: 450,
      jobs: 82,
      average: 77
    },
    thisYear: {
      total: 9700,
      completed: 9050,
      pending: 650,
      jobs: 124,
      average: 78
    }
  });

  // Sample transactions data
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      customer: 'John Doe',
      service: 'Pipe Installation',
      date: '2025-03-22',
      amount: 145,
      status: 'completed'
    },
    {
      id: 2,
      customer: 'Jane Smith',
      service: 'Leak Repair',
      date: '2025-03-20',
      amount: 95,
      status: 'failed'
    },
    {
      id: 3,
      customer: 'Bob Johnson',
      service: 'Water Heater Services',
      date: '2025-03-18',
      amount: 220,
      status: 'completed'
    },
    {
      id: 4,
      customer: 'Alice Williams',
      service: 'Drain Cleaning',
      date: '2025-03-15',
      amount: 110,
      status: 'completed'
    },
    {
      id: 5,
      customer: 'Michael Brown',
      service: 'Bathroom Plumbing',
      date: '2025-03-28',
      amount: 325,
      status: 'pending'
    },
    {
      id: 6,
      customer: 'Sarah Davis',
      service: 'Faucet Replacement',
      date: '2025-03-26',
      amount: 85,
      status: 'failed'
    },
    {
      id: 7,
      customer: 'James Wilson',
      service: 'Pipe Repair',
      date: '2025-03-10',
      amount: 120,
      status: 'completed'
    },
    {
      id: 8,
      customer: 'Emily Miller',
      service: 'Sewer Line Cleaning',
      date: '2025-03-05',
      amount: 175,
      status: 'completed'
    },
    {
        id: 9,
        customer: 'Dylan Miller',
        service: 'Sewer Line Cleaning',
        date: '2025-03-05',
        amount: 275,
        status: 'pending'
      },
      {
        id: 10,
        customer: 'Emily Saunders',
        service: 'Water Heater Services',
        date: '2025-03-05',
        amount: 875,
        status: 'failed'
      },
      {
        id: 11,
        customer: 'Sarah Stone',
        service: 'Faucet Replacement',
        date: '2025-03-05',
        amount: 45,
        status: 'completed'
      },
      {
        id: 12,
        customer: 'Daniel Exeter',
        service: 'Drain Cleaning',
        date: '2025-03-05',
        amount: 560,
        status: 'completed'
      },
      {
        id: 13,
        customer: 'May Brown',
        service: 'Leak Repair',
        date: '2025-03-05',
        amount: 175,
        status: 'failed'
      },
      {
        id: 14,
        customer: 'Alex McCarthy',
        service: 'Electricity Repair',
        date: '2025-03-05',
        amount: 175,
        status: 'pending'
      },
      {
        id: 15,
        customer: 'Emily Stew',
        service: 'Sewer Line Cleaning',
        date: '2025-03-05',
        amount: 175,
        status: 'completed'
      },
  ]);

  // Sample monthly earnings data for chart
  const [monthlyEarnings, setMonthlyEarnings] = useState([
    { month: 'Jan', earnings: 1980 },
    { month: 'Feb', earnings: 2150 },
    { month: 'Mar', earnings: 2450 },
    { month: 'Apr', earnings: 0 },
    { month: 'May', earnings: 0 },
    { month: 'Jun', earnings: 0 },
    { month: 'Jul', earnings: 0 },
    { month: 'Aug', earnings: 0 },
    { month: 'Sep', earnings: 0 },
    { month: 'Oct', earnings: 0 },
    { month: 'Nov', earnings: 0 },
    { month: 'Dec', earnings: 0 }
  ]);

  // Get current period's data
  const currentPeriodData = earningsSummary[timeFilter];

  // Handle filter change
  const handleTimeFilterChange = (period) => {
    setTimeFilter(period);
    setShowTimeFilter(false);
  };

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setShowStatusFilter(false);
  };

  // Filter transactions based on current filters
  const filteredTransactions = transactions.filter(transaction => {
    // Filter by status
    if (statusFilter !== 'all' && transaction.status !== statusFilter) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm && !transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !transaction.service.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Get current transactions for pagination
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  
  // Change page
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  
  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Export transactions as CSV
  const exportTransactions = () => {
    // Create CSV header
    let csvContent = "Customer,Service,Date,Amount,Status\n";
    
    // Add data rows
    filteredTransactions.forEach(transaction => {
      const formattedDate = new Date(transaction.date).toLocaleDateString();
      const row = `${transaction.customer},${transaction.service},${formattedDate},${transaction.amount},${transaction.status}`;
      csvContent += row + "\n";
    });
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Set file name based on current filter
    let fileName = `earnings_${timeFilter}_${new Date().toISOString().slice(0, 10)}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Open transaction details modal
  const openTransactionDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setShowTransactionModal(true);
  };
  
  // Close transaction details modal
  const closeTransactionModal = () => {
    setShowTransactionModal(false);
    setSelectedTransaction(null);
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, searchTerm]);

// Add this function to your EarningsPage component
const downloadReceipt = (transaction) => {
    // Create an iframe element (hidden)
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    
    const receiptDate = new Date().toLocaleDateString();
    const serviceDate = new Date(transaction.date).toLocaleDateString();
    
    // Format the receipt content with HTML for better styling
    const receiptContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt #INV-${2000 + transaction.id}</title>
        <style>
          @page { size: auto; margin: 10mm; }
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
          .receipt { max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; }
          .header { text-align: center; padding-bottom: 20px; border-bottom: 2px solid #eee; }
          .title { font-size: 24px; font-weight: bold; color: #2563eb; margin: 10px 0; }
          .receipt-id { font-size: 14px; color: #666; }
          .status { display: inline-block; padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; }
          .status.completed { background-color: #d1fae5; color: #065f46; }
          .status.pending { background-color: #fef3c7; color: #92400e; }
          .status.failed { background-color: #fee2e2; color: #b91c1c; }
          .section { margin-top: 20px; }
          .section-title { font-size: 14px; text-transform: uppercase; color: #666; margin-bottom: 10px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .detail-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
          .label { color: #666; }
          .value { font-weight: 500; }
          .total-row { border-top: 1px solid #eee; padding-top: 10px; margin-top: 10px; }
          .total-amount { font-size: 18px; font-weight: bold; color: #2563eb; }
          .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
          
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="title">Service Receipt</div>
            <div class="receipt-id">Invoice #: INV-${2000 + transaction.id}</div>
            <div class="receipt-id">Receipt Date: ${receiptDate}</div>
            <div style="margin-top: 10px;">
              <span class="status ${transaction.status}">
                ${transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
              </span>
            </div>
          </div>
          
          <div class="grid">
            <div class="section">
              <div class="section-title">Customer Information</div>
              <div>${transaction.customer}</div>
              <div>customer@example.com</div>
              <div>(555) 123-4567</div>
              
              <div class="section">
                <div class="section-title">Service Details</div>
                <div>${transaction.service}</div>
                <div>Service ID: SRV-${1000 + transaction.id}</div>
                <div>Duration: 2 hours</div>
              </div>
            
              <div class="section">
                <div class="section-title">Service Location</div>
                <div>123 Main Street</div>
                <div>San Francisco, CA 94105</div>
              </div>
            </div>
            
            <div class="section">
              <div class="section-title">Payment Information</div>
              <div class="detail-row">
                <span class="label">Base Rate:</span>
                <span class="value">$${transaction.amount - 20}</span>
              </div>
              <div class="detail-row">
                <span class="label">Service Fee:</span>
                <span class="value">$20.00</span>
              </div>
              <div class="detail-row total-row">
                <span class="label">Total Amount:</span>
                <span class="total-amount">$${transaction.amount}</span>
              </div>
              
              <div class="section">
                <div class="section-title">Date & Time</div>
                <div>Service Date: ${serviceDate}</div>
                <div>Time: 10:00 AM - 12:00 PM</div>
                <div>Payment Date: ${serviceDate}</div>
              </div>
              
              <div class="section">
                <div class="section-title">Payment Method</div>
                <div>Credit Card</div>
              </div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Notes</div>
            <div>${
              transaction.status === 'completed' 
                ? 'Service was completed successfully. Customer provided positive feedback.' 
                : transaction.status === 'pending'
                ? 'Payment is currently pending. It will be processed once the service is marked as completed.'
                : 'Transaction failed due to payment processing issue. Customer has been notified to provide alternative payment method.'
            }</div>
          </div>
          
          <div class="footer">
            <p>Thank you for your business!</p>
            <p>Questions? Contact support@plumberservice.com</p>
          </div>
        </div>
        <script>
          document.title = "Receipt_INV-${2000 + transaction.id}";
          setTimeout(function() {
            window.print();
            window.focus();
          }, 1000);
        </script>
      </body>
      </html>
    `;
  
    // Write to the iframe
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(receiptContent);
    iframe.contentWindow.document.close();
  
    // Use a loading message/spinner while PDF is being prepared
    const loadingEl = document.createElement('div');
    loadingEl.style.position = 'fixed';
    loadingEl.style.top = '0';
    loadingEl.style.left = '0';
    loadingEl.style.width = '100%';
    loadingEl.style.height = '100%';
    loadingEl.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    loadingEl.style.display = 'flex';
    loadingEl.style.justifyContent = 'center';
    loadingEl.style.alignItems = 'center';
    loadingEl.style.zIndex = '9999';
    loadingEl.innerHTML = '<div style="background: white; padding: 20px; border-radius: 5px; text-align: center;"><div style="margin-bottom: 10px; font-weight: bold;">Preparing PDF Receipt...</div><div>Please select "Save as PDF" in the print dialog</div></div>';
    document.body.appendChild(loadingEl);
  
    // Set up event listener for when printing is done or canceled
    iframe.contentWindow.onafterprint = function() {
      // Clean up
      document.body.removeChild(iframe);
      document.body.removeChild(loadingEl);
    };
  
    // Fallback cleanup in case onafterprint doesn't fire
    setTimeout(function() {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
      if (document.body.contains(loadingEl)) {
        document.body.removeChild(loadingEl);
      }
    }, 60000); // 1 minute timeout
  
    // Trigger print after a short delay to ensure content is loaded
    setTimeout(function() {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    }, 1000);
  };
  
  return (
    <div className="bg-greyIsh-50 min-h-screen pb-8">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Link to="/provider/dashboard" className="text-gray-600 hover:text-blueColor mr-4">
            <FaArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-blueColor">Earnings</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 pt-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between mb-4">
            <div className="flex items-center mb-2 md:mb-0">
              <h2 className="text-xl font-semibold text-gray-700 flex items-center">
                <FaMoneyBillWave className="mr-2 text-blueColor" />
                Earnings Summary
              </h2>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <button 
                  onClick={() => setShowTimeFilter(!showTimeFilter)}
                  className="flex items-center px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <FaCalendarAlt className="mr-2 text-gray-500" />
                  {timeFilter === 'thisMonth' && 'This Month'}
                  {timeFilter === 'lastMonth' && 'Last Month'}
                  {timeFilter === 'lastThreeMonths' && 'Last 3 Months'}
                  {timeFilter === 'thisYear' && 'This Year'}
                  {showTimeFilter ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
                </button>
                
                {showTimeFilter && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <div className="py-1">
                      <button 
                        onClick={() => handleTimeFilterChange('thisMonth')}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        This Month
                      </button>
                      <button 
                        onClick={() => handleTimeFilterChange('lastMonth')}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Last Month
                      </button>
                      <button 
                        onClick={() => handleTimeFilterChange('lastThreeMonths')}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Last 3 Months
                      </button>
                      <button 
                        onClick={() => handleTimeFilterChange('thisYear')}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        This Year
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                onClick={exportTransactions}
                className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <FaFileDownload className="mr-2 text-gray-500" />
                Export
              </button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-500 text-sm">Total Earnings</p>
              <p className="text-2xl font-bold text-blueColor mt-2">${currentPeriodData.total}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-500 text-sm">Completed Payments</p>
              <p className="text-2xl font-bold text-green-600 mt-2">${currentPeriodData.completed}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-500 text-sm">Pending Payments</p>
              <p className="text-2xl font-bold text-orange-500 mt-2">${currentPeriodData.pending}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-500 text-sm">Jobs Completed</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">{currentPeriodData.jobs}</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-500 text-sm">Average per Job</p>
              <p className="text-2xl font-bold text-purple-600 mt-2">${currentPeriodData.average}</p>
            </div>
          </div>
        </div>
        
        {/* Earnings Chart */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <FaChartLine className="mr-2 text-blueColor" />
            Earnings Trends
          </h2>
          
          <div className="h-64 relative">
            <div className="absolute inset-0">
              {/* Chart Y-axis labels */}
              <div className="absolute left-0 top-0 h-full w-10 flex flex-col justify-between text-xs text-gray-500">
                <span>$3000</span>
                <span>$2250</span>
                <span>$1500</span>
                <span>$750</span>
                <span>$0</span>
              </div>
              
              {/* Chart content */}
              <div className="absolute left-10 right-0 top-0 bottom-0 border-l border-b">
                <div className="flex h-full">
                  {monthlyEarnings.map((data, index) => (
                    <div key={index} className="flex-1 flex flex-col justify-end items-center">
                      <div 
                        className="w-4/5 bg-blueColor hover:bg-blue-600 transition-all rounded-t"
                        style={{ height: `${(data.earnings / 3000) * 100}%` }}
                      ></div>
                      <span className="text-xs text-gray-500 mt-1">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Transactions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-wrap items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center mb-2 md:mb-0">
              <FaMoneyBillWave className="mr-2 text-blueColor" />
              Transaction History
            </h2>
            
            <div className="flex flex-wrap items-center space-x-2">
              <div className="relative min-w-[200px]">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-lg w-full"
                />
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowStatusFilter(!showStatusFilter)}
                  className="flex items-center px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  <FaFilter className="mr-2 text-gray-500" />
                  {statusFilter === 'all' && 'All Status'}
                  {statusFilter === 'completed' && 'Completed'}
                  {statusFilter === 'pending' && 'Pending'}
                  {statusFilter === 'failed' && 'Failed'}
                  {showStatusFilter ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
                </button>
                
                {showStatusFilter && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                    <div className="py-1">
                      <button 
                        onClick={() => handleStatusFilterChange('all')}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        All Status
                      </button>
                      <button 
                        onClick={() => handleStatusFilterChange('completed')}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Completed
                      </button>
                      <button 
                        onClick={() => handleStatusFilterChange('pending')}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Pending
                      </button>
                      <button 
                        onClick={() => handleStatusFilterChange('failed')}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Failed
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
          {filteredTransactions.length > 0 ? (
  <table className="w-full">
    <thead className="bg-gray-50 border-b">
      <tr>
        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Customer</th>
        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Service</th>
        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Date</th>
        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Amount</th>
        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Status</th>
        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">Details</th>
      </tr>
    </thead>
    <tbody className="divide-y">
      {currentTransactions.map(transaction => (
        <tr key={transaction.id} className="hover:bg-gray-50">
          <td className="py-4 px-4">{transaction.customer}</td>
          <td className="py-4 px-4">{transaction.service}</td>
          <td className="py-4 px-4">{new Date(transaction.date).toLocaleDateString()}</td>
          <td className="py-4 px-4 font-medium">${transaction.amount}</td>
          <td className="py-4 px-4">
            <span className={`px-2 py-1 rounded-full text-xs ${
              transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 
              transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </span>
          </td>
          <td className="py-4 px-4">
            <button 
              onClick={() => openTransactionDetails(transaction)} 
              className="text-blueColor hover:underline"
            >
              View
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
) : (
  <div className="text-center py-12 text-gray-500">
    <FaExclamationCircle className="mx-auto mb-4 text-gray-300" size={40} />
    <p>No transactions found matching your filters</p>
  </div>
)}
          </div>
          
          
{/* Pagination */}
<div className="flex justify-between items-center mt-6">
  <div className="text-sm text-gray-500">
    Showing {currentTransactions.length > 0 ? 
      `${indexOfFirstTransaction + 1}-${Math.min(indexOfLastTransaction, filteredTransactions.length)}` : '0'} of {filteredTransactions.length} transactions
  </div>
  
  <div className="flex space-x-1">
    <button 
      onClick={() => paginate(currentPage - 1)}
      disabled={currentPage === 1}
      className={`px-3 py-1 border rounded ${currentPage === 1 ? 'text-gray-400' : 'hover:bg-gray-50 text-gray-600'}`}
    >
      Previous
    </button>
    
    {pageNumbers.map(number => (
      <button
        key={number}
        onClick={() => paginate(number)}
        className={`px-3 py-1 ${currentPage === number ? 'bg-blueColor text-white' : 'border hover:bg-gray-50 text-gray-600'} rounded`}
      >
        {number}
      </button>
    ))}
    
    <button 
      onClick={() => paginate(currentPage + 1)}
      disabled={currentPage === totalPages || totalPages === 0}
      className={`px-3 py-1 border rounded ${currentPage === totalPages || totalPages === 0 ? 'text-gray-400' : 'hover:bg-gray-50 text-gray-600'}`}
    >
      Next
    </button>
  </div>
</div>
        </div>
      </div>
      
      {/* Transaction Details Modal */}
      {showTransactionModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-gray-800">Transaction Details</h3>
              <button 
                onClick={closeTransactionModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {/* Status Badge */}
              <div className="mb-6 flex justify-between items-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedTransaction.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : selectedTransaction.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedTransaction.status === 'completed' 
                    ? <FaCheckCircle className="inline-block mr-2" /> 
                    : selectedTransaction.status === 'pending'
                    ? <FaClock className="inline-block mr-2" />
                    : <FaExclamationCircle className="inline-block mr-2" />
                  }
                  {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                </span>
                <span className="text-gray-500 text-sm">Transaction #{selectedTransaction.id}</span>
              </div>
              
              {/* Transaction Details */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  {/* Customer Info */}
                  <div className="mb-4">
                    <h4 className="text-sm uppercase text-gray-500 mb-2 flex items-center">
                      <FaUser className="mr-2" />
                      Customer Information
                    </h4>
                    <p className="text-lg font-medium">{selectedTransaction.customer}</p>
                    <p className="text-gray-600">customer@example.com</p>
                    <p className="text-gray-600">(555) 123-4567</p>
                  </div>
                  
                  {/* Service Details */}
                  <div className="mb-4">
                    <h4 className="text-sm uppercase text-gray-500 mb-2 flex items-center">
                      <FaTools className="mr-2" />
                      Service Details
                    </h4>
                    <p className="text-lg font-medium">{selectedTransaction.service}</p>
                    <p className="text-gray-600">Service ID: SRV-{1000 + selectedTransaction.id}</p>
                    <p className="text-gray-600">Duration: 2 hours</p>
                  </div>
                  
                  {/* Location */}
                  <div className="mb-4">
                    <h4 className="text-sm uppercase text-gray-500 mb-2 flex items-center">
                      <FaMapMarkerAlt className="mr-2" />
                      Service Location
                    </h4>
                    <p className="text-gray-600">123 Main Street</p>
                    <p className="text-gray-600">San Francisco, CA 94105</p>
                  </div>
                </div>
                
                <div>
                  {/* Payment Details */}
                  <div className="mb-4">
                    <h4 className="text-sm uppercase text-gray-500 mb-2 flex items-center">
                      <FaDollarSign className="mr-2" />
                      Payment Information
                    </h4>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Base Rate:</span>
                      <span className="font-medium">${selectedTransaction.amount - 20}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Service Fee:</span>
                      <span className="font-medium">$20.00</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t mt-2">
                      <span className="text-gray-800 font-medium">Total Amount:</span>
                      <span className="text-xl font-bold text-blueColor">${selectedTransaction.amount}</span>
                    </div>
                  </div>
                  
                  {/* Date & Time */}
                  <div className="mb-4">
                    <h4 className="text-sm uppercase text-gray-500 mb-2 flex items-center">
                      <FaCalendarDay className="mr-2" />
                      Date & Time
                    </h4>
                    <p className="text-gray-600">Service Date: {new Date(selectedTransaction.date).toLocaleDateString()}</p>
                    <p className="text-gray-600">Time: 10:00 AM - 12:00 PM</p>
                    <p className="text-gray-600">Payment Date: {new Date(selectedTransaction.date).toLocaleDateString()}</p>
                  </div>
                  
                  {/* Invoice Info */}
                  <div className="mb-4">
                    <h4 className="text-sm uppercase text-gray-500 mb-2 flex items-center">
                      <FaReceipt className="mr-2" />
                      Invoice Details
                    </h4>
                    <p className="text-gray-600">Invoice #: INV-{2000 + selectedTransaction.id}</p>
                    <p className="text-gray-600">Payment Method: Credit Card</p>
                  </div>
                </div>
              </div>
              
              {/* Notes */}
              <div className="mt-6 pt-4 border-t">
                <h4 className="text-sm uppercase text-gray-500 mb-2">Notes</h4>
                <p className="text-gray-600">
                  {selectedTransaction.status === 'completed' 
                    ? 'Service was completed successfully. Customer provided positive feedback.' 
                    : selectedTransaction.status === 'pending'
                    ? 'Payment is currently pending. It will be processed once the service is marked as completed.'
                    : 'Transaction failed due to payment processing issue. Customer has been notified to provide alternative payment method.'}
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t flex justify-end space-x-4">
  <button 
    onClick={closeTransactionModal}
    className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
  >
    Close
  </button>
  
  <button 
    onClick={() => downloadReceipt(selectedTransaction)}
    className="px-4 py-2 bg-blueColor text-white rounded hover:bg-blue-600"
  >
    <FaFileDownload className="inline-block mr-2" />
    Download Receipt
  </button>
</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarningsPage;