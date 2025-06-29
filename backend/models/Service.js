const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Service title is required'],
    trim: true,
    maxlength: [100, 'Service title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Service category is required']
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Service provider is required']
  },
  pricing: {
    type: {
      type: String,
      enum: ['hourly', 'fixed', 'quote'],
      required: true,
      default: 'hourly'
    },
    amount: {
      type: Number,
      required: function() {
        return this.pricing.type !== 'quote';
      },
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  duration: {
    estimated: {
      type: Number, // in minutes
      required: true,
      min: [15, 'Service duration must be at least 15 minutes']
    },
    unit: {
      type: String,
      enum: ['minutes', 'hours', 'days'],
      default: 'minutes'
    }
  },
  availability: {
    days: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    timeSlots: [{
      start: String, // e.g., "09:00"
      end: String    // e.g., "17:00"
    }]
  },
  serviceArea: {
    radius: {
      type: Number, // in miles
      default: 25,
      min: [1, 'Service area must be at least 1 mile']
    },
    locations: [{
      city: String,
      state: String,
      zipCode: String
    }]
  },
  images: [{
    type: String, // URLs to service images
    trim: true
  }],
  features: [{
    type: String,
    trim: true,
    maxlength: [100, 'Feature cannot exceed 100 characters']
  }],
  requirements: [{
    type: String,
    trim: true,
    maxlength: [200, 'Requirement cannot exceed 200 characters']
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPromoted: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
serviceSchema.index({ title: 'text', description: 'text' }); // Text search
serviceSchema.index({ category: 1 });
serviceSchema.index({ provider: 1 });
serviceSchema.index({ isActive: 1 });
serviceSchema.index({ 'pricing.amount': 1 });
serviceSchema.index({ 'rating.average': -1 });
serviceSchema.index({ isPromoted: -1, createdAt: -1 });

// Virtual for formatted price
serviceSchema.virtual('formattedPrice').get(function() {
  if (this.pricing.type === 'quote') {
    return 'Contact for Quote';
  }
  return `$${this.pricing.amount}/${this.pricing.type === 'hourly' ? 'hour' : 'service'}`;
});

// Virtual for reviews count
serviceSchema.virtual('reviewCount', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'service',
  count: true
});

// Ensure virtual fields are included in JSON
serviceSchema.set('toJSON', { virtuals: true });
serviceSchema.set('toObject', { virtuals: true });

// Static method to find services by category
serviceSchema.statics.findByCategory = function(categoryId, options = {}) {
  const query = {
    category: categoryId,
    isActive: true
  };
  
  return this.find(query)
    .populate('provider', 'fullName rating businessName')
    .populate('category', 'name')
    .sort(options.sort || { isPromoted: -1, 'rating.average': -1 });
};

// Static method to search services
serviceSchema.statics.searchServices = function(searchTerm, filters = {}) {
  const query = {
    $text: { $search: searchTerm },
    isActive: true,
    ...filters
  };
  
  return this.find(query, { score: { $meta: 'textScore' } })
    .populate('provider', 'fullName rating businessName')
    .populate('category', 'name')
    .sort({ score: { $meta: 'textScore' } });
};

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;