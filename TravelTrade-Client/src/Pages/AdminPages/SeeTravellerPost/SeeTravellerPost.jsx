// SeePendingPost.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {  FaMapMarkerAlt, FaPlane } from "react-icons/fa";
import useAuth from "../../../hooks/useAuth";
import PostStatusBadge from "./components/PostStatusBadge";
import PostActions from "./components/PostActions";
import PostDetailModal from "./components/PostDetailModal";

const SeeTravellerPost = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [postStatus, setPostStatus] = useState("pending");
  const [editingPostId, setEditingPostId] = useState(null);

  const api = "http://localhost:9000";

  useEffect(() => {
    if (user?.email) {
      fetchAllPosts();
    }
  }, [user?.email]);

  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api}/travelPost/pending`);
      setPosts(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setLoading(false);
    }
  };

  const handlePostStatusUpdate = async (postId) => {
    try {
      const post = posts.find((p) => p._id === postId);
      if (!post) return;

      await axios.put(`${api}/travelPost/status`, {
        postId: post._id,
        status: postStatus,
      });

      fetchAllPosts();
      setEditingPostId(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen p-6">
      <motion.div
        className="container mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-center text-[#009ee2] mb-8">Post Review</h1>
        
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
            <p className="text-lg text-gray-600">No posts to review.</p>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-[#009ee2] text-white">
                  <tr>
                    <th className="py-4 px-6 text-left">From</th>
                    <th className="py-4 px-6 text-left">To</th>

                    <th className="py-4 px-6 text-left">Flight Date</th>
                    <th className="py-4 px-6 text-left">Status</th>
                    <th className="py-4 px-6 text-left">Actions</th>
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
                        {editingPostId === post._id ? (
                          <select
                            value={postStatus}
                            onChange={(e) => setPostStatus(e.target.value)}
                            className="border rounded px-3 py-1 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#009ee2]"
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        ) : (
                          <PostStatusBadge status={post.status} />
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <PostActions
                          postId={post._id}
                          editingPostId={editingPostId}
                          setEditingPostId={setEditingPostId}
                          setExpandedPostId={setExpandedPostId}
                          handlePostStatusUpdate={handlePostStatusUpdate}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>

      {expandedPostId && (
        <PostDetailModal
          post={posts.find(post => post._id === expandedPostId)}
          onClose={() => setExpandedPostId(null)}
        />
      )}
    </div>
  );
};

export default SeeTravellerPost;