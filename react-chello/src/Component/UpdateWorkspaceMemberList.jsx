import {
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
  XIcon,
} from "@heroicons/react/solid";
import { signInWithEmailAndPassword } from "firebase/auth";
import { documentId, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  userCollectionRef,
  workspaceCollectionRef,
} from "../Library/firebase.collections";
import { useUserAuth } from "../Library/UserAuthContext";
import { toastError, toastSuccess } from "../Model/Toast";
import { updateUserDb } from "../Model/User";
import { arrayIsEqual, removeArray, removeArrayByIndex } from "../Model/Util";
import { updateWorkspace, updateWorkspaceById } from "../Model/Workspace";

export default function UpdateWorkspaceMemberList({ ws }) {
  const location = useLocation();
  const [member, setMember] = useState([]);
  const { user } = useUserAuth();
  const [refresh, setRefresh] = useState(false);
  const [admin, setAdmin] = useState([]);

  const addMember = (newMember) => {
    setMember((oldArray) => [...oldArray, newMember]);
  };

  const addAdmin = (newMember) => {
    setAdmin((oldArray) => [...oldArray, newMember]);
  };

  const { id } = useParams();

  function handleGrant(member) {
    if (member.userId == user.uid) {
      toastError("Cannot grant yourself!");
      return;
    }

    if (ws) {
      if (member.role == "Admin") {
        toastError("Cannot grant an admin!");
        return;
      } else {
        // Updating worksapce on user
        member.workspace.map((curr) => {
          if (curr.id == ws.id) {
            curr.role = "Admin";
            return;
          }
        });
        updateUserDb(member).then(() => {
          // 1. Remove member id di board
          let idx = 0;
          ws.memberId.map((id) => {
            if (id == member.userId) {
              return;
            }
            idx += 1;
          });
          removeArrayByIndex(ws.memberId, idx);

          // 2. Add admin id
          ws.adminId = [...ws.adminId, member.userId];
          updateWorkspace(ws).then(() => {
            refreshPage();
            toastSuccess("Succesfully granted user!");
          });
        });
      }
    } else {
      toastError("Too fast darling");
    }
  }

  function handleRevoke(member) {
    if (member.userId == user.uid) {
      toastError("Cannot revoke yourself!");
      return;
    }

    if (ws) {
      if (member.role == "Member") {
        toastError("Cannot revoke a member!");
        return;
      } else {
        // Updating workspace on user
        member.workspace.map((curr) => {
          if (curr.id == ws.id) {
            curr.role = "Member";
            return;
          }
        });
        updateUserDb(member).then(() => {
          // 1. Remove admin id di workspace
          let idx = 0;
          ws.adminId.map((id) => {
            if (id == member.userId) {
              return;
            }
            idx += 1;
          });
          removeArrayByIndex(ws.adminId, idx);

          // 2. Add member id
          ws.memberId = [...ws.memberId, member.userId];
          updateWorkspace(ws).then(() => {
            refreshPage();
            toastSuccess("Succesfully granted user!");
          });
        });
      }
    } else {
      toastError("Too fast darling");
    }
  }

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
          refreshPage();
          toastSuccess("Success removing member!");
        })
        .catch((e) => {
          toastError("Failed to remove member! " + e.message);
        });
    }
  }

  useEffect(() => {
    let unsub1;
    let unsub2;
    if (ws) {
      const q = query(workspaceCollectionRef, where(documentId(), "==", id));
      ws.memberId.map((memberId) => {
        const q2 = query(userCollectionRef, where("userId", "==", memberId));
        setMember([]);
        unsub1 = onSnapshot(q2, (snapshot2) => {
          const currentUser = snapshot2.docs[0].data();
          currentUser.role = "Member";
          addMember(currentUser);
        });
      });
      ws.adminId.map((id) => {
        const q2 = query(userCollectionRef, where("userId", "==", id));
        setAdmin([]);
        unsub2 = onSnapshot(q2, (snapshot2) => {
          const currentUser = snapshot2.docs[0].data();
          currentUser.role = "Admin";
          addAdmin(currentUser);
        });
      });
    }
    return () => {
      if (unsub1) unsub1();
      if (unsub2) unsub2();
      setAdmin([]);
      setMember([]);
    };
  }, [ws, refresh]);

  function refreshPage() {
    setAdmin([]);
    setMember([]);
    setRefresh(!refresh);
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {/* <button
        onClick={() => {
          setRefresh(refresh + 1);
        }}
      >
        test
      </button> */}
      {member.map((curr, idx) => (
        <div
          key={idx}
          className="relative rounded-lg border border-gray-300 bg-white px-2 py-2 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
        >
          <div className="flex-shrink-0">
            <img className="h-8 w-8 rounded-full" src={curr.photoUrl} alt="" />
          </div>
          <div className="flex">
            <div className="">
              <p className="text-xs font-medium text-gray-900">
                {curr.displayName}
              </p>
              <p className="text-xs text-gray-500 truncate">{curr.role}</p>
            </div>
            <div className="flex">
              <ChevronDoubleUpIcon
                onClick={() => {
                  handleGrant(curr);
                }}
                className="w-5 h-5 cursor-pointer font-bold ml-2 mt-2 text-xs text-gray-400"
              >
                Grant
              </ChevronDoubleUpIcon>
              <ChevronDoubleDownIcon
                onClick={() => {
                  handleRevoke(curr);
                }}
                className="w-5 h-5 cursor-pointer mt-2 text-xs text-gray-400 font-bold"
              ></ChevronDoubleDownIcon>

              <XIcon
                onClick={() => {
                  handleRemove(curr);
                }}
                className="w-5 h-5 cursor-pointer mt-2 text-xs text-red-400"
              ></XIcon>
            </div>
          </div>
        </div>
      ))}
      {admin.map((curr, idx) => (
        <div
          key={idx}
          className="relative rounded-lg border border-gray-300 bg-white px-2 py-2 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
        >
          <div className="flex-shrink-0">
            <img className="h-8 w-8 rounded-full" src={curr.photoUrl} alt="" />
          </div>
          <div className="flex">
            <div className="">
              <p className="text-xs font-medium text-gray-900">
                {curr.displayName}
              </p>
              <p className="text-xs text-gray-500 truncate">{curr.role}</p>
            </div>
            <div className="flex">
              <ChevronDoubleUpIcon
                onClick={() => {
                  handleGrant(curr);
                }}
                className="w-5 h-5 cursor-pointer font-bold ml-2 mt-2 text-xs text-gray-400"
              >
                Grant
              </ChevronDoubleUpIcon>
              <ChevronDoubleDownIcon
                onClick={() => {
                  handleRevoke(curr);
                }}
                className="w-5 h-5 cursor-pointer mt-2 text-xs text-gray-400 font-bold"
              ></ChevronDoubleDownIcon>

              <XIcon
                onClick={() => {
                  handleRemove(curr);
                }}
                className="w-5 h-5 cursor-pointer mt-2 text-xs text-red-400"
              ></XIcon>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
