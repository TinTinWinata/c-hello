import React, { useState } from 'react'
import { useUserAuth } from '../Library/UserAuthContext';

export default function LogoutButton() {
  
  const {user, logout} = useUserAuth()

  function handleLogout()
  {
    logout()
  }

  function renderButton()
  {
    return(
    <button onClick={handleLogout} className="w-28 font-s btn-logout bg-transparent  text-red-700 font-semibold py-2 px-4 border border-red-500 rounded">
        Log Out
    </button>
    )
  }


  if(user)
  {
    return renderButton()
  }
}
