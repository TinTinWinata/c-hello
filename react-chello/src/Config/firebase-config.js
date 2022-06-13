import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCNxPuE96DP1bzREUXJGccDq5PN44vs70E",
  authDomain: "chello-15d8d.firebaseapp.com",
  projectId: "chello-15d8d",
  storageBucket: "chello-15d8d.appspot.com",
  messagingSenderId: "478745237584",
  appId: "1:478745237584:web:69bf1fe76a5b30c49f9955"
};

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)