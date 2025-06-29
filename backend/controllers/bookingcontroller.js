const Booking = require('../models/Booking'); // Adjust path as needed
const Service = require('../models/Service'); // Adjust path as needed
const User = require('../models/User'); // Adjust path as needed

// CREATE - Customer applies for a service
const createBooking = async (req, res) => {
  try {
    const {
      serviceId,
      title,
      description,
      preferredDate,
      preferredTime,
      alternativeDate,
      alternativeTime,
      location,
      urgency,
      images,
      requirements
    } = req.body;

    // Validate required fields
    if (!serviceId || !title || !description || !preferredDate || !preferredTime || !location) {
      return res.status(400).json({
        success: false,
        message: 'Service ID, title, description, preferred date, time, and location are required'
      });
    }

    // Check if user is a homeowner
    if (req.user.userType !== 'homeowner') {
      return res.status(403).json({
        success: false,
        message: 'Only homeowners can book services'
      });
    }

    // Verify service exists and is active
    const service = await Service.findById(serviceId).populate('provider');
    if (!service || !service.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Service not found or not available'
      });
    }

    // Validate preferred date is not in the past
    const preferredDateTime = new Date(`${preferredDate}T${preferredTime}`);
    if (preferredDateTime < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Preferred date and time cannot be in the past'
      });
    }

    // Create booking data
    const bookingData = {
      service: serviceId,
      customer: req.user._id,
      professional: service.provider._id,
      title,
      description,
      preferredDate: new Date(preferredDate),
      preferredTime,
      alternativeDate: alternativeDate ? new Date(alternativeDate) : undefined,
      alternativeTime,
      location: {
        address: location.address,
        coordinates: location.coordinates,
        instructions: location.instructions
      },
      pricing: {
        type: service.pricing.type,
        estimatedCost: service.pricing.amount
      },
      urgency: urgency || 'medium',
      images: images || [],
      requirements: requirements || [],
      estimatedDuration: service.duration.estimated
    };

    const newBooking = new Booking(bookingData);
    await newBooking.save();

    // Populate the response
    await newBooking.populate([
      { path: 'service', select: 'title pricing' },
      { path: 'customer', select: 'fullName phone email' },
      { path: 'professional', select: 'fullName businessName phone email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Booking request submitted successfully',
      booking: newBooking
    });

  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during booking creation',
      error: error.message
    });
  }
};

