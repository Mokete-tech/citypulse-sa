import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeApp } from "firebase/app";

// Initialize Firebase with environment variables 
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
initializeApp(firebaseConfig);

createRoot(document.getElementById("root")!).render(<App />);
