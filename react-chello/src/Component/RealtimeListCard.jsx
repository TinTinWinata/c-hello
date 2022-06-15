import React, { useEffect, useState } from 'react'
import { doc, onSnapshot, query, where } from 'firebase/firestore'
import { listCollectionRef } from '../Library/firebase.collections'
import { Link, useLocation } from 'react-router-dom'
import { getWebId } from '../Script/Util'
import CreateCard from './CreateCard'


export default function Realtimelist() {

  const location = useLocation()
  const [list, setList] = useState([])
  
  useEffect(()=>{
    
    const id = getWebId()
    const q = query(listCollectionRef)
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
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{card.name}</div>
         </div>
        <div className="px-6 pt-4 pb-2">
        <CreateCard></CreateCard>
        </div>
      </div>
    )})}
    </>
  )
}
