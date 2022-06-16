import React, { useEffect, useState } from "react"
import CreateBoardPopUp from "./CreateBoardPopUp"


export function CreateBoardCard()
{
  const [popUpTrigger, setPopUpTrigger] = useState(false)

  useEffect(() => {
    let handler = (e) => {
      setPopUpTrigger(false)
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  function click()
  {
    setPopUpTrigger(true)
  }

  return(
    <React.Fragment>

<div onClick={click} className="z-0 bg-gray-100 hover:bg-gray-200 relative h-32 w-64 rounded overflow-hidden shadow-lg cursor-pointer">
  <div className="px-6 py-4">
    <div className="z-0 italic text-xl mb-2 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Create Board</div>
  </div>
  <div className="px-6 pt-4 pb-2">
  </div>
</div>
    <CreateBoardPopUp trigger={popUpTrigger} setTrigger={setPopUpTrigger}></CreateBoardPopUp>
    </React.Fragment>


)
}