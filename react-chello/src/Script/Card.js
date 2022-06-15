import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection,getDocs,addDoc,updateDoc,deleteDoc,doc,} from "firebase/firestore"
import { cardCollectionRef, listCollectionRef } from "../Library/firebase.collections";
import { getWebId } from "./Util";

const auth = getAuth();

export async function insertCard(newName)
{
  try {
    let docsData = {
      name:newName, 
      adminId: [auth.currentUser.uid]
    }
    await addDoc(cardCollectionRef, docsData)
    console.log('succed add to docs')
  } catch (error) {
    alert('error adding : ' , error)
    console.log('error adding : ' , error)
  }
}
