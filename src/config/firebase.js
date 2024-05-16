import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCjhRvixk-Q7_2pmUvK0lH_PTxoBGhsiN4",
  authDomain: "pj-0-2.firebaseapp.com",
  projectId: "pj-0-2",
  storageBucket: "pj-0-2.appspot.com",
  messagingSenderId: "659379516150",
  appId: "1:659379516150:web:64c2301676d2ce72bf72d7",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
