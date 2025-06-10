import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  FaMoneyBillWave, 
  FaChartLine, 
  FaPercentage, 
  FaExchangeAlt,
  FaUserTie
} from 'react-icons/fa';

const PlatformAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalEarnings: 0,
    totalTransactions: 0,
    recentTransactions: [],
    platformFeeRate: 0.1 // 10%
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        // Fetch admin data with balance
        const adminResponse = await axios.get('http://localhost:9000/users/traveltradesihab@gmail.com');
        const adminData = adminResponse.data;
        
        // Fetch all completed payments
        const paymentsResponse = await axios.get('http://localhost:9000/all');
        const completedPayments = paymentsResponse.data.filter(
          payment => payment.status === 'completed'
        );

        // Calculate totals
        const totalEarnings = adminData.balance || 0;
        const totalTransactions = completedPayments.length;

        // Get recent transactions (last 5)
        const recentTransactions = completedPayments
          .slice(0, 5)
          .map(payment => ({
            id: payment._id,
            amount: payment.amount,
            fee: payment.amount * 0.1,
            date: payment.paidAt || payment.createdAt,
            traveler: payment.travelerName,
            sender: payment.senderName
          }));

        setAnalytics({
          totalEarnings,
          totalTransactions,
          recentTransactions,
          platformFeeRate: 0.1
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error loading analytics: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-blue-600 mb-8 flex items-center">
          <FaUserTie className="mr-3" />
          Platform Analytics
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Earnings */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <FaMoneyBillWave size={24} />
              </div>
              <div>
                <p className="text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(analytics.totalEarnings)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Total Transactions */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <FaExchangeAlt size={24} />
              </div>
              <div>
                <p className="text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold">{analytics.totalTransactions}</p>
              </div>
            </div>
          </motion.div>

          {/* Platform Fee */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <FaPercentage size={24} />
              </div>
              <div>
                <p className="text-gray-600">Platform Fee Rate</p>
                <p className="text-2xl font-bold">
                  {(analytics.platformFeeRate * 100)}%
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FaChartLine className="mr-2" />
              Recent Transactions
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platform Fee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Traveler
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sender
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.recentTransactions.length > 0 ? (
                  analytics.recentTransactions.map((txn, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{txn.id.slice(-6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(txn.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(txn.fee)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(txn.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {txn.traveler || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {txn.sender || 'N/A'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No recent transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PlatformAnalytics;