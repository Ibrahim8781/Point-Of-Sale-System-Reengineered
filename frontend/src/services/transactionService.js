import api from './api';

export const processTransaction = async (type, data) => {
  // type = 'sale' | 'rental' | 'return'
  const response = await api.post(`/transactions/${type}`, data); // Note: Backend route structure
  return response.data;
};

export const getTransactions = async (params) => {
  const response = await api.get('/transactions', { params });
  return response.data;
};