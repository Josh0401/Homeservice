const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/bookingcontroller'); // Adjust path as needed

const { authenticate, authorize } = require('../middleware/authmiddleware'); // Adjust path as needed

// All booking routes require authentication
router.use(authenticate);

// CREATE - Apply for service (homeowners only)
router.post('/', authorize('homeowner'), createBooking);

// READ - Get my applications (homeowners only)
router.get('/my-applications', authorize('homeowner'), getMyApplications);

// READ - Get application summary (homeowners only)
router.get('/my-applications/summary', authorize('homeowner'), getApplicationSummary);

// READ - Get incoming requests (professionals only)
router.get('/incoming-requests', authorize('professional'), getIncomingRequests);

// READ - Get pending requests count (professionals only)
router.get('/pending-count', authorize('professional'), getPendingRequestsCount);

// READ - Get booking statistics (professionals only)
router.get('/stats', authorize('professional'), getBookingStats);

// READ - Get single booking
router.get('/:id', getBookingById);

// UPDATE - Update booking status
router.patch('/:id/status', updateBookingStatus);

// MESSAGING - Add message to booking
router.post('/:id/messages', addMessage);

// MESSAGING - Mark messages as read
router.patch('/:id/messages/read', markMessagesAsRead);

// RATING - Rate and review booking
router.post('/:id/rate', rateBooking);

module.exports = router;