import { MailIcon } from "@heroicons/react/outline";
import { type } from "@testing-library/user-event/dist/type";
import { onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import BoardList from "../Component/BoardList";
import ClosedBoardButton from "../Component/ClosedBoardButton";
import JoinBoard from "../Component/JoinBoard";
import JoinWorkspace from "../Component/JoinWorkspace";
import Navbar from "../Component/Navbar";
import PublicBoard from "../Component/PublicBoard";
import PublicWorkspace from "../Component/PublicWorkspace";
import Sidebar from "../Component/Sidebar";
import ViewClosedBoard from "../Component/ViewClosedBoard";
import WorkspaceList from "../Component/WorkspaceList";
import {
  boardCollectionRef,
  deletedBoardCollectionRef,
} from "../Library/firebase.collections";
import { useUserAuth } from "../Library/UserAuthContext";

function Home() {
  const [showCloseBoard, setShowCloseBoard] = useState(false);

  const [closedBoard, setClosedBoard] = useState();

  const { userDb } = useUserAuth();

  useEffect(() => {
    let unsub;
    if (userDb) {
      const q = query(
        boardCollectionRef,
        where("adminId", "array-contains", userDb.userId),
        where("closed", "==", true)
      );

      unsub = onSnapshot(q, (snap) => {
        const temp = snap.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
        setClosedBoard(temp);
      });
    }
    return () => {
      if (typeof unsub == "function") unsub();
    };
  }, [userDb]);

  return (
    <>
      <Navbar></Navbar>
      <div className="flex">
        <Sidebar></Sidebar>
        <div className="flex flex-col">
          {showCloseBoard ? (
            <ViewClosedBoard closedBoard={closedBoard}></ViewClosedBoard>
          ) : (
            <React.Fragment>
              <PublicWorkspace></PublicWorkspace>
              <JoinWorkspace></JoinWorkspace>
              <PublicBoard></PublicBoard>
              <JoinBoard></JoinBoard>
              <WorkspaceList></WorkspaceList>
              <BoardList></BoardList>
            </React.Fragment>
          )}
        </div>
      </div>
      <ClosedBoardButton
        setShowCloseBoard={setShowCloseBoard}
      ></ClosedBoardButton>
    </>
  );
}

export default Home;
