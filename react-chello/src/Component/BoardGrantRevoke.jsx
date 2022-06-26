/* This example requires Tailwind CSS v2.0+ */
import {
  ArrowCircleDownIcon,
  ArrowCircleUpIcon,
  BanIcon,
  DotsVerticalIcon,
} from "@heroicons/react/solid";
import { useUserAuth } from "../Library/UserAuthContext";
import { updateBoard } from "../Model/Board";
import { toastError, toastSuccess } from "../Model/Toast";
import { getUser, updateUserDb } from "../Model/User";
import { arrayIsEqual, removeArray, removeArrayByIndex } from "../Model/Util";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function BoardGrantRevoke({ board, memberList, adminList }) {
  const { user } = useUserAuth();

  function handleRevoke(member) {
    if (member.role == "Member") {
      toastError("Cannot revoke an member!");
      return;
      e;
    } else {
      member.board.map((curr) => {
        if (curr.id == board.id) {
          curr.role = "Member";
          return;
        }
      });
      console.log("member : ", member);
      updateUserDb(member).then(() => {
        // 1. Remove member id di board
        let idx = 0;
        board.adminId.map((id) => {
          if (id == member.userId) {
            return;
          }
          idx += 1;
        });
        const temp2 = board.adminId;
        removeArrayByIndex(board.adminId);

        // 2. Add admin id
        board.memberId = [...board.memberId, member.userId];
        updateBoard(board).then(() => {
          toastSuccess("Succesfully granted user!");
        });
      });
    }
  }

  function handleGrant(member) {
    if (member.role == "Admin") {
      toastError("Cannot grant an admin!");
      return;
    } else {
      member.board.map((curr) => {
        if (curr.id == board.id) {
          curr.role = "Admin";
          return;
        }
      });
      updateUserDb(member).then(() => {
        // 1. Remove member id di board
        let idx = 0;
        board.memberId.map((id) => {
          if (id == member.userId) {
            return;
          }
          idx += 1;
        });
        const temp2 = board.memberId;
        removeArrayByIndex(board.memberId);

        // 2. Add admin id
        board.adminId = [...board.adminId, member.userId];
        updateBoard(board).then(() => {
          toastSuccess("Succesfully granted user!");
        });
      });
    }
  }

  function handleRemove(currMember) {
    if (currMember.userId == user.uid) {
      toastError("Cannot remove yourself!");
      return;
    }
    const removedArray = removeArray(board.memberId, currMember.userId);
    if (arrayIsEqual(removedArray, board.memberId)) {
      toastError("Cannot remove admin roles!");
    } else {
      board.memberId = removedArray;
      updateBoard(board)
        .then(() => {
          toastSuccess("Success removing member!");
        })
        .catch((e) => {
          toastError("Failed to remove member! " + e.message);
        });
    }
  }

  return (
    <div>
      <h2 className="text-gray-500 text-xs font-medium uppercase tracking-wide">
        Member List
      </h2>
      <ul className="mt-3">
        {memberList
          ? memberList.map((members, idx) => (
              <li key={idx} className="mt-3 flex shadow-sm rounded-md">
                <div
                  className={classNames(
                    "bg-green-500",
                    "flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md"
                  )}
                >
                  {members.displayName}
                </div>
                <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                  <div className="flex-1 px-4 py-2 text-sm truncate">
                    <a className="text-gray-900 font-medium hover:text-gray-600">
                      {members.displayName}
                    </a>
                    <p className="text-gray-500">{members.role}</p>
                  </div>
                  <div className="flex-shrink-0 pr-2">
                    <button
                      onClick={() => {
                        handleRemove(members);
                      }}
                      className="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <span className="sr-only">Open options</span>
                      <BanIcon className="w-5 h-5" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => {
                        handleGrant(members);
                      }}
                      className="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <span className="sr-only">Open options</span>
                      <ArrowCircleUpIcon
                        className="w-5 h-5"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>
              </li>
            ))
          : ""}
        {adminList
          ? adminList.map((members, idx) => {
              return (
                <li key={idx} className="mt-3 flex shadow-sm rounded-md">
                  <div
                    className={classNames(
                      "bg-green-500",
                      "flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md"
                    )}
                  >
                    {members.displayName}
                  </div>
                  <div className="flex-1 flex items-center justify-between border-t border-r border-b border-gray-200 bg-white rounded-r-md truncate">
                    <div className="flex-1 px-4 py-2 text-sm truncate">
                      <a className="text-gray-900 font-medium hover:text-gray-600">
                        {members.displayName}
                      </a>
                      <p className="text-gray-500">{members.role}</p>
                    </div>
                    <div className="flex-shrink-0 pr-2">
                      <button
                        onClick={() => {
                          handleRemove(members);
                        }}
                        className="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <span className="sr-only">Remov</span>

                        <BanIcon className="w-5 h-5" aria-hidden="true" />
                      </button>
                      <button
                        onClick={() => {
                          handleGrant(members);
                        }}
                        className="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <span className="sr-only">Remov</span>

                        <ArrowCircleUpIcon
                          className="w-5 h-5"
                          aria-hidden="true"
                        />
                      </button>
                      <button
                        onClick={() => {
                          handleRevoke(members);
                        }}
                        className="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full bg-transparent hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <span className="sr-only">Remov</span>

                        <ArrowCircleDownIcon
                          className="w-5 h-5"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })
          : ""}
      </ul>
    </div>
  );
}
