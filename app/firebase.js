import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDSqnRtxjKKDgsaA8h7BbXbqQ7STmgb0oQ",
  authDomain: "luxe-log.firebaseapp.com",
  projectId: "luxe-log",
  storageBucket: "luxe-log.firebasestorage.app",
  messagingSenderId: "952880026670",
  appId: "1:952880026670:web:20ba58628ebf36d21f3bbf",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
