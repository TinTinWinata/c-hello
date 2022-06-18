import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection,getDocs,addDoc,updateDoc,deleteDoc,doc, arrayUnion, documentId,} from "firebase/firestore"
import { db } from '../Config/firebase-config'
import { workspaceCollectionRef, workspaceILRef } from "../Library/firebase.collections";

const auth = getAuth();

const ref = collection(db, "workspace")

  

export async function insertWorkspace(newName, newDetail, newLanguange, newCountry)
{
  try {
    await addDoc(ref, {name:newName, 
      detail:newDetail, 
      languange:newLanguange,
      country:newCountry,
      adminId: [auth.currentUser.uid],
      memberId:[],
    })
    console.log('succed add to docs')
  } catch (error) {
    alert('error adding : ' , error)
    console.log('error adding : ' , error)
  }
}

export async function addMember(workspaceId, newMemberId){
  const ref = doc(db, "workspace", workspaceId)
  // console.log(newMemberId)
  try{
    await updateDoc(ref, {
      memberId: arrayUnion(newMemberId)
    })
    window.location.replace('/home')
    console.log('succed add to docs')
  }catch(error){
    alert('error update : ' , error)
    console.log('error update : ' , error)
  }
}

export async function deleteWorkspace(workspaceId)
{
  const ref = doc(db, "workspace", workspaceId)
  await deleteDoc(ref)

  window.location.replace('/home')
}


export async function addWorkspaceIL(workspaceId)
{
  try{
    return await addDoc(workspaceILRef, {
      workspaceId: workspaceId,
    })
  }catch(error) {
    alert('error adding : ' , error)
    console.log('error adding : ' , error)
  }
}

export async function updateWorkspace(workspace)
{
  const ref = doc(db, "workspace", workspace.id)
  await updateDoc(ref, workspace)
}


