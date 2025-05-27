// ProfileHeader.jsx
import { FaCheck, FaInfoCircle, FaTimes, FaCamera } from "react-icons/fa";

const ProfileHeader = ({ userData, onPhotoChange }) => {
  // Helper function to get status badge
  const getStatusBadge = () => {
    const status = userData.verificationStatus;
    
    if (status === "verified") {
      return (
        <div className="flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1 rounded-full">
          <FaCheck size={12} />
          <span>Verified</span>
        </div>
      );
    } else if (status === "pending") {
      return (
        <div className="flex items-center gap-1 text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">
          <FaInfoCircle size={12} />
          <span>Pending</span>
        </div>
      );
    } else if (status === "rejected") {
      return (
        <div className="flex items-center gap-1 text-red-600 bg-red-100 px-3 py-1 rounded-full">
          <FaTimes size={12} />
          <span>Rejected</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1 text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          <FaInfoCircle size={12} />
          <span>Unverified</span>
        </div>
      );
    }
  };

  // Get first name initial for avatar
  const getInitial = () => {
    if (!userData.name) return "?";
    return userData.name.charAt(0).toUpperCase();
  };

  return (
    <>
      {/* Header Background with enhanced gradient */}
      <div className="h-48 bg-gradient-to-br from-[#0088c6] via-[#009ee2] to-[#00b4ff] relative overflow-hidden">
        {/* Abstract pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-white" 
               style={{
                 backgroundImage: "radial-gradient(circle at 20px 20px, rgba(255,255,255,0.3) 2px, transparent 0)",
                 backgroundSize: "40px 40px"
               }}>
          </div>
        </div>
      </div>

      {/* Profile Image */}
      <div className="relative px-6">
        <div className="absolute -top-44 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <div className="w-40 h-40 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-[#009ee2] to-[#00b4ff] flex items-center justify-center">
              {userData.photo ? (
                <img
                  src={userData.photo}
                  alt={userData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-6xl font-bold text-white">
                  {getInitial()}
                </span>
              )}
            </div>
            
            {/* Photo upload button */}
            <label className="absolute bottom-2 right-2 bg-white text-[#009ee2] rounded-full p-3 border border-gray-200 shadow-md cursor-pointer hover:bg-gray-100 transition-colors">
              <FaCamera size={16} />
              <input 
                type="file"
                className="hidden"
                accept="image/*"
                onChange={onPhotoChange}
              />
            </label>
            
            {userData.verificationStatus === "verified" && (
              <div className="absolute bottom-2 left-2 bg-green-500 text-white rounded-full p-1.5 border-2 border-white shadow-md">
                <FaCheck size={14} />
              </div>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="mt-20 text-center">
          <h2 className="text-2xl font-bold text-gray-800">{userData.name}</h2>
          <p className="text-[#009ee2] font-medium capitalize mt-1">
            {userData.role}
          </p>
          <div className="flex justify-center mt-2">
            {getStatusBadge()}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;