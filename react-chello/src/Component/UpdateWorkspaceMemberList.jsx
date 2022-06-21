import { signInWithEmailAndPassword } from "firebase/auth";
import { documentId, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  userCollectionRef,
  workspaceCollectionRef,
} from "../Library/firebase.collections";
import { useUserAuth } from "../Library/UserAuthContext";
import { toastError, toastSuccess } from "../Script/Toast";
import { arrayIsEqual, removeArray } from "../Script/Util";
import { updateWorkspace, updateWorkspaceById } from "../Script/Workspace";

export default function UpdateWorkspaceMemberList({ ws }) {
  const location = useLocation();
  const [member, setMember] = useState([]);
  const { user } = useUserAuth();
  const [refresh, setRefresh] = useState(0);

  const addMember = (newMember) => {
    setMember((oldArray) => [...oldArray, newMember]);
  };

  const { id } = useParams();

  function handleRemove(currMember) {
    if (currMember.userId == user.uid) {
      toastError("Cannot remove yourself!");
      return;
    }
    const removedArray = removeArray(ws.memberId, currMember.userId);

    if (arrayIsEqual(removedArray, ws.memberId)) {
      toastError("Cannot remove admin roles!");
    } else {
      ws.memberId = removedArray;
      updateWorkspaceById(id, ws)
        .then(() => {
          toastSuccess("Success removing member!");
          setRefresh((prev) => {
            prev + 1;
          });
        })
        .catch((e) => {
          toastError("Failed to remove member! " + e.message);
        });
    }
  }

  useEffect(() => {
    if (ws) {
      setMember([]);
      const q = query(workspaceCollectionRef, where(documentId(), "==", id));
      ws.memberId.map((memberId) => {
        const q2 = query(userCollectionRef, where("userId", "==", memberId));
        const unsubs = onSnapshot(q2, (snapshot2) => {
          const currentUser = snapshot2.docs[0].data();
          currentUser.role = "Member";
          addMember(currentUser);
        });
      });
      ws.adminId.map((id) => {
        const q2 = query(userCollectionRef, where("userId", "==", id));
        const unsubs = onSnapshot(q2, (snapshot2) => {
          const currentUser = snapshot2.docs[0].data();
          currentUser.role = "Admin";
          addMember(currentUser);
        });
      });
    }
    return () => {
      setMember([]);
    };
  }, [ws, refresh]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {member.map((curr) => (
        <div
          key={curr.email}
          className="relative rounded-lg border border-gray-300 bg-white px-2 py-2 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
        >
          <div className="flex-shrink-0">
            <img className="h-8 w-8 rounded-full" src={curr.photoUrl} alt="" />
          </div>
          <div className="flex-1 min-w-0">
            <div
              onClick={() => {
                handleRemove(curr);
              }}
              className="cursor-pointer focus:outline-none"
            >
              <span className="absolute inset-0" aria-hidden="true" />
              <div className="flex">
                <div className="">
                  <p className="text-xs font-medium text-gray-900">
                    {curr.displayName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{curr.role}</p>
                </div>
                <p className="ml-16 mt-2 text-xs text-red-400">Remove</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
