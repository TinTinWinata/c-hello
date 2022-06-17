import React, { useState } from "react";
import { getWebId } from "../Script/Util";
import { addWorkspaceIL } from "../Script/Workspace";

export default function InviteWorkspaceMember() {
  const [link, setLink] = useState("");

  function handleButton() {
    const id = getWebId();
    addWorkspaceIL(id).then((docRef) => {
      setLink("localhost:3000/invite-link/" + docRef.id);
    });
  }

  return (
    <>
      <form className="w-full mt-5 sm:flex sm:items-center">
        <div className="w-full sm:max-w-xs">
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Email Member"
          />
        </div>
        <button
          type="submit"
          className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Submit
        </button>
      </form>
      <p className="text-gray-500 mt-5 text-sm text-">
        Or you can generate link below
      </p>
      <label className="mt-1 block text-gray-700 text-sm font-bold mb-2">
        {link}
      </label>

      <button
        onClick={handleButton}
        className="mt-1 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
      >
        Generate Invite Link
      </button>
    </>
  );
}
