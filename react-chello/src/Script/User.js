import { updateProfile } from "firebase/auth";
import { addDoc } from "firebase/firestore";
import { auth } from "../Config/firebase-config";
import { userCollectionRef } from "../Library/firebase.collections";


export function updateUser(user)
{
  updateProfile(auth.currentUser, user).then(() => {
    console.log('User updated!')
    // console.log(auth.currentUser.email)
    // console.log(auth.currentUser.displayName)
    // console.log(auth.currentUser.age)
  }).catch((error) => {
    console.log('Error Updating User: ' + error.message)
  })
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