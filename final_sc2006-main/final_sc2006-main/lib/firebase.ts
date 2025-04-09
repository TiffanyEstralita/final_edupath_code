// lib/firebaseConfig.ts
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import type { FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported } from "firebase/analytics";

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyAgjg8d3kF5R4Zu0TVW-9b0p1S3FSroTj0",
  authDomain: "sc2006-e0d55.firebaseapp.com",
  projectId: "sc2006-e0d55",
  storageBucket: "sc2006-e0d55.firebasestorage.app",
  messagingSenderId: "909756101968",
  appId: "1:909756101968:web:138433e81179b1e406e855",
  measurementId: "G-973VB6NNWK"
};

// Explicitly declare app as FirebaseApp
const app: FirebaseApp = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

// Initialize Firebase Auth using the app instance.
export const auth = getAuth(app);

// Only initialize Firebase Analytics on the client side.
if (typeof window !== 'undefined') {
  isSupported().then((supported: boolean) => {
    if (supported) {
      getAnalytics(app);
    }
  }).catch((err) => {
    console.error("Analytics initialization error:", err);
  });
}