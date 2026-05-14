// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAcmY2OQ_14a942EhaaaBIzAs6O6dSF0M4",
  authDomain: "ferreteria-2026.firebaseapp.com",
  projectId: "ferreteria-2026",
  storageBucket: "ferreteria-2026.firebasestorage.app",
  messagingSenderId: "585996704753",
  appId: "1:585996704753:web:eec2f0bd7f6ca7ccdc8250",
  measurementId: "G-PFKDKXMX7F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);