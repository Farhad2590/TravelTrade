import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  FaCheck, 
  FaHourglassHalf, 
  FaEye, 
  FaFileInvoiceDollar 
} from "react-icons/fa";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get('http://localhost:9000/payments/admin');
        console.log(response);
        
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
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <FaCheck className="mr-2" />;
      case "pending":
      case "processing":
        return <FaHourglassHalf className="mr-2" />;
      default:
        return <FaFileInvoiceDollar className="mr-2" />;
    }
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  };

  const PaymentDetailsModal = ({ payment, onClose }) => {
    if (!payment) return null;

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
            <h2 className="text-2xl font-bold text-[#009ee2]">Payment Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600 mb-1">Order ID</p>
              <p className="font-semibold">{payment.orderId}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Amount</p>
              <p className="font-semibold">${parseFloat(payment.amount).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Sender</p>
              <p className="font-semibold">{payment.senderName}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Traveler</p>
              <p className="font-semibold">{payment.travelerName}</p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Status</p>
              <div className="flex items-center">
                {getStatusIcon(payment.status)}
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(payment.status)}`}>
                  {payment.status}
                </span>
              </div>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Date</p>
              <p className="font-semibold">{formatDate(payment.createdAt)}</p>
            </div>
          </div>

          {payment.bidDetails && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Parcel Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 mb-1">Parcel Type</p>
                  <p className="font-semibold">{payment.bidDetails.parcel_type}</p>
                </div>
                {payment.bidDetails.parcel_weight_kg && (
                  <div>
                    <p className="text-gray-600 mb-1">Weight</p>
                    <p className="font-semibold">{payment.bidDetails.parcel_weight_kg} kg</p>
                  </div>
                )}
                {payment.bidDetails.from_city && payment.bidDetails.to_city && (
                  <div className="col-span-2">
                    <p className="text-gray-600 mb-1">Route</p>
                    <p className="font-semibold">
                      {payment.bidDetails.from_city} → {payment.bidDetails.to_city}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

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

  return (
    <div className="p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto"
      >
        <h1 className="text-3xl font-bold text-center text-[#009ee2] mb-8">
          All Payments
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
        ) : payments.length === 0 ? (
          <div className="bg-white shadow-xl rounded-xl p-8 text-center">
            <p className="text-lg text-gray-600">No payments found.</p>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-[#009ee2] text-white">
                  <tr>
                    <th className="py-4 px-6 text-left">Order ID</th>
                    <th className="py-4 px-6 text-left">Sender</th>
                    <th className="py-4 px-6 text-left">Traveler</th>
                    <th className="py-4 px-6 text-left">Amount</th>
                    <th className="py-4 px-6 text-left">Parcel Type</th>
                    <th className="py-4 px-6 text-left">Status</th>
                    <th className="py-4 px-6 text-left">Date</th>
                    <th className="py-4 px-6 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, index) => (
                    <tr
                      key={payment._id}
                      className={`border-b border-gray-200 hover:bg-blue-50 transition duration-150 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="py-4 px-6 truncate max-w-[150px]">{payment.orderId}</td>
                      <td className="py-4 px-6">{payment.senderName}</td>
                      <td className="py-4 px-6">{payment.travelerName}</td>
                      <td className="py-4 px-6">${parseFloat(payment.amount).toFixed(2)}</td>
                      <td className="py-4 px-6">{payment.bidDetails?.parcel_type || "N/A"}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          {getStatusIcon(payment.status)}
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                              payment.status
                            )}`}
                          >
                            {payment.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">{formatDate(payment.createdAt)}</td>
                      <td className="py-4 px-6">
                        <motion.button
                          onClick={() => handleViewDetails(payment)}
                          className="bg-[#009ee2] text-white p-2 rounded-lg hover:bg-[#0088c6] transition duration-200"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          title="View Details"
                        >
                          <FaEye />
                        </motion.button>
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
        <PaymentDetailsModal 
          payment={selectedPayment} 
          onClose={() => setShowDetailsModal(false)} 
        />
      )}
    </div>
  );
};

export default Payments;