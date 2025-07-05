// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "hiresonic.firebaseapp.com",
  projectId: "hiresonic",
  storageBucket: "hiresonic.firebasestorage.app",
  messagingSenderId: "976588814359",
  appId: "1:976588814359:web:86b91385d10549392fc452",
  measurementId: "G-SNHXQ9DXK7"
};

export const app = initializeApp(firebaseConfig);