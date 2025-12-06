const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { validate } = require('../middleware/validator');
const { protect, authorize } = require('../middleware/auth');

const {
  getItems,
  getItem,
  getItemByLegacyId,
  createItem,
  updateItem,
  deleteItem,
  updateStock
} = require('../controllers/itemController');

router.get('/', protect, getItems);
router.get('/:id', protect, getItem);
router.get('/legacy/:legacyId', protect, getItemByLegacyId);

router.post(
  '/',
  protect,
  authorize('Admin'),
  [
    body('legacyId').isInt().withMessage('Legacy ID must be a number'),
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('quantityToCheckOut').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
    body('type').isIn(['Sale', 'Rental']).withMessage('Type must be Sale or Rental')
  ],
  validate,
  createItem
);

router.put('/:id', protect, authorize('Admin'), updateItem);
router.delete('/:id', protect, authorize('Admin'), deleteItem);
router.put('/:id/stock', protect, authorize('Admin'), updateStock);

module.exports = router;