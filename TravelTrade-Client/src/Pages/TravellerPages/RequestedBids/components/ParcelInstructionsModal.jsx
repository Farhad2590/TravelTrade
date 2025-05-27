import { FaBoxOpen, FaMapMarkerAlt, FaClock, FaInfoCircle, FaPhone, FaUser } from "react-icons/fa";

const ParcelInstructionsModal = ({ instruction, onClose }) => {
  if (!instruction) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FaBoxOpen className="mr-2" /> Parcel Pickup Instructions
        </h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold flex items-center">
              <FaUser className="mr-2" /> Sender Information
            </h3>
            <p className="pl-6">{instruction.senderEmail}</p>
          </div>
          
          <div>
            <h3 className="font-semibold flex items-center">
              <FaMapMarkerAlt className="mr-2" /> Pickup Address
            </h3>
            <p className="pl-6 whitespace-pre-line">{instruction.pickupAddress}</p>
          </div>
          
          <div>
            <h3 className="font-semibold flex items-center">
              <FaClock className="mr-2" /> Preferred Pickup Time
            </h3>
            <p className="pl-6">
              {new Date(instruction.pickupDateTime).toLocaleString()}
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold flex items-center">
              <FaPhone className="mr-2" /> Contact Number
            </h3>
            <p className="pl-6">{instruction.contactNumber}</p>
          </div>
          
          {instruction.additionalNotes && (
            <div>
              <h3 className="font-semibold flex items-center">
                <FaInfoCircle className="mr-2" /> Additional Notes
              </h3>
              <p className="pl-6 whitespace-pre-line">{instruction.additionalNotes}</p>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParcelInstructionsModal;