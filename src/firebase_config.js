import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


export const firebaseConfig = {
    apiKey: "AIzaSyDLO-NA970nW-QA59pZsDdwoSPlVt5dUlY",
    authDomain: "hds-training-fa4f8.firebaseapp.com",
    projectId: "hds-training-fa4f8",
    storageBucket: "hds-training-fa4f8.firebasestorage.app",
    messagingSenderId: "563609067184",
    appId: "1:563609067184:web:70d4c56ec4901fed0ca575",
    measurementId: "G-HFVR1RN682"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Authentication and Firestore are browser-only in this app. Keeping their
// initialisation behind this guard lets Next render the public page shell on
// the server without attempting to access browser storage.
export const auth = typeof window === "undefined" ? null : getAuth(app);
export const db = typeof window === "undefined" ? null : getFirestore(app);
