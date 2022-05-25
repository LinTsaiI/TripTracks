import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDaw6lweyO0X0iWtkvP_n9dHtiL0XL5nQ8",
  authDomain: "triptracks-tw.firebaseapp.com",
  projectId: "triptracks-tw",
  storageBucket: "triptracks-tw.appspot.com",
  messagingSenderId: "527843874697",
  appId: "1:527843874697:web:c7137b65ab4ddb9008f358",
  measurementId: "G-0YTLTJKYJG"
};

export const firebaseApp = initializeApp(firebaseConfig);
export const analytics = getAnalytics(firebaseApp);
export const auth = getAuth(firebaseApp);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);




