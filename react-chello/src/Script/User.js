import { updateProfile } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../Config/firebase-config";
import { userCollectionRef } from "../Library/firebase.collections";

export function updateUser(user) {
  return updateProfile(auth.currentUser, user);
}

export async function getUserByEmail(email) {
  const ref = query(collection(db, "user"), where("email", "==", email));
  return getDocs(ref);
}

export function updateUserDb(user) {
  const ref = doc(db, "user", user.id);
  return updateDoc(ref, user);
}

export async function updateUserOnDatabase(userId, changes) {
  const ref = query(collection(db, "user"), where("userId", "==", userId));
  const snapshot = await getDocs(ref);
  const userDocsId = snapshot.docs[0].id;
  const updateRef = doc(db, "user", userDocsId);
  return updateDoc(updateRef, changes);
}

export async function getUser(id) {
  const q = query(collection(db, "user"), where("userId", "==", id));
  return getDocs(q);
  const data = qs.docs[0].data();
  return data;
}

export async function insertUser(user, newDisplayName) {
  try {
    await addDoc(userCollectionRef, {
      userId: user.uid,
      displayName: newDisplayName,
      photoUrl: "https://picsum.photos/id/237/200/300",
      about: "",
      education: "",
      email: user.email,
      notification: true,
      workspace: [],
      board: [],
      notificationList: [],
    });
  } catch (error) {}
}
