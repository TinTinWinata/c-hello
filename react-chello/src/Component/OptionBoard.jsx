/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon, XIcon } from "@heroicons/react/outline";
import ManageBoardUpdate from "./ManageBoardUpdate";
import BoardGrantRevoke from "./BoardGrantRevoke";
import { doc, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../Config/firebase-config";
import { useParams } from "react-router-dom";
import {
  boardCollectionRef,
  userCollectionRef,
} from "../Library/firebase.collections";
import BoardInvite from "./BoardInvite";

export default function OptionBoard({ open, setOpen }) {
  const [tabIndex, setTabIndex] = useState(1);

  const [board, setBoard] = useState();
  const [memberList, setMemberList] = useState();
  const [adminList, setAdminList] = useState();

  const { id } = useParams();

  useEffect(() => {
    let unsubMember;
    let unsubAdmin;

    if (board) {
      board.memberId.map((mId) => {
        const q = query(userCollectionRef, where("userId", "==", mId));
        setMemberList([]);
        unsubMember = onSnapshot(q, (snapshot) => {
          const currentUser = {
            ...snapshot.docs[0].data(),
            userId: snapshot.id,
            role: "Member",
          };
          setMemberList((prev) => [...prev, currentUser]);
        });
      });

      board.adminId.map((aId) => {
        const q = query(userCollectionRef, where("userId", "==", aId));
        setAdminList([]);
        unsubAdmin = onSnapshot(q, (snapshot) => {
          const currentUser = {
            ...snapshot.docs[0].data(),
            userId: snapshot.id,
            role: "Admin",
          };
          setAdminList((prev) => [...prev, currentUser]);
        });
      });
    }
    return () => {
      setMemberList([]);
      setAdminList([]);
      if (unsubMember) unsubMember();
      if (unsubAdmin) unsubAdmin();
    };
  }, [board]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "board", id), (snap) => {
      const tempBoard = { ...snap.data(), id: snap.id };
      setBoard(tempBoard);
    });
    return () => {
      unsub();
    };
  }, []);

  // 1. Update Boards
  // 2. Grant Revoke
  // 3. Invite
  // 4. Leave Boards
  // 5. Close Boards

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        static
        className="fixed z-10 inset-0 overflow-y-auto"
        open={open}
        onClose={setOpen}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg  text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:p-6">
              <div className=" sm:block absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">Close</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="w-max border-b border-gray-200">
                <div className="w-max sm:flex sm:items-baseline">
                  <nav className="mt-4 ml-4 -mb-px flex space-x-8">
                    <button
                      className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm"
                      onClick={() => {
                        setTabIndex(1);
                      }}
                    >
                      Update Boards
                    </button>
                    <button
                      className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm"
                      onClick={() => {
                        setTabIndex(2);
                      }}
                    >
                      Manage User
                    </button>
                    <button
                      className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm"
                      onClick={() => {
                        setTabIndex(3);
                      }}
                    >
                      Invite
                    </button>
                    <button
                      className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm"
                      onClick={() => {
                        setTabIndex(4);
                      }}
                    >
                      Leave Board
                    </button>
                    <button
                      className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm"
                      onClick={() => {
                        setTabIndex(5);
                      }}
                    >
                      Close Board
                    </button>
                  </nav>
                </div>
              </div>
              <div className="mt-4 ml-6">
                {tabIndex == 1 ? (
                  <ManageBoardUpdate
                    board={board}
                    setOpen={setOpen}
                  ></ManageBoardUpdate>
                ) : (
                  ""
                )}
                {tabIndex == 2 ? (
                  <BoardGrantRevoke
                    memberList={memberList}
                    adminList={adminList}
                    board={board}
                  ></BoardGrantRevoke>
                ) : (
                  ""
                )}
                {tabIndex == 3 ? <BoardInvite board={board}></BoardInvite> : ""}
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
