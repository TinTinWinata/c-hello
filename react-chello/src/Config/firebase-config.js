import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


// Configure Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCNxPuE96DP1bzREUXJGccDq5PN44vs70E",
  authDomain: "chello-15d8d.firebaseapp.com",
  projectId: "chello-15d8d",
  // databaseURL: "board.asia-southeast1.firebasedatabase.app",
  storageBucket: "chello-15d8d.appspot.com",
  messagingSenderId: "478745237584",
  appId: "1:478745237584:web:69bf1fe76a5b30c49f9955"
};

// Initialized Firebase
firebase.initializeApp(firebaseConfig)

// Configure Firebase UI
const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/signedIn',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
};

// Set Firebase Persistence
const persistence = firebase.auth.Auth.Persistence.LOCAL
firebase.auth().setPersistence(persistence);

// Exporting Firebase Conf
export default uiConfig
export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)

// Firebase Storage
export const storage = getStorage(app)

