import axios from "axios";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheck,
  FaHourglassHalf,
  FaEye,
  FaFileInvoiceDollar,
  FaUser,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaTimes
} from "react-icons/fa";

const STATUS_MAP = {
  completed: {
    label: "Completed",
    icon: <FaCheck className="mr-2 text-green-600" />,
    class: "bg-green-100 text-green-800 border-green-200"
  },
  pending: {
    label: "Pending",
    icon: <FaHourglassHalf className="mr-2 text-yellow-600" />,
    class: "bg-yellow-100 text-yellow-800 border-yellow-200"
  },
  processing: {
    label: "Processing",
    icon: <FaHourglassHalf className="mr-2 text-blue-600" />,
    class: "bg-blue-100 text-blue-800 border-blue-200"
  },
  failed: {
    label: "Failed",
    icon: <FaFileInvoiceDollar className="mr-2 text-red-600" />,
    class: "bg-red-100 text-red-800 border-red-200"
  }
};

const getStatusConfig = (status) => STATUS_MAP[status] || {
  label: status,
  icon: <FaFileInvoiceDollar className="mr-2 text-gray-600" />,
  class: "bg-gray-100 text-gray-800 border-gray-200"
};

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get("http://localhost:9000/all");
        setPayments(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const openModal = (payment) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  };
  const closeModal = () => {
    setShowDetailsModal(false);
    setSelectedPayment(null);
  };

  const PaymentDetailsModal = () => {
    const payment = selectedPayment;
    if (!payment) return null;
    const statusConfig = getStatusConfig(payment.status);

    return (
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
              <h2 className="text-2xl font-bold text-white">Payment Details</h2>
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
                  <FaFileInvoiceDollar className="text-[#009ee2] mr-2" />
                  <h3 className="font-semibold text-gray-800">
                    Payment Info
                  </h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Order ID:</span> {payment.orderId}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Amount:</span>{" "}
                    <span className="text-2xl font-bold text-green-600">
                      ${parseFloat(payment.amount).toFixed(2)}
                    </span>
                  </p>
                  <div className="flex items-center">
                    {statusConfig.icon}
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.class}`}
                    >
                      {statusConfig.label}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                <div className="flex items-center mb-3">
                  <FaUser className="text-green-600 mr-2" />
                  <h3 className="font-semibold text-gray-800">
                    User Info
                  </h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Sender:</span> {payment.senderName}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Traveler:</span> {payment.travelerName}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-100">
                <div className="flex items-center mb-3">
                  <FaCalendarAlt className="text-orange-600 mr-2" />
                  <h3 className="font-semibold text-gray-800">
                    Timeline
                  </h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Created:</span> {formatDate(payment.createdAt)}
                  </p>
                  {payment.paidAt && (
                    <p className="text-sm">
                      <span className="font-medium">Paid At:</span> {formatDate(payment.paidAt)}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                <div className="flex items-center mb-3">
                  <FaMoneyBillWave className="text-purple-600 mr-2" />
                  <h3 className="font-semibold text-gray-800">Parcel Info</h3>
                </div>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Type:</span> {payment.bidDetails?.parcel_type || "N/A"}
                  </p>
                  {payment.bidDetails?.parcel_weight_kg && (
                    <p className="text-sm">
                      <span className="font-medium">Weight:</span> {payment.bidDetails.parcel_weight_kg} kg
                    </p>
                  )}
                  {payment.bidDetails?.from_city && payment.bidDetails?.to_city && (
                    <p className="text-sm">
                      <span className="font-medium">Route:</span>{" "}
                      {payment.bidDetails.from_city} → {payment.bidDetails.to_city}
                    </p>
                  )}
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
    );
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
            All Payments
          </h1>
          <p className="text-gray-600">Admin overview of all platform payments</p>
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
            <FaFileInvoiceDollar className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-xl text-gray-600">No payments found.</p>
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
                Payment Records
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Order ID</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Sender</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Traveler</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                    {/* <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Parcel Type</th> */}
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    {/* <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Date</th> */}
                    <th className="py-4 px-6 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment, index) => {
                    const statusConfig = getStatusConfig(payment.status);
                    return (
                      <motion.tr
                        key={payment._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.07 }}
                        className="hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                      >
                        <td className="py-4 px-6 truncate max-w-[150px]">{payment.orderId}</td>
                        <td className="py-4 px-6">{payment.senderName}</td>
                        <td className="py-4 px-6">{payment.travelerName}</td>
                        <td className="py-4 px-6 font-bold text-gray-900">${parseFloat(payment.amount).toFixed(2)}</td>
                        {/* <td className="py-4 px-6">{payment.bidDetails?.parcel_type || "N/A"}</td> */}
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            {statusConfig.icon}
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.class}`}
                            >
                              {statusConfig.label}
                            </span>
                          </div>
                        </td>
                        {/* <td className="py-4 px-6">{formatDate(payment.createdAt)}</td> */}
                        <td className="py-4 px-6 text-center">
                          <motion.button
                            onClick={() => openModal(payment)}
                            className="bg-[#009ee2] text-white p-2 rounded-lg hover:bg-[#0088c6] transition duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            title="View Details"
                          >
                            <FaEye />
                          </motion.button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {showDetailsModal && <PaymentDetailsModal />}
      </AnimatePresence>
    </div>
  );
};

export default Payments;