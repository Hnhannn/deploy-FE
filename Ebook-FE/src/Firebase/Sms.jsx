import Firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAo6-_dnN2eppO0Yl13ol9OUsI0FOvRlBM",
  authDomain: "very-feaf8.firebaseapp.com",
  projectId: "very-feaf8",
  storageBucket: "very-feaf8.firebasestorage.app",
  messagingSenderId: "714565589296",
  appId: "1:714565589296:web:6feff8ba18e0c15960d0f5",
  measurementId: "G-B1YGWJN4NE",
};

// Initialize Firebase
Firebase.initializeApp(firebaseConfig);

export default Firebase;
