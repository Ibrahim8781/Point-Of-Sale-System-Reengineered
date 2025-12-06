import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { loginUser } from '../../services/authService';
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await loginUser(formData);
      // Backend returns { success: true, data: { token, user: {...} } }
      // OR direct { token, ... } based on controller. 
      // Adjusted based on session 5 authController: returns data directly.
      login(data.token, { 
        id: data._id, 
        username: data.username, 
        role: data.role,
        firstName: data.firstName 
      });
      toast.success(`Welcome back, ${data.firstName}!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>SG Technologies POS</h2>
        <div className="form-group">
          <label>Username (Employee ID)</label>
          <input 
            type="text" 
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required 
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required 
          />
        </div>
        <button type="submit" className="btn-primary">Login</button>
      </form>
    </div>
  );
};

export default Login;