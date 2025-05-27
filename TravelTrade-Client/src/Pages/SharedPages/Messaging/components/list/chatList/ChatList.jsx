import { useEffect, useState } from "react";
import { useUserStore } from "../../../../../../hooks/userStore";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../../../../../firebase/firebase.configue";
import { useChatStore } from "../../../../../../hooks/chatStore";
import { UserCircle, Clock, Search, PlusCircle, Inbox, Star, Archive } from "lucide-react";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const { currentUser } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  useEffect(() => {
    if (!currentUser?.id) return;

    const unSub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        if (!res.exists()) {
          setChats([]);
          return;
        }

        const items = res.data().chats || [];

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);

          const user = userDocSnap.exists() ? userDocSnap.data() : null;
          return { ...item, user };
        });

        const chatData = await Promise.all(promises);
        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => unSub();
  }, [currentUser?.id]);

  const handleSelect = (chat) => {
    if (chat.user) {
      changeChat(chat.chatId, chat.user);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  const getStatusIndicator = (chat) => {
    // This is a placeholder. In a real app, you'd check user's online status
    const isOnline = Math.random() > 0.5; // Random for demo purposes
    return isOnline ? "bg-green-500" : "bg-gray-300";
  };

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (chat.lastMessage?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (activeFilter === "all") return matchesSearch;
    if (activeFilter === "unread") return matchesSearch && chat.unread; // You would need to add unread property
    if (activeFilter === "starred") return matchesSearch && chat.starred; // You would need to add starred property
    
    return matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      {/* Search and filters */}
      <div className="p-4 border-b border-gray-100">
        {/* <div className="relative mb-3">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-2 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#009ee2] focus:border-transparent"
          />
        </div> */}
        
        <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
              activeFilter === "all" 
                ? "bg-blue-100 text-blue-600" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Chats
          </button>
          <button 
            onClick={() => setActiveFilter("unread")}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
              activeFilter === "unread" 
                ? "bg-blue-100 text-blue-600" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Unread
          </button>
          <button 
            onClick={() => setActiveFilter("starred")}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
              activeFilter === "starred" 
                ? "bg-blue-100 text-blue-600" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Starred
          </button>
        </div>
      </div>
      
      {/* Chat categories */}
      {/* <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-gray-700">Chat Categories</h3>
          <button className="text-[#009ee2] hover:text-blue-600 text-sm font-medium">
            Edit
          </button>
        </div>
        
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer">
            <Inbox size={18} className="text-[#009ee2] mb-1" />
            <span className="text-xs font-medium">Inbox</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer">
            <Star size={18} className="text-amber-500 mb-1" />
            <span className="text-xs font-medium">Starred</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-white rounded-lg shadow-sm border border-gray-100 hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer">
            <Archive size={18} className="text-gray-500 mb-1" />
            <span className="text-xs font-medium">Archived</span>
          </div>
        </div>
      </div> */}
      
      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
              <Inbox size={24} className="text-[#009ee2]" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">No conversations yet</h3>
            <p className="text-sm text-gray-500 mb-4">Start chatting with your friends!</p>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#009ee2] text-white rounded-full hover:bg-blue-600 transition-colors">
              <PlusCircle size={16} />
              <span>New Conversation</span>
            </button>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.chatId}
              onClick={() => handleSelect(chat)}
              className={`relative flex items-center p-4 cursor-pointer transition-colors ${
                chatId === chat.chatId 
                  ? "bg-blue-50 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-[#009ee2]" 
                  : "hover:bg-gray-50 border-b border-gray-100"
              }`}
            >
              <div className="relative mr-4">
                {chat.user?.avatar ? (
                  <img
                    src={chat.user.avatar}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#009ee2] flex items-center justify-center text-white overflow-hidden">
                    <UserCircle size={36} />
                  </div>
                )}
                <span className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusIndicator(chat)} rounded-full border-2 border-white`}></span>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-gray-800 truncate">
                    {chat.user?.username || "Unknown User"}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center whitespace-nowrap">
                    <Clock size={12} className="mr-1 inline-block" />
                    {formatTimestamp(chat.updatedAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600 truncate max-w-[80%]">
                    {chat.lastMessage || "No messages yet"}
                  </p>
                  
                  {/* Unread indicator (placeholder, would be dynamic in real app) */}
                  {chat.chatId !== chatId && Math.random() > 0.7 && (
                    <span className="w-5 h-5 bg-[#009ee2] rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {Math.floor(Math.random() * 5) + 1}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;