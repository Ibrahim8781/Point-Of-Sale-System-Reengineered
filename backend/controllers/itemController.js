const Item = require('../models/Item');
const inventoryService = require('../services/inventoryService');

// @desc    Get all items
// @route   GET /api/items
// @access  Private
exports.getItems = async (req, res, next) => {
  try {
    const { type, available } = req.query;
    
    const query = {};
    if (type) query.type = type;
    if (available === 'true') query.isAvailable = true;

    const items = await Item.find(query).sort('name');

    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single item
// @route   GET /api/items/:id
// @access  Private
exports.getItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get item by legacy ID (barcode scan)
// @route   GET /api/items/legacy/:legacyId
// @access  Private
exports.getItemByLegacyId = async (req, res, next) => {
  try {
    const item = await Item.findOne({ legacyId: req.params.legacyId });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new item
// @route   POST /api/items
// @access  Private (Admin only)
exports.createItem = async (req, res, next) => {
  try {
    const item = await Item.create(req.body);

    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private (Admin only)
exports.updateItem = async (req, res, next) => {
  try {
    let item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    item = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private (Admin only)
exports.deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    await item.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item stock
// @route   PUT /api/items/:id/stock
// @access  Private (Admin only)
exports.updateStock = async (req, res, next) => {
  try {
    const { quantity, operation } = req.body;

    const item = await inventoryService.updateStock(
      req.params.id,
      quantity,
      operation
    );

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};