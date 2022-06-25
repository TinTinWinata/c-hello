import React, { useEffect, useState } from "react";
import { doc, documentId, onSnapshot, query, where } from "firebase/firestore";
import {
  boardCollectionRef,
  workspaceCollectionRef,
} from "../Library/firebase.collections";
import { Link, useLocation, useParams } from "react-router-dom";
import { getWebId } from "../Model/Util";
import { useUserAuth } from "../Library/UserAuthContext";

export default function RealtimeBoard({ role }) {
  const location = useLocation();
  const [board, setBoard] = useState([]);
  const { user, userDb } = useUserAuth();
  const [ws, setWs] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const q = query(workspaceCollectionRef, where(documentId(), "==", id));
    const unsub = onSnapshot(q, (snapshot) => {
      setWs({ ...snapshot.docs[0].data(), id: snapshot.docs[0].id });
    });

    return () => {
      unsub();
    };
  }, [location, role]);

  useEffect(() => {
    const q = query(boardCollectionRef, where("workspaceId", "==", id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setBoard(
        snapshot.docs.map((docs) => {
          if (!role && docs.data().visibility == "Private") return;
          if (!role && docs.data().visibility == "Workspace") return;
          // Kalau Guest gak bisa liat private (cuma bisa lait public)

          // Member
          const temp = { ...docs.data(), id: docs.id };
          const member = [...temp.memberId, ...temp.adminId];

          if (temp.visibility == "Private") {
            let isMember = member.includes(userDb.userId);
            if (!isMember) return;
          }

          return temp;
        })
      );
    });
    return () => {
      unsubscribe();
    };
  }, [ws]);

  return (
    <>
      {board.map((card) => {
        if (!card) return;
        const link = "/board/" + card.id;
        const tag = "#" + card.tag;

        return (
          <Link
            to={link}
            replace
            key={card.id}
            className="mb-5 h-fit mr-5 w-64 rounded-xl overflow-hidden shadow-lg cursor-pointer"
          >
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{card.name}</div>
              <p className="text-gray-500">{card.visibility}</p>
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
