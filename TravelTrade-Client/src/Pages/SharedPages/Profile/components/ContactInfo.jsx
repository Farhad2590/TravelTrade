// ContactInfo.jsx
import { FaMailchimp } from "react-icons/fa6";
import { FaPhoneAlt, FaCalendar } from "react-icons/fa";

const ContactInfo = ({ userData }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="mt-6 space-y-3 bg-gradient-to-r from-gray-50 to-blue-50 p-5 rounded-xl shadow-sm border border-gray-100">
      <h3 className="font-semibold text-gray-700 mb-3 border-b border-gray-200 pb-2">Contact Information</h3>
      
      <div className="flex items-center text-gray-700 group hover:bg-white hover:shadow-sm p-2 rounded-lg transition-all duration-300">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#e7f4f6] text-[#009ee2]">
          <FaMailchimp className="w-4 h-4" />
        </div>
        <span className="ml-3 text-sm">{userData.email}</span>
      </div>
      
      <div className="flex items-center text-gray-700 group hover:bg-white hover:shadow-sm p-2 rounded-lg transition-all duration-300">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#e7f4f6] text-[#009ee2]">
          <FaPhoneAlt className="w-3 h-3" />
        </div>
        <span className="ml-3 text-sm">{userData.mobile || "Not provided"}</span>
      </div>
      
      <div className="flex items-center text-gray-700 group hover:bg-white hover:shadow-sm p-2 rounded-lg transition-all duration-300">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#e7f4f6] text-[#009ee2]">
          <FaCalendar className="w-4 h-4" />
        </div>
        <span className="ml-3 text-sm">
          Joined on {formatDate(userData.createdAt)}
        </span>
      </div>
    </div>
  );
};

export default ContactInfo;