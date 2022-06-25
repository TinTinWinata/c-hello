import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  where,
  arrayUnion,
  query,
} from "firebase/firestore";
import { db } from "../Config/firebase-config";
import {
  cardCollectionRef,
  cardInviteLinkCollectionRef,
  listCollectionRef,
} from "../Library/firebase.collections";
import { toastError } from "./Toast";
import { getWebId } from "./Util";

const auth = getAuth();

export function addCardIL(cardId, boardId) {
  return addDoc(cardInviteLinkCollectionRef, {
    cardId: cardId,
    boardId: boardId,
  });
}
export async function insertCard(newName, boardId, listId, date, userDb) {
  console.log("user db : ", userDb);
  try {
    if (!date) {
      date = new Date();
    }
    if (!newName) {
      newName = "New Name";
    }
    let docsData = {
      name: newName,
      boardId: boardId,
      listId: listId,
      label: [],
      date: date,
      watcher: [userDb.userId],
      attachment: [],
    };
    return await addDoc(cardCollectionRef, docsData);
  } catch (error) {
    console.log("error adding : ", error);
  }
}

export async function deleteCardWithBoardId(boardId) {
  const q = query(cardCollectionRef, where("boardId", "==", boardId));
  const cardList = await getDocs(q);
  cardList.docs.map((card) => {
    return deleteDoc(doc(db, "card", card.id));
  });
}

export function addWatcher() {}

export function updateCard(card) {
  const ref = doc(db, "card", card.id);
  return updateDoc(ref, card);
}

export function updateCardWithId(cardId, changes) {
  const ref = doc(db, "card", cardId);
  return updateDoc(ref, changes);
}

export async function deleteCard(card) {
  const ref = doc(db, "card", card.id);
  await deleteDoc(ref, card);
}
