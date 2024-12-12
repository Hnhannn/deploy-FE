import firebase from "firebase/compat/app";
import "firebase/compat/database";
import "firebase/compat/auth";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCM3K2ZLKT1NB3l21jL3h-gkBlBakBSjT4",
  authDomain: "realtimedb-61ce6.firebaseapp.com",
  databaseURL: "https://realtimedb-61ce6-default-rtdb.firebaseio.com",
  projectId: "realtimedb-61ce6",
  storageBucket: "realtimedb-61ce6.firebasestorage.app",
  messagingSenderId: "63488618948",
  appId: "1:63488618948:web:33926b678b52554b233491",
  measurementId: "G-80SFLTJ39V",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Export Firebase services
export const auth = firebase.auth();
export const database = firebase.database();
export const storage = firebase.storage();

export default firebase;
