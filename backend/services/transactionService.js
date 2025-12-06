const Transaction = require('../models/Transaction');
const Item = require('../models/Item');
const Customer = require('../models/Customer');
const Coupon = require('../models/Coupon');
const inventoryService = require('./inventoryService');
const { calculateTax, calculateTotal, applyDiscount, daysBetween } = require('../utils/helpers');

class TransactionService {
  async processSale(transactionData, cashierId) {
    const { customerId, items, couponCode, paymentMethod } = transactionData;

    // Validate items and check availability
    const lineItems = [];
    let subtotal = 0;

    for (const item of items) {
      await inventoryService.checkAvailability(item.item, item.quantity);
      
      const itemDoc = await Item.findById(item.item);
      const lineItem = {
        item: item.item,
        itemName: itemDoc.name,
        priceAtTransaction: itemDoc.price,
        quantity: item.quantity
      };
      
      lineItems.push(lineItem);
      subtotal += itemDoc.price * item.quantity;
    }

    // Apply coupon if provided
    let discountApplied = null;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon) {
        const discountAmount = applyDiscount(subtotal, coupon.discountType, coupon.value);
        subtotal -= discountAmount;
        discountApplied = {
          couponCode: coupon.code,
          amount: discountAmount
        };
      }
    }

    // Calculate tax and total
    const tax = calculateTax(subtotal);
    const total = calculateTotal(subtotal, tax);

    // Create transaction
    const transaction = await Transaction.create({
      type: 'SALE',
      cashier: cashierId,
      customer: customerId || null,
      items: lineItems,
      subtotal,
      tax,
      total,
      discountApplied,
      paymentMethod: paymentMethod || 'CASH',
      status: 'COMPLETED'
    });

    // Update inventory
    await inventoryService.updateMultipleStock(
      items.map(i => ({ itemId: i.item, quantity: i.quantity })),
      'decrease'
    );

    return transaction;
  }

  async processRental(transactionData, cashierId) {
    const { customerId, items, paymentMethod } = transactionData;

    if (!customerId) {
      throw new Error('Customer ID is required for rentals');
    }

    // Validate customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new Error('Customer not found');
    }

    // Validate items and check availability
    const lineItems = [];
    let subtotal = 0;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14 days rental period

    for (const item of items) {
      await inventoryService.checkAvailability(item.item, item.quantity);
      
      const itemDoc = await Item.findById(item.item);
      if (itemDoc.type !== 'Rental') {
        throw new Error(`Item ${itemDoc.name} is not available for rental`);
      }

      const lineItem = {
        item: item.item,
        itemName: itemDoc.name,
        priceAtTransaction: itemDoc.price,
        quantity: item.quantity,
        dueDate,
        returned: false
      };
      
      lineItems.push(lineItem);
      subtotal += itemDoc.price * item.quantity;
    }

    // Calculate tax and total
    const tax = calculateTax(subtotal);
    const total = calculateTotal(subtotal, tax);

    // Create transaction
    const transaction = await Transaction.create({
      type: 'RENTAL',
      cashier: cashierId,
      customer: customerId,
      items: lineItems,
      subtotal,
      tax,
      total,
      paymentMethod: paymentMethod || 'CASH',
      status: 'PENDING_RETURN'
    });

    // Update inventory
    await inventoryService.updateMultipleStock(
      items.map(i => ({ itemId: i.item, quantity: i.quantity })),
      'decrease'
    );

    return transaction;
  }

  async processReturn(transactionData, cashierId) {
    const { customerId, items, returnType } = transactionData;

    if (returnType === 'rental') {
      return await this.processRentalReturn(customerId, items, cashierId);
    } else {
      return await this.processSaleReturn(items, cashierId);
    }
  }

  async processRentalReturn(customerId, items, cashierId) {
    if (!customerId) {
      throw new Error('Customer ID is required for rental returns');
    }

    // Find original rental transactions
    const rentalTransactions = await Transaction.find({
      customer: customerId,
      type: 'RENTAL',
      status: 'PENDING_RETURN'
    }).populate('items.item');

    let totalLateFee = 0;
    const returnItems = [];

    for (const returnItem of items) {
      let found = false;

      for (const rental of rentalTransactions) {
        const rentalItem = rental.items.find(
          i => i.item._id.toString() === returnItem.item && !i.returned
        );

        if (rentalItem) {
          const today = new Date();
          const daysLate = daysBetween(today, rentalItem.dueDate);
          
          let lateFee = 0;
          if (today > rentalItem.dueDate) {
            lateFee = rentalItem.priceAtTransaction * 0.1 * daysLate;
            totalLateFee += lateFee;
          }

          rentalItem.returned = true;
          rentalItem.returnDate = today;
          rentalItem.lateFee = lateFee;

          returnItems.push({
            item: rentalItem.item._id,
            itemName: rentalItem.itemName,
            priceAtTransaction: rentalItem.priceAtTransaction,
            quantity: returnItem.quantity,
            dueDate: rentalItem.dueDate,
            returned: true,
            returnDate: today,
            lateFee
          });

          await rental.save();
          found = true;
          break;
        }
      }

      if (!found) {
        throw new Error(`Rental record not found for item: ${returnItem.item}`);
      }
    }

    // Update all rental statuses
    for (const rental of rentalTransactions) {
      const allReturned = rental.items.every(i => i.returned);
      if (allReturned) {
        rental.status = 'COMPLETED';
        await rental.save();
      }
    }

    // Create return transaction
    const transaction = await Transaction.create({
      type: 'RETURN',
      cashier: cashierId,
      customer: customerId,
      items: returnItems,
      subtotal: totalLateFee,
      tax: 0,
      total: totalLateFee,
      paymentMethod: 'CASH',
      status: 'COMPLETED'
    });

    // Return items to inventory
    await inventoryService.updateMultipleStock(
      items.map(i => ({ itemId: i.item, quantity: i.quantity })),
      'increase'
    );

    return transaction;
  }

  async processSaleReturn(items, cashierId) {
    const returnItems = [];
    let subtotal = 0;

    for (const item of items) {
      const itemDoc = await Item.findById(item.item);
      if (!itemDoc) {
        throw new Error('Item not found');
      }

      returnItems.push({
        item: item.item,
        itemName: itemDoc.name,
        priceAtTransaction: itemDoc.price,
        quantity: item.quantity
      });

      subtotal += itemDoc.price * item.quantity;
    }

    const tax = calculateTax(subtotal);
    const total = calculateTotal(subtotal, tax);

    // Create return transaction
    const transaction = await Transaction.create({
      type: 'RETURN',
      cashier: cashierId,
      items: returnItems,
      subtotal: -subtotal,
      tax: -tax,
      total: -total,
      paymentMethod: 'CASH',
      status: 'COMPLETED'
    });

    // Return items to inventory
    await inventoryService.updateMultipleStock(
      items.map(i => ({ itemId: i.item, quantity: i.quantity })),
      'increase'
    );

    return transaction;
  }

  async getTransactionHistory(filters = {}) {
    const query = {};
    
    if (filters.type) query.type = filters.type;
    if (filters.cashier) query.cashier = filters.cashier;
    if (filters.customer) query.customer = filters.customer;
    if (filters.status) query.status = filters.status;
    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
      if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
    }

    return await Transaction.find(query)
      .populate('cashier', 'firstName lastName username')
      .populate('customer', 'phoneNumber name')
      .populate('items.item', 'name legacyId')
      .sort('-createdAt');
  }
}

module.exports = new TransactionService();