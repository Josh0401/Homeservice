const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth'); // Adjust path as needed
const categoryRoutes = require('./category'); // Adjust path as needed
const serviceRoutes = require('./service'); // Adjust path as needed

// Use routes
router.use('/api/auth', authRoutes);
router.use('/api/categories', categoryRoutes);
router.use('/api/services', serviceRoutes);

// Health check route
router.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler for API routes
router.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

module.exports = router;