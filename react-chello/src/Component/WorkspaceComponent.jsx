
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {collection, getDocs, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react';
import { db } from "../Config/firebase-config";
import {Link} from 'react-router-dom';

const auth = getAuth()

function WorkspaceComponent(props)   {

  const [workspaceList, setWorkSpace] = useState([])

  const workspaceRef = collection(db, "workspace")

  async function get(id){
    const q = query(workspaceRef, where("userId", "==", id))
    const data = await getDocs(q)
    setWorkSpace(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
  } 

  useEffect(()=>{

    const getWorkspace = async() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in 
          get(user.uid)
        } else {
          // User is signed out
        }
      });
      }
    getWorkspace()
  }, [])

  const renderCard = (card) => {
    const link = '/workspace/' + card.id 
    return (
      <li key={card.id}>
      <Link to={link} className="flex items-center p-2 text-base font-normal text-grey-500 rounded-lg dark:text-black hover:bg-gray-100 dark:hover:bg-gray-200">
      <div className="w-3 h-3 rounded-lg mr-2 bg-black"></div>
      <span className="mr-3">{card.name}</span>
        </Link>
     </li>
    )
  }

  return (
      <>
      {workspaceList.map(renderCard)}
      </>
  )
}

export default WorkspaceComponent