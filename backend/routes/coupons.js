const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');
const { protect, authorize } = require('../middleware/auth');

const {
  getCoupons,
  getActiveCoupons,
  validateCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon
} = require('../controllers/couponController');

router.get('/', protect, authorize('Admin'), getCoupons);
router.get('/active', protect, getActiveCoupons);
router.get('/validate/:code', protect, validateCoupon);

router.post(
  '/',
  protect,
  authorize('Admin'),
  [
    body('code').trim().isLength({ min: 3 }).withMessage('Code must be at least 3 characters'),
    body('discountType').isIn(['PERCENTAGE', 'FIXED']).withMessage('Invalid discount type'),
    body('value').isFloat({ min: 0 }).withMessage('Value must be a positive number')
  ],
  validate,
  createCoupon
);

router.put('/:id', protect, authorize('Admin'), updateCoupon);
router.delete('/:id', protect, authorize('Admin'), deleteCoupon);

module.exports = router;