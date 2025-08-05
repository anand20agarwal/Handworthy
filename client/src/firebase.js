// Firebase config and initialization
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';


// Old config (commented for reference)
// const firebaseConfig = {
//   apiKey: "AIzaSyAaUeSe8yoR2kMGh1wD4cERJb4UGHGk2QY",
//   authDomain: "handworthy-pvt-ltd-72b07.firebaseapp.com",
//   projectId: "handworthy-pvt-ltd-72b07",
//   storageBucket: "handworthy-pvt-ltd-72b07.firebasestorage.app",
//   messagingSenderId: "710617179724",
//   appId: "1:710617179724:web:f2752c3d95c2d83eb776e9",
//   measurementId: "G-W6ZJ03GCXS"
// };


// New config for OTP testing (now using environment variables)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
