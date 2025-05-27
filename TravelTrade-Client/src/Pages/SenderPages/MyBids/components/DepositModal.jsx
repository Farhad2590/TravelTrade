import { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import axios from "axios";
import toast from "react-hot-toast";

const DepositModal = ({ order, onClose, onSuccess }) => {
  const [error, setError] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const amount = order.totalCost;

  useEffect(() => {
    if (amount > 0) {
      axios
        .post(`http://localhost:9000/intent`, { amount })
        .then((res) => {
          setClientSecret(res.data.clientSecret);
        })
        .catch((err) => {
          toast.error("Failed to create payment intent");
          console.error(err);
        });
    }
  }, [amount]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      const cardNumber = elements.getElement(CardNumberElement);
      if (!cardNumber) return;

      // Step 1: Create payment method
      const { error: paymentError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: "card",
          card: cardNumber,
        });

      if (paymentError) throw new Error(paymentError.message);

      // Step 2: Confirm payment
      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: paymentMethod.id,
        });

      if (confirmError) throw new Error(confirmError.message);

      setPaymentIntentId(paymentIntent.id);

      // Record payment
      await axios.post(`http://localhost:9000/payments`, {
        travelerEmail: order.travelerEmail,
        senderEmail: order.senderEmail,
        orderId: order._id,
        paymentIntentId: paymentIntent.id,
        amount: order.totalCost,
        status: "completed",
      });

      toast.success("Payment successful! Your deposit has been processed.");
      onSuccess(order._id); // Pass order ID to onSuccess
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.message);
      toast.error(err.message || "Payment failed");

      try {
        await axios.patch(`http://localhost:9000/bids/${order._id}/updateStatus`, {
          status: "payment_failed",
        });
      } catch (updateError) {
        console.error("Failed to update order status:", updateError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#68b5c2]">
            Make Deposit Payment
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Card Number
            </label>
            <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-[#68b5c2]">
              <CardNumberElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": { color: "#aab7c4" },
                    },
                    invalid: { color: "#9e2146" },
                  },
                }}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Expiration Date
              </label>
              <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-[#68b5c2]">
                <CardExpiryElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": { color: "#aab7c4" },
                      },
                      invalid: { color: "#9e2146" },
                    },
                  }}
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                CVC
              </label>
              <div className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-[#68b5c2]">
                <CardCvcElement
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": { color: "#aab7c4" },
                      },
                      invalid: { color: "#9e2146" },
                    },
                  }}
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-[#68b5c2] text-white font-bold py-3 rounded-md hover:bg-[#56a3af] transition disabled:bg-gray-400"
            disabled={!stripe || !clientSecret || loading}
          >
            {loading ? "Processing..." : `Pay $${amount}`}
          </button>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          {paymentIntentId && (
            <p className="text-green-600 text-sm mt-2">
              Payment successful! Transaction ID: {paymentIntentId}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default DepositModal;