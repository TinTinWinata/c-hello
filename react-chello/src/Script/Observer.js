import { getDoc, query, where } from "firebase/firestore";
import { userCollectionRef } from "../Library/firebase.collections";

export function notifyAdminDeletionWorkspace(adminId, notification) {
  adminId.map((id) => {
    const q = query(userCollectionRef, where("userId", "==", id));
    const getData = getDoc(q);
    console.log(getData);
  });
}
