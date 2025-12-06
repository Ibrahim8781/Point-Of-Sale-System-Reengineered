const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    default: 'Unknown' // Legacy system didn't capture names, only phones
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  notes: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);