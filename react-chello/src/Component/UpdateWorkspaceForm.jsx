import React from "react";

export default function UpdateWorkspaceForm() {
  return (
    <>
      <h3 className="mb-4 text-xl font-medium text-gray-900">
        Update Workspace
      </h3>
      <form className="addWorkspace space-y-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Workspace Name
          </label>
          <input
            type="text"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5  "
            placeholder="New Name"
            name="workspaceName"
            required
          ></input>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 ">
            Workspace Description
          </label>
          <textarea
            type="text"
            placeholder="New Description"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5  min-h-[200px] max-h-[300px]"
            name="workspaceDescription"
            required
          ></textarea>
        </div>
        <button className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center">
          Update
        </button>
      </form>
    </>
  );
}
