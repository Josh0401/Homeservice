const User = require('../models/User'); // Adjust path as needed
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d'
  });
};

// Register Controller
const register = async (req, res) => {
  try {
    // Debug: Log the entire request body
    console.log('Request body:', req.body);
    
    const { fullName, email, password, phone, userType, address, businessName, services, hourlyRate } = req.body;

    // Debug: Log individual fields
    console.log('Extracted fields:', { fullName, email, password, phone, userType });

    // Validate required fields
    if (!fullName || !email || !password || !phone || !userType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: fullName, email, password, phone, userType',
        received: { fullName, email, password: password ? 'provided' : 'missing', phone, userType }
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    console.log('About to hash password:', password);
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user data object
    const userData = {
      fullName,
      email,
      password: hashedPassword,
      phone,
      userType,
      address
    };

    // Add professional-specific fields if userType is professional
    if (userType === 'professional') {
      if (businessName) userData.businessName = businessName;
      if (services) userData.services = services;
      if (hourlyRate) userData.hourlyRate = hourlyRate;
    }

    // Create new user
    const newUser = new User(userData);
    await newUser.save();

    // Generate JWT token
    const token = generateToken(newUser._id);

    // Remove password from response
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message
    });
  }
};

// Login Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated'
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: userResponse
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message
    });
  }
};

// Get User Profile
const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: user
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Update User Profile
const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Don't allow password updates through this endpoint
    delete updates.password;
    delete updates.email; // Prevent email changes for security

    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: user
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during update',
      error: error.message
    });
  }
};

// Get All Professionals
const getProfessionals = async (req, res) => {
  try {
    const { service, city } = req.query;

    // Build query
    let query = { userType: 'professional', isActive: true };
    
    if (service) {
      query.services = service;
    }
    
    if (city) {
      query['address.city'] = new RegExp(city, 'i'); // Case-insensitive search
    }

    const professionals = await User.find(query).select('-password');

    res.status(200).json({
      success: true,
      count: professionals.length,
      professionals: professionals
    });

  } catch (error) {
    console.error('Get professionals error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  getProfessionals
};