import React from 'react';

const Cart = ({ cartItems, onRemove, totals }) => {
  return (
    <div className="cart-container">
      <h3>Current Transaction</h3>
      
      <div className="cart-items-list">
        {cartItems.length === 0 ? (
          <p className="empty-cart">Cart is empty. Scan an item to begin.</p>
        ) : (
          cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <div className="item-details">
                <span className="item-name">{item.name}</span>
                <span className="item-price">${item.price.toFixed(2)} each</span>
              </div>
              <div className="item-actions">
                <span className="item-qty">x{item.quantity}</span>
                <span className="item-total">${(item.price * item.quantity).toFixed(2)}</span>
                <button 
                  onClick={() => onRemove(item._id)} 
                  className="btn-remove"
                >
                  &times;
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="cart-totals">
        <div className="total-row">
          <span>Subtotal:</span>
          <span>${totals.subtotal.toFixed(2)}</span>
        </div>
        <div className="total-row">
          <span>Tax (6%):</span>
          <span>${totals.tax.toFixed(2)}</span>
        </div>
        <div className="total-row grand-total">
          <span>Total:</span>
          <span>${totals.total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default Cart;