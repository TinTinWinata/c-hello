import { collection } from "firebase/firestore";
import { db } from "../Config/firebase-config";

export const workspaceCollectionRef = collection(db, "workspace");
export const boardCollectionRef = collection(db, "board");
export const listCollectionRef = collection(db, "list");
export const cardCollectionRef = collection(db, "card");
export const checklistCollectionRef = collection(db, "checklist");
export const workspaceILRef = collection(db, "workspaceInviteLink");
export const boardILRef = collection(db, "boardInviteLink");
export const userCollectionRef = collection(db, "user");
export const notificationCollectionRef = collection(db, "notification");
export const deletedBoardCollectionRef = collection(db, "deletedBoard");
