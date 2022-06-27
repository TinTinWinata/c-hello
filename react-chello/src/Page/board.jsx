import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import BoardClosedError from "../Component/BoardClosedError";
import ListCardGroup from "../Component/ListCardGroup";
import Navbar from "../Component/Navbar";
import Sidebar from "../Component/Sidebar";
import { db } from "../Config/firebase-config";
import { useUserAuth } from "../Library/UserAuthContext";

export default function Board() {
  const [board, setBoard] = useState([]);
  const { id } = useParams();
  const { userDb } = useUserAuth();
  const [role, setRole] = useState();
  const [refresh, setRefresh] = useState(false);
  const location = useLocation();

  function refreshRole() {
    setRefresh((prev) => !prev);
  }

  useEffect(() => {
    if (userDb) {
      userDb.board.map((userBoard) => {
        if (userBoard.id == board.id) {
          setRole(userBoard.role);
        }
      });
    }
  }, [board, refresh]);

  useEffect(() => {
    const q = doc(db, "board", id);
    const unsub = onSnapshot(q, (snapshot) => {
      const temp = { ...snapshot.data(), id: snapshot.id };
      setBoard(temp);
    });

    return () => {
      unsub();
    };
  }, [location]);

  return (
    <>
      {board.closed ? <BoardClosedError></BoardClosedError> : ""}
      <Navbar></Navbar>
      <div className="flex overflow-y-auto h-screen bg-slate-200">
        <Sidebar></Sidebar>
        <ListCardGroup
          board={board}
          refreshRole={refreshRole}
          role={role}
        ></ListCardGroup>
      </div>
    </>
  );
}
