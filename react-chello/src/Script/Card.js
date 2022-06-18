import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection,getDocs,addDoc,updateDoc,deleteDoc,doc, where, arrayUnion,} from "firebase/firestore"
import { db } from "../Config/firebase-config";
import { cardCollectionRef, listCollectionRef } from "../Library/firebase.collections";
import { getWebId } from "./Util";

const auth = getAuth();

export async function insertCard(newName, boardId, listId)
{
  try {
    let docsData = {
      name:newName, 
      boardId: boardId,
      listId: listId
    }
    await addDoc(cardCollectionRef, docsData)
    console.log('succed add to docs')
  } catch (error) {
    alert('error adding : ' , error)
    console.log('error adding : ' , error)
  }
  
}

export  function updateCard(card)
{
  console.log('card id :', card.id)
  const ref = doc(db, "card", card.id)
   updateDoc(ref, card).then(()=>{
      console.log('succes update doc')
      console.log('new date : ', card.date)
   }).catch((error)=>{
      console.log('error updating to docs', error)
   })
}


export async function deleteCard(card)
{
  const ref = doc(db, "card", card.id)
  await deleteDoc(ref, card)
}

