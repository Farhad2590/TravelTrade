import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../../../hooks/useAuth";
import TripDetailsCard from "../../../../Components/PostComponents/TripDetailsCard";
import TravelerCard from "../../../../Components/PostComponents/TravelerCard";
import InitialModal from "./InitialModal";
import LoadingSpinner from "../../../../Components/SharedComponets/LoadingSpinner";

const PostDetails = () => {
  const { id } = useParams();
  const api = "http://localhost:9000";
  const [post, setPost] = useState({});
  const [singleUser, setSingleUser] = useState({});
  const [showInitialModal, setShowInitialModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();

  useEffect(() => {
    fetchPostDetails();
  }, []);

  useEffect(() => {
    if (post?.email) {
      fetchSingleUser();
    }
  }, [post]);

  const fetchPostDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${api}/travelPost/all-public`);
      const singlePost = response.data.posts.find((post) => post._id === id);
      setPost(singlePost || {});
    } catch (error) {
      console.error("Error fetching post details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSingleUser = async () => {
    try {
      const response = await axios.get(`${api}/users/${post?.email}`);
      setSingleUser(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-10 text-[#009ee2]">Travel Details</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <TripDetailsCard post={post} />
          </div>

          <div>
            <TravelerCard 
              traveler={singleUser} 
              onRequestClick={() => setShowInitialModal(true)} 
            />
          </div>
        </div>
      </div>

      {showInitialModal && (
        <InitialModal 
          onClose={() => setShowInitialModal(false)}
          postId={id}
        />
      )}
    </div>
  );
};

export default PostDetails;