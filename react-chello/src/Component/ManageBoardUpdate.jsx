import { doc, onSnapshot, query } from "firebase/firestore";
import { createRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { db } from "../Config/firebase-config";
import { updateBoard } from "../Model/Board";
import { toastError, toastSuccess } from "../Model/Toast";

export default function ManageBoardUpdate({ board, setOpen }) {
  const name = createRef();
  const vis = createRef();

  const [visState, setVisState] = useState("Private");
  const { id } = useParams();

  useEffect(() => {
    if (board) {
      setVisState(board.visibility);
    }
  }, [board]);

 

  function handleClick() {
    if (!board) return;

    const inputName = name.current.value;
    const inputVis = vis.current.value;

    board.name = inputName;
    board.visibility = inputVis;

    updateBoard(board)
      .then(() => {
        toastSuccess("Succesfully update board");
        setOpen(false);
      })
      .catch((e) => {
        toastError("Failed to update board: " + e.message);
      });
  }

  return (
    <div>
      <label
        htmlFor="email"
        className="block text-sm font-medium text-gray-700"
      >
        Workspace Name
      </label>
      <div className="mt-1">
        <input
          ref={name}
          type="text"
          name="email"
          id="email"
          className="p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder="Input update name..."
        />
      </div>
      <label className="mb-2 mt-5 block text-sm font-medium text-gray-700">
        Visbility
      </label>
      <select
        ref={vis}
        className="block appearance-none w-max bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        id="grid-state"
        value={visState}
        onChange={(e) => {
          setVisState(e.target.value);
        }}
      >
        <option>Private</option>
        <option>Workspace</option>
        <option>Public</option>
      </select>
      <button
        type="button"
        className="mt-3 center align-middle inline-flex items-center px-9 py-2 border border-transparent  font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        onClick={handleClick}
      >
        Update
      </button>
    </div>
  );
}
