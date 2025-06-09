import axios from "axios";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useAuth from "../../../hooks/useAuth";
import {
  FaTimes,
  FaCheck,
  FaHourglassHalf,
  FaEye,
  FaEnvelope,
  FaBoxOpen,
  FaPlaneDeparture,
  FaPlaneArrival,
  FaTruckLoading,
  FaBox,
  FaTruck,
  FaMoneyBillWave,
  FaStar,
  FaShippingFast,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaWeight,
  FaDollarSign,
  FaExclamationCircle,
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";
import DepositModal from "./components/DepositModal";
import PostDetailsModal from "./components/PostDetailsModal";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import ParcelPickupModal from "./components/ParcelPickupModal";
import ReviewModal from "./components/ReviewModal";
import toast from "react-hot-toast";
import MessageModal from "./components/MessageModal";

const MyBids = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showParcelPickupModal, setShowParcelPickupModal] = useState(false);
  const [selectedBidForPickup, setSelectedBidForPickup] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedOrderForReview, setSelectedOrderForReview] = useState(null);
  const [processingAction, setProcessingAction] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [filter, setFilter] = useState("all");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedOrderForMessage, setSelectedOrderForMessage] = useState(null);

  const api = "http://localhost:9000";
  const stripePromise = loadStripe(
    "pk_test_51QTn4bCDA6WzUssxYnsLA1dBCEhEipwTPRuMn1xnSiKIlVCG5hPGtOib6FxU52JFchCr3runqi1pjI3Wa99NHLi200TvcaAkCR"
  );

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const paymentStatus = queryParams.get("payment");
    const orderId = queryParams.get("orderId");

    if (
      paymentStatus &&
      ["success", "failed", "cancelled"].includes(paymentStatus)
    ) {
      // Let PaymentResult.jsx handle the display
      return;
    }

    if (user?.email) {
      fetchAllOrders();
    }
  }, [user]);

  useEffect(() => {
    if (user?.email) {
      fetchAllOrders();
    }
  }, [user]);

  const handleParcelPickupClick = (order) => {
    setSelectedBidForPickup(order);
    setShowParcelPickupModal(true);
    setShowActionMenu(null);
  };

  const handleMessageClick = (order) => {
    setSelectedOrderForMessage(order);
    setShowMessageModal(true);
  };

  const fetchAllOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${api}/bids/my/${user.email}`);
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setLoading(false);
    }
  };

  const handleSearchPost = async (postId) => {
    try {
      const response = await axios.get(`${api}/bids/post/${postId}`);
      setSelectedPost(response.data);
      setShowActionMenu(null);
    } catch (error) {
      console.error("Error fetching post details:", error);
      toast.error("Failed to load post details");
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

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "#10B981"; // emerald-500
      case "rejected":
        return "#EF4444"; // red-500
      case "payment_pending":
        return "#F97316"; // orange-500
      case "paymentDone":
        return "#3B82F6"; // blue-500
      case "parcel_Pickup":
        return "#A855F7"; // purple-500
      case "picked_Up":
        return "#6366F1"; // indigo-500
      case "inDeparture":
        return "#14B8A6"; // teal-500
      case "inArrival":
        return "#06B6D4"; // cyan-500
      case "delivered":
        return "#10B981"; // emerald-500
      case "received":
        return "#84CC16"; // lime-500
      default:
        return "#EAB308"; // yellow-500
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800";
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
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "accepted":
        return <FaCheck className="mr-2" />;
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
        return <FaCheckCircle className="mr-2" />;
      default:
        return <FaHourglassHalf className="mr-2" />;
    }
  };

  const getStatusDescription = (status) => {
    switch (status) {
      case "accepted":
        return "Your bid has been accepted by the traveler.";
      case "rejected":
        return "Unfortunately, your bid has been rejected.";
      case "payment_pending":
        return "Please complete your payment to proceed.";
      case "paymentDone":
        return "Payment has been verified. Please provide pickup instructions.";
      case "parcel_Pickup":
        return "Pickup instructions shared. Waiting for traveler to pick up.";
      case "picked_Up":
        return "Your parcel has been picked up by the traveler.";
      case "inDeparture":
        return "Your parcel is at departure location.";
      case "inArrival":
        return "Your parcel has arrived at the destination.";
      case "delivered":
        return "Your parcel has been delivered. Please confirm receipt.";
      case "received":
        return "Delivery completed. Thank you for using our service!";
      default:
        return "Waiting for response from the traveler.";
    }
  };

  const handleDepositClick = (order) => {
    setSelectedOrder(order);
    setShowDepositModal(true);
    setShowActionMenu(null);
  };

  const handleDepositSuccess = async (orderId) => {
    setProcessingAction("updating");
    try {
      await axios.patch(`${api}/bids/${orderId}/updateStatus`, {
        status: "paymentDone",
      });
      fetchAllOrders();
      setShowDepositModal(false);

      const toastStyle = {
        style: {
          background: getStatusColor("paymentDone"),
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
        },
        duration: 3000,
        icon: getStatusIcon("paymentDone"),
      };

      toast.success("Payment completed successfully!", toastStyle);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update payment status");
    } finally {
      setProcessingAction(null);
    }
  };

  const markAsReceived = async (orderId) => {
    setProcessingAction(orderId);
    try {
      await axios.patch(`${api}/bids/${orderId}/updateStatus`, {
        status: "received",
      });
      fetchAllOrders();
      setShowActionMenu(null);

      const toastStyle = {
        style: {
          background: getStatusColor("received"),
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
        },
        duration: 3000,
        icon: getStatusIcon("received"),
      };

      toast.success("Parcel marked as received successfully!", toastStyle);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setProcessingAction(null);
    }
  };

  const handleReviewClick = (order) => {
    setSelectedOrderForReview(order);
    setShowReviewModal(true);
    setShowActionMenu(null);
  };

  const handleReviewSubmit = async (reviewData) => {
    setProcessingAction("reviewing");
    try {
      await axios.post(`${api}/reviews`, {
        ...reviewData,
        orderId: selectedOrderForReview._id,
        userId: user._id,
      });

      const toastStyle = {
        style: {
          background: "#F59E0B", // amber color for review
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
        },
        duration: 3000,
        icon: <FaStar />,
      };

      toast.success("Review submitted successfully!", toastStyle);
      setShowReviewModal(false);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setProcessingAction(null);
    }
  };

  const getNextSteps = (order) => {
    const actions = [];

    switch (order.status) {
      case "payment_pending":
        actions.push({
          icon: <FaMoneyBillWave />,
          label: "Make Payment",
          action: () => handleDepositClick(order),
          color: "bg-green-500 hover:bg-green-600",
        });
        break;
      case "paymentDone":
        actions.push({
          icon: <FaTruck />,
          label: "Add Pickup Instructions",
          action: () => handleParcelPickupClick(order),
          color: "bg-purple-500 hover:bg-purple-600",
        });
        break;
      case "delivered":
        actions.push({
          icon: <FaCheckCircle />,
          label: "Mark as Received",
          action: () => markAsReceived(order._id),
          color: "bg-green-500 hover:bg-green-600",
          loading: processingAction === order._id,
        });
        break;
      case "received":
        actions.push({
          icon: <FaStar />,
          label: "Write Review",
          action: () => handleReviewClick(order),
          color: "bg-yellow-500 hover:bg-yellow-600",
        });
        break;
    }

    return actions;
  };

  const getStatusTransitionSteps = (status) => {
    const allStatuses = [
      "payment_pending",
      "paymentDone",
      "parcel_Pickup",
      "picked_Up",
      "inDeparture",
      "inArrival",
      "delivered",
      "received",
    ];

    if (status === "rejected") {
      return ["rejected"];
    }

    if (status === "accepted") {
      return ["accepted", ...allStatuses.slice(0, 1)];
    }

    const currentIndex = allStatuses.indexOf(status);
    if (currentIndex === -1) return [status];

    return allStatuses.slice(0, currentIndex + 1);
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => {
          if (filter === "active") {
            return !["rejected", "received"].includes(order.status);
          } else if (filter === "completed") {
            return order.status === "received";
          } else if (filter === "pending") {
            return ["payment_pending", "accepted"].includes(order.status);
          }
          return true;
        });

  // Helper function to determine status detail position (top/bottom) in the timeline
  const getStatusPosition = (index) => {
    return index % 2 === 0 ? "above" : "below";
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#009ee2] mb-4 md:mb-0">
            My Order Posts
          </h1>

          <div className="flex bg-white rounded-lg shadow overflow-hidden">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 ${
                filter === "all"
                  ? "bg-[#009ee2] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-4 py-2 ${
                filter === "active"
                  ? "bg-[#009ee2] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-4 py-2 ${
                filter === "completed"
                  ? "bg-[#009ee2] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 ${
                filter === "pending"
                  ? "bg-[#009ee2] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              Pending
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#009ee2]"></div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white shadow-xl rounded-xl p-8 text-center">
            <p className="text-lg text-gray-600">No orders found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const statusSteps = getStatusTransitionSteps(order.status);
              const nextSteps = getNextSteps(order);

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white shadow-lg rounded-xl overflow-hidden"
                >
                  {/* Order header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-start flex-wrap md:flex-nowrap">
                      <div className="mb-4 md:mb-0">
                        <h2 className="text-xl font-semibold text-gray-800">
                          {order.parcel_name || order.parcel_type}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                          <div className="flex items-center text-gray-600">
                            <FaWeight className="mr-2 text-gray-400" />
                            <span>{order.parcel_weight_kg} kg</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <FaDollarSign className="mr-2 text-gray-400" />
                            <span>${order.price_offer || order.totalCost}</span>
                          </div>
                          <div className="flex items-center text-gray-600">
                            <FaCalendarAlt className="mr-2 text-gray-400" />
                            <span>
                              {formatDate(
                                order.travelDate || order.delivery_deadline
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <motion.button
                          onClick={() => handleSearchPost(order.postId)}
                          className="bg-[#009ee2] text-white px-4 py-2 rounded-lg hover:bg-[#0088c6] transition duration-200 flex items-center"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaEye className="mr-2" /> View Details
                        </motion.button>
                        {/* <motion.button
                          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200 flex items-center"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaEnvelope className="mr-2" /> Message
                        </motion.button> */}
                        {/* // With this: */}
                        {order.status !== "rejected" &&
                          [
                            "accepted",
                            "payment_pending",
                            "paymentDone",
                            "parcel_Pickup",
                            "picked_Up",
                            "inDeparture",
                            "inArrival",
                            "delivered",
                            "received",
                          ].includes(order.status) && (
                            <motion.button
                              onClick={() => handleMessageClick(order)}
                              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200 flex items-center"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FaEnvelope className="mr-2" /> Message
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
                              backgroundColor: getStatusColor(order.status),
                            }}
                          ></div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                              order.status
                            )}`}
                            style={{
                              borderLeft: `4px solid ${getStatusColor(
                                order.status
                              )}`,
                            }}
                          >
                            {order.status.replace(/_/g, " ")}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 italic">
                          {getStatusDescription(order.status)}
                        </p>
                      </div>

                      {nextSteps.length > 0 && (
                        <div className="mt-4 md:mt-0 relative">
                          <motion.button
                            onClick={() =>
                              setShowActionMenu(
                                showActionMenu === order._id ? null : order._id
                              )
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200 flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Next Action <FaArrowRight className="ml-2" />
                          </motion.button>

                          <AnimatePresence>
                            {showActionMenu === order._id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute right-0 top-full mt-2 bg-white shadow-xl rounded-lg p-4 z-20 min-w-[200px]"
                              >
                                <div className="flex flex-col space-y-3">
                                  {nextSteps.map((step, index) => (
                                    <motion.button
                                      key={index}
                                      onClick={step.action}
                                      disabled={step.loading}
                                      className={`flex items-center px-4 py-2.5 rounded-lg transition duration-200 text-white ${step.color} w-full`}
                                      whileHover={{ scale: 1.02 }}
                                      whileTap={{ scale: 0.98 }}
                                    >
                                      {step.loading ? (
                                        <div className="w-4 h-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin" />
                                      ) : (
                                        <>
                                          <span className="text-base">
                                            {step.icon}
                                          </span>
                                          <span className="ml-3 text-sm font-medium">
                                            {step.label}
                                          </span>
                                        </>
                                      )}
                                    </motion.button>
                                  ))}
                                </div>
                                <div className="absolute -top-1.5 right-4 w-3 h-3 bg-white transform rotate-45"></div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>

                    {/* Status Timeline - Updated with alternating top/bottom status details */}
                    {order.status !== "rejected" && (
                      <div className="hidden md:block relative mt-10 pt-20 pb-20">
                        <div className="flex items-center justify-between relative pl-14 pr-16">
                          {/* Timeline connector */}
                          <div className="absolute h-1 bg-gray-200 left-0 right-0 top-0 -z-10"></div>
                          <div
                            className="absolute h-1 top-0 left-0 -z-10 transition-all duration-500"
                            style={{
                              backgroundColor: getStatusColor(order.status),
                              width: `${
                                (statusSteps.indexOf(order.status) /
                                  (statusSteps.length - 1)) *
                                100
                              }%`,
                            }}
                          ></div>

                          {statusSteps.map((step, index) => {
                            const isActive =
                              index <= statusSteps.indexOf(order.status);
                            const isCurrentStep = step === order.status;
                            const position = getStatusPosition(index);

                            return (
                              <div
                                key={step}
                                className="flex flex-col items-center relative z-10"
                              >
                                {/* Status dot */}
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${
                                    isActive
                                      ? "text-white shadow-md"
                                      : "bg-gray-200 text-gray-500"
                                  }`}
                                  style={{
                                    backgroundColor: isActive
                                      ? getStatusColor(step)
                                      : "",
                                    transform: isCurrentStep
                                      ? "scale(1.3)"
                                      : "",
                                    transition: "all 0.3s ease",
                                  }}
                                >
                                  {getStatusIcon(step)}
                                </div>

                                {/* Status label and description in alternating positions */}
                                <div
                                  className={`absolute ${
                                    position === "above"
                                      ? "bottom-full mb-2"
                                      : "top-full mt-2"
                                  } flex flex-col items-center w-40 -translate-x-1/2 left-1/2`}
                                >
                                  <span
                                    className={`text-xs font-bold mb-1 uppercase tracking-wider text-center ${
                                      isActive
                                        ? "text-gray-800"
                                        : "text-gray-500"
                                    }`}
                                    style={{
                                      color: isCurrentStep
                                        ? getStatusColor(step)
                                        : "",
                                      textShadow: isCurrentStep
                                        ? "0 0 1px rgba(0,0,0,0.1)"
                                        : "",
                                    }}
                                  >
                                    {step.replace(/_/g, " ")}
                                  </span>

                                  {isCurrentStep && (
                                    <motion.div
                                      initial={{
                                        opacity: 0,
                                        y: position === "above" ? -5 : 5,
                                      }}
                                      animate={{ opacity: 1, y: 0 }}
                                      className={`text-2xs text-center px-2 py-1 rounded-md ${getStatusClass(
                                        step
                                      )} max-w-full`}
                                      style={{
                                        fontSize: "0.65rem",
                                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                                      }}
                                    >
                                      {getStatusDescription(step)}
                                    </motion.div>
                                  )}

                                  {/* Vertical connector line */}
                                  <div
                                    className={`absolute ${
                                      position === "above"
                                        ? "top-full h-2"
                                        : "bottom-full h-2"
                                    } w-px bg-gray-300 left-1/2 -translate-x-1/2`}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Mobile timeline version - simplified but with alternating pattern */}
                    {order.status !== "rejected" && (
                      <div className="md:hidden relative mt-6 px-2">
                        <div className="w-1 absolute h-full bg-gray-200 left-4 top-0"></div>
                        <div
                          className="w-1 absolute bg-blue-500 left-4 top-0 transition-all duration-500"
                          style={{
                            backgroundColor: getStatusColor(order.status),
                            height: `${
                              ((statusSteps.indexOf(order.status) + 1) /
                                statusSteps.length) *
                              100
                            }%`,
                          }}
                        ></div>

                        {statusSteps.map((step, index) => {
                          const isActive =
                            index <= statusSteps.indexOf(order.status);
                          const isCurrentStep = step === order.status;
                          const isEven = index % 2 === 0;

                          return (
                            <div
                              key={step}
                              className="flex items-start mb-4 relative"
                            >
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center z-10 mr-3 ${
                                  isActive
                                    ? "text-white"
                                    : "bg-gray-200 text-gray-500"
                                }`}
                                style={{
                                  backgroundColor: isActive
                                    ? getStatusColor(step)
                                    : "",
                                  transform: isCurrentStep ? "scale(1.2)" : "",
                                }}
                              >
                                {getStatusIcon(step)}
                              </div>

                              <div
                                className={`flex-1 ${isEven ? "pl-2" : "pl-6"}`}
                              >
                                <span
                                  className={`font-medium block mb-1 ${
                                    isActive ? "text-gray-800" : "text-gray-500"
                                  }`}
                                  style={{
                                    color: isCurrentStep
                                      ? getStatusColor(step)
                                      : "",
                                  }}
                                >
                                  {step.replace(/_/g, " ")}
                                </span>

                                {isCurrentStep && (
                                  <motion.p
                                    initial={{ opacity: 0, x: isEven ? -5 : 5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`text-xs ${getStatusClass(
                                      step
                                    )} p-2 rounded-md italic`}
                                  >
                                    {getStatusDescription(step)}
                                  </motion.p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {order.status === "rejected" && (
                      <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4 rounded">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <FaExclamationCircle className="h-5 w-5 text-red-400" />
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
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {selectedPost && (
        <PostDetailsModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          formatDate={formatDate}
          getStatusIcon={getStatusIcon}
          getStatusClass={getStatusClass}
        />
      )}

      {showParcelPickupModal && selectedBidForPickup && (
        <ParcelPickupModal
          bid={selectedBidForPickup}
          onClose={() => setShowParcelPickupModal(false)}
          api={api}
        />
      )}

      {showMessageModal && selectedOrderForMessage && (
        <MessageModal
          order={selectedOrderForMessage}
          onClose={() => setShowMessageModal(false)}
          currentUser={user}
        />
      )}

      {showDepositModal && selectedOrder && (
        <Elements stripe={stripePromise}>
          <DepositModal
            order={selectedOrder}
            onClose={() => setShowDepositModal(false)}
            onSuccess={handleDepositSuccess}
          />
        </Elements>
      )}

      {showReviewModal && selectedOrderForReview && (
        <ReviewModal
          order={selectedOrderForReview}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
};

export default MyBids;
