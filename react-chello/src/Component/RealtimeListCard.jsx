import React, { useEffect, useState } from 'react'
import { doc, onSnapshot, query, where } from 'firebase/firestore'
import { listCollectionRef } from '../Library/firebase.collections'
import { Link, useLocation } from 'react-router-dom'
import { getWebId } from '../Script/Util'
import CreateCard from './CreateCard'
import RealtimeCard from './RealtimeCard'


export default function Realtimelist() {

  const location = useLocation()
  const [list, setList] = useState([])
  
  useEffect(()=>{
    
    const id = getWebId()
    const q = query(listCollectionRef, where('boardId', '==', id))
    const unsubscribe = onSnapshot(q, snapshot=>{
        setList(snapshot.docs.map(docs => ({...docs.data(), id: docs.id})))
    })  
    return()=>{
        unsubscribe()
    }
  }, [location])  

  return ( 
    <>
    {list.map((card) => {     
      const link = '/list/' + card.id
      const tag = '#' + card.tag
      return (
      <div key={card.id} className="bg-white mb-5 h-fit mr-5 w-64 rounded overflow-hidden shadow-lg">
      <div className="px-5 py-3">
        <div className="font-bold text-xl mb-2">{card.name}</div>
         </div>
        <RealtimeCard listId={card.id}></RealtimeCard>
        <div className="px-6 pt-4 pb-2">
        <CreateCard listId={card.id}></CreateCard>
        </div>
      </div>
    )})}
    </>
  )
}
