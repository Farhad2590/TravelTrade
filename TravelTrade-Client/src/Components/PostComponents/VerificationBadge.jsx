
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";

const VerificationBadge = ({ traveler }) => {
  if (!traveler.verificationStatus) return null;
  
  if (traveler.verificationStatus === "pending") {
    return (
      <div className="flex items-center mt-4 bg-yellow-100 px-4 py-2 rounded-lg w-full">
        <FaHourglassHalf className="text-yellow-500 mr-2" />
        <p className="text-yellow-700">Traveler Not Verified</p>
      </div>
    );
  } 
  
  if (traveler.verificationStatus === "verified") {
    return (
      <div className="flex flex-col mt-4 w-full">
        <div className="flex items-center bg-green-100 px-4 py-2 rounded-t-lg">
          <FaCheckCircle className="text-[#009ee2] mr-2" />
          <p className="text-[#009ee2] font-medium">Verified Traveler</p>
        </div>
        {traveler.verificationData && (
          <div className="bg-[#f0faff] p-4 rounded-b-lg border-t-2 border-[#009ee2]">
            <h3 className="text-lg font-semibold text-[#009ee2] mb-3">Verification Information</h3>
            <div className="grid grid-cols-1 gap-3">
              <p><span className="font-medium">Full Name:</span> {traveler.verificationData.fullName}</p>
              <p><span className="font-medium">Nationality:</span> {traveler.verificationData.nationality}</p>
              <p><span className="font-medium">Occupation:</span> {traveler.verificationData.occupation}</p>
              <p><span className="font-medium">Phone:</span> {traveler.verificationData.phone}</p>
            </div>
          </div>
        )}
      </div>
    );
  } 
  
  if (traveler.verificationStatus === "rejected") {
    return (
      <div className="flex items-center mt-4 bg-red-100 px-4 py-2 rounded-lg w-full">
        <FaTimesCircle className="text-red-500 mr-2" />
        <p className="text-red-700">Verification Rejected</p>
      </div>
    );
  }
  
  return null;
};

export default VerificationBadge;