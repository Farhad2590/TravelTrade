import { motion } from "framer-motion";
import {
  FaPlane,
  FaWeight,
  FaTruck,
  FaPhone,
  FaClock,
  FaTimes,
  FaCheck,
  FaHourglassHalf,
  FaGlobeAmericas,
  FaMoneyBillWave,
  FaBoxes,
} from "react-icons/fa";

const PostDetailModal = ({ post, onClose }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
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
    switch (status) {
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

  if (!post) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] relative overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#009ee2] text-white p-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-2xl font-semibold">Trip Details</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition duration-200 text-2xl"
          >
            <FaTimes />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-64px)] space-y-6">
          {/* Category */}
          {post.category && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <FaGlobeAmericas className="text-[#009ee2] text-xl mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-[#009ee2]">
                    Trip Category
                  </h3>
                  <p className="text-[#009ee2] capitalize">{post.category}</p>
                </div>
              </div>
            </div>
          )}

          {/* Departure Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start">
              <FaPlane className="text-[#009ee2] text-xl mr-3 mt-1 transform rotate-45" />
              <div>
                <h3 className="text-lg font-semibold text-[#009ee2]">
                  Departure Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <span className="text-gray-600 font-medium">City:</span>
                    <p className="text-[#009ee2]">{post.departureCity}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Airport:</span>
                    <p className="text-[#009ee2]">{post.departureAirport}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-600 font-medium">
                      Date & Time:
                    </span>
                    <p className="text-[#009ee2]">
                      {formatDate(post.departureDateTime)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Arrival Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start">
              <FaPlane className="text-[#009ee2] text-xl mr-3 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-[#009ee2]">
                  Arrival Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <span className="text-gray-600 font-medium">City:</span>
                    <p className="text-[#009ee2]">{post.arrivalCity}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Airport:</span>
                    <p className="text-[#009ee2]">{post.arrivalAirport}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-600 font-medium">
                      Date & Time:
                    </span>
                    <p className="text-[#009ee2]">
                      {formatDate(post.arrivalDateTime)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Flight Details */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start">
              <FaPlane className="text-[#009ee2] text-xl mr-3 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-[#009ee2]">
                  Flight Details
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <span className="text-gray-600 font-medium">Airline:</span>
                    <p className="text-[#009ee2]">{post.airline}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">
                      Flight Number:
                    </span>
                    <p className="text-[#009ee2]">{post.flightNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Parcel Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start">
              <FaBoxes className="text-[#009ee2] text-xl mr-3 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-[#009ee2]">
                  Parcel Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <span className="text-gray-600 font-medium">
                      Max Weight:
                    </span>
                    <p className="text-[#009ee2]">{post.maxWeight} kg</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">
                      Cost Per Kg:
                    </span>
                    <p className="text-[#009ee2]">${post.costPerKg}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-600 font-medium">
                      Parcel Types:
                    </span>
                    <p className="text-[#009ee2]">{post.parcelTypes}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-600 font-medium">
                      Restrictions:
                    </span>
                    <p className="text-[#009ee2]">{post.restrictions}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Options */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start">
              <FaTruck className="text-[#009ee2] text-xl mr-3 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-[#009ee2]">
                  Delivery Options
                </h3>
                <p className="text-[#009ee2] mt-2">{post.deliveryOptions}</p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start">
              <FaPhone className="text-[#009ee2] text-xl mr-3 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-[#009ee2]">
                  Contact Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <span className="text-gray-600 font-medium">
                      Contact Method:
                    </span>
                    <p className="text-[#009ee2]">{post.contactMethod}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">
                      Response Time:
                    </span>
                    <p className="text-[#009ee2]">{post.responseTime}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">Email:</span>
                    <p className="text-[#009ee2]">{post.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start">
              <FaClock className="text-[#009ee2] text-xl mr-3 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-[#009ee2]">
                  Status Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <span className="text-gray-600 font-medium">Status:</span>
                    <div className="flex items-center">
                      {getStatusIcon(post.status)}
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                          post.status
                        )}`}
                      >
                        {post.status}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium">
                      Created At:
                    </span>
                    <p className="text-[#009ee2]">
                      {formatDate(post.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PostDetailModal;