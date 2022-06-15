import React, { useState } from "react"
import { insertWorkspace } from "../Script/Workspace"
import './WorkspacePopUp.css'
import './CreateBoardPopUp.css'


function CreateBoardPopUp(props){
const [errorMessage, setErrorMessage] = useState('')

function handleSubmit(e)
{
  e.preventDefault()
  const name = e.target.name.value
  const detail = e.target.detail.value
  const languange = e.target.languange.value
  const country = e.target.country.value

  if(name == "" || detail == "" || languange == "")
  {
    setErrorMessage("please input all fields!")   
  }else{
    insertWorkspace(name, detail, languange, country)
    exitPopup()
  }
  
}  

function exitPopup()
{
  props.setTrigger(false)
}

  return (props.trigger) ? (
  <React.Fragment>
      <div className="form-container ml-3 mb-5 z-10 shadow-2xl relative transform bg-white p-10">
        <svg onClick={exitPopup} className="cursor-pointer opacity-80 exit-popup absolute close transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-red-500"  fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
  <form className="w-52 form-popup" onSubmit={handleSubmit}>
    <div className="text-label mb-3 mt-2 italic">Create Board</div>
  <div className="flex flex-wrap -mx-3 mb-6">
    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"htmlFor="grid-first-name">
        Board Name
      </label>
      <input name="name" className="appearance-none block w-max bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" type="text" placeholder=""/>
    </div>
    
  </div>
  <div className="flex flex-wrap -mx-3 mb-6">
    <div className="w-full px-3">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"htmlFor="grid-password">
        Board Tag
      </label>  
      <input name="detail" className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-password" placeholder=""/>
      <p className="text-gray-600 text-xs italic">Make it as long and as crazy as you'd like</p>
    </div>
  </div>
  <div className="flex flex-wrap -mx-3 mb-2">
    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"htmlFor="grid-state">
        Country
      </label>
      <div className="relative">
        <select name="country" className="block appearance-none w-max bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" id="grid-state">
          <option>Private</option>
          <option>Workspace</option>
          <option>Public</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 left-24 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>
    </div>
  </div>
  <p className="text-red-500 text-xs italic">{errorMessage}</p>
  <button type="submit" className="mt-10 w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow">
  Create Board
</button>
</form>
      </div>
  </React.Fragment>
) : ''} 

export default CreateBoardPopUp