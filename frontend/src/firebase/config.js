import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: "AIzaSyBqRkuCY6ZVMdc7RyOFq-0ekNRyakx94rU",
  authDomain: "exam-map-62276.firebaseapp.com",
  projectId: "exam-map-62276",
  storageBucket: "exam-map-62276.firebasestorage.app",
  messagingSenderId: "678974409816",
  appId: "1:678974409816:web:a6ebe90e6832c5aed5ce2d",
  measurementId: "G-PQ3P8M7PD1"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
