import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserAuth } from "../Library/UserAuthContext";
import { toastSuccess } from "../Script/Toast";
import { updateUserOnDatabase } from "../Script/User";
import { getWebId, removeArray } from "../Script/Util";
import {
  deleteWorkspace,
  getWorkspaceById,
  updateWorkspace,
  updateWorkspaceById,
} from "../Script/Workspace";

export default function DeleteWorkspace({ role }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { userDb } = useUserAuth();

  function handleDelete() {
    if (role == "Member") {
      const ws = getWorkspaceById(id);
      ws.then((ws) => {
        const removedArray = removeArray(ws.memberId, userDb.userId);
        let idx = 0;
        updateWorkspaceById(id, { memberId: removedArray });
        // Removing Workspace Member

        userDb.workspace.map((ws) => {
          if (ws.id == id) return;
          idx++;
        });
        userDb.workspace.splice(idx, 1);
        updateUserOnDatabase(userDb.userId, userDb);
        // Removing User Member

        toast.success("Succesfully Leave from" + ws.name + " Workspace");
        navigate("/home");
      }).catch((e) => {
        toast.error("Failed Leaving Workspace " + e.message);
      });
    } else {
      deleteWorkspace(id)
        .then(() => {
          toastSuccess("Succesfully delete workspace!");
          navigate("/home");
        })
        .catch((e) => {});
    }
  }

  return (
    <>
      <div className="text-center w-full h-full">
        <p className="text-gray-500 mt-5 text-sm">
          {role == "Member"
            ? "Are you sure want to leave this workspace ?"
            : "Are you sure want to delete this workspace ? All the data will be lost"}
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
