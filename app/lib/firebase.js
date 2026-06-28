import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYHreWf1A5XluVBluG_8cf6XWfcT4VuVk",
  authDomain: "mnam-4d31a.firebaseapp.com",
  projectId: "mnam-4d31a",
  storageBucket: "mnam-4d31a.firebasestorage.app",
  messagingSenderId: "696725184486",
  appId: "1:696725184486:web:b9e536873d8016ec254027",
  measurementId: "G-DVBJKFSKBX"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// AUTH
export const auth = getAuth(app);

// FIRESTORE (QUAN TRỌNG)
export const db = getFirestore(app);

// STORAGE (nếu cần sau)
// export const storage = getStorage(app);

export default app;