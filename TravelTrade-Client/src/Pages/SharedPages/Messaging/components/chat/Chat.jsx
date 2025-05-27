import EmojiPicker from "emoji-picker-react";
import { doc, onSnapshot, updateDoc, arrayUnion, serverTimestamp, getDoc } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { db } from "../../../../../firebase/firebase.configue";
import { useChatStore } from "../../../../../hooks/chatStore";
import { useUserStore } from "../../../../../hooks/userStore";
import { Send, Image, Camera, Mic, Smile, Phone, Video, Info } from "lucide-react";

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [chat, setChat] = useState(null);
  
  const endRef = useRef(null);
  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  useEffect(() => {
    if (!chatId) return;

    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => unSub();
  }, [chatId]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleSend = async () => {
    if (!text.trim() || !chatId || !currentUser?.id) return;
    if (isCurrentUserBlocked || isReceiverBlocked) return;

    try {
      // Fix: Use Date.now() instead of serverTimestamp() inside arrayUnion
      const now = Date.now();
      
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: now,
        }),
        lastUpdated: serverTimestamp() // We can still use serverTimestamp here
      });

      // Update last message in userchats for both users
      const userChatsRef = doc(db, "userchats", currentUser.id);
      const userChatsSnap = await getDoc(userChatsRef);
      
      if (userChatsSnap.exists()) {
        await updateDoc(userChatsRef, {
          chats: userChatsSnap.data().chats.map((c) => 
            c.chatId === chatId ? { ...c, lastMessage: text, updatedAt: now } : c
          ),
        });
      }

      if (user?.id) {
        const receiverChatsRef = doc(db, "userchats", user.id);
        const receiverChatsSnap = await getDoc(receiverChatsRef);
        
        if (receiverChatsSnap.exists()) {
          await updateDoc(receiverChatsRef, {
            chats: receiverChatsSnap.data().chats.map((c) => 
              c.chatId === chatId ? { ...c, lastMessage: text, updatedAt: now } : c
            ),
          });
        }
      }

      setText("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Helper function to format message timestamps
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Just now";
    
    // Handle both Firestore Timestamp and numeric timestamps
    if (typeof timestamp.toDate === 'function') {
      return timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (typeof timestamp === 'number') {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    return "Just now";
  };

  if (!chatId) {
    return (
      <div className="flex-[2] bg-gradient-to-br from-slate-50 to-blue-50 h-full flex flex-col items-center justify-center rounded-r-lg">
        <div className="p-8 bg-white rounded-2xl shadow-lg flex flex-col items-center max-w-md text-center">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center mb-6">
            <Send size={36} className="text-blue-500 transform -rotate-45" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Start Messaging</h3>
          <p className="text-gray-600">Select a conversation from the list or start a new chat to begin messaging</p>
        </div>
      </div>
    );
  }

  const isOnline = !isCurrentUserBlocked && !isReceiverBlocked;
  const statusColor = isOnline ? "bg-green-500" : "bg-gray-400";
  const statusText = isCurrentUserBlocked 
    ? "You are blocked" 
    : isReceiverBlocked 
      ? "User is blocked" 
      : "Online";

  return (
    <div className="flex-[2] bg-white h-full flex flex-col rounded-r-lg overflow-hidden shadow-xl">
      <div className="p-5 flex items-center justify-between border-b border-gray-100 bg-white shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={user?.avatar || "/avatar.png"} 
              alt={user?.username || "User"} 
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
            />
            <span className={`absolute bottom-0 right-0 w-3 h-3 ${statusColor} rounded-full border-2 border-white`}></span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-800">{user?.username || "User"}</span>
            <p className="text-xs font-medium text-gray-500 flex items-center gap-1">
              <span className={`inline-block w-2 h-2 ${statusColor} rounded-full`}></span>
              {statusText}
            </p>
          </div>
        </div>
        <div className="flex gap-5">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Phone size={18} className="text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Video size={18} className="text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Info size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-5 flex-1 overflow-auto flex flex-col gap-6 bg-gradient-to-br from-slate-50 to-blue-50">
        {chat?.messages?.map((message, index) => {
          const isSender = message.senderId === currentUser?.id;
          
          return (
            <div
              key={message?.createdAt || index}
              className={`max-w-[70%] flex gap-3 ${
                isSender ? "self-end flex-row-reverse" : ""
              }`}
            >
              <div className="shrink-0">
                <img 
                  src={
                    isSender 
                      ? currentUser?.avatar || "/avatar.png"
                      : user?.avatar || "/avatar.png"
                  } 
                  alt="" 
                  className="w-8 h-8 rounded-full object-cover border border-white shadow-sm"
                />
              </div>
              <div className={`flex flex-col ${isSender ? "items-end" : "items-start"}`}>
                <div className={`p-3 rounded-2xl shadow-sm ${
                  isSender 
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                    : "bg-white text-gray-800 border border-gray-100"
                }`}>
                  <p className="text-sm">{message.text}</p>
                </div>
                <span className="text-xs text-gray-500 mt-1 px-2">
                  {formatTimestamp(message.createdAt)}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={endRef}></div>
      </div>

      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex items-center gap-3 bg-gray-50 rounded-full px-4 py-2 shadow-sm">
          <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Image size={18} className="text-gray-500" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Camera size={18} className="text-gray-500" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <Mic size={18} className="text-gray-500" />
            </button>
          </div>
          
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder={
              isCurrentUserBlocked || isReceiverBlocked
                ? "You cannot send messages"
                : "Type a message..."
            }
            disabled={isCurrentUserBlocked || isReceiverBlocked}
            className="flex-1 bg-transparent border-none outline-none text-gray-800 py-2 px-3 text-sm"
          />
          
          <div className="relative">
            <button 
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setOpen((prev) => !prev)}
            >
              <Smile size={18} className="text-gray-500" />
            </button>
            <div className="absolute bottom-12 right-0 z-10">
              <EmojiPicker open={open} onEmojiClick={handleEmoji} />
            </div>
          </div>
          
          <button
            className={`p-2 rounded-full ${
              !text.trim() || isCurrentUserBlocked || isReceiverBlocked
                ? "bg-gray-200 text-gray-400"
                : "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg"
            } transition-all`}
            onClick={handleSend}
            disabled={!text.trim() || isCurrentUserBlocked || isReceiverBlocked}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;