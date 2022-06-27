import { MailIcon } from "@heroicons/react/outline";
import { type } from "@testing-library/user-event/dist/type";
import { onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import BoardList from "../Component/BoardList";
import ClosedBoardButton from "../Component/ClosedBoardButton";
import FavoriteBoard from "../Component/FavoriteBoard";
import HomeMakeWorkspaceBoardButton from "../Component/HomeMakeWorkspaceBoardButton";
import HomeSearching from "../Component/HomeSearching";
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
import { checkReminder } from "../Model/User";

function Home() {
  const [showCloseBoard, setShowCloseBoard] = useState(false);
  const [closedBoard, setClosedBoard] = useState();
  const { userDb } = useUserAuth();
  const [favLength, setFavLength] = useState(0);

  useEffect(() => {
    let unsub;
    if (userDb && userDb.favoriteBoard !== undefined) {
      setFavLength(userDb.favoriteBoard.length);
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
        <div className="w-fit flex flex-col">
          {showCloseBoard ? (
            <ViewClosedBoard closedBoard={closedBoard}></ViewClosedBoard>
          ) : (
            <React.Fragment>
              <HomeSearching></HomeSearching>
              {favLength > 0 ? <FavoriteBoard></FavoriteBoard> : ""}
              <PublicWorkspace></PublicWorkspace>
              <JoinWorkspace></JoinWorkspace>
              <PublicBoard></PublicBoard>
              <JoinBoard></JoinBoard>
              <WorkspaceList></WorkspaceList>
              <BoardList></BoardList>
              <HomeMakeWorkspaceBoardButton />
            </React.Fragment>
          )}
        </div>
      </div>
      <ClosedBoardButton
        showCloseBoard={showCloseBoard}
        setShowCloseBoard={setShowCloseBoard}
      ></ClosedBoardButton>
    </>
  );
}

export default Home;
