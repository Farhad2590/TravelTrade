import axios from "axios";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheck,
  FaTimes,
  FaHourglassHalf,
  FaEye,
  FaMoneyBillWave,
  FaCreditCard,
  FaSpinner,
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaReceipt
} from "react-icons/fa";

const STATUS_MAP = {
  completed: {
    label: "Completed",
    icon: <FaCheck className="mr-2 text-green-600" />,
    class: "bg-green-100 text-green-800 border-green-200"
  },
  rejected: {
    label: "Rejected",
    icon: <FaTimes className="mr-2 text-red-600" />,
    class: "bg-red-100 text-red-800 border-red-200"
  },
  paid: {
    label: "Paid",
    icon: <FaCreditCard className="mr-2 text-blue-600" />,
    class: "bg-blue-100 text-blue-800 border-blue-200"
  },
  processing: {
    label: "Processing",
    icon: <FaSpinner className="mr-2 animate-spin text-purple-700" />,
    class: "bg-purple-100 text-purple-800 border-purple-200"
  },
  pending: {
    label: "Pending",
    icon: <FaHourglassHalf className="mr-2 text-yellow-600" />,
    class: "bg-yellow-100 text-yellow-800 border-yellow-200"
  }
};

const getStatusConfig = (status) => STATUS_MAP[status] || {
  label: status,
  icon: <FaHourglassHalf className="mr-2 text-gray-600" />,
  class: "bg-gray-100 text-gray-800 border-gray-200"
};

const Withdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [modalType, setModalType] = useState(""); // 'details', 'process', 'payment'
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const response = await axios.get('http://localhost:9000/withdrawals/admin/all');
        setWithdrawals(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawals();
  }, []);

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

  const openModal = (withdrawal, type) => {
    setSelectedWithdrawal(withdrawal);
    setModalType(type);
    setPaymentSuccess(false);
  };
  const closeModal = () => {
    setModalType("");
    setSelectedWithdrawal(null);
    setProcessingPayment(false);
    setPaymentSuccess(false);
  };

  const handleStatusUpdate = async (status) => {
    try {
      await axios.patch(`http://localhost:9000/withdrawals/${selectedWithdrawal._id}/status`, { status });
      setWithdrawals(withdrawals.map(w =>
        w._id === selectedWithdrawal._id ? { ...w, status } : w
      ));
      closeModal();
    } catch (err) {
      alert("Failed to update withdrawal status");
    }
  };

  const handlePaymentProcess = async () => {
    setProcessingPayment(true);
    try {
      // 1. Set status to 'processing'
      await axios.patch(`http://localhost:9000/withdrawals/${selectedWithdrawal._id}/status`, { status: 'processing' });
      setWithdrawals(withdrawals.map(w =>
        w._id === selectedWithdrawal._id ? { ...w, status: 'processing' } : w
      ));
      // 2. Process payment
      const paymentResponse = await axios.post('http://localhost:9000/withdrawals/process-payment', {
        withdrawalId: selectedWithdrawal._id,
        travelerEmail: selectedWithdrawal.travelerEmail,
        amount: selectedWithdrawal.amount,
        bankDetails: selectedWithdrawal.bankDetails
      });
      if (paymentResponse.data.success) {
        // 3. Set status to 'paid'
        await axios.patch(`http://localhost:9000/withdrawals/${selectedWithdrawal._id}/status`, { status: 'paid' });
        setWithdrawals(withdrawals.map(w =>
          w._id === selectedWithdrawal._id ? {
            ...w,
            status: 'paid',
            paidAt: new Date(),
            transactionId: paymentResponse.data.transactionId
          } : w
        ));
        setPaymentSuccess(true);
        setTimeout(() => closeModal(), 1800);
      }
    } catch (err) {
      // Revert
      await axios.patch(`http://localhost:9000/withdrawals/${selectedWithdrawal._id}/status`, { status: 'completed' });
      setWithdrawals(withdrawals.map(w =>
        w._id === selectedWithdrawal._id ? { ...w, status: 'completed' } : w
      ));
      alert("Payment failed");
    } finally {
      setProcessingPayment(false);
    }
  };

  // --- MODALS ---
  const ModalBase = ({ children, title, onClose, gradient }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.7, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className={`p-6 rounded-t-2xl ${gradient}`}>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-all duration-200"
              disabled={processingPayment}
            >
              <FaTimes />
            </motion.button>
          </div>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </motion.div>
  );

  const WithdrawalDetailsModal = () => {
    const w = selectedWithdrawal;
    if (!w) return null;
    return (
      <ModalBase
        title="Withdrawal Details"
        onClose={closeModal}
        gradient="bg-gradient-to-r from-[#009ee2] to-[#0085c3]"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
            <div className="flex items-center mb-3">
              <FaUser className="text-[#009ee2] mr-2" />
              <h3 className="font-semibold text-gray-800">Traveler Info</h3>
            </div>
            <p className="text-sm"><span className="font-medium">Traveler:</span> {w.travelerEmail}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
            <div className="flex items-center mb-3">
              <FaMoneyBillWave className="text-green-600 mr-2" />
              <h3 className="font-semibold text-gray-800">Amount</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">${parseFloat(w.amount).toFixed(2)}</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-100">
            <div className="flex items-center mb-3">
              <FaCalendarAlt className="text-orange-600 mr-2" />
              <h3 className="font-semibold text-gray-800">Timeline</h3>
            </div>
            <p className="text-sm"><span className="font-medium">Requested:</span> {formatDate(w.createdAt)}</p>
            {w.paidAt && <p className="text-sm"><span className="font-medium">Paid:</span> {formatDate(w.paidAt)}</p>}
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
            <div className="flex items-center mb-3">
              <FaCreditCard className="text-purple-600 mr-2" />
              <h3 className="font-semibold text-gray-800">Bank Details</h3>
            </div>
            <p className="text-sm"><span className="font-medium">Bank:</span> {w.bankDetails.bankName}</p>
            <p className="text-sm"><span className="font-medium">Account No:</span> {w.bankDetails.accountNumber}</p>
            <p className="text-sm"><span className="font-medium">Routing:</span> {w.bankDetails.routingNumber}</p>
            <p className="text-sm"><span className="font-medium">Holder:</span> {w.bankDetails.accountHolderName}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="flex items-center">
            {getStatusConfig(w.status).icon}
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusConfig(w.status).class}`}>
              {getStatusConfig(w.status).label}
            </span>
          </div>
          {w.transactionId && (
            <p className="text-sm ml-2">
              <span className="font-medium">Transaction ID:</span> {w.transactionId}
            </p>
          )}
        </div>
      </ModalBase>
    );
  };

  const ProcessWithdrawalModal = () => {
    const w = selectedWithdrawal;
    if (!w) return null;
    return (
      <ModalBase
        title="Process Withdrawal"
        onClose={closeModal}
        gradient="bg-gradient-to-r from-purple-600 to-pink-400"
      >
        <div className="mb-6">
          <p className="mb-2"><strong>Traveler:</strong> {w.travelerEmail}</p>
          <p className="mb-2"><strong>Amount:</strong> ${parseFloat(w.amount).toFixed(2)}</p>
          <p className="mb-2"><strong>Bank Name:</strong> {w.bankDetails.bankName}</p>
          <p className="mb-2"><strong>Account Number:</strong> {w.bankDetails.accountNumber}</p>
          <p className="mb-2"><strong>Routing Number:</strong> {w.bankDetails.routingNumber}</p>
          <p className="mb-2"><strong>Account Holder:</strong> {w.bankDetails.accountHolderName}</p>
        </div>
        <div className="flex flex-wrap gap-4 justify-end">
          <motion.button
            onClick={() => handleStatusUpdate('rejected')}
            className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaTimes className="inline mr-2" /> Reject
          </motion.button>
          <motion.button
            onClick={() => handleStatusUpdate('completed')}
            className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaCheck className="inline mr-2" /> Complete
          </motion.button>
        </div>
      </ModalBase>
    );
  };

  const PaymentModal = () => {
    const w = selectedWithdrawal;
    if (!w) return null;
    return (
      <ModalBase
        title="Process Payment"
        onClose={closeModal}
        gradient="bg-gradient-to-r from-green-500 to-blue-400"
      >
        {paymentSuccess ? (
          <div className="text-center py-8">
            <FaCheck className="text-green-500 text-6xl mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h3>
            <p className="text-gray-600">
              ${parseFloat(w.amount).toFixed(2)} has been transferred to {w.travelerEmail}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Payment Confirmation</h3>
              <p className="text-yellow-700 text-sm">
                This will transfer ${parseFloat(w.amount).toFixed(2)} to the traveler's bank account and deduct the amount from their platform balance. This action cannot be undone.
              </p>
            </div>
            <div className="mb-6 space-y-2">
              <p><strong>Traveler:</strong> {w.travelerEmail}</p>
              <p><strong>Amount:</strong> ${parseFloat(w.amount).toFixed(2)}</p>
              <p><strong>Bank:</strong> {w.bankDetails.bankName}</p>
              <p><strong>Account:</strong> {w.bankDetails.accountNumber}</p>
              <p><strong>Account Holder:</strong> {w.bankDetails.accountHolderName}</p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition duration-200"
                disabled={processingPayment}
              >
                Cancel
              </button>
              <motion.button
                onClick={handlePaymentProcess}
                disabled={processingPayment}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={!processingPayment ? { scale: 1.05 } : {}}
                whileTap={!processingPayment ? { scale: 0.95 } : {}}
              >
                {processingPayment ? (
                  <>
                    <FaSpinner className="inline mr-2 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <FaCreditCard className="inline mr-2" /> Transfer Money
                  </>
                )}
              </motion.button>
            </div>
          </>
        )}
      </ModalBase>
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
            Withdrawal Requests
          </h1>
          <p className="text-gray-600">Manage and process all withdrawal requests</p>
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
        ) : withdrawals.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white shadow-xl rounded-2xl p-12 text-center"
          >
            <FaReceipt className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-xl text-gray-600">No withdrawal requests found.</p>
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
                Withdrawal Records
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Traveler Email</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Bank Name</th>
                    {/* <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Account Number</th> */}
                    <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    {/* <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Request Date</th> */}
                    <th className="py-4 px-6 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {withdrawals.map((withdrawal, index) => {
                    const statusConfig = getStatusConfig(withdrawal.status);
                    return (
                      <motion.tr
                        key={withdrawal._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.07 }}
                        className="hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                      >
                        <td className="py-4 px-6">{withdrawal.travelerEmail}</td>
                        <td className="py-4 px-6 font-bold text-gray-900">${parseFloat(withdrawal.amount).toFixed(2)}</td>
                        <td className="py-4 px-6">{withdrawal.bankDetails.bankName}</td>
                        {/* <td className="py-4 px-6">{withdrawal.bankDetails.accountNumber}</td> */}
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
                        {/* <td className="py-4 px-6">{formatDate(withdrawal.createdAt)}</td> */}
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center space-x-2 justify-center">
                            <motion.button
                              onClick={() => openModal(withdrawal, "details")}
                              className="bg-[#009ee2] text-white p-2 rounded-lg hover:bg-[#0088c6] transition duration-200"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              title="View Details"
                            >
                              <FaEye />
                            </motion.button>
                            {withdrawal.status === "pending" && (
                              <motion.button
                                onClick={() => openModal(withdrawal, "process")}
                                className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                title="Process Withdrawal"
                              >
                                <FaMoneyBillWave />
                              </motion.button>
                            )}
                            {withdrawal.status === "completed" && (
                              <motion.button
                                onClick={() => openModal(withdrawal, "payment")}
                                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                title="Transfer Money"
                              >
                                <FaCreditCard />
                              </motion.button>
                            )}
                          </div>
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
        {modalType === "details" && <WithdrawalDetailsModal />}
        {modalType === "process" && <ProcessWithdrawalModal />}
        {modalType === "payment" && <PaymentModal />}
      </AnimatePresence>
    </div>
  );
};

export default Withdrawals;