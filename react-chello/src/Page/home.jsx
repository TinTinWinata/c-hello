import { useEffect } from "react";
import BoardList from "../Component/BoardList";
import CardList from "../Component/CardList";
import JoinWorkspace from "../Component/JoinWorkspace";
import Navbar from "../Component/Navbar";
import Sidebar from "../Component/Sidebar";
import WorkspaceList from "../Component/WorkspaceList";
import { useUserAuth } from "../Library/UserAuthContext";

function Home() {
  return (
    <>
      <Navbar></Navbar>
      <div className="flex">
        <Sidebar></Sidebar>
        <div className="flex flex-col">
          <WorkspaceList></WorkspaceList>
          <JoinWorkspace></JoinWorkspace>
          <BoardList></BoardList>
        </div>
      </div>
    </>
  );
}

export default Home;
