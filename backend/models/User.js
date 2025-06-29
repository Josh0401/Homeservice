const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Basic Info
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  
  // User Type
  userType: {
    type: String,
    enum: ['homeowner', 'professional'],
    required: true
  },
  
  // Address
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  
  // Professional Info (only for professionals)
  businessName: {
    type: String,
    trim: true
  },
  services: [{
    type: String,
    enum: ['plumbing', 'electrical', 'hvac', 'roofing', 'painting', 'carpentry', 'cleaning', 'handyman', 'other']
  }],
  hourlyRate: {
    type: Number,
    min: 0
  },
  
  // Rating
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  services: [{
    type: String,
    enum: ['plumbing', 'electrical', 'hvac', 'roofing', 'painting', 'carpentry', 'cleaning', 'handyman', 'other']
  }],
  hourlyRate: {
    type: Number,
    min: 0
  },
  
  // Rating
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for email lookup
userSchema.index({ email: 1 });
userSchema.index({ userType: 1 });

const User = mongoose.model('User', userSchema);

module.exports = User;