import JoinWorkspace from "../Component/JoinWorkspace";
import Navbar from "../Component/Navbar";
import Sidebar from "../Component/Sidebar";

function Home() {
  return (
    <>
      <Navbar></Navbar>
      <div className="flex">
        <Sidebar></Sidebar>
        <JoinWorkspace></JoinWorkspace>
      </div>
    </>
  );
}

export default Home;
