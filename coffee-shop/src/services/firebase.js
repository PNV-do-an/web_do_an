// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Cấu hình Firebase của bạn - THAY THẾ VỚI CẤU HÌNH CỦA BẠN
const firebaseConfig = {
  apiKey: "AIzaSyAiO6IcGNOuj6D1Fp1SCaHpVrURC63XzpM",
  authDomain: "shopcoffee-83d1a.firebaseapp.com",
  projectId: "shopcoffee-83d1a",
  storageBucket: "shopcoffee-83d1a.firebasestorage.app",
  messagingSenderId: "465750051402",
  appId: "1:465750051402:web:f89169b33c7ddcb615f4b3",
  measurementId: "G-742ZJME5C1"
};
// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Xuất các services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;