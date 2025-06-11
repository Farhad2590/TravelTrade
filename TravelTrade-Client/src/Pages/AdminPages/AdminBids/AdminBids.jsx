// components/AdminBids.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaCheck,
  FaTimes,
  FaHourglassHalf,
  FaMoneyBillWave,
  FaBoxOpen,
  FaTruckLoading,
  FaPlaneDeparture,
  FaPlaneArrival,
  FaBox,
  FaEye,
  FaFileImage,
} from "react-icons/fa";
import { motion } from "framer-motion";

const AdminBids = () => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBid, setSelectedBid] = useState(null);
  const [showCheckImage, setShowCheckImage] = useState(null);

  const api = "http://localhost:9000";

  useEffect(() => {
    fetchBids();
  }, []);

  const fetchBids = async () => {
    try {
      const response = await axios.get(`${api}/bids/admin/all`);
      setBids(response.data);
    } catch (error) {
      console.error("Error fetching bids:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateCheckStatus = async (bidId, status) => {
    try {
      await axios.patch(`${api}/bids/${bidId}/checkStatus`, { status });
      fetchBids();
    } catch (error) {
      console.error("Error updating check status:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "checkStatusPending":
        return "#EAB308"; // yellow
      case "checkStatusApproved":
        return "#10B981"; // green
      case "checkStatusUnapproved":
        return "#EF4444"; // red
      default:
        return "#6B7280"; // gray
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "checkStatusPending":
        return <FaHourglassHalf />;
      case "checkStatusApproved":
        return <FaCheck />;
      case "checkStatusUnapproved":
        return <FaTimes />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto"
      >
        <h1 className="text-3xl font-bold text-center text-[#009ee2] mb-8">
          Admin - Bids Management
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#009ee2]"></div>
          </div>
        ) : bids.length === 0 ? (
          <div className="bg-white shadow-xl rounded-xl p-8 text-center">
            <p className="text-lg text-gray-600">No bids found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bids.map((bid) => (
              <motion.div
                key={bid._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white shadow-lg rounded-xl overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-start flex-wrap md:flex-nowrap">
                    <div className="mb-4 md:mb-0">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {bid.parcel_name || bid.parcel_type}
                      </h2>
                      <p className="text-gray-500 mt-1">
                        From: {bid.departureCity} → To: {bid.arrivalCity}
                      </p>
                      <p className="text-gray-500">
                        Traveler: {bid.travelerEmail} | Sender: {bid.senderEmail}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedBid(bid)}
                      className="bg-[#009ee2] text-white px-4 py-2 rounded-lg hover:bg-[#0088c6] transition flex items-center"
                    >
                      <FaEye className="mr-2" /> View Details
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="font-medium text-gray-700">Status</h3>
                      <p className="capitalize">{bid.status}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Total Cost</h3>
                      <p>${bid.totalCost}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Important</h3>
                      <p>{bid.isImportantParcel ? "Yes" : "No"}</p>
                    </div>
                  </div>

                  {bid.isImportantParcel && (
                    <div className="mt-4">
                      <h3 className="font-medium text-gray-700 mb-2">
                        Check Verification
                      </h3>
                      <div className="flex items-center space-x-4">
                        {bid.checkImage ? (
                          <>
                            <button
                              onClick={() => setShowCheckImage(bid.checkImage)}
                              className="flex items-center text-[#009ee2]"
                            >
                              <FaFileImage className="mr-2" /> View Check
                            </button>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs flex items-center`}
                                style={{
                                  backgroundColor: getStatusColor(bid.checkStatus),
                                  color: "white",
                                }}
                              >
                                {getStatusIcon(bid.checkStatus)}
                                {bid.checkStatus}
                              </span>
                              {bid.checkStatus === "checkStatusPending" && (
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() =>
                                      updateCheckStatus(bid._id, "checkStatusApproved")
                                    }
                                    className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() =>
                                      updateCheckStatus(bid._id, "checkStatusUnapproved")
                                    }
                                    className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                            </div>
                          </>
                        ) : (
                          <p className="text-gray-500 italic">
                            No check uploaded yet
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {showCheckImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 max-w-2xl max-h-screen overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-[#009ee2]">Check Image</h2>
              <button
                onClick={() => setShowCheckImage(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <img
              src={showCheckImage}
              alt="Uploaded check"
              className="max-w-full h-auto"
            />
          </div>
        </div>
      )}

      {selectedBid && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-screen overflow-auto"
          >
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-[#009ee2]">
                Bid Details
              </h2>
              <button
                onClick={() => setSelectedBid(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700">Parcel Information</h3>
                <div className="mt-2 space-y-2">
                  <p>
                    <span className="font-medium">Type:</span> {selectedBid.parcel_type}
                  </p>
                  <p>
                    <span className="font-medium">Description:</span>{" "}
                    {selectedBid.parcel_description}
                  </p>
                  <p>
                    <span className="font-medium">Weight:</span>{" "}
                    {selectedBid.parcel_weight_kg} kg
                  </p>
                  <p>
                    <span className="font-medium">Important:</span>{" "}
                    {selectedBid.isImportantParcel ? "Yes" : "No"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-700">Travel Information</h3>
                <div className="mt-2 space-y-2">
                  <p>
                    <span className="font-medium">Route:</span>{" "}
                    {selectedBid.departureCity} → {selectedBid.arrivalCity}
                  </p>
                  <p>
                    <span className="font-medium">Travel Date:</span>{" "}
                    {selectedBid.travelDate}
                  </p>
                  <p>
                    <span className="font-medium">Cost per kg:</span>{" "}
                    {selectedBid.costPerKg}
                  </p>
                  <p>
                    <span className="font-medium">Total Cost:</span>{" "}
                    {selectedBid.totalCost}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-700">Parties</h3>
                <div className="mt-2 space-y-2">
                  <p>
                    <span className="font-medium">Traveler:</span>{" "}
                    {selectedBid.travelerEmail}
                  </p>
                  <p>
                    <span className="font-medium">Sender:</span>{" "}
                    {selectedBid.senderEmail}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-700">Status</h3>
                <div className="mt-2 space-y-2">
                  <p>
                    <span className="font-medium">Bid Status:</span>{" "}
                    {selectedBid.status}
                  </p>
                  {selectedBid.isImportantParcel && (
                    <>
                      <p>
                        <span className="font-medium">Check Status:</span>{" "}
                        {selectedBid.checkStatus || "Not applicable"}
                      </p>
                      {selectedBid.checkImage && (
                        <button
                          onClick={() => setShowCheckImage(selectedBid.checkImage)}
                          className="text-[#009ee2] flex items-center"
                        >
                          <FaFileImage className="mr-2" /> View Check
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminBids;