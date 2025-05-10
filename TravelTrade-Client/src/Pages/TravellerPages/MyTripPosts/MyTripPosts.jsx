import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaMapMarkerAlt, FaPlane } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import TripDetailsModal from "./components/TripDetailsModal"; 

const MyTripPosts = () => {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPostId, setExpandedPostId] = useState(null);

  const api = "http://localhost:9000";

  useEffect(() => {
    if (user?.email) {
      fetchAllPosts();
    }
  }, [user]);

  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${api}/travelPost/my-posts/${user.email}`
      );

      setPosts(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      console.error(err);
      setLoading(false);
    }
  };

  // Format the date string to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-[#009ee2sss] min-h-screen p-6">
      <motion.div
        className="container mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-center text-[#009ee2] mb-8">
          My Trip Posts
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#009ee2]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white shadow-xl rounded-xl p-8 text-center">
            <p className="text-lg text-gray-600">
              You haven't posted any trips yet.
            </p>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-[#009ee2] text-white">
                  <tr>
                    {posts[0]?.category && (
                      <th className="py-4 px-6 text-left">Category</th>
                    )}
                    <th className="py-4 px-6 text-left">From</th>
                    <th className="py-4 px-6 text-left">To</th>
                    <th className="py-4 px-6 text-left">Flight Date</th>
                    <th className="py-4 px-6 text-left">Status</th>
                    <th className="py-4 px-6 text-left">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post, index) => (
                    <tr
                      key={post._id}
                      className={`border-b border-gray-200 hover:bg-blue-50 transition duration-150 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      {post.category && (
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <span className="capitalize">
                              {post.category || "N/A"}
                            </span>
                          </div>
                        </td>
                      )}
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="text-[#009ee2] mr-2" />
                          {post.departureCity || "N/A"}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <FaMapMarkerAlt className="text-[#009ee2] mr-2" />
                          {post.arrivalCity || "N/A"}
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <FaPlane className="text-[#009ee2] mr-2" />
                          {formatDate(post.departureDateTime)}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                            post.status
                          )}`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <motion.button
                          onClick={() => setExpandedPostId(post._id)}
                          className="bg-[#009ee2] text-white px-4 py-2 rounded-lg hover:bg-[#007bb5] transition duration-200 flex items-center"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <FaEye />
                        </motion.button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>

      {/* Render the TripDetailsModal */}
      {expandedPostId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          onClick={() => setExpandedPostId(null)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] relative overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#009ee2] text-white p-4 flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-2xl font-semibold">Trip Details</h2>
              <button
                onClick={() => setExpandedPostId(null)}
                className="text-white hover:text-gray-200 transition duration-200 text-2xl"
              >
                ✖
              </button>
            </div>
            <TripDetailsModal
              post={posts.find((post) => post._id === expandedPostId)}
              onClose={() => setExpandedPostId(null)}
              formatDate={formatDate}
              getStatusClass={getStatusClass}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default MyTripPosts;