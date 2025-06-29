const express = require('express');
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  hardDeleteCategory,
  bulkCreateCategories
} = require('../controllers/categoryController'); // Adjust path as needed

const { authenticate, requireAdmin, optionalAuth } = require('../middleware/authmiddleware'); // Adjust path as needed

// Public READ routes (no authentication needed)
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Protected CREATE routes (authentication + admin required)
router.post('/', authenticate, requireAdmin, createCategory);
router.post('/bulk', authenticate, requireAdmin, bulkCreateCategories);

// Protected UPDATE routes (authentication + admin required)
router.put('/:id', authenticate, requireAdmin, updateCategory);

// Protected DELETE routes (authentication + admin required)
router.delete('/:id', authenticate, requireAdmin, deleteCategory); // Soft delete
router.delete('/:id/hard', authenticate, requireAdmin, hardDeleteCategory); // Hard delete

module.exports = router;