import { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCheck,
  FaTimes,
  FaMoneyBillWave,
  FaBoxOpen,
  FaTruckLoading,
  FaPlaneDeparture,
  FaPlaneArrival,
  FaBox,
  FaInfoCircle,
  FaEye,
  FaHourglassHalf,
  FaTruck,
  FaStar,
  FaArrowRight,
  FaArrowCircleRight,
} from "react-icons/fa";
import ParcelInstructionsModal from "./components/ParcelInstructionsModal";
import BidDetailsModal from "./components/BidDetailsModal";
import { toast } from "react-hot-toast";

const RequestedBids = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [selectedInstruction, setSelectedInstruction] = useState(null);
  const [selectedBid, setSelectedBid] = useState(null);
  const [showStatusUpdate, setShowStatusUpdate] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const api = "http://localhost:9000";

  useEffect(() => {
    if (user?.email) {
      fetchRequests();
    }
  }, [user?.email]);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${api}/bids/allRequests/${user.email}`);
      setRequests(response.data);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const handleViewInstructions = async (bidId) => {
    try {
      const response = await axios.get(`${api}/parcel-pickup/${bidId}`);
      setSelectedInstruction(response.data);
      setShowInstructionsModal(true);
    } catch (error) {
      console.error("Error fetching instructions:", error);
      toast.error("Failed to fetch pickup instructions");
    }
  };

  const updateStatus = async (bidId, status) => {
    setUpdatingStatus(true);
    try {
      await axios.patch(`${api}/bids/${bidId}/updateStatus`, { status });
      fetchRequests();
      setShowStatusUpdate(null);

      // Show styled toast based on status
      const statusLabel = status.replace(/_/g, " ");
      const toastStyle = {
        style: {
          background: getStatusColor(status),
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
        },
        duration: 3000,
        icon: getStatusIcon(status),
      };

      toast.success(`Status updated to ${statusLabel}`, toastStyle);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "travellerPending":
        return "#EAB308"; // yellow
      case "rejected":
        return "#EF4444"; // red
      case "payment_pending":
        return "#F97316"; // orange
      case "paymentDone":
        return "#3B82F6"; // blue
      case "parcel_Pickup":
        return "#A855F7"; // purple
      case "picked_Up":
        return "#6366F1"; // indigo
      case "inDeparture":
        return "#14B8A6"; // teal
      case "inArrival":
        return "#06B6D4"; // cyan
      case "delivered":
        return "#10B981"; // emerald
      case "received":
        return "#84CC16"; // lime
      default:
        return "#6B7280"; // gray
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "travellerPending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "payment_pending":
        return "bg-orange-100 text-orange-800";
      case "paymentDone":
        return "bg-blue-100 text-blue-800";
      case "parcel_Pickup":
        return "bg-purple-100 text-purple-800";
      case "picked_Up":
        return "bg-indigo-100 text-indigo-800";
      case "inDeparture":
        return "bg-teal-100 text-teal-800";
      case "inArrival":
        return "bg-cyan-100 text-cyan-800";
      case "delivered":
        return "bg-emerald-100 text-emerald-800";
      case "received":
        return "bg-lime-100 text-lime-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "travellerPending":
        return <FaHourglassHalf className="mr-2" />;
      case "rejected":
        return <FaTimes className="mr-2" />;
      case "payment_pending":
        return <FaHourglassHalf className="mr-2" />;
      case "paymentDone":
        return <FaMoneyBillWave className="mr-2" />;
      case "parcel_Pickup":
        return <FaBoxOpen className="mr-2" />;
      case "picked_Up":
        return <FaTruckLoading className="mr-2" />;
      case "inDeparture":
        return <FaPlaneDeparture className="mr-2" />;
      case "inArrival":
        return <FaPlaneArrival className="mr-2" />;
      case "delivered":
        return <FaBox className="mr-2" />;
      case "received":
        return <FaCheck className="mr-2" />;
      default:
        return <FaHourglassHalf className="mr-2" />;
    }
  };

  const getNextStatusAction = (currentStatus) => {
    switch (currentStatus) {
      case "travellerPending":
        return [
          {
            status: "payment_pending",
            label: "Accept",
            color: "green",
            icon: <FaCheck />,
          },
          {
            status: "rejected",
            label: "Reject",
            color: "red",
            icon: <FaTimes />,
          },
        ];
      case "paymentDone":
        return [
          {
            status: "parcel_Pickup",
            label: "Parcel Pickup",
            color: "purple",
            icon: <FaBoxOpen />,
          },
        ];
      case "parcel_Pickup":
        return [
          {
            status: "picked_Up",
            label: "Picked Up",
            color: "indigo",
            icon: <FaTruckLoading />,
          },
        ];
      case "picked_Up":
        return [
          {
            status: "inDeparture",
            label: "In Departure",
            color: "teal",
            icon: <FaPlaneDeparture />,
          },
        ];
      case "inDeparture":
        return [
          {
            status: "inArrival",
            label: "In Arrival",
            color: "cyan",
            icon: <FaPlaneArrival />,
          },
        ];
      case "inArrival":
        return [
          {
            status: "delivered",
            label: "Delivered",
            color: "emerald",
            icon: <FaBox />,
          },
        ];
      default:
        return [];
    }
  };

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

  const getStatusDescription = (status) => {
    switch (status) {
      case "travellerPending":
        return "Waiting for response from the traveler.";
      case "rejected":
        return "Unfortunately, this bid has been rejected.";
      case "payment_pending":
        return "Traveler is waiting for payment to proceed.";
      case "paymentDone":
        return "Payment has been received. Please update status to parcel pickup.";
      case "parcel_Pickup":
        return "Pickup instructions shared. Waiting for traveler to pick up.";
      case "picked_Up":
        return "The parcel has been picked up successfully.";
      case "inDeparture":
        return "The parcel is at departure location.";
      case "inArrival":
        return "The parcel has arrived at the destination.";
      case "delivered":
        return "The parcel has been delivered to the recipient.";
      case "received":
        return "Delivery confirmed and completed.";
      default:
        return "Status pending update.";
    }
  };

  const getStatusTransitionSteps = (status) => {
    const allStatuses = [
      "travellerPending",
      "payment_pending",
      "paymentDone",
      "parcel_Pickup",
      "picked_Up",
      "inDeparture",
      "inArrival",
      "delivered",
      "received",
    ];

    // Filter out "rejected" as it's a terminal state from any point
    if (status === "rejected") {
      return ["rejected"];
    }

    const currentIndex = allStatuses.indexOf(status);
    if (currentIndex === -1) return [status];

    return allStatuses.slice(0, currentIndex + 1);
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
          My Requested Bids
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#009ee2]"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white shadow-xl rounded-xl p-8 text-center">
            <p className="text-lg text-gray-600">No requested bids found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((request) => {
              const nextActions = getNextStatusAction(request.status);
              const statusSteps = getStatusTransitionSteps(request.status);

              return (
                <motion.div
                  key={request._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white shadow-lg rounded-xl overflow-hidden"
                >
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-start flex-wrap md:flex-nowrap">
                      <div className="mb-4 md:mb-0">
                        <h2 className="text-xl font-semibold text-gray-800">
                          {request.parcel_name || request.parcel_type}
                        </h2>
                        <p className="text-gray-500 mt-1">
                          Weight: {request.parcel_weight_kg} kg • Price: $
                          {request.price_offer || request.totalCost}
                        </p>
                        <p className="text-gray-500">
                          Travel Date:{" "}
                          {formatDate(
                            request.travelDate || request.delivery_deadline
                          )}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <motion.button
                          onClick={() => setSelectedBid(request)}
                          className="bg-[#009ee2] text-white p-2 rounded-lg hover:bg-[#0088c6] transition duration-200 flex items-center"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaEye className="mr-1" /> View Details
                        </motion.button>

                        {request.status === "parcel_Pickup" && (
                          <motion.button
                            onClick={() => handleViewInstructions(request._id)}
                            className="bg-purple-500 text-white p-2 rounded-lg hover:bg-purple-600 transition duration-200 flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaTruck className="mr-1" /> Pickup Instructions
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Section */}
                  <div className="p-4 bg-gray-50">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-md font-medium text-gray-700 mb-1">
                          Current Status
                        </h3>
                        <div className="flex items-center">
                          <div
                            className="w-3 h-3 rounded-full mr-2"
                            style={{
                              backgroundColor: getStatusColor(request.status),
                            }}
                          ></div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                              request.status
                            )}`}
                            style={{
                              borderLeft: `4px solid ${getStatusColor(
                                request.status
                              )}`,
                            }}
                          >
                            {request.status.replace(/_/g, " ")}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 italic">
                          {getStatusDescription(request.status)}
                        </p>
                      </div>

                      {nextActions.length > 0 && (
                        <div className="mt-4 md:mt-0 relative">
                          <motion.button
                            onClick={() =>
                              setShowStatusUpdate(
                                showStatusUpdate === request._id
                                  ? null
                                  : request._id
                              )
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Update Status{" "}
                            <FaArrowCircleRight className="ml-2" />
                          </motion.button>

                          <AnimatePresence>
                            {showStatusUpdate === request._id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 bottom-12 bg-white shadow-xl rounded-lg p-3 z-20 min-w-max"
                              >
                                <div className="flex flex-col space-y-2">
                                  {nextActions.map((action) => (
                                    <motion.button
                                      key={action.status}
                                      disabled={updatingStatus}
                                      onClick={() =>
                                        updateStatus(request._id, action.status)
                                      }
                                      className={`flex items-center px-4 py-2 rounded-lg transition duration-200 text-white`}
                                      style={{
                                        backgroundColor: getStatusColor(
                                          action.status
                                        ),
                                      }}
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      {updatingStatus ? (
                                        <div className="w-4 h-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                      ) : (
                                        action.icon
                                      )}
                                      <span className="ml-2">
                                        {action.label}
                                      </span>
                                    </motion.button>
                                  ))}
                                </div>
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-3 h-3 bg-white"></div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>

                    {/* Status Timeline with alternating descriptions */}
                    {request.status !== "rejected" && (
                      <div className="hidden md:block relative mt-10 pt-20 pb-20">
                        <div className="flex items-center justify-between relative pl-14 pr-16">
                          {statusSteps.map((step, index) => {
                            const isActive =
                              index <= statusSteps.indexOf(request.status);
                            const isCurrentStep = step === request.status;
                            const isEvenIndex = index % 2 === 0;

                            return (
                              <div
                                key={step}
                                className="flex flex-col items-center relative z-10"
                              >
                                {/* Description above for even indexed steps */}
                                {isEvenIndex && (
                                  <div
                                    className={`absolute bottom-full mb-2 w-32 text-center ${
                                      isActive
                                        ? "text-gray-800"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    <span className="text-xs">
                                      {step.replace(/_/g, " ")}
                                    </span>
                                  </div>
                                )}

                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                                    isActive
                                      ? "text-white"
                                      : "bg-gray-200 text-gray-500"
                                  }`}
                                  style={{
                                    backgroundColor: isActive
                                      ? getStatusColor(step)
                                      : "",
                                    transform: isCurrentStep
                                      ? "scale(1.2)"
                                      : "",
                                    transition: "all 0.3s ease",
                                  }}
                                >
                                  {getStatusIcon(step)}
                                </div>

                                {/* Description below for odd indexed steps */}
                                {!isEvenIndex && (
                                  <div
                                    className={`absolute top-full mt-2 w-32 text-center ${
                                      isActive
                                        ? "text-gray-800"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    <span className="text-xs">
                                      {step.replace(/_/g, " ")}
                                    </span>
                                  </div>
                                )}
                              </div>
                            );
                          })}

                          {/* Timeline connector */}
                          <div className="absolute h-1 bg-gray-200 left-0 right-0 top-4 -z-10"></div>
                          <div
                            className="absolute h-1 top-4 left-0 -z-10 transition-all duration-500"
                            style={{
                              backgroundColor: getStatusColor(request.status),
                              width: `${
                                (statusSteps.indexOf(request.status) /
                                  (statusSteps.length - 1)) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {request.status === "rejected" && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4 rounded">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <FaTimes className="h-5 w-5 text-red-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-red-700">
                              This bid has been rejected. Please check other
                              opportunities.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Section */}
                  <div className="px-6 py-4 flex justify-end">
                    {/* Action buttons moved to status section for better alignment */}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {selectedBid && (
        <BidDetailsModal
          bid={selectedBid}
          onClose={() => setSelectedBid(null)}
          formatDate={formatDate}
          getStatusIcon={getStatusIcon}
          getStatusClass={getStatusClass}
        />
      )}

      {showInstructionsModal && (
        <ParcelInstructionsModal
          instruction={selectedInstruction}
          onClose={() => setShowInstructionsModal(false)}
        />
      )}
    </div>
  );
};

export default RequestedBids;
