import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Components
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import ProductList from './components/products/ProductList';
import ProductForm from './components/products/ProductForm';
import POS_Terminal from './components/sales/POS_Terminal';
import ProtectedRoute from './components/common/ProtectedRoute';
import Layout from './components/common/Layout';
import Register from './components/auth/Register';
import TransactionHistory from './components/sales/TransactionHistory';
function App() {
    return (
        <AuthProvider>
            <Router>
                <ToastContainer position="top-right" autoClose={3000} />
                <Routes>
                    <Route path="/login" element={<Login />} />

                    {/* Protected Routes Wrapper */}
                    <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/pos" element={<POS_Terminal />} />
                        <Route path="/inventory" element={<ProductList />} />
                        <Route path="/inventory/new" element={<ProductForm />} />
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/transactions" element={<TransactionHistory />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;