import { FaGlobeAmericas, FaPlane, FaWeight, FaTruck, FaPhone, FaClock, FaMoneyBillWave, FaBoxes } from "react-icons/fa";

const TripDetailsModal = ({ post, onClose, formatDate, getStatusClass }) => {
  if (!post) return null;

  return (
    <div className="p-6 overflow-y-auto max-h-[calc(90vh-64px)] space-y-6">
      {/* Category if available */}
      {post.category && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <FaGlobeAmericas className="text-blue-800 text-xl mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-[#009ee2]">Trip Category</h3>
              <p className="text-blue-800 capitalize">{post.category}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Departure Information */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <FaPlane className="text-blue-800 text-xl mr-3 mt-1 transform rotate-45" />
          <div>
            <h3 className="text-lg font-semibold text-[#009ee2]">Departure Information</h3>
            <div className="grid md:grid-cols-2 gap-4 mt-2">
              <div>
                <span className="text-gray-600 font-medium">City:</span>
                <p className="text-blue-800">{post.departureCity || "N/A"}</p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Airport:</span>
                <p className="text-blue-800">{post.departureAirport || "N/A"}</p>
              </div>
              <div className="md:col-span-2">
                <span className="text-gray-600 font-medium">Date & Time:</span>
                <p className="text-blue-800">{formatDate(post.departureDateTime) || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Arrival Information */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <FaPlane className="text-blue-800 text-xl mr-3 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-[#009ee2]">Arrival Information</h3>
            <div className="grid md:grid-cols-2 gap-4 mt-2">
              <div>
                <span className="text-gray-600 font-medium">City:</span>
                <p className="text-blue-800">{post.arrivalCity || "N/A"}</p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Airport:</span>
                <p className="text-blue-800">{post.arrivalAirport || "N/A"}</p>
              </div>
              <div className="md:col-span-2">
                <span className="text-gray-600 font-medium">Date & Time:</span>
                <p className="text-blue-800">{formatDate(post.arrivalDateTime) || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Flight Details */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <FaPlane className="text-blue-800 text-xl mr-3 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-[#009ee2]">Flight Details</h3>
            <div className="grid md:grid-cols-2 gap-4 mt-2">
              <div>
                <span className="text-gray-600 font-medium">Airline:</span>
                <p className="text-blue-800">{post.airline || "N/A"}</p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Flight Number:</span>
                <p className="text-blue-800">{post.flightNumber || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Parcel Details */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <FaBoxes className="text-blue-800 text-xl mr-3 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-[#009ee2]">Parcel Information</h3>
            <div className="grid md:grid-cols-2 gap-4 mt-2">
              <div>
                <span className="text-gray-600 font-medium">Max Weight:</span>
                <p className="text-blue-800">{post.maxWeight || "N/A"} kg</p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Cost Per Kg:</span>
                <p className="text-blue-800">${post.costPerKg || "N/A"}</p>
              </div>
              <div className="md:col-span-2">
                <span className="text-gray-600 font-medium">Parcel Types:</span>
                <p className="text-blue-800">{post.parcelTypes || "N/A"}</p>
              </div>
              <div className="md:col-span-2">
                <span className="text-gray-600 font-medium">Restrictions:</span>
                <p className="text-blue-800">{post.restrictions || "No restrictions specified"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delivery Options */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <FaTruck className="text-blue-800 text-xl mr-3 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-[#009ee2]">Delivery Options</h3>
            <p className="text-blue-800 mt-2">{post.deliveryOptions || "N/A"}</p>
          </div>
        </div>
      </div>
      
      {/* Contact Information */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <FaPhone className="text-blue-800 text-xl mr-3 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-[#009ee2]">Contact Information</h3>
            <div className="grid md:grid-cols-2 gap-4 mt-2">
              <div>
                <span className="text-gray-600 font-medium">Contact Method:</span>
                <p className="text-blue-800">{post.contactMethod || "N/A"}</p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Response Time:</span>
                <p className="text-blue-800">{post.responseTime || "N/A"}</p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Email:</span>
                <p className="text-blue-800">{post.email || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Status Information */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <FaClock className="text-blue-800 text-xl mr-3 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-[#009ee2]">Status Information</h3>
            <div className="grid md:grid-cols-2 gap-4 mt-2">
              <div>
                <span className="text-gray-600 font-medium">Status:</span>
                <p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(post.status)}`}>
                    {post.status || "N/A"}
                  </span>
                </p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Created At:</span>
                <p className="text-blue-800">{formatDate(post.createdAt) || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetailsModal;