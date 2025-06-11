// Updated BlankCheckModal.jsx
import { useState } from "react";
import axios from "axios";
import { FaFileUpload, FaCheckCircle, FaTimesCircle, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

const BlankCheckModal = ({ bid, onClose, api, fetchRequests }) => {
  const [checkImage, setCheckImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const imgbbApiKey = "7f3a98e5b9235e50d10ab2af5590caa9"; // Your ImgBB API key

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("File size should be less than 2MB");
        return;
      }
      if (!file.type.match("image.*")) {
        setError("Please upload an image file");
        return;
      }
      setError(null);
      setCheckImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!checkImage) {
      setError("Please upload a check image");
      return;
    }

    setIsSubmitting(true);
    try {
      // First upload to ImgBB
      const formDataImgbb = new FormData();
      formDataImgbb.append("image", checkImage);

      const uploadRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
        formDataImgbb
      );

      const imageUrl = uploadRes.data.data.url;

      // Then update the bid with the check image and status to checkStatusPending
      await axios.patch(`${api}/bids/${bid._id}/checkStatus`, {
        checkImage: imageUrl,
        status: "checkStatusPending", // Updated status
      });

      fetchRequests();
      onClose();
      toast.success("Check uploaded successfully! Status updated to pending verification.", {
        style: {
          background: "#8B5CF6",
          color: "#fff",
          padding: "16px",
          borderRadius: "8px",
        },
        duration: 3000,
        icon: <FaCheckCircle />,
      });
    } catch (err) {
      console.error("Error uploading check:", err);
      setError("Failed to upload check. Please try again.");
      toast.error("Failed to upload check. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#009ee2]">
            Upload Blank Check
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <FaCheckCircle className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Security Requirement:</strong> Please upload a clear image of a blank check for verification purposes. This helps ensure secure transactions.
              </p>
            </div>
          </div>
        </div>

        {/* Bid Information */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Parcel Details</h3>
          <p className="text-sm text-gray-600">
            <strong>Parcel:</strong> {bid.parcel_name || bid.parcel_type}
          </p>
          <p className="text-sm text-gray-600">
            <strong>Weight:</strong> {bid.parcel_weight_kg} kg
          </p>
          <p className="text-sm text-gray-600">
            <strong>Value:</strong> ${bid.price_offer || bid.totalCost}
          </p>
        </div>

        {/* File Upload Section */}
        <div className="mb-6">
          <label className="block mb-2 font-medium text-gray-700">
            Check Image *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-[#009ee2] transition">
            {previewImage ? (
              <div className="mb-4">
                <img
                  src={previewImage}
                  alt="Check preview"
                  className="max-h-48 w-full object-contain mx-auto rounded border"
                />
                <p className="text-sm text-gray-500 mt-2">Click below to change image</p>
              </div>
            ) : (
              <div className="py-8">
                <FaFileUpload className="mx-auto text-4xl text-gray-400 mb-2" />
                <p className="text-gray-500 mb-1">
                  Upload a clear image of the blank check
                </p>
                <p className="text-xs text-gray-400">
                  Supported formats: JPG, PNG, GIF (Max 2MB)
                </p>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="check-upload"
            />
            <label
              htmlFor="check-upload"
              className="inline-block bg-[#009ee2] text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-[#0088c6] transition mt-2"
            >
              {previewImage ? "Change Image" : "Select Image"}
            </label>
          </div>
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-2 flex items-center"
            >
              <FaTimesCircle className="mr-1" /> {error}
            </motion.p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <motion.button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </motion.button>
          <motion.button
            onClick={handleSubmit}
            disabled={isSubmitting || !checkImage}
            className={`px-6 py-2 rounded-lg text-white flex items-center ${
              isSubmitting || !checkImage
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#009ee2] hover:bg-[#0088c6]"
            } transition`}
            whileHover={{ scale: isSubmitting || !checkImage ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting || !checkImage ? 1 : 0.98 }}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <FaCheckCircle className="mr-2" /> 
                Submit Check
              </>
            )}
          </motion.button>
        </div>

        {/* Help Text */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>Once uploaded, your check will be verified and the parcel pickup process will begin.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default BlankCheckModal;