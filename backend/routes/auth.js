const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  updateProfile,
  getProfessionals
} = require('../controllers/authController'); // Adjust path as needed

const { authenticate, optionalAuth } = require('../middleware/authmiddleware'); // Adjust path as needed

// Public Authentication Routes
router.post('/register', register);
router.post('/login', login);

// Public Professional Routes
router.get('/professionals', getProfessionals);

// Protected User Profile Routes (authentication required)
router.get('/profile/:userId', authenticate, getProfile);
router.put('/profile/:userId', authenticate, updateProfile);

// Get current user profile (from token)
router.get('/me', authenticate, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user
  });
});

module.exports = router;