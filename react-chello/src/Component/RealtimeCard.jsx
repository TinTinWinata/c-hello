import React, { createRef, useEffect, useState } from 'react'
import { doc, onSnapshot, query, where } from 'firebase/firestore'
import { cardCollectionRef, listCollectionRef } from '../Library/firebase.collections'
import { Link, useLocation } from 'react-router-dom'
import { getWebId } from '../Script/Util'
import './RealtimeCard.css'
import { updateCard } from '../Script/Card'



export default function RealtimeCard(props) {

  const location = useLocation()
  const [card, setCard] = useState([])
  const [trigger, setTrigger] = useState(false)
  const [cardClicked, setClickedCard] = useState()


    
  useEffect(()=>{
      
    const id = getWebId()
    const q = query(cardCollectionRef, where('boardId', '==', id), where('listId', '==', props.listId))
    const unsubscribe = onSnapshot(q, snapshot=>{
        setCard(snapshot.docs.map(docs => ({...docs.data(), id: docs.id})))
      })  
      return()=>{
        unsubscribe()
      }
    }, [location])  
    

    function handleOnClick(e, card)
    {
      setTrigger(true)
      setClickedCard(card)
    }

    function handleOffClick()
    {
      setTrigger(false)
    }



    const renderCard = () => {


      var titleInput = createRef()

      const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            cardClicked.name = titleInput.current.value
            updateCard(cardClicked)
        }
      }

      return(
      <>
      <div className="z-10 black-background left-0 top-0 absolute bg-black opacity-70">
        </div>
      <div className="z-10 w-2/4 h-fit absolute bg-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <svg onClick={handleOffClick} className="right-5 top-5 absolute h-8 w-8 text-gray-500 cursor-pointer"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" /></svg>
        <div className="z-20 ml-5 mt-5 text-2xl font-bold">
        <input ref={titleInput} className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text"  onKeyDown={handleKeyDown} defaultValue={cardClicked.name} aria-label="Full name"/>
        
        </div>
      </div>
      </>
    )}

  return (
    <>
        {trigger ? renderCard() : <></>}
      {card.map((card) =>{
        return(
        <div onClick={event=> handleOnClick(event, card)} key={card.id} className="mb-2 ml-5 w-4/5 hover:bg-gray-200 cursor-pointer rounded p-1 shadow">
        <p className="text-sm italic">{card.name}</p>
        </div>
        )
      })}
    </>
  )
}
