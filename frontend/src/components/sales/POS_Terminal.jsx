import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { getItemByLegacyId, getItems } from '../../services/inventoryService';
import { processTransaction } from '../../services/transactionService';

const POS_Terminal = () => {
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [transactionType, setTransactionType] = useState('SALE'); // SALE, RENTAL, RETURN
  const [customerPhone, setCustomerPhone] = useState('');
  
  // Barcode scanner input handling
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;

    try {
      // Try exact legacy ID match first (Barcode)
      const resLegacy = await getItemByLegacyId(searchQuery).catch(() => null);
      if (resLegacy && resLegacy.success) {
        addToCart(resLegacy.data);
        setSearchQuery('');
        return;
      }

      // Fallback to name search
      const resName = await getItems({ keyword: searchQuery, available: true });
      if (resName.success && resName.count > 0) {
        setSearchResults(resName.data);
      } else {
        toast.info("No item found");
      }
    } catch (err) {
      toast.error("Error searching item");
    }
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) {
        return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    setSearchResults([]); // Clear search results after selection
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i._id !== id));
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.06; // Hardcoded 6% from legacy requirements
    return { subtotal, tax, total: subtotal + tax };
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return toast.warning("Cart is empty");
    if (transactionType === 'RENTAL' && !customerPhone) return toast.warning("Customer Phone required for Rental");

    const payload = {
      type: transactionType,
      items: cart.map(i => ({ item: i._id, quantity: i.quantity })),
      paymentMethod: 'CASH', // Default for now
      ...(customerPhone && { customerPhone })
    };

    try {
      // Map frontend type to backend route suffix
      const typeMap = { 'SALE': 'sale', 'RENTAL': 'rental', 'RETURN': 'return' };
      const res = await processTransaction(typeMap[transactionType], payload);
      
      if (res.success) {
        toast.success("Transaction Completed!");
        setCart([]);
        setCustomerPhone('');
        // Logic to print receipt could go here
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Transaction failed");
    }
  };

  const { subtotal, tax, total } = calculateTotals();

  return (
    <div className="pos-container">
      <div className="pos-left">
        <div className="pos-controls">
          <select value={transactionType} onChange={e => setTransactionType(e.target.value)}>
            <option value="SALE">Sale</option>
            <option value="RENTAL">Rental</option>
            <option value="RETURN">Return</option>
          </select>
          {transactionType === 'RENTAL' && (
            <input 
              type="text" 
              placeholder="Customer Phone" 
              value={customerPhone}
              onChange={e => setCustomerPhone(e.target.value)}
            />
          )}
        </div>

        <form onSubmit={handleSearch} className="search-bar">
          <input 
            type="text" 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            placeholder="Scan Barcode or Search Name..." 
            autoFocus
          />
          <button type="submit">Search</button>
        </form>

        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults.map(item => (
              <div key={item._id} onClick={() => addToCart(item)} className="search-item">
                <span>{item.name}</span>
                <span>${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="cart-list">
          {cart.map(item => (
            <div key={item._id} className="cart-item">
              <div className="item-info">
                <h4>{item.name}</h4>
                <small>#{item.legacyId}</small>
              </div>
              <div className="item-qty">
                <span>x{item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
                <button onClick={() => removeFromCart(item._id)} className="btn-danger">X</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pos-right">
        <div className="totals">
          <div className="row"><span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span></div>
          <div className="row"><span>Tax (6%):</span> <span>${tax.toFixed(2)}</span></div>
          <div className="row total"><span>Total:</span> <span>${total.toFixed(2)}</span></div>
        </div>
        <button className="btn-checkout" onClick={handleCheckout}>
          PROCESS {transactionType}
        </button>
      </div>
    </div>
  );
};

export default POS_Terminal;