import { EyeIcon } from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";
import {
  documentId,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { boardCollectionRef } from "../Library/firebase.collections";
import { useUserAuth } from "../Library/UserAuthContext";
import { toastSuccess } from "../Model/Toast";
import { updateUserDb } from "../Model/User";
import { removeArrayByIndex } from "../Model/Util";

export default function FavoriteBoard() {
  const { userDb } = useUserAuth();
  const [board, setBoard] = useState([]);

  function addBoard(n) {
    setBoard((prev) => [...prev, n]);
  }

  function removeFavorite(n) {
    let favBoard = userDb.favoriteBoard;
    let idx = 0;

    favBoard.map((fav) => {
      if (fav == n.id) {
        return;
      }
      idx++;
    });

    removeArrayByIndex(favBoard, idx);
    userDb.favoriteBoard = favBoard;
    updateUserDb(userDb).then(() => {
      toastSuccess("Removed from favorite!");
    });
  }

  useEffect(() => {
    userDb.favoriteBoard.map((favId) => {
      const q = query(boardCollectionRef, where(documentId(), "==", favId));
      getDocs(q).then((doc) => {
        if (doc.docs[0]) {
          const temp = { ...doc.docs[0].data(), id: doc.docs[0].id };
          addBoard(temp);
        }
      });
      return () => {
        unsub();
      };
    });
  }, []);

  return (
    <div className="ml-10 mt-10 flex flex-col w-full">
      <div className="ml-3 mt-3 mb-3 font-bold text-gray-800">
        Favorite Board
      </div>
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className=" py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tag
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Visbility
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Closed
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {board.map((ws, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {ws.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ws.tag}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ws.visibility}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ws.closed ? "Yes" : "No"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <XIcon
                        onClick={() => {
                          removeFavorite(ws);
                        }}
                        className="w-5 h-5 text-indigo-600 hover:text-indigo-900 cursor-pointer"
                      ></XIcon>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
