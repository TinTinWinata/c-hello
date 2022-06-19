import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection,getDocs,addDoc,updateDoc,deleteDoc,doc,} from "firebase/firestore"
import { db } from "../Config/firebase-config";
import { listCollectionRef } from "../Library/firebase.collections";
import { getWebId } from "./Util";

const auth = getAuth();

export async function insertList(newName, boardId)
{
  try {
    let docsData = {
      name:newName, 
      adminId: [auth.currentUser.uid],
      boardId: boardId
    }
    await addDoc(listCollectionRef, docsData)
    console.log('succed add to docs')
  } catch (error) {
    alert('error adding : ' , error)
    console.log('error adding : ' , error)
  }
}

export function updateListById(listId, changes)
{
  const ref = doc(db, "list", listId)
  return updateDoc(ref, changes)
}

export  function updateList(list)
{
  const ref = doc(db, "list", list.id)
  return updateDoc(ref, list)
}
