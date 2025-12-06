import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Stats from './Stats';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {user?.firstName}</h1>
        <p>System Status: Online | Role: {user?.role}</p>
      </header>

      {/* Quick Action Cards */}
      <div className="dashboard-grid">
        <Link to="/pos" className="card action-card">
          <h3>POS Terminal</h3>
          <p>Process Sales & Rentals</p>
        </Link>
        
        <Link to="/inventory" className="card action-card">
          <h3>Inventory</h3>
          <p>Manage Items & Stock</p>
        </Link>
        
        <Link to="/transactions" className="card action-card">
          <h3>History</h3>
          <p>View Transactions & Returns</p>
        </Link>

        {user?.role === 'Admin' && (
          <Link to="/register" className="card action-card admin">
            <h3>User Management</h3>
            <p>Register New Employees</p>
          </Link>
        )}
      </div>

      {/* Statistics Section */}
      <div className="stats-section">
        <Stats />
      </div>
    </div>
  );
};

export default Dashboard;