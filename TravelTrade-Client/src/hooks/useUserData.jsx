import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAuth from './useAuth';

const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchUserData = async (email) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:9000/users/${email}`);
      setUserData(data);
      setError(null);
      return data;
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setError("Failed to load user data");
      toast.error("Failed to load user data");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateUserData = async (updateData) => {
    if (!user?.email) return null;
    
    try {
      const response = await axios.put(
        `http://localhost:9000/users/${user.email}`, 
        updateData
      );
      
      if (response.data.success) {
        // Refresh user data after update
        const updatedData = await fetchUserData(user.email);
        toast.success("Profile updated successfully!");
        return updatedData;
      }
      return null;
    } catch (error) {
      console.error("Failed to update user data:", error);
      toast.error("Failed to update profile");
      return null;
    }
  };

  const updateProfilePhoto = async (photoFile) => {
    if (!photoFile || !user?.email) return null;
    
    const imgbbApi = "7f3a98e5b9235e50d10ab2af5590caa9";
    
    try {
      // Upload to ImgBB
      const formDataImg = new FormData();
      formDataImg.append("image", photoFile);
      
      const uploadRes = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imgbbApi}`,
        formDataImg
      );
      
      const photoUrl = uploadRes.data.data.url;
      
      // Update user profile with new photo URL
      return await updateUserData({ photo: photoUrl });
    } catch (error) {
      console.error("Failed to upload photo:", error);
      toast.error("Failed to upload photo");
      return null;
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchUserData(user.email);
    }
  }, [user?.email]);

  return {
    userData,
    loading,
    error,
    fetchUserData,
    updateUserData,
    updateProfilePhoto
  };
};

export default useUserData;