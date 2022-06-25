import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import uuid from "react-uuid";
import { useUserAuth } from "../Library/UserAuthContext";
import { toastError, toastSuccess } from "../Model/Toast";
import { updateUserOnDatabase } from "../Model/User";
import { getWebId, removeArray } from "../Model/Util";
import {
  addWorkspaceDeleteLink,
  deleteWorkspace,
  getWorkspaceById,
  updateWorkspace,
  updateWorkspaceById,
} from "../Model/Workspace";
import { notifyAdminDeletionWorkspace } from "../Script/Observer";

export default function DeleteWorkspace({ ws, role }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { userDb } = useUserAuth();

  function handleDelete() {
    if (ws) {

      // Validate if admin workspace more than one
      if (ws.adminId.length > 1) {
        addWorkspaceDeleteLink(ws).then((docRef) => {
          const link = "/delete-workspace/" + docRef.id;

          const notification = {
            id: uuid(),
            senderId: userDb.userId,
            type: "delete-workspace",
            value:
              userDb.displayName +
              " Invite you to Delete " +
              ws.name +
              " Workspace",
            link: link,
          };
          notifyAdminDeletionWorkspace(ws.adminId, notification);
        });
      } else {
        //   Delete Workspace
        deleteWorkspace(id)
          .then(() => {
            toastSuccess("Succesfully delete workspace!");
            navigate("/home");
          })
          .catch((e) => {});
      }
    } else {
      toastError("Too fast darling");
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
        Yes I'm sure, Delete Workspace
      </button>
    </>
  );
}
