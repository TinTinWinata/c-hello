import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from "../Config/firebase-config";

const userAuthContext = createContext()

export function UserAuthContextProvider({children}){

  const [user, setUser] = useState("")



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
  },[])
  
  return (
    <userAuthContext.Provider value={{user, signUp, login, logout}}>
      {children}
    </userAuthContext.Provider>)
  
}

export function useUserAuth()
{
  return useContext(userAuthContext)
}