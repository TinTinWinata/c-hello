/* This example requires Tailwind CSS v2.0+ */
import { BanIcon, DotsVerticalIcon } from "@heroicons/react/solid";
import { useUserAuth } from "../Library/UserAuthContext";
import { updateBoard } from "../Model/Board";
import { toastError } from "../Model/Toast";
import { arrayIsEqual, removeArray } from "../Model/Util";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function BoardGrantRevoke({ board, memberList, adminList }) {
  const { user } = useUserAuth();

  function handleRemove(currMember) {
    console.log(currMember);
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

  function handleOnRemove() {}

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
