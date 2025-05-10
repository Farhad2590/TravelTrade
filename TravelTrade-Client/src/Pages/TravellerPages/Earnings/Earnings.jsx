import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import useAuth from "../../../hooks/useAuth";
import { FaCheck, FaTimes, FaHourglassHalf, FaMoneyBillWave, FaFileInvoiceDollar } from "react-icons/fa";

const Earnings = () => {
  const { user } = useAuth();
  const [earnings, setEarnings] = useState({ payments: [], totalEarnings: 0 });
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    routingNumber: "",
    accountHolderName: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const api = "http://localhost:9000";

  useEffect(() => {
    if (user?.email) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [earningsRes, withdrawalsRes] = await Promise.all([
        axios.get(`${api}/payments/earnings/${user.email}`),
        axios.get(`${api}/withdrawals/${user.email}`),
      ]);

      setEarnings(earningsRes.data);
      setWithdrawals(withdrawalsRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching earnings data:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <FaCheck className="mr-2" />;
      case "rejected":
        return <FaTimes className="mr-2" />;
      case "pending":
      case "processing":
        return <FaHourglassHalf className="mr-2" />;
      default:
        return <FaFileInvoiceDollar className="mr-2" />;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.bankName.trim()) errors.bankName = "Bank name is required";
    if (!formData.accountNumber.trim()) errors.accountNumber = "Account number is required";
    if (!formData.routingNumber.trim()) errors.routingNumber = "Routing number is required";
    if (!formData.accountHolderName.trim()) errors.accountHolderName = "Account holder name is required";
    
    return errors;
  };

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      await axios.post(`${api}/withdrawals`, {
        travelerEmail: user.email,
        amount: earnings.totalEarnings,
        bankDetails: formData,
      });
      
      // Show success message
      alert("Withdrawal request submitted successfully!");
      setShowWithdrawModal(false);
      setFormData({
        bankName: "",
        accountNumber: "",
        routingNumber: "",
        accountHolderName: "",
      });
      
      // Refresh data
      fetchData();
    } catch (err) {
      console.error("Failed to submit withdrawal request:", err);
      alert("Failed to submit withdrawal request. Please try again.");
    }
  };

  return (
    <div className="p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto"
      >
        <h1 className="text-3xl font-bold text-center text-[#009ee2] mb-8">
          Your Earnings
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#009ee2]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl shadow-lg">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-xl overflow-hidden p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <FaMoneyBillWave className="text-[#009ee2] text-3xl mr-3" />
                <h2 className="text-2xl font-semibold">
                  Total Earnings: <span className="text-[#009ee2]">${earnings.totalEarnings.toFixed(2)}</span>
                </h2>
              </div>
              <motion.button
                onClick={() => setShowWithdrawModal(true)}
                disabled={earnings.totalEarnings <= 0}
                className={`px-4 py-2 rounded-lg text-white font-medium transition duration-200 ${
                  earnings.totalEarnings <= 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#009ee2] hover:bg-[#0088c6]"
                }`}
                whileHover={earnings.totalEarnings > 0 ? { scale: 1.05 } : {}}
                whileTap={earnings.totalEarnings > 0 ? { scale: 0.95 } : {}}
              >
                Request Withdrawal
              </motion.button>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Payment History</h3>
              {earnings.payments.length === 0 ? (
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-gray-600">No payment history found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-[#009ee2] text-white">
                      <tr>
                        <th className="py-4 px-6 text-left">Order ID</th>
                        <th className="py-4 px-6 text-left">Amount</th>
                        <th className="py-4 px-6 text-left">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {earnings.payments.map((payment, index) => (
                        <tr
                          key={payment._id}
                          className={`border-b border-gray-200 hover:bg-blue-50 transition duration-150 ${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }`}
                        >
                          <td className="py-4 px-6">{payment.orderId}</td>
                          <td className="py-4 px-6">${parseFloat(payment.amount).toFixed(2)}</td>
                          <td className="py-4 px-6">{formatDate(payment.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-gray-700">Withdrawal History</h3>
              {withdrawals.length === 0 ? (
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-gray-600">No withdrawal history found.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-[#009ee2] text-white">
                      <tr>
                        <th className="py-4 px-6 text-left">Amount</th>
                        <th className="py-4 px-6 text-left">Status</th>
                        <th className="py-4 px-6 text-left">Request Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {withdrawals.map((withdrawal, index) => (
                        <tr
                          key={withdrawal._id}
                          className={`border-b border-gray-200 hover:bg-blue-50 transition duration-150 ${
                            index % 2 === 0 ? "bg-gray-50" : "bg-white"
                          }`}
                        >
                          <td className="py-4 px-6">${parseFloat(withdrawal.amount).toFixed(2)}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              {getStatusIcon(withdrawal.status)}
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                                  withdrawal.status
                                )}`}
                              >
                                {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">{formatDate(withdrawal.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>

      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#009ee2]">Request Withdrawal</h2>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <form onSubmit={handleWithdrawSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bankName">
                  Bank Name
                </label>
                <input
                  id="bankName"
                  name="bankName"
                  type="text"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${
                    formErrors.bankName ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009ee2]`}
                  placeholder="Enter bank name"
                />
                {formErrors.bankName && (
                  <p className="text-red-500 text-xs italic mt-1">{formErrors.bankName}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="accountNumber">
                  Account Number
                </label>
                <input
                  id="accountNumber"
                  name="accountNumber"
                  type="text"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${
                    formErrors.accountNumber ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009ee2]`}
                  placeholder="Enter account number"
                />
                {formErrors.accountNumber && (
                  <p className="text-red-500 text-xs italic mt-1">{formErrors.accountNumber}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="routingNumber">
                  Routing Number
                </label>
                <input
                  id="routingNumber"
                  name="routingNumber"
                  type="text"
                  value={formData.routingNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${
                    formErrors.routingNumber ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009ee2]`}
                  placeholder="Enter routing number"
                />
                {formErrors.routingNumber && (
                  <p className="text-red-500 text-xs italic mt-1">{formErrors.routingNumber}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="accountHolderName">
                  Account Holder Name
                </label>
                <input
                  id="accountHolderName"
                  name="accountHolderName"
                  type="text"
                  value={formData.accountHolderName}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${
                    formErrors.accountHolderName ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009ee2]`}
                  placeholder="Enter account holder name"
                />
                {formErrors.accountHolderName && (
                  <p className="text-red-500 text-xs italic mt-1">{formErrors.accountHolderName}</p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                  Amount
                </label>
                <input
                  id="amount"
                  type="text"
                  value={`$${earnings.totalEarnings.toFixed(2)}`}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <motion.button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  className="px-4 py-2 bg-[#009ee2] text-white font-medium rounded-lg hover:bg-[#0088c6] transition duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Submit
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Earnings;