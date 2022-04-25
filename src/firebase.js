import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDaw6lweyO0X0iWtkvP_n9dHtiL0XL5nQ8",
  authDomain: "triptracks-tw.firebaseapp.com",
  projectId: "triptracks-tw",
  storageBucket: "triptracks-tw.appspot.com",
  messagingSenderId: "527843874697",
  appId: "1:527843874697:web:c7137b65ab4ddb9008f358",
  measurementId: "G-0YTLTJKYJG"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
// Get a reference to the database service
export const db = getDatabase(app);
