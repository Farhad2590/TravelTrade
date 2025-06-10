import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  FaCheck, 
  FaTimes, 
  FaHourglassHalf, 
  FaEye,
  FaMoneyBillWave,
  FaCreditCard,
  FaSpinner
} from "react-icons/fa";

const Withdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
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

  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "paid":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <FaCheck className="mr-2" />;
      case "rejected":
        return <FaTimes className="mr-2" />;
      case "paid":
        return <FaCreditCard className="mr-2" />;
      case "processing":
        return <FaSpinner className="mr-2 animate-spin" />;
      default:
        return <FaHourglassHalf className="mr-2" />;
    }
  };

  const handleViewDetails = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowDetailsModal(true);
  };

  const handleProcessClick = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowProcessModal(true);
  };

  const handlePaymentClick = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowPaymentModal(true);
    setPaymentSuccess(false);
  };

  const handleStatusUpdate = async (status) => {
    try {
      await axios.patch(`http://localhost:9000/withdrawals/${selectedWithdrawal._id}/status`, { status });
      
      // Update local state
      setWithdrawals(withdrawals.map(w => 
        w._id === selectedWithdrawal._id ? { ...w, status } : w
      ));
      
      console.log(`Withdrawal ${status} successfully`);
      setShowProcessModal(false);
    } catch (err) {
      console.error('Failed to update withdrawal status', err);
    }
  };

  const handlePaymentProcess = async () => {
    setProcessingPayment(true);
    try {
      // Step 1: Update withdrawal status to processing
      await axios.patch(`http://localhost:9000/withdrawals/${selectedWithdrawal._id}/status`, { 
        status: 'processing' 
      });

      // Update local state immediately
      setWithdrawals(withdrawals.map(w => 
        w._id === selectedWithdrawal._id ? { ...w, status: 'processing' } : w
      ));

      // Step 2: Process payment and deduct from traveler balance
      const paymentResponse = await axios.post('http://localhost:9000/withdrawals/process-payment', {
        withdrawalId: selectedWithdrawal._id,
        travelerEmail: selectedWithdrawal.travelerEmail,
        amount: selectedWithdrawal.amount,
        bankDetails: selectedWithdrawal.bankDetails
      });

      if (paymentResponse.data.success) {
        // Step 3: Update withdrawal status to paid
        await axios.patch(`http://localhost:9000/withdrawals/${selectedWithdrawal._id}/status`, { 
          status: 'paid' 
        });

        // Update local state
        setWithdrawals(withdrawals.map(w => 
          w._id === selectedWithdrawal._id ? { 
            ...w, 
            status: 'paid',
            paidAt: new Date(),
            transactionId: paymentResponse.data.transactionId
          } : w
        ));

        setPaymentSuccess(true);
        setTimeout(() => {
          setShowPaymentModal(false);
          setPaymentSuccess(false);
        }, 2000);
      }
    } catch (err) {
      console.error('Payment processing failed:', err);
      // Revert status back to completed if payment fails
      await axios.patch(`http://localhost:9000/withdrawals/${selectedWithdrawal._id}/status`, { 
        status: 'completed' 
      });
      setWithdrawals(withdrawals.map(w => 
        w._id === selectedWithdrawal._id ? { ...w, status: 'completed' } : w
      ));
    } finally {
      setProcessingPayment(false);
    }
  };

  const WithdrawalDetailsModal = ({ withdrawal, onClose }) => {
    if (!withdrawal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#009ee2]">Withdrawal Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600 mb-1">Traveler Email</p>
              <p className="font-semibold">{withdrawal.travelerEmail}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Amount</p>
              <p className="font-semibold">${parseFloat(withdrawal.amount).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Status</p>
              <div className="flex items-center">
                {getStatusIcon(withdrawal.status)}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(withdrawal.status)}`}>
                  {withdrawal.status}
                </span>
              </div>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Request Date</p>
              <p className="font-semibold">{formatDate(withdrawal.createdAt)}</p>
            </div>
            {withdrawal.paidAt && (
              <div>
                <p className="text-gray-600 mb-1">Paid Date</p>
                <p className="font-semibold">{formatDate(withdrawal.paidAt)}</p>
              </div>
            )}
            {withdrawal.transactionId && (
              <div>
                <p className="text-gray-600 mb-1">Transaction ID</p>
                <p className="font-semibold">{withdrawal.transactionId}</p>
              </div>
            )}
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Bank Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 mb-1">Bank Name</p>
                <p className="font-semibold">{withdrawal.bankDetails.bankName}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Account Number</p>
                <p className="font-semibold">{withdrawal.bankDetails.accountNumber}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Routing Number</p>
                <p className="font-semibold">{withdrawal.bankDetails.routingNumber}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Account Holder</p>
                <p className="font-semibold">{withdrawal.bankDetails.accountHolderName}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-6 rounded-lg transition duration-200"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  const ProcessWithdrawalModal = ({ withdrawal, onClose }) => {
    if (!withdrawal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full mx-4"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#009ee2]">Process Withdrawal</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>

          <div className="mb-6">
            <p><strong>Traveler:</strong> {withdrawal.travelerEmail}</p>
            <p className="mt-2"><strong>Amount:</strong> ${parseFloat(withdrawal.amount).toFixed(2)}</p>
            <p className="mt-2"><strong>Bank Name:</strong> {withdrawal.bankDetails.bankName}</p>
            <p className="mt-2"><strong>Account Number:</strong> {withdrawal.bankDetails.accountNumber}</p>
            <p className="mt-2"><strong>Routing Number:</strong> {withdrawal.bankDetails.routingNumber}</p>
            <p className="mt-2"><strong>Account Holder:</strong> {withdrawal.bankDetails.accountHolderName}</p>
          </div>

          <div className="flex flex-wrap justify-end space-x-4">
            <motion.button
              onClick={() => handleStatusUpdate('rejected')}
              className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaTimes className="inline mr-2" />
              Reject
            </motion.button>
            <motion.button
              onClick={() => handleStatusUpdate('completed')}
              className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaCheck className="inline mr-2" />
              Complete
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  };

  const PaymentModal = ({ withdrawal, onClose }) => {
    if (!withdrawal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-2xl p-6 max-w-lg w-full mx-4"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#009ee2]">Process Payment</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
              disabled={processingPayment}
            >
              ×
            </button>
          </div>

          {paymentSuccess ? (
            <div className="text-center py-8">
              <FaCheck className="text-green-500 text-6xl mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h3>
              <p className="text-gray-600">
                ${parseFloat(withdrawal.amount).toFixed(2)} has been transferred to {withdrawal.travelerEmail}
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Payment Confirmation</h3>
                <p className="text-yellow-700 text-sm">
                  This action will transfer ${parseFloat(withdrawal.amount).toFixed(2)} to the traveler's bank account 
                  and deduct the amount from their platform balance. This action cannot be undone.
                </p>
              </div>

              <div className="mb-6 space-y-2">
                <p><strong>Traveler:</strong> {withdrawal.travelerEmail}</p>
                <p><strong>Amount:</strong> ${parseFloat(withdrawal.amount).toFixed(2)}</p>
                <p><strong>Bank:</strong> {withdrawal.bankDetails.bankName}</p>
                <p><strong>Account:</strong> {withdrawal.bankDetails.accountNumber}</p>
                <p><strong>Account Holder:</strong> {withdrawal.bankDetails.accountHolderName}</p>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={onClose}
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
                      <FaSpinner className="inline mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaCreditCard className="inline mr-2" />
                      Transfer Money
                    </>
                  )}
                </motion.button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    );
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
          Withdrawal Requests
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#009ee2]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl shadow-md">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="bg-white shadow-xl rounded-xl p-8 text-center">
            <p className="text-lg text-gray-600">No withdrawal requests found.</p>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-[#009ee2] text-white">
                  <tr>
                    <th className="py-4 px-6 text-left">Traveler Email</th>
                    <th className="py-4 px-6 text-left">Amount</th>
                    <th className="py-4 px-6 text-left">Bank Name</th>
                    <th className="py-4 px-6 text-left">Account Number</th>
                    <th className="py-4 px-6 text-left">Status</th>
                    <th className="py-4 px-6 text-left">Request Date</th>
                    <th className="py-4 px-6 text-left">Actions</th>
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
                      <td className="py-4 px-6">{withdrawal.travelerEmail}</td>
                      <td className="py-4 px-6">${parseFloat(withdrawal.amount).toFixed(2)}</td>
                      <td className="py-4 px-6">{withdrawal.bankDetails.bankName}</td>
                      <td className="py-4 px-6">{withdrawal.bankDetails.accountNumber}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          {getStatusIcon(withdrawal.status)}
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                              withdrawal.status
                            )}`}
                          >
                            {withdrawal.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">{formatDate(withdrawal.createdAt)}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <motion.button
                            onClick={() => handleViewDetails(withdrawal)}
                            className="bg-[#009ee2] text-white p-2 rounded-lg hover:bg-[#0088c6] transition duration-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            title="View Details"
                          >
                            <FaEye />
                          </motion.button>
                          
                          {withdrawal.status === "pending" && (
                            <motion.button
                              onClick={() => handleProcessClick(withdrawal)}
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
                              onClick={() => handlePaymentClick(withdrawal)}
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>

      {showDetailsModal && (
        <WithdrawalDetailsModal 
          withdrawal={selectedWithdrawal} 
          onClose={() => setShowDetailsModal(false)} 
        />
      )}

      {showProcessModal && (
        <ProcessWithdrawalModal 
          withdrawal={selectedWithdrawal} 
          onClose={() => setShowProcessModal(false)} 
        />
      )}

      {showPaymentModal && (
        <PaymentModal 
          withdrawal={selectedWithdrawal} 
          onClose={() => setShowPaymentModal(false)} 
        />
      )}
    </div>
  );
};

export default Withdrawals;