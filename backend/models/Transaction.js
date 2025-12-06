const mongoose = require('mongoose');

const lineItemSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: true
  },
  itemName: String, // Snapshot name in case it changes
  priceAtTransaction: Number, // Snapshot price
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  // Rental specific fields
  dueDate: Date,
  returned: {
    type: Boolean,
    default: false
  },
  returnDate: Date,
  lateFee: {
    type: Number,
    default: 0
  }
});

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['SALE', 'RENTAL', 'RETURN'],
    required: true
  },
  cashier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  items: [lineItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  discountApplied: {
    couponCode: String,
    amount: Number
  },
  paymentMethod: {
    type: String,
    enum: ['CASH', 'CREDIT'],
    default: 'CASH'
  },
  status: {
    type: String,
    enum: ['COMPLETED', 'PENDING_RETURN', 'REFUNDED'],
    default: 'COMPLETED'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);