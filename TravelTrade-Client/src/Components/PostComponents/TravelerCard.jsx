import VerificationBadge from '../PostComponents/VerificationBadge';
import ReviewsSection from '../PostComponents/ReviewsSection';

const TravelerCard = ({ traveler, onRequestClick }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col">
      <div className="bg-[#009ee2] p-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Traveler Information
        </h2>
      </div>
      
      <div className="p-6 flex flex-col items-center flex-grow">
        {traveler?.photo ? (
          <img
            src={traveler.photo}
            alt="User"
            className="w-32 h-32 rounded-full object-cover mb-6 border-4 border-white shadow-lg"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200 mb-6 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
        
        <h2 className="text-2xl font-semibold text-[#009ee2] mb-2">
          {traveler.name || "User Name"}
        </h2>
        
        <div className="w-full space-y-3 mt-4">
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <span className="text-gray-600">Email:</span>
            <span className="font-medium text-gray-800">{traveler.email || "N/A"}</span>
          </div>
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <span className="text-gray-600">Mobile:</span>
            <span className="font-medium text-gray-800">{traveler.mobile || "N/A"}</span>
          </div>
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <span className="text-gray-600">Role:</span>
            <span className="font-medium text-gray-800 capitalize">{traveler.role || "N/A"}</span>
          </div>
        </div>
        
        <VerificationBadge traveler={traveler} />
        
        {/* Reviews Section */}
        <ReviewsSection reviews={traveler.reviews} />
      </div>
      
      <div className="p-6 mt-auto">
        <button
          onClick={onRequestClick}
          className="w-full bg-[#009ee2] hover:bg-blue-700 transition px-6 py-3 rounded-lg text-white text-lg font-semibold shadow-md flex items-center justify-center"
        >
          <span>Make a Request</span>
        </button>
      </div>
    </div>
  );
};

export default TravelerCard;