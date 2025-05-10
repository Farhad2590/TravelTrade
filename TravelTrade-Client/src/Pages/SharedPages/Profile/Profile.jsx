// Profile.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import ProfileHeader from "./components/ProfileHeader";
import ContactInfo from "./components/ContactInfo";
import VerificationDetails from "./components/VerificationDetails";
import VerificationButton from "./components/VerificationButton";
import VerificationModal from "./components/VerificationModal";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [verificationForm, setVerificationForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    occupation: "",
    linkedin: "",
    facebook: "",
    nationality: "",
    profilePhoto: null,
    nidPhoto: null,
  });
  const { user } = useAuth();

  useEffect(() => {
    if (user?.email) {
      fetchUserData(user.email);
    }
  }, [user?.email]);

  const fetchUserData = async (email) => {
    try {
      const { data } = await axios.get(`http://localhost:9000/users/${email}`);
      setUserData(data);
      setFormData({
        fullName: data.name || "",
        phone: data.mobile || "",
        occupation: data.verificationData?.occupation || "",
        linkedin: data.verificationData?.linkedin || "",
        facebook: data.verificationData?.facebook || "",
        nationality: data.verificationData?.nationality || "",
        profilePhoto: null,
        nidPhoto: null,
      });
    } catch (error) {
      console.error("Failed to fetch user:", error);
      toast.error("Failed to load profile data");
    }
  };

  const handleSubmitVerification = async (formData) => {
    setIsSubmitting(true);
    const imgbbApi = "7f3a98e5b9235e50d10ab2af5590caa9";

    try {
      let photoUrl = userData.photo;
      let nidUrl = userData.photo;
      
      if (formData.profilePhoto) {
        const formDataImg = new FormData();
        formDataImg.append("image", formData.profilePhoto);
        const uploadRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imgbbApi}`,
          formDataImg
        );
        photoUrl = uploadRes.data.data.url;
      }

      if (formData.nidPhoto) {
        const formDataImg = new FormData();
        formDataImg.append("image", formData.nidPhoto);
        const uploadRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imgbbApi}`,
          formDataImg
        );
        nidUrl = uploadRes.data.data.url;
      }

      const verificationData = {
        ...formData,
        profilePhoto: photoUrl,
        nidPhoto: nidUrl,
        email: user.email,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      await axios.put(`http://localhost:9000/users/${user.email}`, {
        verificationData: verificationData,
        verificationStatus: "pending"
      });

      toast.success("Verification request submitted successfully!");
      setVerificationForm(false);
      fetchUserData(user.email);
    } catch (error) {
      console.error("Failed to submit verification:", error);
      toast.error("Failed to submit verification request");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#009ee2]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
      <ProfileHeader userData={userData} />
      
      <div className="relative px-6 pb-6">
        <ContactInfo userData={userData} />
        
        {userData.verificationStatus === "verified" && userData.verificationData && (
          <VerificationDetails verificationData={userData.verificationData} />
        )}
      </div>

      {(userData.verificationStatus !== "verified" && userData.verificationStatus !== "pending") && (
        <VerificationButton 
          status={userData.verificationStatus || "not_submitted"} 
          onRequestVerification={() => setVerificationForm(true)}
        />
      )}

      {verificationForm && (
        <VerificationModal
          formData={formData}
          setFormData={setFormData}
          isSubmitting={isSubmitting}
          onClose={() => setVerificationForm(false)}
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitVerification(formData);
          }}
        />
      )}
    </div>
  );
};

export default Profile;