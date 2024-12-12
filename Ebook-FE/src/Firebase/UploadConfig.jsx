import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC-s9ZG44_akLJr9aPOf0eDgUDmifz104Y",
  authDomain: "ebookpage-836d8.firebaseapp.com",
  projectId: "ebookpage-836d8",
  storageBucket: "ebookpage-836d8.appspot.com",
  messagingSenderId: "110255040448",
  appId: "1:110255040448:web:f324f691b0ffad8e0e8a25",
  measurementId: "G-R0S6PNYSYY",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const ImportDB = getStorage(app);
export const auth = getAuth(app);
