import axios from "axios";
import { useEffect, useState } from "react";
// import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheck,
  FaHourglassHalf,
  FaReceipt,
  FaEye,
  FaTimes,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaCreditCard,
  FaUser,
  FaEnvelope,
} from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";

const PaymentHistory = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const api = "http://localhost:9000";
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log(payments);

  useEffect(() => {
    if (user?.email) {
      fetchPaymentHistory();
    }
  }, [user]);

  const fetchPaymentHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${api}/history/${user.email}`);
      setPayments(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching payment history:", err);
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
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
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
        return <FaCheck className="mr-2 text-green-600" />;
      case "pending":
      case "processing":
        return <FaHourglassHalf className="mr-2 text-yellow-600" />;
      default:
        return <FaReceipt className="mr-2 text-gray-600" />;
    }
  };

  const openModal = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
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
            Payment History
          </h1>
          <p className="text-gray-600">Track all your payment transactions</p>
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
        ) : payments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white shadow-xl rounded-2xl p-12 text-center"
          >
            <FaReceipt className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-xl text-gray-600">No payment history found.</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-2xl rounded-2xl overflow-hidden"
          >
            <div className="bg-gradient-to-r from-[#009ee2] to-[#0085c3] px-6 py-4">
              <h2 className="text-xl font-semibold text-white">
                Transaction Records
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
                      Status
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="py-4 px-6 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment, index) => (
                    <motion.tr
                      key={payment._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <FaReceipt className="text-[#009ee2] mr-2" />
                          <span className="font-medium text-gray-900">
                            {payment.orderId}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          {getStatusIcon(payment.status)}
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusClass(
                              payment.status
                            )}`}
                          >
                            {payment.status.charAt(0).toUpperCase() +
                              payment.status.slice(1)}
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
                          <FaCreditCard className="text-[#009ee2] mr-2" />
                          <span className="capitalize font-medium text-gray-700">
                            {payment.paymentMethod || "Credit Card"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openModal(payment)}
                          className="bg-[#009ee2] hover:bg-[#0085c3] text-white p-2 rounded-full shadow-lg transition-all duration-200"
                        >
                          <FaEye className="text-sm" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && selectedPayment && (
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
                    Payment Details
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
                      <FaReceipt className="text-[#009ee2] mr-2" />
                      <h3 className="font-semibold text-gray-800">
                        Order Information
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Order ID:</span>{" "}
                        {selectedPayment.orderId}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Payment Intent ID:</span>{" "}
                        {selectedPayment.paymentIntentId}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Validation ID:</span>{" "}
                        {selectedPayment.valId || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                    <div className="flex items-center mb-3">
                      <FaMoneyBillWave className="text-green-600 mr-2" />
                      <h3 className="font-semibold text-gray-800">
                        Payment Details
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Amount:</span>{" "}
                        <span className="text-2xl font-bold text-green-600">
                          ${parseFloat(selectedPayment.amount).toFixed(2)}
                        </span>
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Method:</span>{" "}
                        <span className="capitalize">
                          {selectedPayment.paymentMethod}
                        </span>
                      </p>
                      <div className="flex items-center">
                        {getStatusIcon(selectedPayment.status)}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusClass(
                            selectedPayment.status
                          )}`}
                        >
                          {selectedPayment.status.charAt(0).toUpperCase() +
                            selectedPayment.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                    <div className="flex items-center mb-3">
                      <FaUser className="text-purple-600 mr-2" />
                      <h3 className="font-semibold text-gray-800">
                        User Information
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Traveler:</span>{" "}
                        {selectedPayment.travelerEmail}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Sender:</span>{" "}
                        {selectedPayment.senderEmail}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-100">
                    <div className="flex items-center mb-3">
                      <FaCalendarAlt className="text-orange-600 mr-2" />
                      <h3 className="font-semibold text-gray-800">Timeline</h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Created:</span>{" "}
                        {formatDate(selectedPayment.createdAt)}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Paid At:</span>{" "}
                        {formatDate(selectedPayment.paidAt)}
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

export default PaymentHistory;
