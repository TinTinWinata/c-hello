import { getAuth, signOut } from "firebase/auth";

const auth = getAuth();

export function logOut()
{
  signOut(auth).then(() => {
    window.location.replace('/')
  }).catch((error) => {
    alert('failed to sign out : ', error)
  });
}