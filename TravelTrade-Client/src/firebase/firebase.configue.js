// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDi36Y7Mv5ELuwvrzWcFrW6GpIJuyFYwK0",
  authDomain: "traveltrade-4f50d.firebaseapp.com",
  projectId: "traveltrade-4f50d",
  storageBucket: "traveltrade-4f50d.firebasestorage.app",
  messagingSenderId: "355231018165",
  appId: "1:355231018165:web:3e98b2f4a2de80d22722fc"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore()
