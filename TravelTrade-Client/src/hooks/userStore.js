import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "../firebase/firebase.configue";

export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true,
  
  fetchUserInfo: async (uid) => {
    if (!uid) {
      return set({ currentUser: null, isLoading: false });
    }

    set({ isLoading: true });
    
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        set({ 
          currentUser: { 
            id: uid,
            ...docSnap.data() 
          }, 
          isLoading: false 
        });
      } else {
        console.warn("User document not found");
        set({ currentUser: null, isLoading: false });
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
      set({ currentUser: null, isLoading: false });
    }
  },

  clearUser: () => set({ currentUser: null, isLoading: false })
}));