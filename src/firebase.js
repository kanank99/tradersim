import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyARdr98-seGK4R576LyTQ1Meefc9MTUyeg",
  authDomain: "trader-sim.firebaseapp.com",
  projectId: "trader-sim",
  storageBucket: "trader-sim.appspot.com",
  messagingSenderId: "103879111346",
  appId: "1:103879111346:web:e0b64898aa410896388fab",
  measurementId: "G-PY93NZY4R4",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
// const analytics = getAnalytics(app);
