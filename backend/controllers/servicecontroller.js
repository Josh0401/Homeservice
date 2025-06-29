const Service = require('../models/Service'); // Adjust path as needed
const Category = require('../models/Category'); // Adjust path as needed

// CREATE - Add new service (Only professionals can create services)
const createService = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      pricing,
      duration,
      availability,
      serviceArea,
      images,
      features,
      requirements
    } = req.body;

    // Validate required fields
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, and category are required'
      });
    }

    // Check if user is a professional
    if (req.user.userType !== 'professional') {
      return res.status(403).json({
        success: false,
        message: 'Only professionals can create services'
      });
    }

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category selected'
      });
    }

    // Create service data
    const serviceData = {
      title,
      description,
      category,
      provider: req.user._id, // Set provider from authenticated user
      pricing: pricing || { type: 'hourly', amount: 0 },
      duration: duration || { estimated: 60, unit: 'minutes' },
      availability,
      serviceArea,
      images: images || [],
      features: features || [],
      requirements: requirements || []
    };

    const newService = new Service(serviceData);
    await newService.save();

    // Populate the response
    await newService.populate([
      { path: 'provider', select: 'fullName businessName rating' },
      { path: 'category', select: 'name description' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service: newService
    });

  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during service creation',
      error: error.message
    });
  }
};

// READ - Get all services with filters
const getAllServices = async (req, res) => {
  try {
    const {
      category,
      provider,
      priceMin,
      priceMax,
      search,
      city,
      sortBy = 'newest',
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    let query = { isActive: true };

    if (category) query.category = category;
    if (provider) query.provider = provider;
    if (city) {
      query['serviceArea.locations.city'] = new RegExp(city, 'i');
    }

    // Price range filter
    if (priceMin || priceMax) {
      query['pricing.amount'] = {};
      if (priceMin) query['pricing.amount'].$gte = Number(priceMin);
      if (priceMax) query['pricing.amount'].$lte = Number(priceMax);
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Sorting options
    let sortOption = {};
    switch (sortBy) {
      case 'price-low':
        sortOption = { 'pricing.amount': 1 };
        break;
      case 'price-high':
        sortOption = { 'pricing.amount': -1 };
        break;
      case 'rating':
        sortOption = { 'rating.average': -1 };
        break;
      case 'popular':
        sortOption = { views: -1 };
        break;
      default:
        sortOption = { isPromoted: -1, createdAt: -1 };
    }

    // Pagination
    const skip = (page - 1) * limit;

    const services = await Service.find(query)
      .populate('provider', 'fullName businessName rating')
      .populate('category', 'name description')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    const total = await Service.countDocuments(query);

    res.status(200).json({
      success: true,
      count: services.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      services: services
    });

  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching services',
      error: error.message
    });
  }
};

// READ - Get single service by ID
const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id)
      .populate('provider', 'fullName businessName rating phone email address')
      .populate('category', 'name description');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Increment view count
    await Service.findByIdAndUpdate(id, { $inc: { views: 1 } });

    res.status(200).json({
      success: true,
      service: service
    });

  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching service',
      error: error.message
    });
  }
};

// READ - Get services by current user (My Services)
const getMyServices = async (req, res) => {
  try {
    const { status = 'all' } = req.query;

    let query = { provider: req.user._id };

    if (status === 'active') query.isActive = true;
    if (status === 'inactive') query.isActive = false;

    const services = await Service.find(query)
      .populate('category', 'name description')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      services: services
    });

  } catch (error) {
    console.error('Get my services error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching your services',
      error: error.message
    });
  }
};

// UPDATE - Update service (Only service owner can update)
const updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Find service
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check if user is the service owner
    if (service.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only update your own services'
      });
    }

    // Don't allow changing provider
    delete updates.provider;

    // Verify category if being updated
    if (updates.category) {
      const categoryExists = await Category.findById(updates.category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Invalid category selected'
        });
      }
    }

    const updatedService = await Service.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate([
      { path: 'provider', select: 'fullName businessName rating' },
      { path: 'category', select: 'name description' }
    ]);

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      service: updatedService
    });

  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during service update',
      error: error.message
    });
  }
};

// DELETE - Delete service (Only service owner can delete)
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    // Find service
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Check if user is the service owner
    if (service.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own services'
      });
    }

    // Soft delete - mark as inactive
    const deletedService = await Service.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
      service: deletedService
    });

  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during service deletion',
      error: error.message
    });
  }
};

// SEARCH - Search services by text
const searchServices = async (req, res) => {
  try {
    const { q: searchTerm, category, city, page = 1, limit = 10 } = req.query;

    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: 'Search term is required'
      });
    }

    // Build filters
    let filters = {};
    if (category) filters.category = category;
    if (city) filters['serviceArea.locations.city'] = new RegExp(city, 'i');

    // Pagination
    const skip = (page - 1) * limit;

    const services = await Service.searchServices(searchTerm, filters)
      .skip(skip)
      .limit(Number(limit));

    const total = await Service.countDocuments({
      $text: { $search: searchTerm },
      isActive: true,
      ...filters
    });

    res.status(200).json({
      success: true,
      searchTerm,
      count: services.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      services: services
    });

  } catch (error) {
    console.error('Search services error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during search',
      error: error.message
    });
  }
};

module.exports = {
  createService,
  getAllServices,
  getServiceById,
  getMyServices,
  updateService,
  deleteService,
  searchServices
};