import SidebarComponent from "./SidebarComponent";
import WorkspaceComponent from "./WorkspaceComponent";
import './Sidebar.css'
import React, { useEffect, useState } from "react";
import WorkspacePopUp from "./WorkspacePopUp";

import LogoutButton from "./LogoutButton";



function Sidebar() {

  const [popUpCreateWP, setPopUpCreateWP] = useState(false)

  function createWorkspace()
  {
      setPopUpCreateWP(true)
  }
  
  return (
    <React.Fragment>
      <WorkspacePopUp trigger={popUpCreateWP} setTrigger={setPopUpCreateWP}></WorkspacePopUp>
    <aside className="w-64" aria-label="Sidebar">
    <div className="relative pl-10 h-screen overflow-y-auto py-4 px-3 bg-gray-50 rounded">
      <ul className="space-y-2 mt-10">
      <SidebarComponent text="Boards" link="/board" svg=""></SidebarComponent>
      <SidebarComponent text="Templates" link="/template"></SidebarComponent>
      <SidebarComponent text="Home" link="/"></SidebarComponent>
      </ul>
      <ul className="pt-4 mt-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
        <li>
          <div className="flex">
          <p className="workspace">Workspace</p>
          <svg onClick={createWorkspace} className="cursor-pointer scale-75 h-8 w-8 text-black-500 opacity-50"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />  <line x1="12" y1="8" x2="12" y2="16" />  <line x1="8" y1="12" x2="16" y2="12" /></svg>
          </div>
        </li>
        <WorkspaceComponent></WorkspaceComponent>
        <LogoutButton></LogoutButton>
      </ul>
   </div>
</aside>
    </React.Fragment>
  );
}

export default Sidebar;
