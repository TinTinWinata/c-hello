import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  arrayUnion,
  documentId,
  getDoc,
} from "firebase/firestore";
import { db } from "../Config/firebase-config";
import {
  workspaceCollectionRef,
  workspaceILRef,
} from "../Library/firebase.collections";
import { useUserAuth } from "../Library/UserAuthContext";
import { deleteBoard } from "./Board";
import { updateUserOnDatabase } from "./User";

const auth = getAuth();
const ref = collection(db, "workspace");
// const { userDb } = useUserAuth();

export async function getWorkspaceById(id) {
  const ref = doc(db, "workspace", id);
  const temp = await getDoc(ref);
  return temp.data();
}
export async function insertWorkspace(
  newName,
  newDetail,
  newLanguange,
  newCountry,
  userDb
) {
  try {
    const doc = await addDoc(ref, {
      name: newName,
      detail: newDetail,
      languange: newLanguange,
      country: newCountry,
      adminId: [auth.currentUser.uid],
      memberId: [],
      visibility: "Private",
    });

    const changes = {
      workspace: [
        ...userDb.workspace,
        {
          id: doc.id,
          name: newName,
          role: "Admin",
        },
      ],
    };
    updateUserOnDatabase(userDb.userId, changes).then(() => {
      console.log("succesfully updated user!");
    });
  } catch (error) {
    alert("error adding : ", error);
    console.log("error adding : ", error);
  }
}



export async function addMember(ws, newMemberId, userDb) {
  const ref = doc(db, "workspace", ws.id);

  return updateDoc(ref, {
    memberId: arrayUnion(newMemberId),
  }).then(() => {
    const changes = {
      workspace: [
        ...userDb.workspace,
        {
          id: ws.id,
          name: ws.name,
          role: "Member",
        },
      ],
    };
    return updateUserOnDatabase(userDb.userId, changes);
  });
}

export function deleteWorkspace(workspaceId) {
  const ref = doc(db, "workspace", workspaceId);
  deleteBoard(workspaceId)
    .then(() => {
      console.log("succed to delete board");
    })
    .catch((error) => {
      console.log("failed to delete docs ", error.message);
    });
  return deleteDoc(ref);
}

export async function addWorkspaceIL(workspaceId) {
  try {
    return await addDoc(workspaceILRef, {
      workspaceId: workspaceId,
    });
  } catch (error) {
    alert("error adding : ", error);
    console.log("error adding : ", error);
  }
}

export async function updateWorkspace(workspace) {
  const ref = doc(db, "workspace", workspace.id);
  await updateDoc(ref, workspace);
}

export async function updateWorkspaceById(id, changes) {
  const ref = doc(db, "workspace", id);
  await updateDoc(ref, changes);
}
