/* This example requires Tailwind CSS v2.0+ */
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/outline";
import { doc, onSnapshot, query, where } from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../Config/firebase-config";
import {
  cardCollectionRef,
  listCollectionRef,
} from "../Library/firebase.collections";
import Select from "react-select";
import { data } from "autoprefixer";
import { getCardById, updateCard } from "../Model/Card";
import { toastError, toastSuccess } from "../Model/Toast";
import { removeArrayByIndex } from "../Model/Util";
import { updateBoard } from "../Model/Board";

export default function BoardLabel({ setOpen, open, role }) {
  const [board, setBoard] = useState();
  const { id } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (board) {
      const q = query(cardCollectionRef, where("boardId", "==", id));
      const unsub = onSnapshot(q, (snap) => {
        setData([]);
        snap.docs.map((doc) => {
          const list = { ...doc.data(), id: doc.id };
          const option = {
            label: list.name,
            value: list.id,
          };
          setData((prev) => [...prev, option]);
        });
      });

      return () => {
        unsub();
      };
    }
  }, [board]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "board", id), (snap) => {
      const tempBoard = { ...snap.data(), id: snap.id };
      console.log("board : ", tempBoard);
      setBoard(tempBoard);
    });
    return () => {
      unsub();
    };
  }, []);

  function handleOnChange(e, lbl) {
    // Remove label from board
    let idx = 0;
    board.label.map((boardlb) => {
      if (boardlb.id == lbl.id) {
        return;
      }
      idx += 1;
    });
    removeArrayByIndex(board.label, idx);
    console.log(" board  : ", board);
    updateBoard(board).then(() => {
      // Add label to card
      const cardId = e.value;
      getCardById(cardId).then((doc) => {
        const card = { ...doc.data(), id: doc.id };
        card.label = [...card.label, lbl];
        updateCard(card)
          .then(() => {
            setOpen(false);
            toastSuccess("Succesfully attach label!");
          })
          .catch((e) => {
            toastError("Failed to attach label!");
          });
      });
    });
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
              <div>
                {board ? (
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      {board.label.length == 0
                        ? "You dont have any detach label yet!"
                        : "Label List"}
                    </Dialog.Title>
                    <div className="mt-2">
                      {board.label.map((lbl, idx) => {
                        const color = "bg-[" + lbl.color + "] ";
                        return (
                          <div className="flex" key={idx}>
                            <div className={color + " w-5 h-5"}></div>
                            <p className="text-sm text-gray-500 ml-2">
                              {lbl.text}
                            </p>
                            <p className="text-sm text-gray-500 ml-2">
                              You can attach to :
                            </p>
                            <Select
                              onChange={(e) => {
                                handleOnChange(e, lbl);
                              }}
                              options={data}
                            ></Select>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                  onClick={() => setOpen(false)}
                >
                  Go back to board
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
