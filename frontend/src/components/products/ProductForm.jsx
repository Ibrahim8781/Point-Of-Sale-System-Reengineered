import React, { useState } from 'react';
import { createItem } from '../../services/inventoryService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    legacyId: '',
    name: '',
    price: '',
    quantityToCheckOut: '',
    type: 'Sale'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createItem(formData);
      toast.success("Item created successfully");
      navigate('/inventory');
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating item");
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Barcode ID (Legacy ID)</label>
          <input name="legacyId" type="number" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Item Name</label>
          <input name="name" type="text" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Price ($)</label>
          <input name="price" type="number" step="0.01" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Stock Quantity</label>
          <input name="quantityToCheckOut" type="number" onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Type</label>
          <select name="type" onChange={handleChange}>
            <option value="Sale">Sale</option>
            <option value="Rental">Rental</option>
          </select>
        </div>
        <button type="submit" className="btn-primary">Save Item</button>
      </form>
    </div>
  );
};

export default ProductForm;