import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASEURL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID,
 passwd : process.env.REACT_APP_PASSWORD,
 email : process.env.REACT_APP_EMAIL,
};

// Initialize Firebase

 const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
signInWithEmailAndPassword(auth, firebaseConfig.email, firebaseConfig.passwd)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    console.log("logged as : ", user.uid);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log("code : ", errorCode, "  message ; ", errorMessage);
    return null;
  });

export const db = getFirestore(app);