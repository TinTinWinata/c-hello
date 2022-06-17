import { addDoc, doc, updateDoc } from "firebase/firestore"
import { db } from "../Config/firebase-config"
import { checklistCollectionRef } from "../Library/firebase.collections"


export async function insertChecklist(cardId, checklist)
{
  try {
    let docsData = {
      cardId:cardId, 
      name: checklist.name,
      value: checklist.value
    }
    await addDoc(checklistCollectionRef, docsData)
  } catch (error) {
    console.log('error adding : ' , error)
  }
  
}

export async function updateChecklist(checklist)
{
  const ref = doc(db, "checklist", checklist.id)
  await updateDoc(ref, checklist)
}