// VerificationModal.jsx
import { FaTimes, FaShieldAlt, FaIdCard, FaUser } from "react-icons/fa";

const VerificationModal = ({ formData, setFormData, isSubmitting, onClose, onSubmit }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-fadeIn shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#0088c6] via-[#009ee2] to-[#00b4ff] text-white p-4 rounded-t-xl flex justify-between items-center">
          <div className="flex items-center">
            <FaShieldAlt className="mr-3 text-xl" />
            <h2 className="text-xl font-bold">Verification Request</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors p-2 hover:bg-black hover:bg-opacity-10 rounded-full"
          >
            <FaTimes size={20} />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 rounded-r-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <FaIdCard className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Complete this form to verify your account. Verification helps build trust with other users and unlocks additional features.
                </p>
              </div>
            </div>
          </div>
          
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaUser className="mr-2 text-[#009ee2]" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Full Name"
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />

              <FormInput
                label="Phone Number"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <FormInput
                label="Occupation"
                type="text"
                name="occupation"
                value={formData.occupation}
                onChange={handleChange}
                required
              />

              <FormInput
                label="Nationality"
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                required
              />

              <FormInput
                label="LinkedIn Profile"
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
                optional
              />

              <FormInput
                label="Facebook Profile"
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/username"
                optional
              />
            </div>
          </div>

          {/* Photo Uploads */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <FaIdCard className="mr-2 text-[#009ee2]" />
              Verification Documents
            </h3>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="block mb-2 font-semibold text-gray-700">Profile Photo</label>
                <input
                  type="file"
                  name="profilePhoto"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009ee2] focus:border-transparent bg-white"
                />
                <p className="text-xs text-gray-500 mt-2">Please upload a clear, recent photo of yourself</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="block mb-2 font-semibold text-gray-700">ID Card Photo</label>
                <input
                  type="file"
                  name="nidPhoto"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009ee2] focus:border-transparent bg-white"
                />
                <p className="text-xs text-gray-500 mt-2">National ID card, passport, or other government-issued ID</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-gradient-to-r from-[#009ee2] to-[#00b4ff] hover:from-[#0088c6] hover:to-[#009ee2] text-white font-semibold py-3 rounded-lg transition duration-300 ${
                isSubmitting ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit Verification Request"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper component for form inputs
const FormInput = ({ label, type, name, value, onChange, placeholder, required, optional }) => {
  return (
    <div>
      <label className="block mb-1 font-semibold text-gray-700">
        {label}
        {optional && <span className="text-xs font-normal text-gray-500 ml-1">(Optional)</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009ee2] focus:border-transparent"
        required={required}
      />
    </div>
  );
};

export default VerificationModal;