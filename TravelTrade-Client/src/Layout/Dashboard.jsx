import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaBox,
  FaPlane,
  FaMoneyBillWave,
  FaHome,
  FaSignOutAlt,
  FaExchangeAlt,
  FaShieldAlt,
  FaUsersCog,
  FaChartLine,
  FaHandshake,
  FaShoppingCart,
  FaMapMarkedAlt,
  FaSearch,
  FaBriefcase,
  FaFileInvoiceDollar,
  FaStar,
} from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";

import { MdVerified } from "react-icons/md";
import { FcMenu } from "react-icons/fc";
import { GiTargetPoster } from "react-icons/gi";
import useAuth from "../hooks/useAuth";
import UseAdmin from "../hooks/useAdmin";
import UseTraveler from "../hooks/UseTraveler";
import UseSender from "../hooks/useSender";

const Dashboard = () => {
  const { user, logOut } = useAuth();
  const [isAdmin] = UseAdmin();
  const [isTraveler] = UseTraveler();
  const [isSender] = UseSender();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Determine user role with fallback
  const userRole = isAdmin
    ? "admin"
    : isTraveler
    ? "traveler"
    : isSender
    ? "sender"
    : "unauthorized";

  // Links for Sender
  const senderLinks = [
    { name: "My Profile", path: "/dashboard/profile", icon: <FaUser /> },
    { name: "My Bids", path: "/dashboard/my-bids", icon: <FaBox /> },
    {
      name: "Find Travelers",
      path: "/dashboard/find-travelers",
      icon: <FaSearch />,
    },
    {
      name: "New Request",
      path: "/dashboard/new-request",
      icon: <FaBriefcase />,
    },
    {
      name: "Active Shipments",
      path: "/dashboard/active-shipments",
      icon: <FaExchangeAlt />,
    },
    {
      name: "Payment History",
      path: "/dashboard/payments",
      icon: <FaFileInvoiceDollar />,
    },
    { name: "My Reviews", path: "/dashboard/my-reviews", icon: <FaStar /> },
    { name: "Messaging", path: "/dashboard/messaging", icon: <FaRegMessage /> },
  ];

  // Links for Traveler
  const travelerLinks = [
    { name: "My Profile", path: "/dashboard/profile", icon: <FaUser /> },
    { name: "Post New Trip", path: "/dashboard/post-trip", icon: <FaPlane /> },
    {
      name: "My Trip Schedule",
      path: "/dashboard/my-trips",
      icon: <FaMapMarkedAlt />,
    },
    {
      name: "Available Requests",
      path: "/dashboard/available-requests",
      icon: <FaShoppingCart />,
    },
    {
      name: "Current Deliveries",
      path: "/dashboard/current-deliveries",
      icon: <FaBox />,
    },
    {
      name: "Earnings",
      path: "/dashboard/earnings",
      icon: <FaMoneyBillWave />,
    },
    {
      name: "Received Reviews",
      path: "/dashboard/received-reviews",
      icon: <FaStar />,
    },
    { name: "Messaging", path: "/dashboard/messaging", icon: <FaRegMessage /> },
  ];

  // Links for Admin
  const adminLinks = [
    { name: "Admin Profile", path: "/dashboard/profile", icon: <FaUser /> },
    {
      name: "User Management",
      path: "/dashboard/manage-users",
      icon: <FaUsersCog />,
    },
    {
      name: "Transaction Monitor",
      path: "/dashboard/transactions",
      icon: <FaMoneyBillWave />,
    },
    {
      name: "Dispute Center",
      path: "/dashboard/disputes",
      icon: <FaHandshake />,
    },
    {
      name: "Platform Analytics",
      path: "/dashboard/analytics",
      icon: <FaChartLine />,
    },
    {
      name: "Pending Post",
      path: "/dashboard/post-review",
      icon: <FaShieldAlt />,
    },
    {
      name: "Verification Requests",
      path: "/dashboard/verification-request",
      icon: <MdVerified />,
    },
    { name: "All Reviews", path: "/dashboard/all-reviews", icon: <FaStar /> },
    { name: "Messaging", path: "/dashboard/messaging", icon: <FaRegMessage /> },
  ];

  // Get appropriate links based on user role
  const getLinksForRole = () => {
    switch (userRole) {
      case "admin":
        return adminLinks;
      case "traveler":
        return travelerLinks;
      case "sender":
        return senderLinks;
      default:
        return [];
    }
  };

  const linksToShow = getLinksForRole();

  const handleLogOut = async () => {
    try {
      await logOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`flex flex-col w-full md:w-64 px-4 py-6 ${
          isSidebarOpen ? "block" : "hidden md:block"
        }`}
        style={{ backgroundColor: "#009ee2" }}
      >
        {/* Logo and Title */}
        <div className="flex items-center justify-center mb-8">
          <h1 className="text-2xl font-bold text-white">TravelTrade</h1>
        </div>

        {/* User Profile Section */}
        <div className="flex flex-col items-center mt-2 -mx-2">
          <img
            className="object-cover w-16 h-16 mx-2 rounded-full border-4 border-white"
            src={user?.photoURL || "https://via.placeholder.com/40"}
            alt="user avatar"
          />
          <h4 className="mx-2 mt-3 font-medium text-white">
            {user?.displayName || "User"}
          </h4>
          <p className="mx-2 mt-1 text-xs font-medium text-white/90">
            {user?.email}
          </p>
          <div className="mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-white text-[#009ee2]">
            {userRole.toUpperCase()}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-8">
          <ul className="flex flex-col gap-1">
            {linksToShow.map((link, index) => (
              <li key={index}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 transition-all duration-200 ease-in-out rounded-lg hover:bg-blue-400 hover:bg-opacity-30 ${
                      isActive
                        ? "bg-white text-[#009ee2] font-semibold"
                        : "text-white"
                    }`
                  }
                >
                  <span className="inline-flex items-center justify-center w-5 h-5 mr-3">
                    {link.icon}
                  </span>
                  <span className="text-sm">{link.name}</span>
                </NavLink>
              </li>
            ))}

            {/* Divider */}
            <div className="border-t border-white/20 my-3"></div>

            {/* Home Link */}
            <li>
              <NavLink
                to="/"
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center px-4 py-3 text-white transition-all duration-200 ease-in-out rounded-lg hover:bg-blue-400 hover:bg-opacity-30"
              >
                <span className="inline-flex items-center justify-center w-5 h-5 mr-3">
                  <FaHome />
                </span>
                <span className="text-sm">Home</span>
              </NavLink>
            </li>

            {/* Logout Button */}
            <li>
              <button
                onClick={handleLogOut}
                className="w-full flex items-center px-4 py-3 text-white transition-all duration-200 ease-in-out rounded-lg hover:bg-blue-400 hover:bg-opacity-30 text-left"
              >
                <span className="inline-flex items-center justify-center w-5 h-5 mr-3">
                  <FaSignOutAlt />
                </span>
                <span className="text-sm">Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-[#009ee2] text-white shadow-lg"
      >
        <FcMenu size={24} />
      </button>

      {/* Main Content */}
      <div className="flex-1 ">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm min-h-[calc(100vh-4rem)]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