// READ - Get all my applications (for homeowners)
const getMyApplications = async (req, res) => {
  try {
    const { status = 'all', page = 1, limit = 10 } = req.query;

    // Only homeowners can view their applications
    if (req.user.userType !== 'homeowner') {
      return res.status(403).json({
        success: false,
        message: 'Only homeowners can view applications'
      });
    }

    // Build query
    let query = { customer: req.user._id };
    
    if (status && status !== 'all') {
      query.status = status;
    }

    // Pagination
    const skip = (page - 1) * limit;

    const applications = await Booking.find(query)
      .populate('service', 'title pricing category')
      .populate('professional', 'fullName businessName phone email rating')
      .populate('service.category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Booking.countDocuments(query);

    // Group by status for summary
    const statusSummary = await Booking.aggregate([
      { $match: { customer: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      count: applications.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      statusSummary: statusSummary.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      applications: applications
    });

  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching applications',
      error: error.message
    });
  }
};

// READ - Get all incoming requests (for professionals)
const getIncomingRequests = async (req, res) => {
  try {
    const { status = 'all', page = 1, limit = 10, sortBy = 'newest' } = req.query;

    // Only professionals can view incoming requests
    if (req.user.userType !== 'professional') {
      return res.status(403).json({
        success: false,
        message: 'Only professionals can view incoming requests'
      });
    }

    // Build query
    let query = { professional: req.user._id };
    
    if (status && status !== 'all') {
      query.status = status;
    }

    // Sorting options
    let sortOption = {};
    switch (sortBy) {
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'urgent':
        sortOption = { urgency: -1, createdAt: -1 };
        break;
      case 'date':
        sortOption = { preferredDate: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    // Pagination
    const skip = (page - 1) * limit;

    const requests = await Booking.find(query)
      .populate('service', 'title pricing')
      .populate('customer', 'fullName phone email address')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Booking.countDocuments(query);

    // Group by status for summary
    const statusSummary = await Booking.aggregate([
      { $match: { professional: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Group by urgency for pending requests
    const urgencySummary = await Booking.aggregate([
      { $match: { professional: req.user._id, status: 'pending' } },
      { $group: { _id: '$urgency', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      count: requests.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      statusSummary: statusSummary.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      urgencySummary: urgencySummary.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      requests: requests
    });

  } catch (error) {
    console.error('Get incoming requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching incoming requests',
      error: error.message
    });
  }
};

// READ - Get pending requests count (for professionals - notifications)
const getPendingRequestsCount = async (req, res) => {
  try {
    if (req.user.userType !== 'professional') {
      return res.status(403).json({
        success: false,
        message: 'Only professionals can view pending requests count'
      });
    }

    const pendingCount = await Booking.countDocuments({
      professional: req.user._id,
      status: 'pending'
    });

    const urgentCount = await Booking.countDocuments({
      professional: req.user._id,
      status: 'pending',
      urgency: { $in: ['high', 'emergency'] }
    });

    res.status(200).json({
      success: true,
      pendingCount,
      urgentCount
    });

  } catch (error) {
    console.error('Get pending requests count error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching pending count',
      error: error.message
    });
  }
};

// READ - Get application summary (for homeowners)
const getApplicationSummary = async (req, res) => {
  try {
    if (req.user.userType !== 'homeowner') {
      return res.status(403).json({
        success: false,
        message: 'Only homeowners can view application summary'
      });
    }

    // Total applications
    const totalApplications = await Booking.countDocuments({ customer: req.user._id });

    // Status breakdown
    const statusBreakdown = await Booking.aggregate([
      { $match: { customer: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Recent applications (last 5)
    const recentApplications = await Booking.find({ customer: req.user._id })
      .populate('service', 'title')
      .populate('professional', 'fullName businessName')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status preferredDate createdAt');

    // Active bookings (accepted, confirmed, in-progress)
    const activeBookings = await Booking.countDocuments({
      customer: req.user._id,
      status: { $in: ['accepted', 'confirmed', 'in-progress'] }
    });

    // Completed bookings
    const completedBookings = await Booking.countDocuments({
      customer: req.user._id,
      status: 'completed'
    });

    res.status(200).json({
      success: true,
      summary: {
        totalApplications,
        activeBookings,
        completedBookings,
        statusBreakdown: statusBreakdown.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        recentApplications
      }
    });

  } catch (error) {
    console.error('Get application summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching application summary',
      error: error.message
    });
  }
};

// READ - Get single booking by ID
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate('service', 'title description pricing')
      .populate('customer', 'fullName phone email address')
      .populate('professional', 'fullName businessName phone email address')
      .populate('messages.sender', 'fullName userType');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is authorized to view this booking
    const isAuthorized = booking.customer._id.toString() === req.user._id.toString() ||
                        booking.professional._id.toString() === req.user._id.toString();

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      booking: booking
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching booking',
      error: error.message
    });
  }
};

// UPDATE - Update booking status (Professional actions)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note, scheduledDate, scheduledTime, finalCost } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization based on status change
    const isProfessional = booking.professional.toString() === req.user._id.toString();
    const isCustomer = booking.customer.toString() === req.user._id.toString();

    // Professional can: accept, reject, confirm, mark in-progress, complete
    // Customer can: cancel, confirm
    const professionalActions = ['accepted', 'rejected', 'confirmed', 'in-progress', 'completed'];
    const customerActions = ['cancelled', 'confirmed'];

    if (professionalActions.includes(status) && !isProfessional) {
      return res.status(403).json({
        success: false,
        message: 'Only the assigned professional can perform this action'
      });
    }

    if (customerActions.includes(status) && !isCustomer && status !== 'confirmed') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to perform this action'
      });
    }

    // Validate status transitions
    const validTransitions = {
      'pending': ['accepted', 'rejected', 'cancelled'],
      'accepted': ['confirmed', 'cancelled'],
      'confirmed': ['in-progress', 'cancelled'],
      'in-progress': ['completed', 'cancelled'],
      'completed': [],
      'cancelled': [],
      'rejected': []
    };

    if (!validTransitions[booking.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${booking.status} to ${status}`
      });
    }

    // Update booking
    const updateData = { status };
    
    // Add scheduled details if accepting
    if (status === 'accepted' && scheduledDate && scheduledTime) {
      updateData.scheduledDate = new Date(scheduledDate);
      updateData.scheduledTime = scheduledTime;
    }

    // Add final cost if completing
    if (status === 'completed' && finalCost) {
      updateData['pricing.finalCost'] = finalCost;
      updateData.workCompletedAt = new Date();
    }

    await booking.updateStatus(status, req.user._id, note);

    // Update additional fields
    if (Object.keys(updateData).length > 1) {
      await Booking.findByIdAndUpdate(id, updateData);
    }

    // Fetch updated booking
    const updatedBooking = await Booking.findById(id)
      .populate('service', 'title')
      .populate('customer', 'fullName')
      .populate('professional', 'fullName businessName');

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      booking: updatedBooking
    });

  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during status update',
      error: error.message
    });
  }
};

// UPDATE - Add message to booking
const addMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is authorized
    const isAuthorized = booking.customer.toString() === req.user._id.toString() ||
                        booking.professional.toString() === req.user._id.toString();

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to message in this booking'
      });
    }

    await booking.addMessage(req.user._id, message.trim());

    // Get updated booking with populated messages
    const updatedBooking = await Booking.findById(id)
      .populate('messages.sender', 'fullName userType');

    res.status(200).json({
      success: true,
      message: 'Message added successfully',
      messages: updatedBooking.messages
    });

  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding message',
      error: error.message
    });
  }
};

// UPDATE - Mark messages as read
const markMessagesAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check authorization
    const isAuthorized = booking.customer.toString() === req.user._id.toString() ||
                        booking.professional.toString() === req.user._id.toString();

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this booking'
      });
    }

    // Mark unread messages as read (messages not sent by current user)
    await Booking.findByIdAndUpdate(id, {
      $set: {
        'messages.$[elem].isRead': true
      }
    }, {
      arrayFilters: [{ 'elem.sender': { $ne: req.user._id }, 'elem.isRead': false }]
    });

    res.status(200).json({
      success: true,
      message: 'Messages marked as read'
    });

  } catch (error) {
    console.error('Mark messages as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while marking messages as read',
      error: error.message
    });
  }
};

// UPDATE - Rate and review after completion
const rateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only rate completed bookings'
      });
    }

    // Check authorization and determine rating type
    const isCustomer = booking.customer.toString() === req.user._id.toString();
    const isProfessional = booking.professional.toString() === req.user._id.toString();

    if (!isCustomer && !isProfessional) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to rate this booking'
      });
    }

    // Update appropriate rating
    const updateField = isCustomer ? 'customerRating' : 'professionalRating';
    const updateData = {
      [`${updateField}.rating`]: rating,
      [`${updateField}.review`]: review || '',
      [`${updateField}.ratedAt`]: new Date()
    };

    await Booking.findByIdAndUpdate(id, updateData);

    res.status(200).json({
      success: true,
      message: 'Rating submitted successfully'
    });

  } catch (error) {
    console.error('Rate booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting rating',
      error: error.message
    });
  }
};

// READ - Get booking statistics for professionals
const getBookingStats = async (req, res) => {
  try {
    if (req.user.userType !== 'professional') {
      return res.status(403).json({
        success: false,
        message: 'Only professionals can view booking statistics'
      });
    }

    const stats = await Booking.aggregate([
      { $match: { professional: req.user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalRevenue: { $sum: '$pricing.finalCost' }
        }
      }
    ]);

    const totalBookings = await Booking.countDocuments({ professional: req.user._id });
    const completedBookings = await Booking.countDocuments({ 
      professional: req.user._id, 
      status: 'completed' 
    });

    const avgRating = await Booking.aggregate([
      { $match: { professional: req.user._id, 'customerRating.rating': { $exists: true } } },
      { $group: { _id: null, avgRating: { $avg: '$customerRating.rating' } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalBookings,
        completedBookings,
        averageRating: avgRating[0]?.avgRating || 0,
        statusBreakdown: stats,
        completionRate: totalBookings > 0 ? (completedBookings / totalBookings * 100).toFixed(1) : 0
      }
    });

  } catch (error) {
    console.error('Get booking stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics',
      error: error.message
    });
  }
};

module.exports = {
  createBooking,
  getMyApplications,
  getIncomingRequests,
  getPendingRequestsCount,
  getApplicationSummary,
  getBookingById,
  updateBookingStatus,
  addMessage,
  markMessagesAsRead,
  rateBooking,
  getBookingStats
};