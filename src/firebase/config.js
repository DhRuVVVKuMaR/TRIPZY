import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  // Replace with your Firebase config
  apiKey: "AIzaSyDYkCSJUp9f2RUiEzfBcnQsx_cwkl9yafg",
  authDomain: "tripzybitbox.firebaseapp.com",
  projectId: "tripzybitbox",
  storageBucket: "tripzybitbox.appspot.com",
  messagingSenderId: "207380509514",
  appId: "1:207380509514:web:63674b3c5946d20aa9c7b3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);

// Initialize Google Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('profile');
googleProvider.addScope('email');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export { db, auth, googleProvider }; 