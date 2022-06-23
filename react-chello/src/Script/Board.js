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
  arrayUnion,
} from "firebase/firestore";
import { db } from "../Config/firebase-config";
import {
  boardCollectionRef,
  boardILRef,
  deletedBoardCollectionRef,
} from "../Library/firebase.collections";
import { useUserAuth } from "../Library/UserAuthContext";
import { deleteCardWithBoardId } from "./Card";
import { deleteListWithBoardId } from "./List";
import { toastError, toastSuccess } from "./Toast";
import { updateUserDb, updateUserOnDatabase } from "./User";
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

export async function addBoardMember(board, newMemberId, userDb) {
  const ref = doc(db, "board", board.id);
  console.log("board id : ", board.id);

  return updateDoc(ref, {
    memberId: arrayUnion(newMemberId),
  }).then(() => {
    const changes = {
      board: [
        ...userDb.board,
        {
          id: board.id,
          name: board.name,
          role: "Member",
        },
      ],
    };
    return updateUserOnDatabase(userDb.userId, changes);
  });
}

export function addBoardIL(boardId) {
  return addDoc(boardILRef, {
    boardId: boardId,
  });
}

export async function insertBoard(newName, newTag, newVisibility, userDb) {
  try {
    let docsData = {
      name: newName,
      tag: newTag,
      visibility: newVisibility,
      memberId: [],
      adminId: [auth.currentUser.uid],
      workspaceId: getWebId(),
      closed: false,
    };
    const doc = await addDoc(ref, docsData);
    const board = {
      id: doc.id,
      name: newName,
      role: "Admin",
    };
    userDb.board = [...userDb.board, board];
    updateUserDb(userDb)
      .then(() => {
        toastSuccess("Succed create a ", newName, " board");
      })
      .catch((e) => {
        toastError("Error adding! : ", e.message);
      });
  } catch (error) {
    toastError("Error adding a board ", error);
  }
}

export function updateBoard(board) {
  const ref = doc(db, "board", board.id);
  return updateDoc(ref, board);
}

export async function insertClosedBoard(boardId, adminList) {
  await addDoc(deletedBoardCollectionRef, {
    boardId: boardId,
    adminId: adminList,
  });
}
