import React, { useEffect, useState, useContext } from 'react';
import { getItems, deleteItem } from '../../services/inventoryService';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProductList = () => {
  const [items, setItems] = useState([]);
  const { user } = useContext(AuthContext);

  const fetchItems = async () => {
    try {
      const { data } = await getItems(); // Gets all items
      setItems(data);
    } catch (error) {
      toast.error("Failed to load inventory");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await deleteItem(id);
        toast.success("Item deleted");
        fetchItems();
      } catch (error) {
        toast.error("Failed to delete item");
      }
    }
  };

  return (
    <div className="page-container">
      <div className="header-actions">
        <h2>Inventory</h2>
        {user.role === 'Admin' && (
          <Link to="/inventory/new" className="btn-primary">Add Item</Link>
        )}
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item._id}>
              <td>{item.legacyId}</td>
              <td>{item.name}</td>
              <td>{item.type}</td>
              <td>${item.price.toFixed(2)}</td>
              <td>{item.quantityToCheckOut}</td>
              <td>
                {user.role === 'Admin' && (
                  <button onClick={() => handleDelete(item._id)} className="btn-sm btn-danger">Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;