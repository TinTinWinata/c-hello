import BoardList from "../Component/BoardList";
import JoinWorkspace from "../Component/JoinWorkspace";
import Navbar from "../Component/Navbar";
import Sidebar from "../Component/Sidebar";
import WorkspaceList from "../Component/WorkspaceList";

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
