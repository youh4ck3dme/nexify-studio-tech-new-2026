import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if variables are loaded (only client side runs firebase calls, but this is safe)
const isFirebaseConfigured = !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

// Initialize Firebase for Client-side
const app = isFirebaseConfigured
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp())
  : null;
const auth = app ? getAuth(app) : null;
const db = app ? getFirestore(app) : null;
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider, isFirebaseConfigured };
