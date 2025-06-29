const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  // Basic Booking Info
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Service is required']
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer is required']
  },
  professional: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Professional is required']
  },
  
  // Booking Details
  title: {
    type: String,
    required: [true, 'Booking title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Problem description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  
  // Scheduling
  preferredDate: {
    type: Date,
    required: [true, 'Preferred date is required']
  },
  preferredTime: {
    type: String,
    required: [true, 'Preferred time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:MM format']
  },
  alternativeDate: {
    type: Date
  },
  alternativeTime: {
    type: String,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:MM format']
  },
  
  // Confirmed Schedule (set by professional)
  scheduledDate: {
    type: Date
  },
  scheduledTime: {
    type: String
  },
  estimatedDuration: {
    type: Number, // in minutes
    default: 60
  },
  
  // Location
  location: {
    address: {
      street: {
        type: String,
        required: [true, 'Street address is required'],
        trim: true
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true
      },
      state: {
        type: String,
        required: [true, 'State is required'],
        trim: true
      },
      zipCode: {
        type: String,
        required: [true, 'Zip code is required'],
        trim: true
      }
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    instructions: {
      type: String,
      trim: true,
      maxlength: [300, 'Instructions cannot exceed 300 characters']
    }
  },
  
  // Pricing
  pricing: {
    type: {
      type: String,
      enum: ['hourly', 'fixed', 'quote'],
      required: true
    },
    estimatedCost: {
      type: Number,
      min: 0
    },
    finalCost: {
      type: Number,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  
  // Status Management
  status: {
    type: String,
    enum: [
      'pending',      // Customer applied, waiting for professional response
      'accepted',     // Professional accepted the booking
      'rejected',     // Professional rejected the booking
      'confirmed',    // Both parties confirmed details
      'in-progress',  // Work is being done
      'completed',    // Work is finished
      'cancelled',    // Booking was cancelled
      'disputed'      // There's a dispute
    ],
    default: 'pending'
  },
  
  // Status History
  statusHistory: [{
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'confirmed', 'in-progress', 'completed', 'cancelled', 'disputed']
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    note: String
  }],
  
  // Communication
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    isRead: {
      type: Boolean,
      default: false
    }
  }],
  
  // Additional Info
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'emergency'],
    default: 'medium'
  },
  images: [{
    type: String, // URLs to problem images uploaded by customer
    description: String
  }],
  requirements: [{
    type: String,
    trim: true
  }],
  
  // Completion Details
  workCompletedAt: Date,
  customerNotes: String,
  professionalNotes: String,
  
  // Payment
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'disputed'],
    default: 'pending'
  },
  paymentMethod: String,
  paymentId: String, // External payment system ID
  
  // Rating & Review (after completion)
  customerRating: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    ratedAt: Date
  },
  professionalRating: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    ratedAt: Date
  }
}, {
  timestamps: true
});

// Indexes for better query performance
bookingSchema.index({ customer: 1, status: 1 });
bookingSchema.index({ professional: 1, status: 1 });
bookingSchema.index({ service: 1 });
bookingSchema.index({ preferredDate: 1 });
bookingSchema.index({ scheduledDate: 1 });
bookingSchema.index({ status: 1, createdAt: -1 });

// Virtual for booking reference number
bookingSchema.virtual('referenceNumber').get(function() {
  return `BK${this._id.toString().slice(-8).toUpperCase()}`;
});

// Virtual for total messages count
bookingSchema.virtual('messageCount').get(function() {
  return this.messages.length;
});

// Virtual for unread messages count
bookingSchema.virtual('unreadCount').get(function() {
  return this.messages.filter(msg => !msg.isRead).length;
});

// Ensure virtual fields are included in JSON
bookingSchema.set('toJSON', { virtuals: true });
bookingSchema.set('toObject', { virtuals: true });

// Pre-save middleware to add status history
bookingSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date()
    });
  }
  next();
});

// Static method to get bookings by status for a user
bookingSchema.statics.getByStatusForUser = function(userId, userType, status) {
  const field = userType === 'professional' ? 'professional' : 'customer';
  const query = { [field]: userId };
  
  if (status && status !== 'all') {
    query.status = status;
  }
  
  return this.find(query)
    .populate('service', 'title pricing')
    .populate('customer', 'fullName phone email')
    .populate('professional', 'fullName businessName phone email')
    .sort({ createdAt: -1 });
};

// Instance method to add message
bookingSchema.methods.addMessage = function(senderId, message) {
  this.messages.push({
    sender: senderId,
    message: message,
    timestamp: new Date()
  });
  return this.save();
};

// Instance method to update status
bookingSchema.methods.updateStatus = function(newStatus, changedBy, note) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    changedBy: changedBy,
    changedAt: new Date(),
    note: note
  });
  return this.save();
};

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;