const express = require('express');
const router = express.Router();
const {
  createService,
  getAllServices,
  getServiceById,
  getMyServices,
  updateService,
  deleteService,
  searchServices
} = require('../controllers/servicecontroller'); // Adjust path as needed

const { authenticate, authorize } = require('../middleware/authmiddleware'); // Adjust path as needed

// Public READ routes (no authentication needed)
router.get('/', getAllServices);
router.get('/search', searchServices);
router.get('/:id', getServiceById);

// Protected routes (authentication required)
router.use(authenticate); // All routes below require authentication

// Professional-only routes (create services)
router.post('/', authorize('professional'), createService);

// User's own services
router.get('/my/services', getMyServices);

// Service owner only routes (update/delete own services)
router.put('/:id', updateService); // Authorization checked in controller
router.delete('/:id', deleteService); // Authorization checked in controller

module.exports = router;