import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCrDp5lD-TxyFS1YuC_fw_fP3D9ORPUqG0",
    authDomain: "safewisedb.firebaseapp.com",
    projectId: "safewisedb",
    storageBucket: "safewisedb.appspot.com",
    messagingSenderId: "225395469684",
    appId: "1:225395469684:web:b8490341f400a561621021"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

export { db, auth };