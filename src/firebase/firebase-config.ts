import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

/* const firebaseConfig = {
  apiKey: "AIzaSyAjUFM2u2nc78FXv9Ba4LnTaKZ78jAOxBM",
  authDomain: "fika-8aec8.firebaseapp.com",
  projectId: "fika-8aec8",
  storageBucket: "fika-8aec8.firebasestorage.app",
  messagingSenderId: "739628553615",
  appId: "1:739628553615:web:361c27d13464bb991de7fa"
}; */

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); 