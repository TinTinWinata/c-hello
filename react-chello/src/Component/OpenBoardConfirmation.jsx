/* This example requires Tailwind CSS v2.0+ */
import { createRef, Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/outline";
import { useUserAuth } from "../Library/UserAuthContext";
import { toastError, toastSuccess } from "../Model/Toast";
import {
  getWorkspaceById,
  insertWorkspaceWithBoard,
  insertWorkspaceWithLabel,
} from "../Model/Workspace";
import { getDocs } from "firebase/firestore";
import { workspaceCollectionRef } from "../Library/firebase.collections";
import { updateBoard } from "../Model/Board";

export default function OpenBoardConfirmation({
  selectedBoard,
  open,
  setOpen,
}) {
  const [showNew, setShowNew] = useState(false);
  const { userDb } = useUserAuth();
  const nameRef = createRef();

  useEffect(() => {
    return () => {
      setShowNew(false);
    };
  }, []);

  function handleNo() {
    const ws = getWorkspaceById(selectedBoard.workspaceId);

    ws.then((ws) => {
      if (!ws) {
        toastError("Cannot open boards, workspace already deleted");
        return;
      }

      selectedBoard.closed = false;
      updateBoard(selectedBoard).then(() => {
        toastSuccess(
          "Succesfully open a board in the " + ws.name + " workspace!"
        );
        setOpen(false);
      });
    });
  }

  function handleNewWorkspace() {
    setShowNew(true);
  }

  function handleClick() {
    if (!selectedBoard) {
      toastError("You're too fast darling!");
      return;
    }
    const name = nameRef.current.value;
    if (!name) return;
    selectedBoard.closed = false;
    insertWorkspaceWithBoard(name, "", "", "", userDb, selectedBoard).then(
      () => {
        toastSuccess("Succesfully added  ", name, " workspace!");
        setOpen(false);
      }
    );
  }

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

          {/* This element is to trick the browser into centering the modal contents. */}
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
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              {showNew ? (
                <>
                  <div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="mb-2 text-lg leading-6 font-medium text-gray-900"
                      >
                        Opening new workspace
                      </Dialog.Title>
                      <p className="text-sm text-gray-500 mb-2">
                        Your board has been opened again on another workspace
                      </p>
                      <input
                        ref={nameRef}
                        className="p-3 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Enter new Workspace name"
                      />
                    </div>
                  </div>
                  <div className="mt-3 ">
                    <button
                      onClick={handleClick}
                      type="button"
                      className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                    >
                      Yes open it
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Dialog.Title
                    as="h3"
                    className="mb-2 text-lg leading-6 font-medium text-gray-900"
                  >
                    Do you want to open with same workspace ? Or create new
                    workspace ?
                  </Dialog.Title>
                  <p className="text-sm text-gray-500 mb-2">
                    You can assign your board with new workspace
                  </p>
                  <div className="flex mt-3">
                    <button
                      onClick={handleNewWorkspace}
                      type="button"
                      className="mr-3 inline-flex items-center px-10 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Let's create new
                    </button>
                    <button
                      onClick={handleNo}
                      type="button"
                      className="inline-flex items-center px-10 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      No, just open it
                    </button>
                  </div>
                </>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
