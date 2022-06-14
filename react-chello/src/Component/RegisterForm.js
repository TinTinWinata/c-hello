import uiConfig, { db } from '../Config/firebase-config'
import './RegisterForm.css'
import { collection,getDocs,addDoc,updateDoc,deleteDoc,doc,} from "firebase/firestore"
import { useEffect, useState } from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
const auth = getAuth();

function RegisterForm() {

  const usersCollectionRef = collection(db, "user")
  const [errorMessage, setErrorMessage] = useState('')

async function register(e)
{
  e.preventDefault()

  let newEmail = e.target.email.value
  let newPassword = e.target.password.value

    createUserWithEmailAndPassword(auth, newEmail, newPassword)
    .then((userCredential) => {
      const user = userCredential.user;
      window.location.replace('/login')
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      setErrorMessage(errorMessage)
    });
  
  
}


  return (
<div className="w-full max-w-xs" id="registerForm">
  <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={register}>
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Email
      </label>
      <input name="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="example@gmail.com"/>
    </div>
    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-bold mb-2">
        Password
      </label>
      <input name="password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************"/>
      <p className="text-red-500 text-xs italic">{errorMessage}</p>
    </div>
    <div className="flex items-center justify-between">
      <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Sign Up
      </button>
    </div>
    <StyledFirebaseAuth className="" uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
      <a className="inline-block align-baseline font-bold text-xs text-blue-500 hover:text-blue-800" href="#">
        Forgot Password?
      </a>
  </form>
  <p className="text-center text-gray-500 text-xs">
    &copy;2020 Acme Corp. All rights reserved.
  </p>
</div>
  );
}

export default RegisterForm;
