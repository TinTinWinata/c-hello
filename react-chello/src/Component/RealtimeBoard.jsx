import React, { useEffect, useState } from "react";
import { doc, onSnapshot, query, where } from "firebase/firestore";
import { boardCollectionRef } from "../Library/firebase.collections";
import { Link, useLocation } from "react-router-dom";
import { getWebId } from "../Script/Util";
import { useUserAuth } from "../Library/UserAuthContext";

export default function RealtimeBoard() {
  const location = useLocation();
  const [board, setBoard] = useState([]);
  const { user } = useUserAuth();

  useEffect(() => {
    const id = getWebId();
    const q = query(
      boardCollectionRef,
      where("workspaceId", "==", id),
      where("adminId", "array-contains", user.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBoard(snapshot.docs.map((docs) => ({ ...docs.data(), id: docs.id })));
    });
    return () => {
      unsubscribe();
    };
  }, [location]);

  return (
    <>
      {board.map((card) => {
        const link = "/board/" + card.id;
        const tag = "#" + card.tag;
        return (
          <Link
            to={link}
            replace
            key={card.id}
            className="mb-5 h-32 mr-5 w-64 rounded overflow-hidden shadow-lg cursor-pointer"
          >
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{card.name}</div>
            </div>
            <div className="px-6 pt-4 pb-2">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                {tag}
              </span>
            </div>
          </Link>
        );
      })}
    </>
  );
}
