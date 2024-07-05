import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCKnhPa_cDYJ_XsXE7l20jZK_btnIsMdHM",
  authDomain: "learnfirebase-6dce0.firebaseapp.com",
  projectId: "learnfirebase-6dce0",
  storageBucket: "learnfirebase-6dce0.appspot.com",
  messagingSenderId: "120159524113",
  appId: "1:120159524113:web:9f2cd99bd99cc53883e8b0",
  measurementId: "G-2TGYZVK3PE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);
export { auth, googleAuthProvider, db, storage };
