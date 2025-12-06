const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');
const { protect } = require('../middleware/auth');

const {
  processSale,
  processRental,
  processReturn,
  getTransactions,
  getTransaction,
  getCustomerRentals
} = require('../controllers/transactionController');

router.get('/', protect, getTransactions);
router.get('/:id', protect, getTransaction);
router.get('/customer/:customerId/rentals', protect, getCustomerRentals);

router.post(
  '/sale',
  protect,
  [
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.item').notEmpty().withMessage('Item ID is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('paymentMethod').optional().isIn(['CASH', 'CREDIT']).withMessage('Invalid payment method')
  ],
  validate,
  processSale
);

router.post(
  '/rental',
  protect,
  [
    body('customerId').notEmpty().withMessage('Customer ID is required'),
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.item').notEmpty().withMessage('Item ID is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('paymentMethod').optional().isIn(['CASH', 'CREDIT']).withMessage('Invalid payment method')
  ],
  validate,
  processRental
);

router.post(
  '/return',
  protect,
  [
    body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
    body('items.*.item').notEmpty().withMessage('Item ID is required'),
    body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
    body('returnType').isIn(['rental', 'sale']).withMessage('Return type must be rental or sale')
  ],
  validate,
  processReturn
);

module.exports = router;