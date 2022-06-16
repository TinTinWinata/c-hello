import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from "../Config/firebase-config";
import { useLocation } from "react-router-dom";

const userAuthContext = createContext()

export function UserAuthContextProvider({children}){

  const [user, setUser] = useState("")

  const location = useLocation()

  function signUp(email, password)
  {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  function logout() {
    return signOut(auth);
  }

  function login(email, password)
  {
    return signInWithEmailAndPassword(auth, email, password)
  }

  useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth, (currentUser)=>{
      setUser(currentUser)
  })
    return () => {
      unsubscribe()
    }
  },[location])
  
  return (
    <userAuthContext.Provider value={{user, signUp, login, logout}}>
      {children}
    </userAuthContext.Provider>)
  
}

export function useUserAuth()
{
  return useContext(userAuthContext)
}