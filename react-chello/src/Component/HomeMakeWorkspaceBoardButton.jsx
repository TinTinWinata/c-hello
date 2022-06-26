import React, { useState } from "react";
import { toastError } from "../Model/Toast";
import WorkspacePopUp from "./WorkspacePopUp";
import HomeBoardPopUp from "./HomeBoardPopUp";
import { useUserAuth } from "../Library/UserAuthContext";

export default function HomeMakeWorkspaceBoardButton() {
  const [showWs, setShowWs] = useState(false);
  const [showB, setShowB] = useState(false);
  const { user } = useUserAuth()

  function handleWorkspace() {
    if (!user) {
      toastError("Please login before you can create any workspace");
      return;
    }

    setShowWs((prev) => !prev);
  }

  function handleBoard() {
    if (!user) {
      toastError("Please login before you can create any workspace");
      return;
    }
    setShowB((prev) => !prev);
  }

  return (
    <>
      {showB ? (
        <HomeBoardPopUp trigger={showB} setTrigger={setShowB}></HomeBoardPopUp>
      ) : (
        ""
      )}
      {showWs ? (
        <WorkspacePopUp
          trigger={showWs}
          setTrigger={setShowWs}
        ></WorkspacePopUp>
      ) : (
        ""
      )}
      <div className="ml-10 mt-10 mb-10 flex">
        <button
          onClick={handleWorkspace}
          type="button"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Workspace
        </button>
        <button
          onClick={handleBoard}
          type="button"
          className="ml-5 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Board
        </button>
      </div>
    </>
  );
}
