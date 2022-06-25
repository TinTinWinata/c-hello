import { addDoc } from "firebase/firestore";
import {
  boardILRef,
  cardInviteLinkCollectionRef,
  workspaceILRef,
} from "../Library/firebase.collections";
import { addWorkspaceIL } from "../Model/Workspace";

export async function createInviteDetail(type, data) {
  const date = new Date();
  date.setDate(date.getDate() + 1);

  if (type == "workspace") {
    try {
      console.log("created with : ", date);
      return await addDoc(workspaceILRef, {
        workspaceId: data.id,
        dueDate: date,
      });
    } catch (error) {
      console.log("error adding : ", error);
    }
  } else if (type == "board") {
    return await addDoc(boardILRef, {
      boardId: data.id,
      dueDate: date,
    });
  } else if (type == "card") {
    return await addDoc(cardInviteLinkCollectionRef, {
      cardId: data.cardId,
      boardId: data.boardId,
    });
  }
}
