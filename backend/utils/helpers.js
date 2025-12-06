// Generate JWT Token
const generateToken = (id) => {
  const jwt = require('jsonwebtoken');
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Calculate tax based on subtotal
const calculateTax = (subtotal, taxRate = 0.06) => {
  return subtotal * taxRate;
};

// Calculate total with tax
const calculateTotal = (subtotal, tax) => {
  return subtotal + tax;
};

// Apply discount to subtotal
const applyDiscount = (subtotal, discountType, discountValue) => {
  if (discountType === 'PERCENTAGE') {
    return subtotal * discountValue;
  } else if (discountType === 'FIXED') {
    return Math.min(discountValue, subtotal);
  }
  return 0;
};

// Calculate days between dates
const daysBetween = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date1 - date2) / oneDay));
};

// Calculate late fee
const calculateLateFee = (daysLate, dailyRate = 0.10) => {
  return daysLate > 0 ? daysLate * dailyRate : 0;
};

module.exports = {
  generateToken,
  calculateTax,
  calculateTotal,
  applyDiscount,
  daysBetween,
  calculateLateFee
};