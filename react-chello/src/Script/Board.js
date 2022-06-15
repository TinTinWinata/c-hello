import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection,getDocs,addDoc,updateDoc,deleteDoc,doc,} from "firebase/firestore"
import { db } from '../Config/firebase-config'
import { getWebId } from "./Util";

const auth = getAuth();

const ref = collection(db, "board")
export async function insertBoard(newName, newTag, newVisibility)
{
  try {
    let docsData = {
      name:newName, 
      tag: newTag,
      visbility: newVisibility,
      adminId: [auth.currentUser.uid],
      workspaceId: getWebId()
    }
    await addDoc(ref, docsData)
    console.log('succed add to docs')
  } catch (error) {
    alert('error adding : ' , error)
    console.log('error adding : ' , error)
  }
}
