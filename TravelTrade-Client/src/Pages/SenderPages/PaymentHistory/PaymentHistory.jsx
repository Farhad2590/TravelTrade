import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import useAuth from "../../../hooks/useAuth";
import { FaCheck, FaHourglassHalf, FaReceipt } from "react-icons/fa";

const PaymentHistory = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const api = "http://localhost:9000";

  useEffect(() => {
    if (user?.email) {
      fetchPaymentHistory();
    }
  }, [user]);

  const fetchPaymentHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${api}/payments/history/${user.email}`);
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
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
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
      case "pending":
      case "processing":
        return <FaHourglassHalf className="mr-2" />;
      default:
        return <FaReceipt className="mr-2" />;
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
          Payment History
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
        ) : payments.length === 0 ? (
          <div className="bg-white shadow-xl rounded-xl p-8 text-center">
            <p className="text-lg text-gray-600">No payment history found.</p>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-[#009ee2] text-white">
                  <tr>
                    <th className="py-4 px-6 text-left">Order ID</th>
                    <th className="py-4 px-6 text-left">Amount</th>
                    <th className="py-4 px-6 text-left">Payment Date</th>
                    <th className="py-4 px-6 text-left">Status</th>
                    <th className="py-4 px-6 text-left">Payment Method</th>
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
                      <td className="py-4 px-6">{payment.orderId}</td>
                      <td className="py-4 px-6">${parseFloat(payment.amount).toFixed(2)}</td>
                      <td className="py-4 px-6">{formatDate(payment.createdAt)}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          {getStatusIcon(payment.status)}
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                              payment.status
                            )}`}
                          >
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {payment.paymentMethod || "Credit Card"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentHistory;