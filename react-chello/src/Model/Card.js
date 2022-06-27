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
  getDoc,
} from "firebase/firestore";
import { db } from "../Config/firebase-config";
import {
  cardCollectionRef,
  cardInviteLinkCollectionRef,
  listCollectionRef,
} from "../Library/firebase.collections";
import { getListWithListId, updateList } from "./List";
import { toastError } from "./Toast";
import { getWebId } from "./Util";

const auth = getAuth();

export function getCardWithListId(listId) {
  const q = query(cardCollectionRef, where("listId", "==", listId));
  return getDocs(q);
}

export function checkCardDueDate(card) {
  card.map((currCard) => {
    const diff = currCard.date.toDate() - new Date();
    if (currCard.status == "Complete") {
      return;
    }
    if (diff < 0) {
      currCard.status = "Due Date";
      getListWithListId(currCard.listId).then((doc) => {
        const list = { ...doc.data(), id: doc.id };
        list.status = "Due Date";
        updateList(list);
      });
    }
  });
}

export function addCardIL(cardId, boardId) {
  return addDoc(cardInviteLinkCollectionRef, {
    cardId: cardId,
    boardId: boardId,
  });
}

export async function insertCard(newName, boardId, listId, date, userDb, desc) {
  console.log("user db : ", userDb);
  try {
    if (!date) {
      date = new Date();
      date.setDate(date.getDate() + 10);
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
      description: desc,
      watcher: [userDb.userId],
      attachment: [],
      status: "",
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
export async function getCardById(id) {
  const ref = doc(db, "card", id);
  return getDoc(ref);
}

export async function deleteCard(card) {
  const ref = doc(db, "card", card.id);
  await deleteDoc(ref, card);
}
