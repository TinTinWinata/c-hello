import { addDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../Config/firebase-config";
import { checklistCollectionRef } from "../Library/firebase.collections";

export async function insertChecklist(checklist) {
  try {
    await addDoc(checklistCollectionRef, checklist);
  } catch (error) {
    console.log("error adding : ", error.message);
  }
}

export async function updateChecklist(checklist) {
  const ref = doc(db, "checklist", checklist.id);
  await updateDoc(ref, checklist);
}
