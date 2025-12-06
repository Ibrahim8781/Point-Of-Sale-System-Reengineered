const Item = require('../models/Item');

class InventoryService {
  async getAvailableItems(type = null) {
    const query = { isAvailable: true };
    if (type) {
      query.type = type;
    }
    return await Item.find(query).sort('name');
  }

  async checkAvailability(itemId, quantity) {
    const item = await Item.findById(itemId);
    if (!item) {
      throw new Error('Item not found');
    }
    if (!item.isAvailable) {
      throw new Error('Item is not available');
    }
    if (item.quantityToCheckOut < quantity) {
      throw new Error(`Insufficient quantity. Available: ${item.quantityToCheckOut}`);
    }
    return true;
  }

  async updateStock(itemId, quantity, operation = 'decrease') {
    const item = await Item.findById(itemId);
    if (!item) {
      throw new Error('Item not found');
    }

    if (operation === 'decrease') {
      if (item.quantityToCheckOut < quantity) {
        throw new Error('Insufficient stock');
      }
      item.quantityToCheckOut -= quantity;
    } else if (operation === 'increase') {
      item.quantityToCheckOut += quantity;
    }

    await item.save();
    return item;
  }

  async updateMultipleStock(items, operation = 'decrease') {
    const updates = [];
    for (const item of items) {
      updates.push(this.updateStock(item.itemId, item.quantity, operation));
    }
    return await Promise.all(updates);
  }
}

module.exports = new InventoryService();