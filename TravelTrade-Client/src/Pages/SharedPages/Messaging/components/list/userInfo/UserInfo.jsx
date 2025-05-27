import useUserData from "../../../../../../hooks/useUserData";
import { UserCircle, Settings, LogOut, Moon, Bell, MessageSquare } from "lucide-react";

const UserInfo = () => {
  const { userData } = useUserData();
    
  return (
    <div className="bg-[#009ee2] text-white">
      <div className="px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            {userData?.photo ? (
              <img 
                src={userData?.photo}
                alt="User profile" 
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-800 flex items-center justify-center border-2 border-white shadow-md">
                <UserCircle size={32} className="text-white" />
              </div>
            )}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          </div>
          <div>
            <h2 className="font-semibold">{userData?.name || "User"}</h2>
            <p className="text-xs text-blue-100 mt-1">Active now</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
            <Bell size={18} className="text-white" />
          </button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
            <Moon size={18} className="text-white" />
          </button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
            <Settings size={18} className="text-white" />
          </button>
        </div>
      </div>
      
      {/* User stats */}
      {/* <div className="px-6 pb-4 pt-1 flex justify-between">
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold">128</span>
          <span className="text-xs text-blue-100">Contacts</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold">45</span>
          <span className="text-xs text-blue-100">Groups</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold">8</span>
          <span className="text-xs text-blue-100">Unread</span>
        </div>
      </div> */}
      
      {/* Quick actions */}
      {/* <div className="bg-blue-800 bg-opacity-20 py-3 px-6 flex justify-between">
        <button className="flex items-center gap-2 text-xs font-medium hover:text-blue-200 transition-colors">
          <MessageSquare size={16} />
          <span>New Message</span>
        </button>
        <button className="flex items-center gap-2 text-xs font-medium hover:text-blue-200 transition-colors">
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div> */}
    </div>
  );
};

export default UserInfo;