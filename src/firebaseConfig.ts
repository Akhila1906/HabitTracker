// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCUmdzt_xnVv3hW3U31VB4tZQFsD8cjsmc",
  authDomain: "reframe-21acd.firebaseapp.com",
  projectId: "reframe-21acd",
  storageBucket: "reframe-21acd.firebasestorage.app",
  messagingSenderId: "307662114364",
  appId: "1:307662114364:web:1be215c2490a6c21b1bd39"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
