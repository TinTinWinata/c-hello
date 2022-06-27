import { documentId, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  workspaceCollectionRef,
  workspaceILRef,
} from "../Library/firebase.collections";
import { useUserAuth } from "../Library/UserAuthContext";
import { toastError, toastSuccess } from "../Model/Toast";
import { getWebId } from "../Model/Util";
import { addMember, updateWorkspace } from "../Model/Workspace";
import { notifyJoinMember } from "../Script/Observer";

export default function JoinWorkspaceForm() {
  const { id } = useParams();
  const [expired, setExpired] = useState();
  const [workspace, setWorkspace] = useState({ name: "Workspace" });

  const location = useLocation();
  const { user, userDb } = useUserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(workspaceILRef, where(documentId(), "==", id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      validateDate(snapshot.docs[0].data().dueDate);
      var snap = snapshot.docs[0].data().workspaceId;
      const q2 = query(workspaceCollectionRef, where(documentId(), "==", snap));
      onSnapshot(q2, (snapshot2) => {
        if (snapshot2.docs.length == 0) {
          // toastError("Cannot join workspace, workspace has been deleted");
          navigate("/home");
          return;
        }
        setWorkspace({
          ...snapshot2.docs[0].data(),
          id: snapshot2.docs[0].id,
        });
      });
    });
    return () => {
      unsubscribe();
    };
  }, [location]);

  function validateDate(date) {
    const currDate = new Date();
    const diffTime = Math.abs(date.toDate() - currDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 0) {
      setExpired(true);
    } else {
      setExpired(false);
    }
  }

  function onClickBack() {
    navigate(-1);
  }

  function handleJoin() {
    if (expired) {
      toastError("Link has been expired!");
      return;
    }

    if (!user) {
      toastError(
        "You must register an account before you can join this workspace"
      );
      return;
    }

    if (workspace) {
      addMember(workspace, user.uid, userDb)
        .then(() => {
          const notification = {
            link: "",
            type: "joined-member",
            value:
              user.displayName +
              " has been join " +
              workspace.name +
              " workspace!",
          };
          notifyJoinMember(workspace, notification);
          toastSuccess("Success join a workspace!");
          navigate("/home");
        })
        .catch((e) => {
          toastError("Failed to join workspace! " + e.message);
          navigate("/home");
        });
    } else {
      toastError("You too fast darling!");
    }
  }

  return (
    <div
      tabIndex="-1"
      aria-hidden="true"
      className="fixed overflow-y-auto overflow-x-hidden w-full md:inset-0 md:h-full bg-gray-500 bg-opacity-30 h-full flex justify-center items-center"
    >
      <div className="fixed p-4 w-full max-w-2xl h-full md:h-auto">
        <div className="bg-white rounded-lg shadow border-2 relative">
          <div className="py-6 px-6 lg:px-8">
            <div className="flex">
              <h3 className="mb-4 text-xl font-medium text-gray-900 ">
                Welcome to
              </h3>
              <h3 className="ml-2 mb-4 text-xl font-medium text-gray-900 ">
                {workspace.name}
              </h3>
              <p
                onClick={onClickBack}
                className="flex-shrink text-sm cursor-pointer text-blue-500 mt-2 ml-72"
              >
                Back
              </p>
            </div>
            <button
              onClick={handleJoin}
              className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center"
            >
              Join Workspace
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
