import BoardList from "../Component/BoardList";
import JoinWorkspace from "../Component/JoinWorkspace";
import Navbar from "../Component/Navbar";
import PublicBoard from "../Component/PublicBoard";
import PublicWorkspace from "../Component/PublicWorkspace";
import Sidebar from "../Component/Sidebar";
import WorkspaceList from "../Component/WorkspaceList";

function Home() {
  return (
    <>
      <Navbar></Navbar>
      <div className="flex">
        <Sidebar></Sidebar>
        <div className="flex flex-col">
          <PublicWorkspace></PublicWorkspace>
          <PublicBoard></PublicBoard>
            <WorkspaceList></WorkspaceList>
            <JoinWorkspace></JoinWorkspace>
          <BoardList></BoardList>
        </div>
      </div>
    </>
  );
}

export default Home;
