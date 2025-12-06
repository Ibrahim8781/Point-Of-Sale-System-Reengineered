const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  discountType: {
    type: String,
    enum: ['PERCENTAGE', 'FIXED'],
    default: 'PERCENTAGE'
  },
  value: {
    type: Number,
    default: 0.10 // Default 10% from legacy
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Coupon', couponSchema);