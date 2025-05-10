// components/PostActions.jsx
import { motion } from "framer-motion";
import { FaEye, FaCheck, FaTimes } from "react-icons/fa";

const PostActions = ({ 
  postId, 
  editingPostId, 
  setEditingPostId, 
  setExpandedPostId,
  handlePostStatusUpdate
}) => {
  return (
    <div className="flex space-x-2">
      {editingPostId === postId ? (
        <>
          <motion.button
            onClick={() => handlePostStatusUpdate(postId)}
            className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaCheck />
          </motion.button>
          <motion.button
            onClick={() => setEditingPostId(null)}
            className="bg-gray-600 text-white p-2 rounded-lg hover:bg-gray-700 transition duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaTimes />
          </motion.button>
        </>
      ) : (
        <>
          <motion.button
            onClick={() => setEditingPostId(postId)}
            className="bg-[#009ee2] text-white p-2 rounded-lg hover:bg-[#0088c6] transition duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaCheck />
          </motion.button>
          <motion.button
            onClick={() => setExpandedPostId(postId)}
            className="bg-[#009ee2] text-white p-2 rounded-lg hover:bg-[#0088c6] transition duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaEye />
          </motion.button>
        </>
      )}
    </div>
  );
};

export default PostActions;