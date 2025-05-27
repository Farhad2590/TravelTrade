// VerificationButton.jsx
import { FaShieldAlt, FaRedo, FaHourglassHalf } from "react-icons/fa";

const VerificationButton = ({ status, onRequestVerification }) => {
  const getButtonConfig = () => {
    switch (status) {
      case "pending":
        return {
          text: "Verification In Progress",
          icon: <FaHourglassHalf className="mr-2" />,
          className: "bg-yellow-500 hover:bg-yellow-600 cursor-not-allowed opacity-80",
          disabled: true
        };
      case "rejected":
        return {
          text: "Reapply For Verification",
          icon: <FaRedo className="mr-2" />,
          className: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
          disabled: false
        };
      default:
        return {
          text: "Get Verified",
          icon: <FaShieldAlt className="mr-2" />,
          className: "bg-gradient-to-r from-[#009ee2] to-[#00b4ff] hover:from-[#0088c6] hover:to-[#009ee2]",
          disabled: false
        };
    }
  };

  const buttonConfig = getButtonConfig();

  return (
    <div className="px-6 pb-6">
      <button
        disabled={buttonConfig.disabled}
        onClick={onRequestVerification}
        className={`w-full text-white rounded-lg px-4 py-3 text-center font-semibold transition duration-300 ease-in-out flex items-center justify-center ${buttonConfig.className}`}
      >
        {buttonConfig.icon}
        {buttonConfig.text}
      </button>
      
      {status === "rejected" && (
        <div className="mt-3 bg-red-50 border border-red-100 rounded-lg p-3">
          <p className="text-sm text-red-600 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Your previous verification request was rejected. Please reapply with correct information.
          </p>
        </div>
      )}
    </div>
  );
};

export default VerificationButton;