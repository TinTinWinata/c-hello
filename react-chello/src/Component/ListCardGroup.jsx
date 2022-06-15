import React from 'react'
import CreateNewListCard from './CreateNewListCard'
import Realtimelist from './RealtimeListCard'

export default function ListCardGroup() {
  return (
    <>
    <div className="ml-5 mt-5 flex flex-wrap">
      <Realtimelist></Realtimelist>
      <CreateNewListCard></CreateNewListCard>
    </div>
    </>
  )
}
