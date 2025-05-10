import { useState } from "react";
import {  FaCalendarAlt, FaMapMarkerAlt, FaPlus } from "react-icons/fa";
import { motion } from "framer-motion";

export default function PostTravelPlans() {
  const [travelData, setTravelData] = useState({
    from: "",
    to: "",
    date: "",
  });

  const handleChange = (e) => {
    setTravelData({ ...travelData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Travel Plan Submitted:", travelData);
  };

  return (
    <div className="bg-gradient-to-r from-blue-100 to-blue-300 min-h-screen flex items-center justify-center p-6">
      <motion.div 
        className="bg-white shadow-2xl rounded-xl p-8 max-w-lg w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-blue-900 text-3xl font-bold text-center mb-6">Post Your Travel Plans</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex items-center bg-gray-100 p-3 rounded-lg">
            <FaMapMarkerAlt className="text-[#009ee2] mx-2" />
            <input 
              type="text" 
              name="from" 
              placeholder="Departure City" 
              value={travelData.from} 
              onChange={handleChange} 
              className="bg-transparent focus:outline-none p-2 w-full text-lg"
              required
            />
          </div>

          <div className="flex items-center bg-gray-100 p-3 rounded-lg">
            <FaMapMarkerAlt className="text-[#009ee2] mx-2" />
            <input 
              type="text" 
              name="to" 
              placeholder="Destination City" 
              value={travelData.to} 
              onChange={handleChange} 
              className="bg-transparent focus:outline-none p-2 w-full text-lg"
              required
            />
          </div>

          <div className="flex items-center bg-gray-100 p-3 rounded-lg">
            <FaCalendarAlt className="text-[#009ee2] mx-2" />
            <input 
              type="date" 
              name="date" 
              value={travelData.date} 
              onChange={handleChange} 
              className="bg-transparent focus:outline-none p-2 w-full text-lg"
              required
            />
          </div>

          <motion.button 
            type="submit" 
            className="bg-[#009ee2] text-white px-5 py-3 rounded-lg w-full text-lg font-semibold flex items-center justify-center space-x-2 hover:bg-blue-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaPlus /> <span>Post Travel Plan</span>
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
