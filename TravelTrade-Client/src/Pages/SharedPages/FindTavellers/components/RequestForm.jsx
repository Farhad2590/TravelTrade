import { useState } from 'react';

const RequestForm = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    parcel_description: "",
    parcel_name: "",
    parcel_quantity: "",
    parcel_weight_kg: "",
    price_offer: "",
    delivery_deadline: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const success = await onSubmit(formData);
      if (success) {
        setFormData({
          parcel_description: "",
          parcel_name: "",
          parcel_quantity: "",
          parcel_weight_kg: "",
          price_offer: "",
          delivery_deadline: "",
        });
      }
    } catch (error) {
      console.error("Error in form submission:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
        <div className="bg-[#009ee2] p-6">
          <h2 className="text-2xl font-bold text-white">
            Submit Parcel Request
          </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block mb-1 font-semibold text-gray-700">
                Parcel Description
              </label>
              <textarea
                name="parcel_description"
                value={formData.parcel_description}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                rows="3"
                placeholder="Describe the parcel..."
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Parcel Name
              </label>
              <input
                type="text"
                name="parcel_name"
                value={formData.parcel_name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Example: Medicine"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Parcel Quantity
              </label>
              <input
                type="text"
                name="parcel_quantity"
                value={formData.parcel_quantity}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="3 boxes"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Parcel Weight (kg)
              </label>
              <input
                type="number"
                name="parcel_weight_kg"
                step="0.1"
                value={formData.parcel_weight_kg}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="0.5"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Price Offer ($)
              </label>
              <input
                type="number"
                name="price_offer"
                value={formData.price_offer}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="50"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold text-gray-700">
                Delivery Deadline
              </label>
              <input
                type="date"
                name="delivery_deadline"
                value={formData.delivery_deadline}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              />
            </div>
          </div>

          <div className="flex justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-500 hover:bg-gray-600 transition text-white py-3 px-6 rounded-lg font-semibold"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full bg-[#009ee2] hover:bg-blue-700 transition text-white py-3 px-6 rounded-lg font-semibold flex justify-center items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;