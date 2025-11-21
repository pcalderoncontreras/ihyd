import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAMtqOldN5IvKngvi_bnNMoJE2tYLwi_0g",
    authDomain: "ihyd-db07f.firebaseapp.com",
    projectId: "ihyd-db07f",
    storageBucket: "ihyd-db07f.firebasestorage.app",
    messagingSenderId: "119470314352",
    appId: "1:119470314352:web:a7f032a8810607a06e35b5",
    measurementId: "G-02BPYZ1W90"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testConnection() {
    console.log("Attempting to connect to Firebase (collection: productos)...");
    try {
        const querySnapshot = await getDocs(collection(db, "productos"));
        console.log("Connection successful!");
        console.log(`Found ${querySnapshot.size} documents in 'productos' collection.`);
        querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data());
        });
    } catch (error) {
        console.error("Connection failed:", error);
    }
}

testConnection();
