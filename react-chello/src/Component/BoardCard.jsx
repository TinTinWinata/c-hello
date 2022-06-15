
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {collection, getDocs, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react';
import { db } from "../Config/firebase-config";
import {Link} from 'react-router-dom';
import { getWebId } from '../Script/Util';


export function BoardCard(props)
{
  const auth = getAuth()

  const [boardList, setBoard] = useState([])

  const boardRef = collection(db, "board")

  async function get(id){
    const q = query(boardRef, where("workspaceId", "==", id))
    const data = await getDocs(q)
    setBoard(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
  } 

  // useEffect(()=>{
  //   console.log('asd')
  //     get(getWebId())
  // }, [boardList, setBoard])


  const renderCard = (card)=>{
    const link = './board/' + card.id
    return(
  <Link to={link} key={card.id} className="mb-5 h-32 mr-5 w-64 rounded overflow-hidden shadow-lg cursor-pointer">
    <div className="px-6 py-4">
      <div className="font-bold text-xl mb-2">{card.name}</div>
    </div>
      <div className="px-6 pt-4 pb-2">
      <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">{card.tag}</span>
      </div>
  </Link>
    )
  }

  return(
      <>
      {boardList.map(renderCard)}
      </>
)
}