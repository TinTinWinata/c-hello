import { updateProfile } from "firebase/auth";
import { addDoc, collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { auth, db } from "../Config/firebase-config";
import { userCollectionRef } from "../Library/firebase.collections";


export function updateUser(user)
{
  return  updateProfile(auth.currentUser, user)
}

export async function updateUserOnDatabase(userId, changes){
  console.log('user : ', userId)
  console.log('changes : ' , changes)
  const ref = query(collection(db, "user"), where("userId", '==', userId))
  const snapshot = await getDocs(ref)
  const userDocsId = snapshot.docs[0].id
  const updateRef = doc(db, "user", userDocsId)
  return updateDoc(updateRef, changes)
}


export async function insertUser(user, newDisplayName)
{
  try {
    await addDoc(userCollectionRef, {
      userId:user.uid,
      displayName: newDisplayName
    })
    console.log('succed add to docs')
  } catch (error) {
    alert('error adding : ' , error)
    console.log('error adding : ' , error)
  }
}