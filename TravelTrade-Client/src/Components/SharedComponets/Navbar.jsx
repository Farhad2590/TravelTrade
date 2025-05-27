import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  User,
  Bell,
  Search,
  Globe,
  Package,
  Plane,
  Info
} from "lucide-react";
import useAuth from "../../hooks/useAuth";

const Navbar = () => {
  const { logOut, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <nav
      className="px-4 py-3 flex items-center justify-between relative  bg-[#009ee2] text-white shadow-lg"
     
    >
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div className="relative">
          <Globe className="h-6 w-6 text-white animate-spin-slow" />
          <Plane className="h-3 w-3 text-white absolute -top-1 -right-1" />
        </div>
        <h1 className="text-xl font-bold text-white">TravelTrade</h1>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-6">
        <Link
          to="/findTravelers"
          className="flex items-center text-white hover:bg-[#009ee2] px-3 py-2 rounded"
        >
          <Package className="mr-2 h-4 w-4" />
          Find Travelers
        </Link>
        <Link
          to="/postTravelPlans"
          className="flex items-center text-white hover:bg-[#009ee2] px-3 py-2 rounded"
        >
          <Plane className="mr-2 h-4 w-4" />
          Post Travel Plans
        </Link>
        <Link
          to="/howItWorks"
          className="flex items-center text-white hover:bg-[#009ee2] px-3 py-2 rounded"
        >
          <Info className="mr-2 h-4 w-4" />
          How It Works
        </Link>

        {/* Search input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[#009ee2]" />
          </div>
          <input
            type="text"
            className="block w-48 pl-10 pr-3 py-1 border border-[#009ee2] rounded-full text-sm bg-white text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#009ee2]"
            placeholder="Search travelers..."
          />
        </div>

        {user?.email ? (
          <div className="relative flex items-center ml-4">
            {/* Notification Icon */}
            <button
              className="text-white hover:bg-[#009ee2] p-2 rounded mr-2"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
            </button>

            {/* Avatar and Dropdown */}
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2"
              aria-label="User menu"
            >
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="rounded-full w-10 h-10 border-2 border-white"
                />
              ) : (
                <User className="text-white rounded-full bg-[#009ee2] p-1 h-8 w-8" />
              )}
            </button>

            {isDropdownOpen && (
              <div
                className="absolute bg-white text-black rounded-lg shadow-lg right-0 mt-2 w-48 z-50"
                style={{ top: "100%" }}
              >
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium">{user.displayName || user.email}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>

                {/* <Link
                  to="/profile"
                  className="px-4 py-2 hover:bg-gray-100 w-full text-left flex items-center space-x-2 transition"
                >
                  <User className="text-gray-600 h-4 w-4" />
                  <span>Profile</span>
                </Link> */}

                <Link
                  to="/dashboard"
                  className="px-4 py-2 hover:bg-gray-100 w-full text-left flex items-center space-x-2 transition"
                >
                  <Package className="text-gray-600 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>

                <button
                  onClick={logOut}
                  className="px-4 py-2 hover:bg-gray-100 w-full text-left flex items-center space-x-2 text-red-600 transition border-t border-gray-200"
                >
                  <X className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/signUpFlow"
            className="bg-white text-[#009ee2] hover:bg-gray-100 px-4 py-2 rounded-md font-medium flex items-center"
          >
            <User className="mr-2 h-4 w-4" />
            Sign In
          </Link>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center space-x-4">
        {user?.email && (
          <button
            onClick={toggleDropdown}
            className="flex items-center"
            aria-label="User menu"
          >
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || "User"}
                className="rounded-full w-8 h-8 border-2 border-white"
              />
            ) : (
              <User className="text-white h-6 w-6" />
            )}
          </button>
        )}

        <button
          className="text-xl text-white p-1"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div
          className="absolute top-full left-0 w-full flex flex-col items-start space-y-1 p-4 z-50 shadow-lg"
          style={{ backgroundColor: "#68b5c2" }}
        >
          <Link
            to="/findTravelers"
            className="flex items-center text-white hover:bg-[#009ee2] px-3 py-2 rounded w-full"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Package className="mr-2 h-4 w-4" />
            Find Travelers
          </Link>
          <Link
            to="/postTravelPlans"
            className="flex items-center text-white hover:bg-[#009ee2] px-3 py-2 rounded w-full"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Plane className="mr-2 h-4 w-4" />
            Post Travel Plans
          </Link>
          <Link
            to="/howItWorks"
            className="flex items-center text-white hover:bg-[#009ee2] px-3 py-2 rounded w-full"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <Info className="mr-2 h-4 w-4" />
            How It Works
          </Link>

          {/* Mobile Search */}
          <div className="relative w-full mt-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[#009ee2]" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-[#009ee2] rounded-full text-sm bg-white text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#009ee2]"
              placeholder="Search travelers..."
            />
          </div>

          {!user?.email && (
            <Link
              to="/signUpFlow"
              className="bg-white text-[#009ee2] hover:bg-gray-100 px-3 py-2 rounded w-full flex items-center mt-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className="mr-2 h-4 w-4" />
              Sign In
            </Link>
          )}
        </div>
      )}

      {/* Mobile User Dropdown */}
      {isDropdownOpen && user?.email && (
        <div className="md:hidden absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg z-50 w-60 mr-2">
          <div className="p-3 border-b border-gray-200">
            <p className="font-medium">{user.displayName || "User"}</p>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
          </div>
          
          <Link
            to="/profile"
            className="flex items-center px-4 py-3 hover:bg-gray-50"
            onClick={() => setIsDropdownOpen(false)}
          >
            <User className="text-gray-600 h-4 w-4 mr-3" />
            <span>Profile</span>
          </Link>
          
          <Link
            to="/dashboard"
            className="flex items-center px-4 py-3 hover:bg-gray-50"
            onClick={() => setIsDropdownOpen(false)}
          >
            <Package className="text-gray-600 h-4 w-4 mr-3" />
            <span>Dashboard</span>
          </Link>
          
          <button
            onClick={() => {
              logOut();
              setIsDropdownOpen(false);
            }}
            className="flex items-center px-4 py-3 hover:bg-gray-50 text-red-600 w-full border-t border-gray-200"
          >
            <X className="h-4 w-4 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;