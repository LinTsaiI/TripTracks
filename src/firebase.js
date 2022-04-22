// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwMtcCuyKz-Uj8C094xBHOjc7zFUWiefk",
  authDomain: "rosy-cache-344503.firebaseapp.com",
  projectId: "rosy-cache-344503",
  storageBucket: "rosy-cache-344503.appspot.com",
  messagingSenderId: "518980134226",
  appId: "1:518980134226:web:9d2e51a5d1251de69e868b",
  measurementId: "G-F05HX38NZP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);