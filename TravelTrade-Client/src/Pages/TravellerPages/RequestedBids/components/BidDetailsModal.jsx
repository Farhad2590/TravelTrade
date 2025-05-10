import {
  FaCheck,
  FaTimes,
  FaMoneyBillWave,
  FaBoxOpen,
  FaTruckLoading,
  FaPlaneDeparture,
  FaPlaneArrival,
  FaBox,
  FaHourglassHalf,
  FaUser,
  FaPlane,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaWeightHanging,
  FaDollarSign,
  FaInfoCircle
} from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const BidDetailsModal = ({ bid, onClose, formatDate, getStatusIcon, getStatusClass }) => {
  const [senderProfile, setSenderProfile] = useState(null);
  const [travelPost, setTravelPost] = useState(null);
  const [loading, setLoading] = useState({
    sender: true,
    post: true
  });
  const [activeTab, setActiveTab] = useState('parcel');

  const api = "http://localhost:9000";

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (bid?.senderEmail) {
          const senderResponse = await axios.get(`${api}/users/${bid.senderEmail}`);
          setSenderProfile(senderResponse.data);
        }
        if (bid?.postId) {
          const postResponse = await axios.get(`${api}/travelPost/post/${bid.postId}`);
          setTravelPost(postResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load additional details");
      } finally {
        setLoading({ sender: false, post: false });
      }
    };

    fetchData();
  }, [bid]);

  const renderParcelDetails = () => (
    <div className="space-y-4">
      <div className="flex items-start">
        <FaBox className="text-[#009ee2] mt-1 mr-3 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-gray-600">Parcel Type</h4>
          <p className="text-gray-800">{bid.parcel_type || "N/A"}</p>
        </div>
      </div>

      <div className="flex items-start">
        <FaWeightHanging className="text-[#009ee2] mt-1 mr-3 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-gray-600">Weight</h4>
          <p className="text-gray-800">{bid.parcel_weight_kg} kg</p>
        </div>
      </div>

      <div className="flex items-start">
        <FaDollarSign className="text-[#009ee2] mt-1 mr-3 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-gray-600">Price</h4>
          <p className="text-gray-800">${bid.price_offer || bid.totalCost}</p>
        </div>
      </div>

      <div className="flex items-start">
        {getStatusIcon(bid.status)}
        <div className="ml-3">
          <h4 className="font-semibold text-gray-600">Status</h4>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
              bid.status
            )}`}
          >
            {bid.status.replace(/_/g, " ")}
          </span>
        </div>
      </div>

      <div className="flex items-start">
        <FaCalendarAlt className="text-[#009ee2] mt-1 mr-3 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-gray-600">Travel Date</h4>
          <p className="text-gray-800">{formatDate(bid.travelDate || bid.delivery_deadline)}</p>
        </div>
      </div>

      <div className="flex items-start">
        <FaInfoCircle className="text-[#009ee2] mt-1 mr-3 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-gray-600">Description</h4>
          <p className="text-gray-800">{bid.parcel_description || "N/A"}</p>
        </div>
      </div>
    </div>
  );

  const renderSenderDetails = () => (
    loading.sender ? (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#009ee2]"></div>
      </div>
    ) : senderProfile ? (
      <div className="space-y-4">
        <div className="flex justify-center mb-4">
          {senderProfile.photo ? (
            <img
              src={senderProfile.photo}
              alt="Sender"
              className="w-24 h-24 rounded-full object-cover border-4 border-[#009ee2]"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              <FaUser size={32} />
            </div>
          )}
        </div>

        <div className="flex items-start">
          <FaUser className="text-[#009ee2] mt-1 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-600">Name</h4>
            <p className="text-gray-800">{senderProfile.name || "N/A"}</p>
          </div>
        </div>

        <div className="flex items-start">
          <FaEnvelope className="text-[#009ee2] mt-1 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-600">Email</h4>
            <p className="text-gray-800">{senderProfile.email}</p>
          </div>
        </div>

        <div className="flex items-start">
          <FaPhone className="text-[#009ee2] mt-1 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-600">Phone</h4>
            <p className="text-gray-800">{senderProfile.mobile || "N/A"}</p>
          </div>
        </div>

        <div className="flex items-start">
          <FaMapMarkerAlt className="text-[#009ee2] mt-1 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-600">Address</h4>
            <p className="text-gray-800">{senderProfile.address || "N/A"}</p>
          </div>
        </div>
      </div>
    ) : (
      <div className="text-center py-8 text-gray-500">
        <FaTimes className="mx-auto text-2xl mb-2" />
        <p>Sender information not available</p>
      </div>
    )
  );

  const renderTravelDetails = () => (
    loading.post ? (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#009ee2]"></div>
      </div>
    ) : travelPost ? (
      <div className="space-y-4">
        <div className="flex items-start">
          <FaPlaneDeparture className="text-[#009ee2] mt-1 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-600">Departure</h4>
            <p className="text-gray-800">
              {travelPost.departureCity} ({travelPost.departureAirport})
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <FaPlaneArrival className="text-[#009ee2] mt-1 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-600">Arrival</h4>
            <p className="text-gray-800">
              {travelPost.arrivalCity} ({travelPost.arrivalAirport})
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <FaCalendarAlt className="text-[#009ee2] mt-1 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-600">Travel Date</h4>
            <p className="text-gray-800">{formatDate(travelPost.travelDate)}</p>
          </div>
        </div>

        <div className="flex items-start">
          <FaWeightHanging className="text-[#009ee2] mt-1 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-600">Available Weight</h4>
            <p className="text-gray-800">{travelPost.availableWeight} kg</p>
          </div>
        </div>

        <div className="flex items-start">
          <FaInfoCircle className="text-[#009ee2] mt-1 mr-3 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-600">Additional Notes</h4>
            <p className="text-gray-800">{travelPost.additionalNotes || "N/A"}</p>
          </div>
        </div>
      </div>
    ) : (
      <div className="text-center py-8 text-gray-500">
        <FaTimes className="mx-auto text-2xl mb-2" />
        <p>Travel post information not available</p>
      </div>
    )
  );

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-2xl w-[95%] max-w-4xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
        >
          &times;
        </button>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-[#009ee2]">
            Bid Details
          </h2>
          
          <div className="flex border-b mb-6">
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'parcel' ? 'text-[#009ee2] border-b-2 border-[#009ee2]' : 'text-gray-500'}`}
              onClick={() => setActiveTab('parcel')}
            >
              <FaBox className="inline mr-2" />
              Parcel Details
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'sender' ? 'text-[#009ee2] border-b-2 border-[#009ee2]' : 'text-gray-500'}`}
              onClick={() => setActiveTab('sender')}
            >
              <FaUser className="inline mr-2" />
              Sender Info
            </button>
            <button
              className={`py-2 px-4 font-medium ${activeTab === 'travel' ? 'text-[#009ee2] border-b-2 border-[#009ee2]' : 'text-gray-500'}`}
              onClick={() => setActiveTab('travel')}
            >
              <FaPlane className="inline mr-2" />
              Travel Info
            </button>
          </div>
          
          <div className="min-h-[300px]">
            {activeTab === 'parcel' && renderParcelDetails()}
            {activeTab === 'sender' && renderSenderDetails()}
            {activeTab === 'travel' && renderTravelDetails()}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BidDetailsModal;