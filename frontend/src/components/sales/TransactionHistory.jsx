import React, { useEffect, useState } from 'react';
import { getTransactions } from '../../services/transactionService';
import { toast } from 'react-toastify';

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const res = await getTransactions();
      if (res.success) {
        setTransactions(res.data);
      }
    } catch (error) {
      toast.error("Could not load history");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading records...</div>;

  return (
    <div className="page-container">
      <h2>Transaction History</h2>
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Cashier</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(t => (
            <tr key={t._id}>
              <td>{new Date(t.createdAt).toLocaleString()}</td>
              <td><span className={`badge badge-${t.type.toLowerCase()}`}>{t.type}</span></td>
              <td>{t.cashier?.firstName} {t.cashier?.lastName}</td>
              <td>{t.items.length} items</td>
              <td>${t.total.toFixed(2)}</td>
              <td>{t.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;