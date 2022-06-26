import SidebarComponent from "./SidebarComponent";
import WorkspaceComponent from "./WorkspaceComponent";
import "./Sidebar.css";
import React, { useEffect, useState } from "react";
import WorkspacePopUp from "./WorkspacePopUp";

import LogoutButton from "./LogoutButton";
import BoardComponent from "./BoardComponent";
import { useUserAuth } from "../Library/UserAuthContext";

function Sidebar() {
  const [popUpCreateWP, setPopUpCreateWP] = useState(false);
  const { user } = useUserAuth();

  function createWorkspace() {
    setPopUpCreateWP(true);
  }

  return (
    <React.Fragment>
      <WorkspacePopUp
        trigger={popUpCreateWP}
        setTrigger={setPopUpCreateWP}
      ></WorkspacePopUp>
      <aside className="w-64" aria-label="Sidebar">
        <div className="w-64 pl-10 fixed top-10 h-screen overflow-y-auto py-4 px-3 bg-gray-50 rounded">
          <ul className="space-y-2 mt-10">
            <SidebarComponent text="Home" link="/home"></SidebarComponent>
          </ul>
          <ul className="pt-4 mt-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
            <li>
              <div className="flex">
                <p className="workspace">Workspace</p>
                {user ? (
                  <svg
                    onClick={createWorkspace}
                    className="cursor-pointer scale-75 h-8 w-8 text-black-500 opacity-50"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {" "}
                    <rect
                      x="3"
                      y="3"
                      width="18"
                      height="18"
                      rx="2"
                      ry="2"
                    />{" "}
                    <line x1="12" y1="8" x2="12" y2="16" />{" "}
                    <line x1="8" y1="12" x2="16" y2="12" />
                  </svg>
                ) : (
                  ""
                )}
              </div>
            </li>
            <WorkspaceComponent></WorkspaceComponent>
          </ul>
          <ul className="pt-4 mt-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
            <BoardComponent></BoardComponent>
          </ul>
        </div>
      </aside>
    </React.Fragment>
  );
}

export default Sidebar;
