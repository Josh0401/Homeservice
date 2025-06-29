const Category = require('../models/Category'); // Adjust path as needed

// CREATE - Add new category
const createCategory = async (req, res) => {
  try {
    const { name, description, icon, sortOrder } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } // Case-insensitive check
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    // Create new category
    const categoryData = {
      name: name.toLowerCase(), // Store in lowercase for consistency
      description,
      icon,
      sortOrder: sortOrder || 0
    };

    const newCategory = new Category(categoryData);
    await newCategory.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category: newCategory
    });

  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during category creation',
      error: error.message
    });
  }
};

// READ - Get all categories
const getAllCategories = async (req, res) => {
  try {
    const { isActive, sortBy = 'sortOrder' } = req.query;

    // Build query
    let query = {};
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Sorting options
    let sortOption = {};
    switch (sortBy) {
      case 'name':
        sortOption = { name: 1 };
        break;
      case 'created':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { sortOrder: 1, name: 1 };
    }

    const categories = await Category.find(query)
      .sort(sortOption)
      .populate('professionalCount');

    res.status(200).json({
      success: true,
      count: categories.length,
      categories: categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories',
      error: error.message
    });
  }
};

// READ - Get single category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findById(id).populate('professionalCount');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      category: category
    });

  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching category',
      error: error.message
    });
  }
};

// UPDATE - Update category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon, isActive, sortOrder } = req.body;

    // Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // If name is being updated, check for duplicates
    if (name && name.toLowerCase() !== category.name) {
      const existingCategory = await Category.findOne({
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: id }
      });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists'
        });
      }
    }

    // Update fields
    const updateData = {};
    if (name) updateData.name = name.toLowerCase();
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      category: updatedCategory
    });

  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during category update',
      error: error.message
    });
  }
};

// DELETE - Delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Soft delete - just mark as inactive
    const deletedCategory = await Category.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      category: deletedCategory
    });

  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during category deletion',
      error: error.message
    });
  }
};

// HARD DELETE - Permanently delete category (use with caution)
const hardDeleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category permanently deleted',
      category: category
    });

  } catch (error) {
    console.error('Hard delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during category deletion',
      error: error.message
    });
  }
};

// BULK CREATE - Create multiple categories at once
const bulkCreateCategories = async (req, res) => {
  try {
    const { categories } = req.body;

    if (!categories || !Array.isArray(categories)) {
      return res.status(400).json({
        success: false,
        message: 'Categories array is required'
      });
    }

    // Process categories to ensure lowercase names
    const processedCategories = categories.map(cat => ({
      ...cat,
      name: cat.name.toLowerCase()
    }));

    const createdCategories = await Category.insertMany(processedCategories, {
      ordered: false // Continue even if some fail
    });

    res.status(201).json({
      success: true,
      message: `${createdCategories.length} categories created successfully`,
      categories: createdCategories
    });

  } catch (error) {
    console.error('Bulk create error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during bulk category creation',
      error: error.message
    });
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  hardDeleteCategory,
  bulkCreateCategories
};