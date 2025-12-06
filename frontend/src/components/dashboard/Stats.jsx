import React, { useEffect, useState } from 'react';
import { getTransactions } from '../../services/transactionService';

const Stats = () => {
  const [stats, setStats] = useState({ totalSales: 0, count: 0, totalTax: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch recent transactions to calculate daily stats
        const res = await getTransactions();
        if (res.success) {
          const transactions = res.data;
          const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
          const totalTax = transactions.reduce((sum, t) => sum + t.tax, 0);
          
          setStats({
            totalSales,
            totalTax,
            count: transactions.length
          });
        }
      } catch (error) {
        console.error("Failed to load stats");
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="stats-container">
      <h3>Quick Overview</h3>
      <div className="stats-row">
        <div className="stat-box">
          <label>Total Revenue</label>
          <span>${stats.totalSales.toFixed(2)}</span>
        </div>
        <div className="stat-box">
          <label>Transactions</label>
          <span>{stats.count}</span>
        </div>
        <div className="stat-box">
          <label>Tax Collected</label>
          <span>${stats.totalTax.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default Stats;