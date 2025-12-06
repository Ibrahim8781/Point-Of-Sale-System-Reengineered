const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');
const { protect, authorize } = require('../middleware/auth');

const {
  getCustomers,
  getCustomer,
  getCustomerByPhone,
  createCustomer,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customerController');

router.get('/', protect, getCustomers);
router.get('/:id', protect, getCustomer);
router.get('/phone/:phoneNumber', protect, getCustomerByPhone);

router.post(
  '/',
  protect,
  [
    body('phoneNumber')
      .trim()
      .matches(/^\d{10}$/)
      .withMessage('Phone number must be 10 digits'),
    body('name').optional().trim(),
    body('email').optional().isEmail().withMessage('Invalid email address')
  ],
  validate,
  createCustomer
);

router.put('/:id', protect, updateCustomer);
router.delete('/:id', protect, authorize('Admin'), deleteCustomer);

module.exports = router;