import React, { useState } from "react";
import ManageWorkspaceForm from "./ManageWorkspaceForm";

export default function ManageWorkspace({ role }) {
  const [isTrigger, setTrigger] = useState(false);

  function clickHandle() {
    setTrigger(true);
  }

  return (
    <>
      {isTrigger ? (
        <ManageWorkspaceForm role={role} setTrigger={setTrigger} />
      ) : (
        <></>
      )}
      <div
        onClick={clickHandle}
        className="p-2 bg-white-200 hover:bg-gray-50 shadow sm:rounded-lg fixed bottom-5 right-5 cursor-pointer"
      >
        <div className="flex">
          <h3 className="first-letter:text-sm leading-6 font-medium text-gray-900">
            {role == "Member" ? "Setting Workspace" : "Manage Workspace"}
          </h3>
          <svg
            className="h-5 w-5 mt-1 ml-2 text-gray-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {" "}
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        </div>
      </div>
    </>
  );
}
