import { FaStar, FaRegStar, FaUser } from "react-icons/fa";
import { useState } from "react";

const ReviewsSection = ({ reviews }) => {
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // Don't render anything if no reviews
  if (!reviews || reviews.length === 0) {
    return null;
  }

  // Calculate average rating
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? (
          <FaStar key={i} className="text-white" />
        ) : (
          <FaRegStar key={i} className="text-white opacity-50" />
        )
      );
    }
    return stars;
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const currentReview = reviews[currentReviewIndex];

  return (
    <div className="w-full mt-6">
      <div className="bg-[#009ee2] p-4 rounded-t-lg">
        <div className="flex items-center justify-between text-white">
          <h3 className="text-lg font-semibold">Reviews</h3>
          <div className="flex items-center space-x-2">
            <div className="flex">
              {renderStars(Math.round(averageRating))}
            </div>
            <span className="text-sm">({reviews.length})</span>
          </div>
        </div>
        <div className="text-white text-sm mt-1">
          Average: {averageRating.toFixed(1)}/5
        </div>
      </div>
      
      <div className="bg-white border-2 border-t-0 border-[#009ee2] rounded-b-lg">
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <FaUser className="text-[#009ee2] text-sm" />
              <span className="text-sm font-medium text-[#009ee2]">
                {currentReview.reviewerEmail}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              {renderStars(currentReview.rating).map((star, index) => (
                <span key={index} className="text-[#009ee2]">
                  {star}
                </span>
              ))}
            </div>
          </div>
          
          {currentReview.parcel_type && (
            <div className="mb-2">
              <span className="inline-block bg-[#009ee2] text-white text-xs px-2 py-1 rounded-full">
                {currentReview.parcel_type}
              </span>
            </div>
          )}
          
          <p className="text-[#009ee2] text-sm mb-2 leading-relaxed">
            {currentReview.comment}
          </p>
          
          <div className="text-xs text-[#009ee2] opacity-70">
            {formatDate(currentReview.createdAt)}
          </div>
        </div>

        {/* Slider Controls */}
        {reviews.length > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-[#009ee2] border-opacity-20">
            <button
              onClick={prevReview}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#009ee2] text-white hover:bg-[#007bb8] transition-colors"
            >
              ❮
            </button>
            
            <div className="flex space-x-2">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentReviewIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentReviewIndex ? 'bg-[#009ee2]' : 'bg-[#009ee2] opacity-30'
                  }`}
                />
              ))}
            </div>
            
            <button
              onClick={nextReview}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-[#009ee2] text-white hover:bg-[#007bb8] transition-colors"
            >
              ❯
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;