import { addDoc } from "firebase/firestore";
import { db } from "../Config/firebase-config";
import { notificationCollectionRef } from "../Library/firebase.collections";
import { useUserAuth } from "../Library/UserAuthContext";

export function insertNotification(notification) {
  return addDoc(notificationCollectionRef, notification);
}
