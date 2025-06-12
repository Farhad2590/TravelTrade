import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../../../hooks/useAuth";
import useUserData from "../../../hooks/useUserData";
import {
  FaCheck,
  FaTimes,
  FaHourglassHalf,
  FaMoneyBillWave,
  FaFileInvoiceDollar,
  FaEye,
  FaCalendarAlt,
  FaUser,
  FaEnvelope,
  FaPercentage,
} from "react-icons/fa";

const Earnings = () => {
  const { user } = useAuth();
  const { userData } = useUserData();
  const [earnings, setEarnings] = useState({ payments: [], totalEarnings: 0 });
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        axios.get(`${api}/earnings/${user.email}`),
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
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
      case "approved":
        return <FaCheck className="mr-2 text-green-600" />;
      case "rejected":
      case "failed":
        return <FaTimes className="mr-2 text-red-600" />;
      case "pending":
      case "processing":
        return <FaHourglassHalf className="mr-2 text-yellow-600" />;
      default:
        return <FaFileInvoiceDollar className="mr-2 text-gray-600" />;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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
    if (!formData.accountNumber.trim())
      errors.accountNumber = "Account number is required";
    if (!formData.routingNumber.trim())
      errors.routingNumber = "Routing number is required";
    if (!formData.accountHolderName.trim())
      errors.accountHolderName = "Account holder name is required";

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
        amount: userData.balance,
        bankDetails: formData,
      });

      alert("Withdrawal request submitted successfully!");
      setShowWithdrawModal(false);
      setFormData({
        bankName: "",
        accountNumber: "",
        routingNumber: "",
        accountHolderName: "",
      });
      fetchData();
    } catch (err) {
      console.error("Failed to submit withdrawal request:", err);
      alert("Failed to submit withdrawal request. Please try again.");
    }
  };

  const openModal = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWithdrawal(null);
  };

  const calculatePlatformFee = (amount) => {
    return (amount * 0.1).toFixed(2);
  };

  const calculateTravelerEarnings = (amount) => {
    return (amount * 0.9).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto max-w-7xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#009ee2] mb-2">
            Your Earnings
          </h1>
          <p className="text-gray-600">Track your earnings and withdrawals</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#009ee2]"></div>
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border-l-4 border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-lg"
          >
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Balance Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white shadow-2xl rounded-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#009ee2] to-[#0085c3] px-6 py-4">
                <h2 className="text-xl font-semibold text-white">
                  Current Balance
                </h2>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <FaMoneyBillWave className="text-4xl text-[#009ee2] mr-4" />
                    <div>
                      <p className="text-gray-600">Available Balance</p>
                      <p className="text-3xl font-bold text-gray-800">
                        ${userData?.balance?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setShowWithdrawModal(true)}
                    disabled={!userData?.balance || userData.balance <= 0}
                    className={`px-6 py-3 rounded-lg text-white font-medium transition duration-200 ${
                      !userData?.balance || userData.balance <= 0
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#009ee2] hover:bg-[#0088c6]"
                    }`}
                    whileHover={
                      userData?.balance > 0 ? { scale: 1.05 } : {}
                    }
                    whileTap={userData?.balance > 0 ? { scale: 0.95 } : {}}
                  >
                    Request Withdrawal
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Earnings Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white shadow-2xl rounded-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#009ee2] to-[#0085c3] px-6 py-4">
                <h2 className="text-xl font-semibold text-white">
                  Payment History
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Platform Fee (10%)
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Your Earnings
                      </th>
                      {/* <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Date
                      </th> */}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {earnings.payments.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-gray-500">
                          No payment history found
                        </td>
                      </tr>
                    ) : (
                      earnings.payments.map((payment, index) => (
                        <motion.tr
                          key={payment._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="hover:bg-blue-50 transition-all duration-200"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <FaFileInvoiceDollar className="text-[#009ee2] mr-2" />
                              <span className="font-medium text-gray-900">
                                {payment.orderId}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <FaMoneyBillWave className="text-green-500 mr-2" />
                              <span className="font-bold text-lg text-gray-900">
                                ${parseFloat(payment.amount).toFixed(2)}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <FaPercentage className="text-red-500 mr-2" />
                              <span className="font-bold text-gray-900">
                                ${calculatePlatformFee(payment.amount)}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <FaMoneyBillWave className="text-green-500 mr-2" />
                              <span className="font-bold text-green-600">
                                ${calculateTravelerEarnings(payment.amount)}
                              </span>
                            </div>
                          </td>
                          {/* <td className="py-4 px-6">
                            <div className="flex items-center">
                              <FaCalendarAlt className="text-[#009ee2] mr-2" />
                              <span>{formatDate(payment.createdAt)}</span>
                            </div>
                          </td> */}
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Withdrawals Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white shadow-2xl rounded-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#009ee2] to-[#0085c3] px-6 py-4">
                <h2 className="text-xl font-semibold text-white">
                  Withdrawal History
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Traveler Email
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      {/* <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Request Date
                      </th> */}
                      <th className="py-4 px-6 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {withdrawals.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-gray-500">
                          No withdrawal history found
                        </td>
                      </tr>
                    ) : (
                      withdrawals.map((withdrawal, index) => (
                        <motion.tr
                          key={withdrawal._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="hover:bg-blue-50 transition-all duration-200"
                        >
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <FaUser className="text-[#009ee2] mr-2" />
                              <span className="font-medium text-gray-900">
                                {withdrawal.travelerEmail}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <FaMoneyBillWave className="text-green-500 mr-2" />
                              <span className="font-bold text-lg text-gray-900">
                                ${parseFloat(withdrawal.amount).toFixed(2)}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              {getStatusIcon(withdrawal.status)}
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusClass(
                                  withdrawal.status
                                )}`}
                              >
                                {withdrawal.status.charAt(0).toUpperCase() +
                                  withdrawal.status.slice(1)}
                              </span>
                            </div>
                          </td>
                          {/* <td className="py-4 px-6">
                            <div className="flex items-center">
                              <FaCalendarAlt className="text-[#009ee2] mr-2" />
                              <span>{formatDate(withdrawal.createdAt)}</span>
                            </div>
                          </td> */}
                          <td className="py-4 px-6 text-center">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openModal(withdrawal)}
                              className="bg-[#009ee2] hover:bg-[#0085c3] text-white p-2 rounded-full shadow-lg transition-all duration-200"
                            >
                              <FaEye className="text-sm" />
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>

      {/* Withdrawal Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowWithdrawModal(false)}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-[#009ee2] to-[#0085c3] p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">
                    Request Withdrawal
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowWithdrawModal(false)}
                    className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all duration-200"
                  >
                    <FaTimes />
                  </motion.button>
                </div>
              </div>

              <div className="p-6">
                <form onSubmit={handleWithdrawSubmit}>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Bank Name
                    </label>
                    <input
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
                      <p className="text-red-500 text-xs italic mt-1">
                        {formErrors.bankName}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Account Number
                    </label>
                    <input
                      name="accountNumber"
                      type="text"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${
                        formErrors.accountNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009ee2]`}
                      placeholder="Enter account number"
                    />
                    {formErrors.accountNumber && (
                      <p className="text-red-500 text-xs italic mt-1">
                        {formErrors.accountNumber}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Routing Number
                    </label>
                    <input
                      name="routingNumber"
                      type="text"
                      value={formData.routingNumber}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${
                        formErrors.routingNumber
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009ee2]`}
                      placeholder="Enter routing number"
                    />
                    {formErrors.routingNumber && (
                      <p className="text-red-500 text-xs italic mt-1">
                        {formErrors.routingNumber}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Account Holder Name
                    </label>
                    <input
                      name="accountHolderName"
                      type="text"
                      value={formData.accountHolderName}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border ${
                        formErrors.accountHolderName
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009ee2]`}
                      placeholder="Enter account holder name"
                    />
                    {formErrors.accountHolderName && (
                      <p className="text-red-500 text-xs italic mt-1">
                        {formErrors.accountHolderName}
                      </p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Amount
                    </label>
                    <input
                      type="text"
                      value={`$${userData?.balance?.toFixed(2) || "0.00"}`}
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
                      Submit Request
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Withdrawal Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedWithdrawal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-[#009ee2] to-[#0085c3] p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-white">
                    Withdrawal Details
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeModal}
                    className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all duration-200"
                  >
                    <FaTimes />
                  </motion.button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                    <div className="flex items-center mb-3">
                      <FaUser className="text-[#009ee2] mr-2" />
                      <h3 className="font-semibold text-gray-800">
                        Traveler Information
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Email:</span>{" "}
                        {selectedWithdrawal.travelerEmail}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                    <div className="flex items-center mb-3">
                      <FaMoneyBillWave className="text-green-600 mr-2" />
                      <h3 className="font-semibold text-gray-800">
                        Withdrawal Details
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Amount:</span>{" "}
                        <span className="text-2xl font-bold text-green-600">
                          ${parseFloat(selectedWithdrawal.amount).toFixed(2)}
                        </span>
                      </p>
                      <div className="flex items-center">
                        {getStatusIcon(selectedWithdrawal.status)}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusClass(
                            selectedWithdrawal.status
                          )}`}
                        >
                          {selectedWithdrawal.status.charAt(0).toUpperCase() +
                            selectedWithdrawal.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                    <div className="flex items-center mb-3">
                      <FaCalendarAlt className="text-purple-600 mr-2" />
                      <h3 className="font-semibold text-gray-800">Timeline</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Request Date:</span>{" "}
                        {formatDate(selectedWithdrawal.createdAt)}
                      </p>
                      {selectedWithdrawal.updatedAt && (
                        <p className="text-sm">
                          <span className="font-medium">Last Update:</span>{" "}
                          {formatDate(selectedWithdrawal.updatedAt)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-100">
                    <div className="flex items-center mb-3">
                      <FaFileInvoiceDollar className="text-orange-600 mr-2" />
                      <h3 className="font-semibold text-gray-800">
                        Bank Details
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Bank Name:</span>{" "}
                        {selectedWithdrawal.bankDetails.bankName}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Account Number:</span>{" "}
                        {selectedWithdrawal.bankDetails.accountNumber}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Routing Number:</span>{" "}
                        {selectedWithdrawal.bankDetails.routingNumber}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Account Holder:</span>{" "}
                        {selectedWithdrawal.bankDetails.accountHolderName}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={closeModal}
                      className="bg-gradient-to-r from-[#009ee2] to-[#0085c3] text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Close Details
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Earnings;