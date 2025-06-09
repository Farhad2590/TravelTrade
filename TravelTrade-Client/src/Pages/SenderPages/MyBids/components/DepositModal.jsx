import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const DepositModal = ({ order, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    setLoading(true);
    setError("");
    
    try {
      const response = await axios.post(`http://localhost:9000/initiate`, {
        orderId: order._id,
        amount: order.totalCost,
        email: order.senderEmail,
        travelerEmail: order.travelerEmail,
      });

      if (response.data.success && response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      } else {
        throw new Error("Payment URL not received");
      }
    } catch (err) {
      console.error("Payment initiation error:", err);
      setError(err.response?.data?.error || "Failed to initiate payment");
      toast.error("Payment initiation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#68b5c2]">
            Make Payment via SSLCommerz
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <div className="mb-4">
          <p className="font-semibold">Order Summary:</p>
          <p>Parcel Type: {order.parcel_type}</p>
          <p>Weight: {order.parcel_weight_kg} kg</p>
          <p>
            From: {order.departureCity} to {order.arrivalCity}
          </p>
          <p>Travel Date: {order.travelDate}</p>
          <p className="font-bold mt-2">Total Amount: ${order.totalCost}</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handlePayment}
            className="w-full bg-[#68b5c2] text-white font-bold py-3 rounded-md hover:bg-[#56a3af] transition disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Processing..." : `Pay $${order.totalCost}`}
          </button>
          
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          
          <p className="text-sm text-gray-500">
            You will be redirected to SSLCommerz secure payment page to complete your transaction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;