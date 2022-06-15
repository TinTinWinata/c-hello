import Navbar from "../Component/Navbar";
import Sidebar from "../Component/Sidebar";
import { useParams } from 'react-router-dom';
import { getWebId } from "../Script/Util";
import { BoardCard } from "../Component/BoardCard";
import { BoardCardGroup } from "../Component/BoardCardGroup";

// const param = useParams()


function Workspace(props) {return (
  <>
      <Navbar></Navbar>
      <div className="flex">

      <Sidebar></Sidebar>

      <div className="flex-col ml-10 mt-5">
      <div className="font-bold text-2xl mb-5">Boards List</div>
          <BoardCardGroup></BoardCardGroup>
          <div className="font-bold text-2xl mb-5 mt-10">Member List</div>
        </div>  
      </div>

  </>
  );
}

export default Workspace;
