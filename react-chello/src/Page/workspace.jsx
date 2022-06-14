import Navbar from "../Component/Navbar";
import Sidebar from "../Component/Sidebar";
import { useParams } from 'react-router-dom';

// const param = useParams()
console.log()

function Workspace(props) {return (
  <>
      <Navbar></Navbar>
      <Sidebar></Sidebar>
  </>
  );
}

export default Workspace;
