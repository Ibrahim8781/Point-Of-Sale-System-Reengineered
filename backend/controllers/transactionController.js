const transactionService = require('../services/transactionService');

// @desc    Process sale transaction
// @route   POST /api/transactions/sale
// @access  Private
exports.processSale = async (req, res, next) => {
  try {
    const transaction = await transactionService.processSale(
      req.body,
      req.user.id
    );

    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Process rental transaction
// @route   POST /api/transactions/rental
// @access  Private
exports.processRental = async (req, res, next) => {
  try {
    const transaction = await transactionService.processRental(
      req.body,
      req.user.id
    );

    res.status(201).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Process return transaction
// @route   POST /api/transactions/return
//@access  Private
exports.processReturn = async (req, res, next) => {
try {
const transaction = await transactionService.processReturn(
req.body,
req.user.id
);
res.status(201).json({
  success: true,
  data: transaction
});
} catch (error) {
res.status(400).json({
success: false,
message: error.message
});
}
};
// @desc    Get transaction history
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res, next) => {
try {
const transactions = await transactionService.getTransactionHistory(req.query);
res.json({
  success: true,
  count: transactions.length,
  data: transactions
});
} catch (error) {
next(error);
}
};
// @desc    Get single transaction
// @route   GET /api/transactions/:id
// @access  Private
exports.getTransaction = async (req, res, next) => {
try {
const transaction = await Transaction.findById(req.params.id)
.populate('cashier', 'firstName lastName username')
.populate('customer', 'phoneNumber name')
.populate('items.item', 'name legacyId');
if (!transaction) {
  return res.status(404).json({
    success: false,
    message: 'Transaction not found'
  });
}

res.json({
  success: true,
  data: transaction
});
} catch (error) {
next(error);
}
};
// @desc    Get customer rental history
// @route   GET /api/transactions/customer/:customerId/rentals
// @access  Private
exports.getCustomerRentals = async (req, res, next) => {
try {
const rentals = await Transaction.find({
customer: req.params.customerId,
type: 'RENTAL'
})
.populate('items.item', 'name legacyId')
.sort('-createdAt');
res.json({
  success: true,
  count: rentals.length,
  data: rentals
});
} catch (error) {
next(error);
}
};