const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  legacyId: {
    type: Number,
    required: true,
    unique: false,
    index: true // Key for looking up scanned barcodes
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantityToCheckOut: { // Stock on hand
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  type: {
    type: String,
    enum: ['Sale', 'Rental'],
    required: true,
    default: 'Sale'
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Item', itemSchema);