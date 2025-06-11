import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";
import LoadingSpinner from "../../../../Components/SharedComponets/LoadingSpinner";
import toast from "react-hot-toast";

const RequestPage = () => {
  const { id, type } = useParams();
  const api = "http://localhost:9000";
  const [post, setPost] = useState({});
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    parcel_type: "",
    parcel_description: "",
    parcel_weight_kg: "",
    accepted_terms: false,
    ...(type === "bring" && { security_deposit: "" }),
  });
  const [totalCost, setTotalCost] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImportantParcel, setIsImportantParcel] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();
  console.log(userData);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const response = await axios.get(`${api}/travelPost/post/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error("Error fetching post details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostDetails();
  }, [id]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${api}/users/${user?.email}`);
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching post details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);
  // console.log(post);

  // Calculate total cost whenever parcel weight or security deposit changes
  useEffect(() => {
    if (post?.costPerKg && formData.parcel_weight_kg) {
      const weightCost =
        parseFloat(formData.parcel_weight_kg) * parseFloat(post.costPerKg);
      const securityDeposit =
        type === "bring" && formData.security_deposit
          ? parseFloat(formData.security_deposit)
          : 0;
      setTotalCost(weightCost + securityDeposit);
    } else {
      setTotalCost(0);
    }
  }, [
    formData.parcel_weight_kg,
    formData.security_deposit,
    post.costPerKg,
    type,
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const finalData = {
      ...formData,
      isImportantParcel,
      request_type: type,
      postId: id,
      travelerEmail: post.email,
      senderEmail: user.email,
      senderName: user.displayName,
      costPerKg: post.costPerKg,
      totalCost: totalCost.toFixed(2),
      departureCity: post.departureCity,
      arrivalCity: post.arrivalCity,
      travelDate: post.departureDateTime?.slice(0, 10),
      travelerId: userData.firebaseId,
    };

    try {
      await axios.post(`${api}/bids`, finalData);
      toast.success("Request submitted successfully!");
      navigate(`/dashboard/my-bids`);
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-[#009ee2]">
          {type === "send" ? "Send Parcel Request" : "Bring Parcel Request"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Parcel Type <span className="text-red-500">*</span>
              </label>
              <select
                name="parcel_type"
                value={formData.parcel_type}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                required
              >
                <option value="">Select Parcel Type</option>
                {post.parcelTypes?.split(",").map((type, index) => (
                  <option key={index} value={type.trim()}>
                    {type.trim()}
                  </option>
                ))}
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Parcel Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="parcel_description"
                value={formData.parcel_description}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                rows="3"
                placeholder="Describe the parcel in detail..."
                required
              />
            </div>
            {type === "send" && (
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="important"
                    name="isImportantParcel"
                    type="checkbox"
                    checked={isImportantParcel}
                    onChange={(e) => setIsImportantParcel(e.target.checked)}
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                  />
                </div>
                <label
                  htmlFor="important"
                  className="ml-3 text-sm font-medium text-gray-700"
                >
                  This parcel contains high-value items (requires blank check
                  from traveler)
                </label>
              </div>
            )}

            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Parcel Weight (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="parcel_weight_kg"
                step="0.1"
                min="0.1"
                max={post.maxWeight}
                value={formData.parcel_weight_kg}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder={`Enter weight in kilograms (max ${post.maxWeight}kg)`}
                required
              />
              {formData.parcel_weight_kg && post?.costPerKg && (
                <p className="text-sm text-gray-600 mt-1">
                  Shipping Cost: {formData.parcel_weight_kg} kg ×{" "}
                  {post.costPerKg} Taka/kg ={" "}
                  {parseFloat(formData.parcel_weight_kg) *
                    parseFloat(post.costPerKg)}{" "}
                  Taka
                </p>
              )}
              {formData.parcel_weight_kg &&
                parseFloat(formData.parcel_weight_kg) >
                  parseFloat(post.maxWeight) && (
                  <p className="text-sm text-red-600 mt-1">
                    Traveller Can allow weight is {post.maxWeight} kg
                  </p>
                )}
            </div>

            {type === "bring" && (
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Security Deposit (Taka){" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="security_deposit"
                  min="0"
                  value={formData.security_deposit}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Amount in Taka"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  This amount will be used if the traveler needs to purchase
                  items for you.
                </p>
              </div>
            )}

            {totalCost > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-bold text-lg text-blue-800">
                  Total Cost Summary
                </h3>
                <div className="mt-2 space-y-1">
                  <p className="flex justify-between">
                    <span>Shipping Cost:</span>
                    <span>
                      {parseFloat(formData.parcel_weight_kg) *
                        parseFloat(post.costPerKg)}{" "}
                      Taka
                    </span>
                  </p>
                  {type === "bring" && formData.security_deposit && (
                    <p className="flex justify-between">
                      <span>Security Deposit:</span>
                      <span>{formData.security_deposit} Taka</span>
                    </p>
                  )}
                  <p className="flex justify-between font-bold text-blue-900 border-t pt-2 mt-2">
                    <span>Total Amount:</span>
                    <span>{totalCost.toFixed(2)} Taka</span>
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="accepted_terms"
                  type="checkbox"
                  checked={formData.accepted_terms}
                  onChange={handleChange}
                  className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                  required
                />
              </div>
              <label
                htmlFor="terms"
                className="ml-3 text-sm font-medium text-gray-700"
              >
                I have read and accept all details of the travel schedule
              </label>
            </div>
          </div>

          <div className="flex justify-between gap-4 pt-2">
            <button
              type="button"
              onClick={() => navigate(`/post/${id}`)}
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
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestPage;
