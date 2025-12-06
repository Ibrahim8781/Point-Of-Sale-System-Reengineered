import React from 'react';

const ProductFilter = ({ onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFilterChange(name, type === 'checkbox' ? checked : value);
  };

  return (
    <div className="filter-bar">
      <input
        type="text"
        name="keyword"
        placeholder="Search items..."
        onChange={handleChange}
        className="filter-input"
      />
      <select name="type" onChange={handleChange} className="filter-select">
        <option value="">All Types</option>
        <option value="Sale">Sale Only</option>
        <option value="Rental">Rental Only</option>
      </select>
      <label className="checkbox-label">
        <input
          type="checkbox"
          name="available"
          onChange={handleChange}
        />
        Available Only
      </label>
    </div>
  );
};

export default ProductFilter;