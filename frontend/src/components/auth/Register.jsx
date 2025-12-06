import React, { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../services/api'; // Direct API usage to access protected route

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'Cashier' // Default as per legacy system
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Backend authController.js expects: username, firstName, lastName, password, role
      await api.post('/auth/register', formData);
      toast.success(`User ${formData.username} registered successfully!`);
      setFormData({ username: '', password: '', firstName: '', lastName: '', role: 'Cashier' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="form-container">
      <h2>Register New Employee</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Employee ID (Username)</label>
          <input name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div className="form-group-row">
          <div className="form-group">
            <label>First Name</label>
            <input name="firstName" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Last Name</label>
            <input name="lastName" value={formData.lastName} onChange={handleChange} required />
          </div>
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength="6" />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="Cashier">Cashier</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="btn-primary">Register Employee</button>
      </form>
    </div>
  );
};

export default Register;