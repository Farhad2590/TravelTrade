import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  FaMoneyBillWave,
  FaChartLine,
  FaPercentage,
  FaExchangeAlt,
  FaUserTie,
  FaUser,
  FaCalendarAlt,
  FaUserFriends,
  FaDollarSign,
  FaBoxOpen
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

        // Get recent transactions (last 5, most recent first)
        const recentTransactions = [...completedPayments]
          .sort((a, b) => new Date(b.paidAt || b.createdAt) - new Date(a.paidAt || a.createdAt))
          .slice(0, 5)
          .map(payment => ({
            id: payment._id,
            amount: payment.amount,
            fee: payment.amount * 0.1,
            date: payment.paidAt || payment.createdAt,
            traveler: payment.travelerName,
            sender: payment.senderName,
            parcelType: payment.bidDetails?.parcel_type,
            orderId: payment.orderId
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 pb-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="mb-8 flex items-center gap-4">
          <FaUserTie className="text-4xl text-[#009ee2]" />
          <h1 className="text-4xl font-bold text-[#009ee2]">Platform Analytics</h1>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Total Earnings */}
          <motion.div
            whileHover={{ y: -5, boxShadow: "0 8px 40px rgba(0,0,0,0.12)" }}
            className="bg-white rounded-2xl shadow-lg p-7 border-l-4 border-[#009ee2] flex items-center space-x-6"
          >
            <div className="p-4 rounded-xl bg-blue-100 text-[#009ee2] shadow-sm">
              <FaMoneyBillWave size={32} />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Earnings</p>
              <p className="text-2xl font-bold">{formatCurrency(analytics.totalEarnings)}</p>
            </div>
          </motion.div>

          {/* Total Transactions */}
          <motion.div
            whileHover={{ y: -5, boxShadow: "0 8px 40px rgba(0,0,0,0.12)" }}
            className="bg-white rounded-2xl shadow-lg p-7 border-l-4 border-green-500 flex items-center space-x-6"
          >
            <div className="p-4 rounded-xl bg-green-100 text-green-600 shadow-sm">
              <FaExchangeAlt size={32} />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Total Transactions</p>
              <p className="text-2xl font-bold">{analytics.totalTransactions}</p>
            </div>
          </motion.div>

          {/* Platform Fee */}
          <motion.div
            whileHover={{ y: -5, boxShadow: "0 8px 40px rgba(0,0,0,0.12)" }}
            className="bg-white rounded-2xl shadow-lg p-7 border-l-4 border-purple-500 flex items-center space-x-6"
          >
            <div className="p-4 rounded-xl bg-purple-100 text-purple-600 shadow-sm">
              <FaPercentage size={32} />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Platform Fee Rate</p>
              <p className="text-2xl font-bold">{(analytics.platformFeeRate * 100)}%</p>
            </div>
          </motion.div>
        </div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="bg-gradient-to-r from-[#009ee2] to-[#0085c3] px-6 py-4">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FaChartLine className="mr-2" />
              Recent Transactions
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Platform Fee
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Parcel Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th> */}
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Traveler
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Sender
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.recentTransactions.length > 0 ? (
                  analytics.recentTransactions.map((txn, index) => (
                    <motion.tr
                      key={txn.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.08 }}
                      className="hover:bg-blue-50 transition-all duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {txn.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">
                        {formatCurrency(txn.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600">
                        {formatCurrency(txn.fee)}
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {txn.parcelType || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(txn.date)}
                      </td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {txn.traveler || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {txn.sender || 'N/A'}
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      No recent transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PlatformAnalytics;