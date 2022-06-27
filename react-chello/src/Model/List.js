import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../Config/firebase-config";
import { listCollectionRef } from "../Library/firebase.collections";
import { getBoardById, updateBoard } from "./Board";
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

export function updateListWithId(listId, changes) {
  const ref = doc(db, "list", listId);
  return updateDoc(ref, changes);
}

export function changeIndex(listId, idx, prevIdx, refresh) {
  const q = query(listCollectionRef, where("listIndex", "==", idx));
  console.log("idx : ", idx);
  getDocs(q).then((docs) => {
    if (docs.docs[0]) {
      const idxList = { ...docs.docs[0].data(), id: docs.docs[0].id };
      idxList.listIndex = prevIdx;
      updateList(idxList).then(() => {
        const ref = doc(db, "list", listId);
        updateDoc(ref, { listIndex: idx })
          .then(() => {
            if (refresh) refresh();
            toastSuccess("Succesfully change list");
          })
          .catch((e) => {
            toastError("Failed to move list index!");
          });
      });
    } else {
      toastError("Data not found");
    }
  });
}

export async function insertList(newName, boardId, idx) {
  let docsData = {
    name: newName,
    adminId: [auth.currentUser.uid],
    boardId: boardId,
    label: [],
    listIndex: idx,
  };

  return addDoc(listCollectionRef, docsData);
}

export function updateListById(listId, changes) {
  const ref = doc(db, "list", listId);
  return updateDoc(ref, changes);
}

export function getListWithListId(listId) {
  const ref = doc(db, "list", listId);
  return getDoc(ref);
}

export function updateList(list) {
  const ref = doc(db, "list", list.id);
  return updateDoc(ref, list);
}

export async function deleteList(list) {
  const ref = doc(db, "list", list.id);
  await deleteDoc(ref, list);
}
