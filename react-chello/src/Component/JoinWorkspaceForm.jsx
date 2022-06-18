import { documentId, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  workspaceCollectionRef,
  workspaceILRef,
} from "../Library/firebase.collections";
import { useUserAuth } from "../Library/UserAuthContext";
import { getWebId } from "../Script/Util";
import { addMember, updateWorkspace } from "../Script/Workspace";

export default function JoinWorkspaceForm() {
  const { id } = useParams();
  const [workspace, setWorkspace] = useState({ name: "Workspace" });
  const [workspaceId, setWorkspaceId] = useState();
  const location = useLocation();
  const { user } = useUserAuth();

  useEffect(() => {
    const q = query(workspaceILRef, where(documentId(), "==", id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      var snap = snapshot.docs[0].data().workspaceId;
      const q2 = query(workspaceCollectionRef, where(documentId(), "==", snap));
      onSnapshot(q2, (snapshot2) => {
        setWorkspace(snapshot2.docs[0].data());
        setWorkspaceId(snapshot2.docs[0].id);
      });
    });
    return () => {
      unsubscribe();
    };
  }, [location]);

  function handleJoin() {
    if (workspaceId) {
      addMember(workspaceId, user.uid);
    }
    // window.location.replace("/home");
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
