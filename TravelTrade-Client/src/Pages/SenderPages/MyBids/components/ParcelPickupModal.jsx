import { useState } from "react";
import axios from "axios";
import { FaBoxOpen, FaMapMarkerAlt, FaClock, FaInfoCircle } from "react-icons/fa";

const ParcelPickupModal = ({ bid, onClose, api }) => {
  const [instructions, setInstructions] = useState({
    pickupAddress: "",
    pickupDateTime: "",
    additionalNotes: "",
    contactNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInstructions((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${api}/parcel-pickup`, {
        bidId: bid._id,
        senderEmail: bid.senderEmail,
        travelerEmail: bid.travelerEmail,
        parcelName: bid.parcel_name || bid.parcel_type,
        ...instructions,
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error submitting instructions:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FaBoxOpen className="mr-2" /> Parcel Pickup Instructions
        </h2>
        
        {success ? (
          <div className="text-green-600 text-center py-4">
            Instructions submitted successfully!
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 flex items-center">
                <FaMapMarkerAlt className="mr-2" /> Pickup Address
              </label>
              <textarea
                name="pickupAddress"
                value={instructions.pickupAddress}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
                rows={3}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 flex items-center">
                <FaClock className="mr-2" /> Preferred Pickup Date & Time
              </label>
              <input
                type="datetime-local"
                name="pickupDateTime"
                value={instructions.pickupDateTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 flex items-center">
                <FaInfoCircle className="mr-2" /> Additional Notes
              </label>
              <textarea
                name="additionalNotes"
                value={instructions.additionalNotes}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                rows={2}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Contact Number
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={instructions.contactNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {loading ? "Submitting..." : "Submit Instructions"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ParcelPickupModal;