import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection,getDocs,addDoc,updateDoc,deleteDoc,doc,} from "firebase/firestore"
import { db } from '../Config/firebase-config'

const auth = getAuth();

const ref = collection(db, "workspace")
export async function insertWorkspace(newName, newDetail, newLanguange, newCountry)
{
  try {
    await addDoc(ref, {name:newName, detail:newDetail, languange:newLanguange, country:newCountry, userId: auth.currentUser.uid})
    console.log('succed add to docs')
  } catch (error) {
    alert('error adding : ' , error)
    console.log('error adding : ' , error)
  }
}
