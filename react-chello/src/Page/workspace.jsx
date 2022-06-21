import Navbar from "../Component/Navbar";
import Sidebar from "../Component/Sidebar";
import { useParams } from "react-router-dom";
import { getWebId } from "../Script/Util";
import { BoardCardGroup } from "../Component/BoardCardGroup";
import ManageWorkspace from "../Component/ManageWorkspace";
import WorkspaceMemberlist from "../Component/WorkspaceMemberlist";
import { useEffect, useState } from "react";
import { useUserAuth } from "../Library/UserAuthContext";

// const param = useParams()

function Workspace(props) {
  const { user, userDb } = useUserAuth();
  const { id } = useParams();
  const [role, setRole] = useState();

  useEffect(() => {
    if (userDb) {
      userDb.workspace.map((ws) => {
        if (ws.id == id) {
          setRole(ws.role);
        }
      });
    }
  });

  return (
    <>
      <Navbar></Navbar>
      <div className="flex">
        <Sidebar></Sidebar>
        <div className="flex-col ml-16 mt-7 ">
          <div className="font-bold text-2xl mb-5">Boards List</div>
          <BoardCardGroup role={role}></BoardCardGroup>
          <div className="font-bold text-2xl mb-5 mt-10">Member List</div>
          <WorkspaceMemberlist></WorkspaceMemberlist>
        </div>
      </div>
      {role ? <ManageWorkspace role={role} /> : ""}
    </>
  );
}

export default Workspace;
