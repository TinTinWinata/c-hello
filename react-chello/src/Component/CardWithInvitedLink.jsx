import {
  collection,
  documentId,
  getDoc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../Config/firebase-config";
import Board from "../Page/board";
import ReactLoading from "react-loading";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import {
  boardCollectionRef,
  cardInviteLinkCollectionRef,
} from "../Library/firebase.collections";
import { ExclamationCircleIcon } from "@heroicons/react/solid";

export default function CardWithInvitedLink() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [inviteData, setInviteData] = useState();
  const [board, setBoard] = useState();
  const [show, setShow] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    let unsub;
    if (inviteData) {
      const boardId = inviteData.boardId;
      const q = query(boardCollectionRef, where(documentId(), "==", boardId));
      unsub = onSnapshot(q, (doc) => {
        setBoard({ ...doc.docs[0].data(), id: doc.docs[0].id });
      });
    }
  }, [inviteData]);

  useEffect(() => {
    if (board) {
      if (board.visibility === "Private") {
        setShow(true);
      } else {
        setTimeout(() => {
          navigate("/board/", inviteData.boardId);
          setLoading(false);
        }, 1000);
      }
    }
  }, [board]);

  useEffect(() => {
    const q = query(cardInviteLinkCollectionRef, where(documentId(), "==", id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      var snap = { ...snapshot.docs[0].data() };
      setInviteData(snap);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      {loading ? (
        <>
          <Navbar></Navbar>
          <Sidebar></Sidebar>
          <div className="fixed w-screen h-screen bg-black opacity-50"></div>
          {!show ? (
            <ReactLoading
              className="z-10 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
              type="bars"
              color="white"
              height={"10%"}
              width={"10%"}
            ></ReactLoading>
          ) : (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100">
                  <ExclamationCircleIcon
                    className="h-20 w-20 text-red-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <div className="text-lg leading-6 font-medium text-gray-900">
                    This is private board
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      You dont have access to see this board!
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                  onClick={() => {
                    navigate("/home");
                  }}
                >
                  Go back to home
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <Board inviteData={inviteData}></Board>
      )}
    </>
  );
}
