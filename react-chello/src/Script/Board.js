import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../Config/firebase-config";
import { boardCollectionRef } from "../Library/firebase.collections";
import { deleteCardWithBoardId } from "./Card";
import { deleteListWithBoardId } from "./List";
import { toastError, toastSuccess } from "./Toast";
import { getWebId } from "./Util";

const auth = getAuth();

const ref = collection(db, "board");
export async function deleteBoard(workspaceId) {
  const q = query(boardCollectionRef, where("workspaceId", "==", workspaceId));
  const boardList = await getDocs(q);
  boardList.docs.map((board) => {
    deleteListWithBoardId(board.id);
    deleteCardWithBoardId(board.id);
    return deleteDoc(doc(db, "board", board.id));
  });
}

export async function insertBoard(newName, newTag, newVisibility) {
  try {
    let docsData = {
      name: newName,
      tag: newTag,
      visibility: newVisibility,
      adminId: [auth.currentUser.uid],
      workspaceId: getWebId(),
    };
    await addDoc(ref, docsData);
    toastSuccess("Succed create a ", newName, " board");
  } catch (error) {
    toastError("Error adding a board ", error);
  }
}
