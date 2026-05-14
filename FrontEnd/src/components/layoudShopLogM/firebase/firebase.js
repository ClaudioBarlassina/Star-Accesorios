// Import the functions you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // 🔥 IMPORTANTE
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA0ybIPM3FwzJMgZswi2jcsjfdaP1yaMi4",
  authDomain: "star-accesorios-f0365.firebaseapp.com",
  projectId: "star-accesorios-f0365",
  storageBucket: "star-accesorios-f0365.firebasestorage.app",
  messagingSenderId: "1084089964306",
  appId: "1:1084089964306:web:0eb8e296599776952e85cb",
  measurementId: "G-K81F3W4R8G"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔥 ESTA ES LA CLAVE
export const auth = getAuth(app);

// opcional (no afecta login)
const analytics = getAnalytics(app);