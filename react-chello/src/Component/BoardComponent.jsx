import { onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { boardCollectionRef } from "../Library/firebase.collections";
import { useUserAuth } from "../Library/UserAuthContext";

export default function BoardComponent() {
  const { userDb } = useUserAuth();
  const [boardMember, setBoardMember] = useState([]);
  const [boardAdmin, setBoardAdmin] = useState([]);

  useEffect(() => {
    if (userDb) {
      const q = query(
        boardCollectionRef,
        where("adminId", "array-contains", userDb.userId)
      );

      onSnapshot(q, (doc) => {
        setBoardAdmin(
          doc.docs.map((docs) => ({ ...docs.data(), id: docs.id }))
        );
      });
      const q2 = query(
        boardCollectionRef,
        where("memberId", "array-contains", userDb.userId)
      );

      onSnapshot(q2, (doc) => {
        setBoardMember(
          doc.docs.map((docs) => ({ ...docs.data(), id: docs.id }))
        );
      });
    }
  }, [userDb]);

  return (
    <>
      <li>
        <div className="flex">
          <p className="workspace">Board</p>
        </div>
      </li>

      {boardMember.map((board, idx) => {
        const link = "/board/" + board.id;
        return (
          <li key={idx}>
            <div
              to={link}
              className="flex items-center p-2 text-base font-normal text-grey-500 rounded-lg dark:text-black hover:bg-gray-100 dark:hover:bg-gray-200"
            >
              <div className={"w-3 h-3 rounded-lg mr-2 bg-black"}></div>
              <span className="mr-3">{board.name}</span>
            </div>
          </li>
        );
      })}
      {boardAdmin.map((board, idx) => {
        const link = "/board/" + board.id;
        return (
          <li key={idx}>
            <div
              to={link}
              className="flex items-center p-2 text-base font-normal text-grey-500 rounded-lg dark:text-black hover:bg-gray-100 dark:hover:bg-gray-200"
            >
              <div className={"w-3 h-3 rounded-lg mr-2 bg-red-400"}></div>
              <span className="mr-3">{board.name}</span>
            </div>
          </li>
        );
      })}
    </>
  );
}
