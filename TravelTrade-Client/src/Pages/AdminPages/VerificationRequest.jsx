import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaUser, FaEnvelope, FaUserCheck, FaUserTimes, FaHourglassHalf, FaEdit, FaTrash, FaSave, FaTimes, FaEye } from "react-icons/fa";

const VerificationRequest = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const api = "http://localhost:9000";

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${api}/users/verificationRequest/all`);
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setLoading(false);
    }
  };

  const handleEditStatus = (userId, currentStatus) => {
    setEditingUserId(userId);
    setNewStatus(currentStatus);
  };

  const handleStatusUpdate = async (userId) => {
    try {
      const user = users.find((u) => u._id === userId);
      if (!user) return;

      await axios.put(`${api}/users/verificationRequest/verify/${user.email}`, {
        status: newStatus,
      });

      setUsers(
        users.map((u) =>
          u._id === userId
            ? {
                ...u,
                verificationData: {
                  ...u.verificationData,
                  status: newStatus,
                },
              }
            : u
        )
      );
      setEditingUserId(null);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`${api}/users/${userId}`);
      setUsers(users.filter((u) => u._id !== userId));
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  const getStatusClass = (status) => {
    switch(status) {
      case "verified":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case "verified":
        return <FaUserCheck className="mr-2" />;
      case "pending":
        return <FaHourglassHalf className="mr-2" />;
      case "rejected":
        return <FaUserTimes className="mr-2" />;
      default:
        return <FaUser className="mr-2" />;
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-100 to-blue-300 min-h-screen p-6">
      <motion.div
        className="container mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">Verification Requests</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">
            {error}
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white shadow-xl rounded-xl p-8 text-center">
            <p className="text-lg text-gray-600">No verification requests found.</p>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-blue-900 text-white">
                  <tr>
                    <th className="py-4 px-6 text-left">Name</th>
                    <th className="py-4 px-6 text-left">Email</th>
                    <th className="py-4 px-6 text-left">Status</th>
                    <th className="py-4 px-6 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => {
                    const status = user.verificationData?.status || "pending";
                    return (
                      <tr
                        key={user._id}
                        className={`border-b border-gray-200 hover:bg-blue-50 transition duration-150 ${
                          index % 2 === 0 ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <FaUser className="text-blue-700 mr-2" />
                            {user.name || "N/A"}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center">
                            <FaEnvelope className="text-blue-700 mr-2" />
                            {user.email}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          {editingUserId === user._id ? (
                            <select
                              value={newStatus}
                              onChange={(e) => setNewStatus(e.target.value)}
                              className="border rounded px-3 py-1 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="pending">Pending</option>
                              <option value="verified">Verified</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          ) : (
                            <div className="flex items-center">
                              {getStatusIcon(status)}
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(status)}`}>
                                {status}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-6 space-x-2">
                          <motion.button
                            onClick={() => setSelectedUser(user)}
                            className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <FaEye className="mr-2" /> View
                          </motion.button>

                          {editingUserId === user._id ? (
                            <>
                              <motion.button
                                onClick={() => handleStatusUpdate(user._id)}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 flex items-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaSave className="mr-2" /> Save
                              </motion.button>
                              <motion.button
                                onClick={() => setEditingUserId(null)}
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200 flex items-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaTimes className="mr-2" /> Cancel
                              </motion.button>
                            </>
                          ) : (
                            <>
                              <motion.button
                                onClick={() => handleEditStatus(user._id, status)}
                                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition duration-200 flex items-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaEdit className="mr-2" /> Edit
                              </motion.button>
                              <motion.button
                                onClick={() => handleDeleteUser(user._id)}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 flex items-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaTrash className="mr-2" /> Delete
                              </motion.button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>

      {/* User Details Modal */}
      {selectedUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] relative overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-blue-900 text-white p-4 flex justify-between items-center sticky top-0 z-10">
              <h2 className="text-2xl font-semibold">User Verification Details</h2>
              <button
                onClick={closeModal}
                className="text-white hover:text-gray-200 transition duration-200 text-2xl"
              >
                ✖
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-64px)] space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <FaUser className="text-blue-800 text-xl mr-3 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">Basic Information</h3>
                    <div className="grid md:grid-cols-2 gap-4 mt-2">
                      <div>
                        <span className="text-gray-600 font-medium">Name:</span>
                        <p className="text-blue-800">{selectedUser.name || "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 font-medium">Email:</span>
                        <p className="text-blue-800">{selectedUser.email || "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 font-medium">Role:</span>
                        <p className="text-blue-800">{selectedUser.role || "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 font-medium">Phone:</span>
                        <p className="text-blue-800">{selectedUser.mobile || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <FaUserCheck className="text-blue-800 text-xl mr-3 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">Verification Information</h3>
                    <div className="grid md:grid-cols-2 gap-4 mt-2">
                      <div>
                        <span className="text-gray-600 font-medium">Occupation:</span>
                        <p className="text-blue-800">{selectedUser.verificationData?.occupation || "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 font-medium">Nationality:</span>
                        <p className="text-blue-800">{selectedUser.verificationData?.nationality || "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 font-medium">Status:</span>
                        <p>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(selectedUser.verificationData?.status || "pending")}`}>
                            {selectedUser.verificationData?.status || "Pending"}
                          </span>
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600 font-medium">LinkedIn:</span>
                        <p className="text-blue-800">{selectedUser.verificationData?.linkedin || "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-gray-600 font-medium">Facebook:</span>
                        <p className="text-blue-800">{selectedUser.verificationData?.facebook || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">Profile Photo</h3>
                {selectedUser.verificationData?.profilePhoto ? (
                  <img 
                    src={selectedUser.verificationData.profilePhoto} 
                    alt="Profile" 
                    className="max-w-full h-auto rounded-lg border border-gray-200"
                  />
                ) : (
                  <p className="text-gray-500">No profile photo uploaded</p>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">NID Photo</h3>
                {selectedUser.verificationData?.nidPhoto ? (
                  <img 
                    src={selectedUser.verificationData.nidPhoto} 
                    alt="NID" 
                    className="max-w-full h-auto rounded-lg border border-gray-200"
                  />
                ) : (
                  <p className="text-gray-500">No NID photo uploaded</p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default VerificationRequest;