import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import uuid from "react-uuid";
import { useUserAuth } from "../Library/UserAuthContext";
import { toastSuccess } from "../Model/Toast";
import { updateUserOnDatabase } from "../Model/User";
import { getWebId, removeArray } from "../Model/Util";
import {
  deleteWorkspace,
  getWorkspaceById,
  updateWorkspace,
  updateWorkspaceById,
} from "../Model/Workspace";
import { notifyAdminDeletionWorkspace } from "../Script/Observer";

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
      // Validate if admin workspace more than one
      const ws = getWorkspaceById(id);
      if (ws.adminId.length > 1) {
        const notification = {
          id: uuid(),
          senderId: userDb.userId,
          type: "delete-workspace",
          value:
            userDb.displayName +
            " Invite you to Delete " +
            ws.name +
            " Workspace",
          link: "/delete-workspace/" + ws.id,
        };
        notifyAdminDeletionWorkspace(ws.adminId, notification);
      } else {
        // Delete
        deleteWorkspace(id)
          .then(() => {
            toastSuccess("Succesfully delete workspace!");
            navigate("/home");
          })
          .catch((e) => {});
      }
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
