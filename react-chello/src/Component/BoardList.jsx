import { EyeIcon } from "@heroicons/react/outline";
import { StarIcon } from "@heroicons/react/solid";
import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../Config/firebase-config";
import { boardCollectionRef } from "../Library/firebase.collections";
import { useUserAuth } from "../Library/UserAuthContext";
import { toastError, toastSuccess } from "../Model/Toast";
import { updateUserDb } from "../Model/User";
import CardList from "./CardList";

export default function WorkspaceList() {
  const [boardAdminList, setBoardAdminList] = useState([]);
  const [boardMemberList, setBoardMemberList] = useState([]);
  const { userDb } = useUserAuth();
  const navigate = useNavigate();

  function handleSee(board) {
    navigate("/board/" + board.id);
  }

  function handleFavorite(board) {
    let favoriteBoard = userDb.favoriteBoard;
    if (!favoriteBoard) favoriteBoard = [];

    let isExists = true;

    console.log("user : ", userDb);

    favoriteBoard.map((favorite) => {
      // Checking if favorite board already exisss
      if (favorite == board.id) {
        isExists = false;
      }
    });
    if (isExists == false) {
      toastError("Board already exists in your favorite Board!");
    } else {
      favoriteBoard = [...favoriteBoard, board.id];
      userDb.favoriteBoard = favoriteBoard;
      updateUserDb(userDb).then(() => {
        toastSuccess("Board succesfully added to favorite!");
      });
    }
  }

  async function get(id) {
    const q = query(boardCollectionRef, where("adminId", "array-contains", id));

    onSnapshot(q, (doc) => {
      setBoardAdminList(
        doc.docs.map((docs) => ({ ...docs.data(), id: docs.id }))
      );
    });

    const q2 = query(
      boardCollectionRef,
      where("memberId", "array-contains", id)
    );

    onSnapshot(q2, (doc) => {
      setBoardMemberList(
        doc.docs.map((docs) => ({ ...docs.data(), id: docs.id }))
      );
    });
  }

  useEffect(() => {
    const getWorkspace = async () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in
          get(user.uid);
        } else {
          // User is signed out
        }
      });
    };
    getWorkspace();
  }, []);

  return (
    <>
      <div className="ml-10 mt-3 flex flex-col w-full">
        <div className="ml-3 mt-3 mb-3 font-bold text-gray-800">Board List</div>
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
                      Visibility
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Member
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only"></span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {boardMemberList.map((board) => (
                    <tr key={board.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {board.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {board.tag}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {board.visbility}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {board.adminId.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </a>
                      </td>
                    </tr>
                  ))}
                  {boardAdminList.map((board) => (
                    <tr key={board.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {board.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {board.tag}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {board.visbility}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {board.adminId.length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex">
                          <EyeIcon
                            onClick={() => {
                              handleSee(board);
                            }}
                            className="cursor-pointer w-5 h-5 text-indigo-600 hover:text-indigo-900"
                          ></EyeIcon>
                          <StarIcon
                            onClick={() => {
                              handleFavorite(board);
                            }}
                            className="cursor-pointer w-5 h-5 text-indigo-600 hover:text-indigo-900"
                          ></StarIcon>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {boardAdminList.map((board) => {
        return <CardList key={board.id} board={board}></CardList>;
      })}
      {boardMemberList.map((board) => {
        return <CardList key={board.id} board={board}></CardList>;
      })}
    </>
  );
}
