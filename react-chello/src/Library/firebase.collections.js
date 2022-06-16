import { collection } from "firebase/firestore";
import { db } from "../Config/firebase-config";

export const workspaceCollectionRef = collection(db, 'workspace')
export const boardCollectionRef = collection(db, 'board')
export const listCollectionRef = collection(db, 'list')
export const cardCollectionRef = collection(db, 'card')