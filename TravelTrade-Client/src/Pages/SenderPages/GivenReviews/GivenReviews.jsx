import React, { useState, useEffect } from "react";
import { Star, Calendar, Package, User } from "lucide-react";
import useAuth from "../../../hooks/useAuth";

const GivenReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchGivenReviews();
    // eslint-disable-next-line
  }, []);

  const fetchGivenReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:9000/users/reviews/given/${user?.email}`);
      const data = await response.json();
      if (response.ok) {
        setReviews(data.reviews || []);
      } else {
        setError(data.error || "Failed to fetch reviews");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => (
    <div className="flex items-center">
      {Array.from({ length: 5 }, (_, idx) => (
        <Star key={idx} className={`w-4 h-4 ${idx < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
      ))}
    </div>
  );

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-r from-[#009ee2] to-[#0085c3] rounded-xl shadow-xl px-8 py-6 mb-8 text-white">
          <h2 className="text-3xl font-bold">Reviews You’ve Given</h2>
          <p className="text-blue-100 mt-2">All your posted reviews, visible to travelers and senders</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">You haven’t given any reviews yet</p>
              <p className="text-gray-400 text-sm mt-2">Reviews you give to travelers will appear here</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 shadow p-6"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                      {review.reviewedUserPhoto ? (
                        <img
                          src={review.reviewedUserPhoto}
                          alt={review.reviewedUserName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {review.reviewedUserName}
                      </h3>
                      <p className="text-xs text-gray-500">{review.reviewedUserEmail}</p>
                    </div>
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-blue-600 font-bold text-lg">{review.rating}/5</span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{review.comment}</p>
                  <div className="flex items-center gap-8 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      {review.parcel_type}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(review.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GivenReviews;