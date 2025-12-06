const Customer = require('../models/Customer');

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
exports.getCustomers = async (req, res, next) => {
  try {
    const customers = await Customer.find().sort('-createdAt');

    res.json({
      success: true,
      count: customers.length,
      data: customers
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private
exports.getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get customer by phone number
// @route   GET /api/customers/phone/:phoneNumber
// @access  Private
exports.getCustomerByPhone = async (req, res, next) => {
  try {
    const customer = await Customer.findOne({ phoneNumber: req.params.phoneNumber });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new customer
// @route   POST /api/customers
// @access  Private
exports.createCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.create(req.body);

    res.status(201).json({
      success: true,
      data: customer
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Customer with this phone number already exists'
      });
    }
    next(error);
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
exports.updateCustomer = async (req, res, next) => {
  try {
    let customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      data: customer
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private (Admin only)
exports.deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    await customer.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};