import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BoardClosedError from "../Component/BoardClosedError";
import ListCardGroup from "../Component/ListCardGroup";
import Navbar from "../Component/Navbar";
import Sidebar from "../Component/Sidebar";
import { db } from "../Config/firebase-config";

export default function Board() {
  const [board, setBoard] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const q = doc(db, "board", id);
    const unsub = onSnapshot(q, (snapshot) => {
      const temp = { ...snapshot.data(), id: snapshot.id };
      console.log("tem : ", temp);
      setBoard(temp);
    });

    return () => {
      unsub();
    };
  }, []);

  console.log("board closed ; ", board.closed);

  return (
    <>
      {board.closed ? <BoardClosedError></BoardClosedError> : ""}
      <Navbar></Navbar>
      <div className="flex overflow-y-auto h-screen bg-slate-200">
        <Sidebar></Sidebar>
        <ListCardGroup></ListCardGroup>
      </div>
    </>
  );
}
