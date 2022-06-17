import { updateProfile } from "firebase/auth";
import { auth } from "../Config/firebase-config";


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