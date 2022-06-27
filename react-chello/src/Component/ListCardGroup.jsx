import React, { useState } from "react";
import BoardCalendarView from "./BoardCalendarView";
import ChangeViewList from "./ChangeViewList";
import CreateNewListCard from "./CreateNewListCard";
import Realtimelist from "./RealtimeListCard";

export default function ListCardGroup({ role, refreshRole, board }) {
  const [tabIndex, setTabIndex] = useState(1);

  const [refresh, setRefresh] = useState();

  function refreshPage() {
    setRefresh((prev) => !prev);
  }

  return (
    <>
      <div className="ml-5 w-full  mt-5">
        {role ? (
          <CreateNewListCard
            refreshPage={refreshPage}
            refresh={refresh}
            role={role}
          ></CreateNewListCard>
        ) : (
          ""
        )}

        {tabIndex == 1 ? (
          <Realtimelist
            board={board}
            refreshPage={refreshPage}
            refresh={refresh}
            refreshRole={refreshRole}
            role={role}
          ></Realtimelist>
        ) : (
          ""
        )}
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
