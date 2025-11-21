// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAMtqOldN5IvKngvi_bnNMoJE2tYLwi_0g",
    authDomain: "ihyd-db07f.firebaseapp.com",
    projectId: "ihyd-db07f",
    storageBucket: "ihyd-db07f.firebasestorage.app",
    messagingSenderId: "119470314352",
    appId: "1:119470314352:web:a7f032a8810607a06e35b5",
    measurementId: "G-02BPYZ1W90"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);