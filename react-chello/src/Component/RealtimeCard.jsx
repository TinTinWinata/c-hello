import React, { createRef, useEffect, useState } from 'react'
import { doc, onSnapshot, query, where } from 'firebase/firestore'
import { cardCollectionRef, listCollectionRef } from '../Library/firebase.collections'
import { Link, useLocation } from 'react-router-dom'
import { getWebId } from '../Script/Util'
import './RealtimeCard.css'
import { deleteCard, updateCard } from '../Script/Card'



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
      var descriptionInput = createRef()
      

      const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            cardClicked.name = titleInput.current.value
            cardClicked.description = descriptionInput.current.value
            updateCard(cardClicked)
        }
      }

      const handleOnChange = (e)=>{
        cardClicked.description = descriptionInput.current.value
        updateCard(cardClicked)
      }

      const handleDelete = () => {
        deleteCard(cardClicked)
        setTrigger(false)
      }

      const handleAttach = () => {

      }

      return(
      <>
      <div className="z-10 black-background left-0 top-0 absolute bg-black opacity-70">
        </div>
      <div className="z-10 w-2/4 h-fit absolute bg-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <svg onClick={handleOffClick} className="right-5 top-5 absolute h-8 w-8 text-gray-500 cursor-pointer"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <line x1="18" y1="6" x2="6" y2="18" />  <line x1="6" y1="6" x2="18" y2="18" /></svg>
        <div className="z-20 ml-5 mt-5 text-2xl font-bold flex flex-col">
        <input ref={titleInput} className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text"  onKeyDown={handleKeyDown} defaultValue={cardClicked.name} aria-label="Full name"/>
        
        <div className="pt-4 mt-4 w-5/6 space-y-2 border-t border-gray-200 dark:border-gray-700"></div>
        <p className="text-lg appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text"  aria-label="Full name">Description</p> 
        <textarea ref={descriptionInput} onChange={handleOnChange} aria-label="Description"  className="ml-2 mt-1 bg-gray-300 rounded w-2/3 h-24 text-sm font-normal appearance-none bg-transparent border-none text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text"  defaultValue={cardClicked.description} />       
        
        <p className="text-lg appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text"  aria-label="Full name">Check List</p> 
        <input type="text" id="email" class="font-normal ml-2 w-1/4 text-xs bg-gray-50 border border-gray-300 text-gray-600 rounded-lg focus:ring-gray-500 focus:border-gray-500 block p-1.5 dark:bg-gray-300 dark:border-gray-300 dark:placeholder-gray-400 dark:text-black dark:focus:ring-white-500 dark:focus:border-gray-500" placeholder="New Checklist..."/>
        <svg class="h-8 w-8 text-red-500"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>

        {/* <p className="text-lg appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text"  aria-label="Full name">Due Date</p>  */}
        <div className="flex">
          <button onClick={handleDelete} className="w-1/6 mt-5 appearance-none bg-transparent border-mt-2 mb-5 bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-2 px-4  rounded">
            Delete
          </button>
          <label for="file-upload" className="ml-3 w-1/6 mt-5 appearance-none bg-transparent border-mt-2 mb-5 bg-sky-500 hover:bg-sky-700 text-white text-sm font-bold py-2 px-4  rounded">
              Attach
          </label>
          <input id="file-upload" type="file" className="hidden"/>
        </div>
        
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
