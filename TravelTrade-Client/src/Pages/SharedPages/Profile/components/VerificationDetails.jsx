// VerificationDetails.jsx
import { 
    FaNetworkWired, 
    FaYandexInternational, 
    FaFacebook, 
    FaLinkedin, 
    FaOpenid 
  } from "react-icons/fa";
  import { CgProfile } from "react-icons/cg";
  
  const VerificationDetails = ({ verificationData }) => {
    return (
      <div className="mt-6 bg-white border border-gray-100 rounded-xl shadow-sm p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-4 border-b pb-2 flex items-center">
          <span className="bg-gradient-to-r from-[#009ee2] to-[#00b4ff] w-1 h-5 rounded mr-2"></span>
          Verification Details
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoItem 
              icon={<FaNetworkWired className="w-4 h-4 text-[#009ee2]" />}
              label="Occupation"
              value={verificationData.occupation}
            />
            
            <InfoItem 
              icon={<FaYandexInternational className="w-4 h-4 text-[#009ee2]" />}
              label="Nationality"
              value={verificationData.nationality}
            />
            
            {verificationData.facebook && (
              <InfoItem 
                icon={<FaFacebook className="w-4 h-4 text-[#009ee2]" />}
                label="Facebook"
                value={verificationData.facebook}
                isLink
              />
            )}
            
            {verificationData.linkedin && (
              <InfoItem 
                icon={<FaLinkedin className="w-4 h-4 text-[#009ee2]" />}
                label="LinkedIn"
                value={verificationData.linkedin}
                isLink
              />
            )}
          </div>
          
          <div className="mt-6 space-y-6">
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <div className="bg-gray-50 p-3 flex items-center">
                <CgProfile className="w-5 h-5 text-[#009ee2]" />
                <span className="ml-3 font-medium text-gray-700">Verification Photo</span>
              </div>
              <div className="p-3">
                <img 
                  src={verificationData.profilePhoto} 
                  alt="Verification" 
                  className="h-32 object-cover rounded-lg mx-auto hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <div className="bg-gray-50 p-3 flex items-center">
                <FaOpenid className="w-5 h-5 text-[#009ee2]" />
                <span className="ml-3 font-medium text-gray-700">ID Verification</span>
              </div>
              <div className="p-3">
                <img 
                  src={verificationData.nidPhoto} 
                  alt="ID" 
                  className="h-32 object-cover rounded-lg mx-auto hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Helper component for info items
  const InfoItem = ({ icon, label, value, isLink = false }) => {
    return (
      <div className="flex items-center text-gray-700 hover:bg-gray-50 p-2 rounded-lg transition-all duration-300">
        <div className="flex items-center justify-center min-w-10 h-10 rounded-full bg-[#e7f4f6]">
          {icon}
        </div>
        <div className="ml-3">
          <span className="text-xs text-gray-500">{label}</span>
          {isLink ? (
            <a 
              href={value} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="block text-blue-600 hover:underline truncate max-w-56"
            >
              {value}
            </a>
          ) : (
            <p className="font-medium text-gray-800">{value}</p>
          )}
        </div>
      </div>
    );
  };
  
  export default VerificationDetails;