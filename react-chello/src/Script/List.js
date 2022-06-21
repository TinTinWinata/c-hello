import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../Config/firebase-config";
import { listCollectionRef } from "../Library/firebase.collections";
import { toastError, toastSuccess } from "./Toast";
import { getWebId } from "./Util";

const auth = getAuth();

export async function deleteListWithBoardId(boardId) {
  const q = query(listCollectionRef, where("boardId", "==", boardId));
  const list = await getDocs(q);
  list.docs.map((li) => {
    return deleteDoc(doc(db, "list", li.id));
  });
}

export async function insertList(newName, boardId) {
  console.log("hello world");
  try {
    let docsData = {
      name: newName,
      adminId: [auth.currentUser.uid],
      boardId: boardId,
    };
    await addDoc(listCollectionRef, docsData);
    toastSuccess("Sucessfuly add a list!");
  } catch (error) {
    toastError("Error adding list! : ", error);
  }
}

export function updateListById(listId, changes) {
  const ref = doc(db, "list", listId);
  return updateDoc(ref, changes);
}

export function updateList(list) {
  const ref = doc(db, "list", list.id);
  return updateDoc(ref, list);
}
