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
  }, []);

  const fetchGivenReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:9000/users/reviews/given/${user?.email}`);
    //   console.log(response);
      
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

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Reviews You've Given
        </h2>

        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              You haven't given any reviews yet
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Reviews you give to travelers will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-6 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      {review.reviewedUserPhoto ? (
                        <img
                          src={review.reviewedUserPhoto}
                          alt={review.reviewedUserName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Review for {review.reviewedUserName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {review.reviewedUserEmail}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {renderStars(review.rating)}
                    <span className="text-sm text-gray-600 ml-2">
                      {review.rating}/5
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">
                    {review.comment}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Package className="w-4 h-4" />
                      <span>{review.parcel_type}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GivenReviews;
