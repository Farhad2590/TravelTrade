import { useState } from "react";
import { FaCalendarAlt, FaMapMarkerAlt, FaPlane, FaPaperPlane, FaWeight, FaExclamationTriangle, FaTruck, FaPhone, FaClock, FaGlobeAmericas } from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import useAuth from "../../hooks/useAuth";

const PostNewTrip = () => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    category: "",
    departureCity: "",
    departureAirport: "",
    departureDateTime: "",
    arrivalCity: "",
    arrivalAirport: "",
    arrivalDateTime: "",
    airline: "",
    flightNumber: "",
    maxWeight: "",
    parcelTypes: "",
    costPerKg: "",
    restrictions: "",
    deliveryOptions: "",
    contactMethod: "",
    responseTime: "",
    status: "pending",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const tripCategories = [
    { value: "", label: "Select Category" },
    { value: "domestic", label: "Domestic" },
    { value: "international", label: "International" },
  ];

const parcelTypes = [
  "Documents",
  "Electronics",
  "Clothing",
  "Medicines",
  "Food Items (Non-perishable)",
  "Food Items (Perishable)",
  "Fragile Items",
  "Books",
  "Cosmetics",
  "Jewelry",
  "Artwork",
  "Musical Instruments",
  "Sports Equipment",
  "Tools",
  "Automotive Parts",
  "Baby Items",
  "Pet Supplies",
  "Home Decor",
  "Office Supplies",
  "Medical Equipment",
  "Industrial Parts",
  "Collectibles",
  "Antiques",
  "Plants",
  "Others"
];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (type) => {
    setFormData(prev => {
      const currentTypes = prev.parcelTypes.split(',').filter(t => t);
      const updatedTypes = currentTypes.includes(type)
        ? currentTypes.filter(t => t !== type)
        : [...currentTypes, type];
      return { ...prev, parcelTypes: updatedTypes.join(',') };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.category) {
      toast.error("Please select a trip category");
      return;
    }
    
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:9000/travelPost/", {
        ...formData,
        email: user.email,
      });
      
      toast.success("Trip posted successfully!");
      setMessage("Trip posted successfully!");
      setFormData({
        category: "",
        departureCity: "",
        departureAirport: "",
        departureDateTime: "",
        arrivalCity: "",
        arrivalAirport: "",
        arrivalDateTime: "",
        airline: "",
        flightNumber: "",
        maxWeight: "",
        parcelTypes: "",
        costPerKg: "",
        restrictions: "",
        deliveryOptions: "",
        contactMethod: "",
        responseTime: "",
        status: "pending",
      });
    } catch (error) {
      const errMsg = error.response?.data?.error || "Something went wrong";
      toast.error(`Error: ${errMsg}`);
      setMessage(`Error: ${errMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-100 to-blue-300 min-h-screen flex items-center justify-center p-6">
      <motion.div 
        className="bg-white shadow-2xl rounded-xl p-8 max-w-4xl w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {message && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-4 mb-4 rounded ${
              message.includes("Error")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </motion.div>
        )}

        <h2 className="text-blue-900 text-3xl font-bold text-center mb-6">Post Your Delivery Offer</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trip Category */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#009ee2]">Trip Category</h3>
            <div className="flex items-center bg-gray-100 p-3 rounded-lg">
              <FaGlobeAmericas className="text-[#009ee2] mx-2" />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="bg-transparent focus:outline-none p-2 w-full cursor-pointer"
              >
                {tripCategories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Departure Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#009ee2]">Departure Information</h3>
              
              <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                <FaMapMarkerAlt className="text-[#009ee2] mx-2" />
                <input
                  name="departureCity"
                  value={formData.departureCity}
                  onChange={handleChange}
                  type="text"
                  placeholder="Departure City"
                  className="bg-transparent focus:outline-none p-2 w-full"
                  required
                />
              </div>
              
              <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                <FaPlane className="text-[#009ee2] mx-2" />
                <input
                  name="departureAirport"
                  value={formData.departureAirport}
                  onChange={handleChange}
                  type="text"
                  placeholder="Departure Airport/Code"
                  className="bg-transparent focus:outline-none p-2 w-full"
                  required
                />
              </div>
              
              <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                <FaCalendarAlt className="text-[#009ee2] mx-2" />
                <input
                  name="departureDateTime"
                  value={formData.departureDateTime}
                  onChange={handleChange}
                  type="datetime-local"
                  className="bg-transparent focus:outline-none p-2 w-full"
                  required
                />
              </div>
            </div>
            
            {/* Arrival Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#009ee2]">Arrival Information</h3>
              
              <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                <FaMapMarkerAlt className="text-[#009ee2] mx-2" />
                <input
                  name="arrivalCity"
                  value={formData.arrivalCity}
                  onChange={handleChange}
                  type="text"
                  placeholder="Arrival City"
                  className="bg-transparent focus:outline-none p-2 w-full"
                  required
                />
              </div>
              
              <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                <FaPlane className="text-[#009ee2] mx-2" />
                <input
                  name="arrivalAirport"
                  value={formData.arrivalAirport}
                  onChange={handleChange}
                  type="text"
                  placeholder="Arrival Airport/Code"
                  className="bg-transparent focus:outline-none p-2 w-full"
                  required
                />
              </div>
              
              <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                <FaCalendarAlt className="text-[#009ee2] mx-2" />
                <input
                  name="arrivalDateTime"
                  value={formData.arrivalDateTime}
                  onChange={handleChange}
                  type="datetime-local"
                  className="bg-transparent focus:outline-none p-2 w-full"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Flight Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#009ee2]">Flight Details</h3>
              
              <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                <FaPlane className="text-[#009ee2] mx-2" />
                <input
                  name="airline"
                  value={formData.airline}
                  onChange={handleChange}
                  type="text"
                  placeholder="Airline Name"
                  className="bg-transparent focus:outline-none p-2 w-full"
                  required
                />
              </div>
              
              <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                <FaPaperPlane className="text-[#009ee2] mx-2" />
                <input
                  name="flightNumber"
                  value={formData.flightNumber}
                  onChange={handleChange}
                  type="text"
                  placeholder="Flight Number"
                  className="bg-transparent focus:outline-none p-2 w-full"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#009ee2]">Parcel Details</h3>
              
              <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                <FaWeight className="text-[#009ee2] mx-2" />
                <input
                  name="maxWeight"
                  value={formData.maxWeight}
                  onChange={handleChange}
                  type="number"
                  placeholder="Maximum Weight (kg)"
                  className="bg-transparent focus:outline-none p-2 w-full"
                  required
                />
              </div>
              
              <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                <FaWeight className="text-[#009ee2] mx-2" />
                <input
                  name="costPerKg"
                  value={formData.costPerKg}
                  onChange={handleChange}
                  type="number"
                  placeholder="Cost per kg ($)"
                  className="bg-transparent focus:outline-none p-2 w-full"
                  required
                />
              </div>
            </div>
          </div>

          {/* Parcel Types */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#009ee2]">Parcel Types I Can Carry</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {parcelTypes.map(type => (
                <div key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    id={type}
                    checked={formData.parcelTypes.includes(type)}
                    onChange={() => handleCheckboxChange(type)}
                    className="h-4 w-4 text-[#009ee2] focus:ring-[#009ee2] border-gray-300 rounded"
                  />
                  <label htmlFor={type} className="ml-2 text-gray-700">
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Restrictions */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#009ee2]">Restrictions</h3>
            <div className="flex items-start bg-gray-100 p-3 rounded-lg">
              <FaExclamationTriangle className="text-[#009ee2] mx-2 mt-2" />
              <textarea
                name="restrictions"
                value={formData.restrictions}
                onChange={handleChange}
                placeholder="List any restrictions (e.g., no liquids, no perishables, etc.)"
                className="bg-transparent focus:outline-none p-2 w-full min-h-24"
              ></textarea>
            </div>
          </div>
          
          {/* Delivery & Contact Options */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#009ee2]">Delivery Options</h3>
              
              <div className="space-y-3">
                <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                  <input
                    type="radio"
                    id="airportOption"
                    name="deliveryOptions"
                    value="I will deliver or pickup from airport"
                    checked={formData.deliveryOptions === "I will deliver or pickup from airport"}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#009ee2] focus:ring-[#009ee2] border-gray-300"
                  />
                  <label htmlFor="airportOption" className="ml-3">
                    I will deliver or pickup from airport
                  </label>
                </div>
                
                <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                  <input
                    type="radio"
                    id="courierOption"
                    name="deliveryOptions"
                    value="I will send/receive via courier"
                    checked={formData.deliveryOptions === "I will send/receive via courier"}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#009ee2] focus:ring-[#009ee2] border-gray-300"
                  />
                  <label htmlFor="courierOption" className="ml-3">
                    I will send/receive via courier
                  </label>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[#009ee2]">Contact Preferences</h3>
              
              <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                <FaPhone className="text-[#009ee2] mx-2" />
                <input
                  name="contactMethod"
                  value={formData.contactMethod}
                  onChange={handleChange}
                  type="text"
                  placeholder="Preferred Contact Method"
                  className="bg-transparent focus:outline-none p-2 w-full"
                  required
                />
              </div>
              
              <div className="flex items-center bg-gray-100 p-3 rounded-lg">
                <FaClock className="text-[#009ee2] mx-2" />
                <input
                  name="responseTime"
                  value={formData.responseTime}
                  onChange={handleChange}
                  type="text"
                  placeholder="Expected Response Time"
                  className="bg-transparent focus:outline-none p-2 w-full"
                  required
                />
              </div>
            </div>
          </div>

          <motion.button 
            type="submit" 
            className="bg-[#009ee2] text-white px-5 py-3 rounded-lg w-full text-lg font-semibold flex items-center justify-center space-x-2 hover:bg-blue-700 mt-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            <FaPaperPlane /> <span>{loading ? "Submitting..." : "Post Trip"}</span>
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default PostNewTrip;