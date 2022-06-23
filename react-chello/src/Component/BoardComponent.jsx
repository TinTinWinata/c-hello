import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUserAuth } from "../Library/UserAuthContext";

export default function BoardComponent() {
  const { userDb } = useUserAuth();
  const [board, setBoard] = useState([]);

  useEffect(() => {
    if (userDb) {
      setBoard(userDb.board);
    }
  }, [userDb]);

  useEffect(() => {
    console.log("board : ", board);
  }, [board]);

  return (
    <>
      <li>
        <div className="flex">
          <p className="workspace">Board</p>
        </div>
      </li>

      {board.map((board, idx) => {
        const link = "/board/" + board.id;
        return (
          <li key={idx}>
            <Link
              to={link}
              replace
              className="flex items-center p-2 text-base font-normal text-grey-500 rounded-lg dark:text-black hover:bg-gray-100 dark:hover:bg-gray-200"
            >
              <div className="w-3 h-3 rounded-lg mr-2 bg-black"></div>
              <span className="mr-3">{board.name}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
}
