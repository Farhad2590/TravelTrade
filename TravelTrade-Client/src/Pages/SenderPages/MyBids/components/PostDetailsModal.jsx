import { motion } from "framer-motion";
import {
  FaPlane,
  FaWeight,
  FaTruck,
  FaPhone,
  FaClock,
  FaTimes,
  FaInfoCircle,
  FaMoneyBillWave,
} from "react-icons/fa";

const PostDetailsModal = ({ post, onClose, formatDate, getStatusIcon, getStatusClass }) => {

  const status = post?.status || 'unknown';
  const formattedStatus = status.replace(/_/g, ' ');

  console.log(post);
  

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

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-64px)]">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <FaInfoCircle className="text-[#009ee2] text-xl mr-3 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-[#009ee2]">
                    Basic Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <span className="text-gray-600 font-medium">Request Type:</span>
                      <p className="text-[#009ee2] capitalize">
                        {post?.request_type || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">Parcel Type:</span>
                      <p className="text-[#009ee2] capitalize">
                        {post?.parcel_type || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                      <p className="text-[#009ee2]">
                        {post?.departureCity || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">
                        Airport:
                      </span>
                      <p className="text-[#009ee2]">
                        {post?.departureAirport || "N/A"}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-gray-600 font-medium">
                        Date & Time:
                      </span>
                      <p className="text-[#009ee2]">
                        {formatDate(post?.departureDateTime || post?.travelDate) || "N/A"}
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
                      <p className="text-[#009ee2]">
                        {post?.arrivalCity || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">
                        Airport:
                      </span>
                      <p className="text-[#009ee2]">
                        {post?.arrivalAirport || "N/A"}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-gray-600 font-medium">
                        Date & Time:
                      </span>
                      <p className="text-[#009ee2]">
                        {formatDate(post?.arrivalDateTime) || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Parcel Details */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <FaWeight className="text-[#009ee2] text-xl mr-3 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-[#009ee2]">
                    Parcel Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <span className="text-gray-600 font-medium">
                        Weight:
                      </span>
                      <p className="text-[#009ee2]">
                        {post?.parcel_weight_kg || post?.maxWeight || "N/A"} kg
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">
                        Cost per kg:
                      </span>
                      <p className="text-[#009ee2]">
                        ${post?.costPerKg || "N/A"}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-gray-600 font-medium">
                        Description:
                      </span>
                      <p className="text-[#009ee2]">
                        {post?.parcel_description || "No description provided"}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-gray-600 font-medium">
                        Restrictions:
                      </span>
                      <p className="text-[#009ee2]">
                        {post?.restrictions || "No restrictions specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Information */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <FaMoneyBillWave className="text-[#009ee2] text-xl mr-3 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-[#009ee2]">
                    Financial Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4 mt-2">
                    <div>
                      <span className="text-gray-600 font-medium">
                        Price Offer:
                      </span>
                      <p className="text-[#009ee2]">
                        ${post?.price_offer || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">
                        Total Cost:
                      </span>
                      <p className="text-[#009ee2]">
                        ${post?.totalCost || "N/A"}
                      </p>
                    </div>
                  </div>
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
                        Traveler Email:
                      </span>
                      <p className="text-[#009ee2]">
                        {post?.travelerEmail || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">Sender Email:</span>
                      <p className="text-[#009ee2]">{post?.senderEmail || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">Sender Name:</span>
                      <p className="text-[#009ee2]">{post?.senderName || "N/A"}</p>
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
                        {getStatusIcon(status)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(status)}`}>
                          {formattedStatus}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600 font-medium">
                        Created At:
                      </span>
                      <p className="text-[#009ee2]">
                        {formatDate(post?.createdAt) || "N/A"}
                      </p>
                    </div>
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

export default PostDetailsModal;