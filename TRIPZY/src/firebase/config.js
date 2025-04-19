import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "AIzaSyDYkCSJUp9f2RUiEzfBcnQsx_cwkl9yafg",
  authDomain: "tripzybitbox.firebaseapp.com",
  projectId: "tripzybitbox",
  storageBucket: "tripzybitbox.firebasestorage.app",
  messagingSenderId: "207380509514",
  appId: "1:207380509514:web:63674b3c5946d20aa9c7b3",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 