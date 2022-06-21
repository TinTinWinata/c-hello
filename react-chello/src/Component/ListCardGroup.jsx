import React, { useState } from "react";
import BoardCalendarView from "./BoardCalendarView";
import ChangeViewList from "./ChangeViewList";
import CreateNewListCard from "./CreateNewListCard";
import Realtimelist from "./RealtimeListCard";

export default function ListCardGroup() {
  const [tabIndex, setTabIndex] = useState(1);

  return (
    <>
      <div className="ml-5 w-full  mt-5">
        <CreateNewListCard></CreateNewListCard>
        {tabIndex == 1 ? <Realtimelist></Realtimelist> : ""}
        {tabIndex == 2 ? <BoardCalendarView></BoardCalendarView> : ""}
        <ChangeViewList
          tabIndex={tabIndex}
          setTabIndex={setTabIndex}
        ></ChangeViewList>
      </div>
    </>
  );
}
