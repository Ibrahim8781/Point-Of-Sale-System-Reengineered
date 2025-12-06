const Coupon = require('../models/Coupon');

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private (Admin only)
exports.getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find();

    res.json({
      success: true,
      count: coupons.length,
      data: coupons
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get active coupons
// @route   GET /api/coupons/active
// @access  Private
exports.getActiveCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find({ isActive: true });

    res.json({
      success: true,
      count: coupons.length,
      data: coupons
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Validate coupon code
// @route   GET /api/coupons/validate/:code
// @access  Private
exports.validateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findOne({ 
      code: req.params.code.toUpperCase(),
      isActive: true 
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or inactive coupon code'
      });
    }

    res.json({
      success: true,
      data: coupon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create coupon
// @route   POST /api/coupons
// @access  Private (Admin only)
exports.createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);

    res.status(201).json({
      success: true,
      data: coupon
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code already exists'
      });
    }
    next(error);
  }
};

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private (Admin only)
exports.updateCoupon = async (req, res, next) => {
  try {
    let coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: coupon
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private (Admin only)
exports.deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: 'Coupon not found'
      });
    }

    await coupon.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};