// Profile.jsx
import { useState } from "react";
import useUserData from "../../../hooks/useUserData";
import toast from "react-hot-toast";
import ProfileHeader from "./components/ProfileHeader";
import ContactInfo from "./components/ContactInfo";
import VerificationDetails from "./components/VerificationDetails";
import VerificationButton from "./components/VerificationButton";
import VerificationModal from "./components/VerificationModal";
import axios from "axios";

const Profile = () => {
  const [verificationForm, setVerificationForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userData, loading, updateProfilePhoto } = useUserData();
  
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

  // Update form data when user data is loaded
  useState(() => {
    if (userData) {
      setFormData({
        fullName: userData.name || "",
        phone: userData.mobile || "",
        occupation: userData.verificationData?.occupation || "",
        linkedin: userData.verificationData?.linkedin || "",
        facebook: userData.verificationData?.facebook || "",
        nationality: userData.verificationData?.nationality || "",
        profilePhoto: null,
        nidPhoto: null,
      });
    }
  }, [userData]);

  const handleSubmitVerification = async (formData) => {
    setIsSubmitting(true);
    const imgbbApi = "7f3a98e5b9235e50d10ab2af5590caa9";

    try {
      let photoUrl = userData.photo;
      
      if (formData.profilePhoto) {
        const formDataImg = new FormData();
        formDataImg.append("image", formData.profilePhoto);
        const uploadRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imgbbApi}`,
          formDataImg
        );
        photoUrl = uploadRes.data.data.url;
      }

      const verificationData = {
        ...formData,
        profilePhoto: photoUrl,
        email: userData.email,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      await axios.put(`http://localhost:9000/users/${userData.email}`, {
        verificationData: verificationData,
        verificationStatus: "pending"
      });

      toast.success("Verification request submitted successfully!");
      setVerificationForm(false);
    } catch (error) {
      console.error("Failed to submit verification:", error);
      toast.error("Failed to submit verification request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProfilePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size should be less than 2MB");
      return;
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a JPG or PNG image");
      return;
    }
    
    const loadingToast = toast.loading("Uploading photo...");
    await updateProfilePhoto(file);
    toast.dismiss(loadingToast);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#009ee2]"></div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center h-80">
        <p className="text-gray-500 text-lg">Failed to load profile data</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-[#009ee2] text-white rounded-md hover:bg-[#0088c6]"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
      <ProfileHeader 
        userData={userData} 
        onPhotoChange={handleProfilePhotoChange} 
      />
      
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