import React from 'react'
import { useUserAuth } from '../Library/UserAuthContext'
import ProfileContent from './ProfileContent'
import ProfileHeader from './ProfileHeader'

export default function ProfileComponent() {

   const { user } = useUserAuth()

  return (
    <>
    <ProfileHeader user={user}/>
    <ProfileContent user={user}/>
    </>
  )
}
