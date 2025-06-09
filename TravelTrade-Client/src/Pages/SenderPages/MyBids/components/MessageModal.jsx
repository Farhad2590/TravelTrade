import { useState } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane, FaTimes } from "react-icons/fa";
import { db } from "../../../../firebase/firebase.configue";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../../../../hooks/chatStore";
import { useUserStore } from "../../../../hooks/userStore";

const MessageModal = ({ order, onClose, currentUser }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { changeChat } = useChatStore();
  const { currentUser: firebaseUser } = useUserStore();
  console.log(order);
  

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setError("");

    if (!message.trim()) {
      setError("Message cannot be empty");
      return;
    }

    if (!firebaseUser?.id) {
      setError("Current user information is missing");
      return;
    }

    if (!order?.travelerId) {
      setError("No traveler information found in this order");
      return;
    }

    setLoading(true);

    try {
      const travelerId = order.travelerId;
      const travelerRef = doc(db, "users", travelerId);
      const travelerSnap = await getDoc(travelerRef);

      if (!travelerSnap.exists()) {
        throw new Error("Traveler not found in Firebase");
      }

      const traveler = travelerSnap.data();

      // Check for existing chat between users
      const userChatsRef = doc(db, "userchats", firebaseUser.id);
      const userChatsSnap = await getDoc(userChatsRef);

      let chatId;
      let existingChat = null;

      if (userChatsSnap.exists()) {
        existingChat = userChatsSnap
          .data()
          .chats?.find((chat) => chat.receiverId === travelerId);
      }

      if (existingChat) {
        chatId = existingChat.chatId;
      } else {
        // Create new chat
        const newChatRef = doc(collection(db, "chats"));
        chatId = newChatRef.id;

        await setDoc(newChatRef, {
          createdAt: serverTimestamp(),
          messages: [],
          participants: [firebaseUser.id, travelerId],
        });

        // Prepare chat data for both users
        const newChatData = {
          chatId,
          lastMessage: message,
          receiverId: travelerId,
          updatedAt: Date.now(),
        };

        const newTravelerChatData = {
          chatId,
          lastMessage: message,
          receiverId: firebaseUser.id,
          updatedAt: Date.now(),
        };

        // Update current user's chats
        if (userChatsSnap.exists()) {
          await updateDoc(userChatsRef, {
            chats: arrayUnion(newChatData),
          });
        } else {
          await setDoc(userChatsRef, {
            userId: firebaseUser.id,
            chats: [newChatData],
          });
        }

        // Update traveler's chats
        const travelerChatsRef = doc(db, "userchats", travelerId);
        const travelerChatsSnap = await getDoc(travelerChatsRef);

        if (travelerChatsSnap.exists()) {
          await updateDoc(travelerChatsRef, {
            chats: arrayUnion(newTravelerChatData),
          });
        } else {
          await setDoc(travelerChatsRef, {
            userId: travelerId,
            chats: [newTravelerChatData],
          });
        }
      }

      // Add the message to the chat - FIXED: Use Date.now() instead of serverTimestamp()
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: firebaseUser.id,
          text: message,
          createdAt: Date.now(), // Changed from serverTimestamp() to Date.now()
        }),
      });

      // Update last message in userchats
      const userChatsData = userChatsSnap.exists() ? userChatsSnap.data().chats : [];
      await updateDoc(doc(db, "userchats", firebaseUser.id), {
        chats: userChatsData.map((chat) => 
          chat.chatId === chatId ? { ...chat, lastMessage: message, updatedAt: Date.now() } : chat
        ),
      });

      // Get fresh traveler chats data
      const travelerChatsRef = doc(db, "userchats", travelerId);
      const travelerChatsSnap = await getDoc(travelerChatsRef);
      const travelerChatsData = travelerChatsSnap.exists() ? travelerChatsSnap.data().chats : [];
      
      await updateDoc(travelerChatsRef, {
        chats: travelerChatsData.map((chat) => 
          chat.chatId === chatId ? { ...chat, lastMessage: message, updatedAt: Date.now() } : chat
        ),
      });

      changeChat(chatId, traveler);
      navigate("/dashboard/messaging");
    } catch (err) {
      console.error("Error sending message:", err);
      setError(err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl p-6 w-full max-w-md"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Message Traveler
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSendMessage} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Write your message here..."
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition flex items-center"
            >
              {loading ? (
                <span className="animate-spin mr-2">↻</span>
              ) : (
                <FaPaperPlane className="mr-2" />
              )}
              Send
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default MessageModal;