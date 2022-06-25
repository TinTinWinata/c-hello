import React, { useState } from "react";
import BoardCalendarView from "./BoardCalendarView";
import ChangeViewList from "./ChangeViewList";
import CreateNewListCard from "./CreateNewListCard";
import Realtimelist from "./RealtimeListCard";

export default function ListCardGroup({role, refreshRole}) {
  const [tabIndex, setTabIndex] = useState(1);

  return (
    <>
      <div className="ml-5 w-full  mt-5">
        {role ? ( <CreateNewListCard role={role}></CreateNewListCard>): ""}
       
        {tabIndex == 1 ? <Realtimelist refreshRole={refreshRole} role={role}></Realtimelist> : ""}
        {tabIndex == 2 ? (
          <BoardCalendarView role={role}></BoardCalendarView>
        ) : (
          ""
        )}
        <ChangeViewList
          tabIndex={tabIndex}
          setTabIndex={setTabIndex}
        ></ChangeViewList>
      </div>
    </>
  );
}
