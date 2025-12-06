const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');
const { protect, authorize } = require('../middleware/auth');

const {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword
} = require('../controllers/authController');

router.post(
  '/register',
  protect,
  authorize('Admin'),
  [
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['Admin', 'Cashier']).withMessage('Invalid role')
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  login
);

router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateDetails);
router.put('/updatepassword', protect, updatePassword);

module.exports = router;