import { motion } from "framer-motion";
import { FaSearch, FaHandshake, FaPlane, FaBox, FaMoneyBillWave, FaStar } from "react-icons/fa";

export default function HowItWorks() {
  const steps = [
    { icon: <FaSearch className='text-blue-800 text-4xl' />, title: "Find a Traveler", description: "Browse travelers heading to your destination and choose a trusted one." },
    { icon: <FaHandshake className='text-blue-800 text-4xl' />, title: "Make a Deal", description: "Negotiate the carrying terms, agree on a price, and finalize the arrangement." },
    { icon: <FaPlane className='text-blue-800 text-4xl' />, title: "Traveler Brings Your Item", description: "The traveler purchases and carries the package safely during their journey." },
    { icon: <FaBox className='text-blue-800 text-4xl' />, title: "Receive Your Parcel", description: "Meet up in person or use a local courier for final delivery." },
    { icon: <FaMoneyBillWave className='text-blue-800 text-4xl' />, title: "Secure Payment", description: "Your payment is held securely and released only after confirmation of delivery." },
    { icon: <FaStar className='text-blue-800 text-4xl' />, title: "Rate & Review", description: "Share your experience by rating the traveler to help others make informed choices." },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-100 to-blue-300 min-h-screen flex flex-col items-center py-12 px-6">
      <motion.h1 
        className="text-blue-900 text-4xl font-extrabold mb-12 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        How It Works
      </motion.h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
        {steps.map((step, index) => (
          <motion.div 
            key={index} 
            className="bg-white p-6 rounded-xl shadow-xl text-center transform hover:scale-105 transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.2 }}
          >
            <div className="mb-4">{step.icon}</div>
            <h3 className="text-xl font-bold text-blue-900">{step.title}</h3>
            <p className="text-gray-700 mt-2">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
