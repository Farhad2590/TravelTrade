import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaUserShield,
  FaUserCheck,
  FaUserTimes,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
} from "react-icons/fa";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUserId, setEditingUserId] = useState(null);
  const [newRole, setNewRole] = useState("");
  const api = "http://localhost:9000";

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:9000/users`);
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      setLoading(false);
    }
  };

  const handleEditRole = (userId, currentRole) => {
    setEditingUserId(userId);
    setNewRole(currentRole);
  };

  const handleRoleUpdate = async (userId) => {
    try {
      const user = users.find((u) => u._id === userId);
      if (!user) return;

      await axios.put(`${api}/users/updateUserRole/${user.email}`, {
        role: newRole,
      });

      setUsers(
        users.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
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

  const getRoleClass = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800";
      case "traveler":
        return "bg-blue-100 text-blue-800";
      case "sender":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <FaUserShield className="mr-2" />;
      case "traveler":
        return <FaUser className="mr-2" />;
      case "sender":
        return <FaUser className="mr-2" />;
      default:
        return <FaUser className="mr-2" />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
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
    switch (status) {
      case "verified":
        return <FaUserCheck className="mr-2" />;
      case "pending":
        return <FaUser className="mr-2" />;
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
        <h1 className="text-3xl font-bold text-center text-blue-900 mb-8">
          User Management
        </h1>

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
            <p className="text-lg text-gray-600">No users found.</p>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-blue-900 text-white">
                  <tr>
                    <th className="py-4 px-6 text-left">Name</th>
                    <th className="py-4 px-6 text-left">Email</th>
                    <th className="py-4 px-6 text-left">Role</th>
                    <th className="py-4 px-6 text-left">Status</th>
                    <th className="py-4 px-6 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
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
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value)}
                            className="border rounded px-3 py-1 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="admin">Admin</option>
                            <option value="traveler">Traveler</option>
                            <option value="sender">Sender</option>
                          </select>
                        ) : (
                          <div className="flex items-center">
                            {getRoleIcon(user.role)}
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleClass(
                                user.role
                              )}`}
                            >
                              {user.role}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          {getStatusIcon(
                            user.verificationData?.status || "unverified"
                          )}
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(
                              user.verificationData?.status || "unverified"
                            )}`}
                          >
                            {user.verificationData?.status || "Unverified"}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-2">
                          {editingUserId === user._id ? (
                            <>
                              <motion.button
                                onClick={() => handleRoleUpdate(user._id)}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 flex items-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaSave />
                              </motion.button>
                              <motion.button
                                onClick={() => setEditingUserId(null)}
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200 flex items-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaTimes />
                              </motion.button>
                            </>
                          ) : (
                            <>
                              <motion.button
                                onClick={() =>
                                  handleEditRole(user._id, user.role)
                                }
                                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition duration-200 flex items-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaEdit />
                              </motion.button>
                              <motion.button
                                onClick={() => handleDeleteUser(user._id)}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200 flex items-center"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <FaTrash />
                              </motion.button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UserManagement;
