import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../Library/UserAuthContext";
import { toastError, toastSuccess } from "../Model/Toast";
import { updateUserOnDatabase } from "../Model/User";
import { removeArray } from "../Model/Util";
import { deleteWorkspace, updateWorkspaceById } from "../Model/Workspace";

export default function LeaveWorkspace({ ws, role, setTabIndex }) {
  const { userDb } = useUserAuth();
  const navigate = useNavigate();

  function checkDelete() {
    const adminLength = ws.adminId.length;
    const memberLength = ws.memberId.length;
    if (adminLength + memberLength == 0) {
      deleteWorkspace(ws.id).then(() => {
        toastSuccess("Succesfully delete workspace");
      });
    }
  }

  function adminLeaveWorkspace() {
    // Leave
    const removedArray = removeArray(ws.adminId, userDb.userId);
    let idx = 0;
    updateWorkspaceById(ws.id, { adminId: removedArray });
    // Removing Workspace Member

    userDb.workspace.map((wsUser) => {
      if (wsUser.id == ws.id) return;
      idx++;
    });
    userDb.workspace.splice(idx, 1);
    updateUserOnDatabase(userDb.userId, userDb);
    // Removing User Member

    navigate("/home");
    toastSuccess("Succesfully Leave from " + ws.name + " Workspace");
  }

  function handleLeave() {
    if (role == "Member") {
      const removedArray = removeArray(ws.memberId, userDb.userId);
      let idx = 0;
      updateWorkspaceById(ws.id, { memberId: removedArray });
      // Removing Workspace Member

      userDb.workspace.map((wsUser) => {
        if (wsUser.id == ws.id) return;
        idx++;
      });
      userDb.workspace.splice(idx, 1);
      updateUserOnDatabase(userDb.userId, userDb);
      // Removing User Member

      navigate("/home");
      toastSuccess("Succesfully Leave from " + ws.name + " Workspace");
    }
    if (role == "Admin") {
      if (ws.adminId.length > 1) {
        adminLeaveWorkspace();
      } else if (ws.adminId.length == 1) {
        if (ws.memberId.length == 0) {
          deleteWorkspace(ws.id).then(() => {
            navigate("/home");
            toastSuccess("Workspace has been deleted!");
          });
        } else {
          toastError(
            "You cannot leave if you're an solo admin! Please add another admin!"
          );
          setTabIndex(1);
        }
      }
    }
  }

  return (
    <>
      <div className="text-center w-full h-full">
        <h1 className="text-gray-800 font-bold mt-1 text-2xl">
          Leaving A Workspace
        </h1>
        <p className="text-gray-500 text-sm">
          Are you sure want to leave this workspace ? All the data will be lost
        </p>
      </div>
      <label className="mt-1 block text-gray-700 text-sm font-bold mb-2"></label>

      <button
        onClick={handleLeave}
        className="mt-1  w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Yes Leave Workspace
      </button>
    </>
  );
}
