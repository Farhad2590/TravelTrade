import { useEffect, useState } from "react";
import { FaPlaneDeparture, FaSearch, FaUserCheck } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function FindTravelers() {
  const [search, setSearch] = useState("");
  const [travelersData, setTravelersData] = useState([]);
  const navigate = useNavigate();
  const api = "http://localhost:9000";

  useEffect(() => {
    fetchAllPublicPosts();
  }, []);

  const fetchAllPublicPosts = async () => {
    try {
      const response = await fetch(`${api}/travelPost/all-public`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      setTravelersData(data.posts);
    } catch (error) {
      console.error("Error fetching travelers data:", error);
    }
  };

  const filteredTravelers = travelersData.filter((traveler) =>
    traveler.arrivalCity?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-r from-blue-100 to-blue-300 min-h-screen py-10 px-5 md:px-20">
      <motion.h1
        className="text-[#009ee2] text-4xl font-extrabold mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Find Your Trusted Traveler
      </motion.h1>

      <div className="flex items-center bg-white p-3 rounded-lg shadow-lg mb-6">
        <FaSearch className="text-[#009ee2] mx-2 text-xl" />
        <input
          type="text"
          placeholder="Search by destination..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent focus:outline-none p-2 w-full text-lg"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTravelers.map((traveler, index) => (
          <motion.div
            key={index}
            className="border border-[#009ee2] p-6 rounded-xl shadow-xl bg-white hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-[#009ee2] flex items-center">
              <FaUserCheck className="mr-2 text-[#009ee2]" /> Traveler from{" "}
              {traveler.departureCity}
            </h2>
            <p className="text-gray-700 mt-2">
              <FaPlaneDeparture className="inline mr-2 text-[#009ee2]" />
              {traveler.departureCity} → {traveler.arrivalCity}
            </p>
            <p className="text-gray-600 mt-2">
              Travel Date:{" "}
              <span className="font-medium text-[#009ee2]">
                {traveler.departureDateTime?.slice(0, 10)}
              </span>
            </p>
            <button
              onClick={() => {
                navigate(`/findTravelers/${traveler._id}`);
              }}
              className="mt-5 bg-[#009ee2] text-white px-5 py-3 rounded-lg hover:bg-[#009ee2] w-full text-lg font-semibold"
            >
              View Details
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
