import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
} from "firebase/auth";
import { auth, db } from "../Config/firebase-config";
import { useLocation } from "react-router-dom";
import { insertUser } from "../Script/User";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { notificationCollectionRef } from "./firebase.collections";

const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [notification, setNotification] = useState([]);
  const [user, setUser] = useState("");
  const [userDb, setUserDb] = useState("");
  const [refresh, setRefresh] = useState(true);

  const location = useLocation();

  function attachNotification(currentUser) {
    const q = query(
      notificationCollectionRef,
      where("userId", "==", currentUser.uid)
    );

    onSnapshot(q, (doc) => {
      setNotification(
        doc.docs.map((docs) => ({
          ...docs.data(),
          id: docs.id,
        }))
      );
    });
  }

  function refreshPage() {
    if (refresh) {
      setRefresh(false);
    } else {
      setRefresh(true);
    }
  }

  async function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password).then(
      (cred) => {
        const user = cred.user;
        insertUser(user, user.email);
      }
    );
  }

  function logout() {
    return signOut(auth);
  }

  function changePassword(newPassword) {
    return updatePassword(user, newPassword);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  useEffect(() => {
    console.log("refreshed context!");

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        attachNotification(currentUser);
        const ref = query(
          collection(db, "user"),
          where("userId", "==", currentUser.uid)
        );
        const snapshot = await getDocs(ref);
        setUserDb(snapshot.docs[0].data());
      }
    });

    return () => {
      unsubscribe();
    };
  }, [location, refresh]);

  return (
    <userAuthContext.Provider
      value={{
        userDb,
        refreshPage,
        user,
        signUp,
        login,
        logout,
        changePassword,
        notification,
      }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
