import { useState } from "react";
import { motion } from "framer-motion";
import { FaStar, FaTimes } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";

const ReviewModal = ({ order, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const api = "http://localhost:9000";
  const { user } = useAuth();

  console.log(order);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (rating === 0) {
      toast.error("Please select a rating");
      setIsSubmitting(false);
      return;
    }

    try {
      const reviewData = {
        rating,
        comment,
        parcel_type: order.parcel_type,
        createdAt: new Date().toISOString(),
        reviewerEmail: user.email,
      };

      // First submit to the reviews collection
      await onSubmit(reviewData);

      // Then add to the user's review array
      await axios.post(
        `${api}/users/review/${order.travelerEmail}`,
        reviewData
      ); // Send just the reviewData

      toast.success("Review submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md"
      >
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Leave a Review
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-1">Order Details</h4>
            <p className="text-gray-600">
              {order.parcel_name || order.parcel_type} - $
              {order.price_offer || order.totalCost}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Your Rating
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl ${
                      star <= rating ? "text-yellow-500" : "text-gray-300"
                    }`}
                  >
                    <FaStar />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="comment"
                className="block text-gray-700 font-medium mb-2"
              >
                Review Comment
              </label>
              <textarea
                id="comment"
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Share your experience with this order..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ReviewModal;
