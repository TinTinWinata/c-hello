import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUserAuth } from "../Library/UserAuthContext";
import { toastSuccess } from "../Model/Toast";
import {
  deleteWorkspace,
  getWorkspaceById,
  getWorkspaceDeleteById,
  updateDeleteWorkspace,
} from "../Model/Workspace";
import { LoadingScreen } from "./LoadingScreen";

export default function DeleteWorkspaceForm() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();
  const [ws, setWs] = useState();
  const [deleteDetail, setDeleteDetail] = useState();
  const { userDb } = useUserAuth();

  useEffect(() => {
    if (deleteDetail) {
      const wsId = deleteDetail.workspaceId;
      const doc = getWorkspaceById(wsId);
      doc.then((ws) => {
        setWs(ws);
        setLoading(false);
      });
    }
  }, [deleteDetail]);

  useEffect(() => {
    const doc = getWorkspaceDeleteById(id);
    doc.then((ws) => {
      setDeleteDetail(ws);
    });

    return () => {};
  }, []);

  function checkIfAllAgree() {
    const length = deleteDetail.adminId.length;
    let statusLength = 0;
    deleteDetail.adminId.map((admin) => {
      if (admin.status == true) {
        statusLength += 1;
      }
    });
    if (statusLength == length) {
      deleteWorkspace(ws.id)
        .then(() => {
          toastSuccess("Succesfully delete workspace!");
          navigate("/home");
        })
        .catch((e) => {});
    } else {
      toastSuccess("Waiting for " + length - statusLength + " More admin!");
      navigate("/home");
    }
  }

  function handleDelete() {
    deleteDetail.adminId.map((map) => {
      if (map.admin == userDb.userId) {
        map.status = true;
      }
    });
    updateDeleteWorkspace(deleteDetail).then(() => {
      checkIfAllAgree();
    });
  }

  function handleLove() {
    navigate(-1);
  }

  return (
    <>
      {loading ? (
        <LoadingScreen></LoadingScreen>
      ) : (
        <div
          tabIndex="-1"
          aria-hidden="true"
          className="fixed overflow-y-auto overflow-x-hidden w-full md:inset-0 md:h-full bg-gray-500 bg-opacity-30 h-full flex justify-center items-center"
        >
          <div className="fixed p-4 w-full max-w-2xl h-full md:h-auto">
            <div className="bg-white rounded-lg shadow border-2 relative">
              <div className="py-6 px-6 lg:px-8">
                <h3 className="mb-4 text-xl font-medium text-gray-700 ">
                  Welcome to This Workspace You Sure want to delete this
                  workspace ?
                </h3>
                <p className="text-gray-400">All the data will be lost!</p>
                <h3 className="ml-2 mb-4 text-xl font-medium text-gray-900 "></h3>
                <div className="flex">
                  <button
                    onClick={handleDelete}
                    className="mr-3 w-full text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-3 text-center"
                  >
                    Delete Workspace
                  </button>
                  <button
                    onClick={handleLove}
                    className="ml-3 w-full text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-3 text-center"
                  >
                    I Still Love It
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
