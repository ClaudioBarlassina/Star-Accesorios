// Import the functions you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // 🔥 IMPORTANTE
import { getAnalytics } from "firebase/analytics";

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

// 🔥 ESTA ES LA CLAVE
export const auth = getAuth(app);

// opcional (no afecta login)
const analytics = getAnalytics(app);