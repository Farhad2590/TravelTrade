// components/PostStatusBadge.jsx
import { FaCheck, FaTimes, FaHourglassHalf } from "react-icons/fa";

const PostStatusBadge = ({ status }) => {
  const getStatusClass = (status) => {
    switch(status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "pending":
        return <FaHourglassHalf className="mr-2" />;
      case "approved":
        return <FaCheck className="mr-2" />;
      case "rejected":
        return <FaTimes className="mr-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center">
      {getStatusIcon(status)}
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(status)}`}>
        {status}
      </span>
    </div>
  );
};

export default PostStatusBadge;