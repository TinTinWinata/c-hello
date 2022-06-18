import Navbar from "../Component/Navbar";
import Sidebar from "../Component/Sidebar";
import { useParams } from "react-router-dom";
import { getWebId } from "../Script/Util";
import { BoardCardGroup } from "../Component/BoardCardGroup";
import ManageWorkspace from "../Component/ManageWorkspace";
import WorkspaceMemberlist from "../Component/WorkspaceMemberlist";

// const param = useParams()

function Workspace(props) {
  return (
    <>
      <Navbar></Navbar>
      <div className="flex">
        <Sidebar></Sidebar>
        <div className="flex-col ml-10 mt-5">
          <div className="font-bold text-2xl mb-5">Boards List</div>
          <BoardCardGroup></BoardCardGroup>
          <div className="font-bold text-2xl mb-5 mt-10">Member List</div>
          <WorkspaceMemberlist></WorkspaceMemberlist>
        </div>
      </div>
      <ManageWorkspace />
    </>
  );
}

export default Workspace;
