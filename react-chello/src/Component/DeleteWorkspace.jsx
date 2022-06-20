import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getWebId } from "../Script/Util";
import { deleteWorkspace } from "../Script/Workspace";

export default function DeleteWorkspace() {
  const navigate = useNavigate();

  function handleDelete() {
    const id = getWebId();
    deleteWorkspace(id)
      .then(() => {
        navigate("/home");
      })
      .catch((e) => {});
  }

  return (
    <>
      <div className="text-center w-full h-full">
        <p className="text-gray-500 mt-5 text-sm">
          Are you sure want to delete this workspace ? All the data will be lost
        </p>
      </div>
      <label className="mt-1 block text-gray-700 text-sm font-bold mb-2"></label>

      <button
        onClick={handleDelete}
        className="mt-1  w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Yes I'm sure
      </button>
    </>
  );
}
