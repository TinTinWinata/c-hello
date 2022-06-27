import React, { createRef, useEffect, useState } from "react";
import { doc, documentId, onSnapshot, query, where } from "firebase/firestore";
import { cardCollectionRef } from "../Library/firebase.collections";
import { Link, useLocation, useParams } from "react-router-dom";
import { getWebId } from "../Model/Util";
import {
  appendChecklistCard,
  checkCardDueDate,
  deleteCard,
  updateCard,
} from "../Model/Card";
import userEvent from "@testing-library/user-event";
import CheckListCard from "./CheckListCard";
import { RenderCard } from "./RenderCard";
import { Draggable } from "react-beautiful-dnd";
import { toastError } from "../Model/Toast";
import { useUserAuth } from "../Library/UserAuthContext";
import { db } from "../Config/firebase-config";
import { CheckIcon, XIcon } from "@heroicons/react/outline";

export default function RealtimeCard(props) {
  const refresh = props.refresh;
  const refreshRole = props.refreshRole;
  const location = useLocation();
  const [card, setCard] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [cardClicked, setClickedCard] = useState();
  const [role, setRole] = useState();
  const [board, setBoard] = useState();

  const { userDb } = useUserAuth();
  const { id } = useParams();

  useEffect(() => {
    if (card) {
      checkCardDueDate(card);
    }
  }, [card]);

  // FIND ROLE
  useEffect(() => {
    console.log("setting role...");
    if (userDb && board) {
      userDb.board.map((userBoard) => {
        if (userBoard.id == board.id) {
          console.log("user board role :", userBoard.role);
          setRole(userBoard.role);
        }
      });
    }
  }, [board]);

  useEffect(() => {
    const q = doc(db, "board", id);
    const unsub = onSnapshot(q, (snapshot) => {
      const temp = { ...snapshot.data(), id: snapshot.id };
      setBoard(temp);
    });

    return () => {
      unsub();
    };
  }, []);

  // ----------------------------------------------------------------

  useEffect(() => {
    console.log("refershed card");
    const q = query(
      cardCollectionRef,
      where("boardId", "==", id),
      where("listId", "==", props.listId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCard(snapshot.docs.map((docs) => ({ ...docs.data(), id: docs.id })));
    });
    return () => {
      unsubscribe();
    };
  }, [location, refresh]);

  useEffect(() => {
    if (cardClicked) {
      setTrigger(true);
    }
  }, [cardClicked]);

  function handleOnClick(e, card) {
    if (role) {
      setClickedCard(card);
    } else {
      console.log("role : ", role);
      toastError("You dont have access to see this card!");
    }
  }

  function handleOffClick() {
    setTrigger(false);
  }

  return (
    <>
      {trigger ? (
        <RenderCard
          role={role}
          listId={props.listId}
          setClickedCard={setClickedCard}
          setTrigger={setTrigger}
          cardClicked={cardClicked}
        ></RenderCard>
      ) : (
        <></>
      )}
      {card.map((card, index) => {
        return (
          <div
            key={index}
            className="cursor-pointer"
            onClick={(event) => handleOnClick(event, card)}
          >
            <Draggable draggableId={card.id} index={index}>
              {(provided, snapshot) => {
                return (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                      userSelect: "none",
                      padding: "16",
                      margin: "0 0 8px 0",
                      minHeight: "50px",
                      borderRadius: "15px",
                      boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)",
                      backgroundColor: snapshot.isDragging
                        ? "#ededed"
                        : "#ededed",
                      color: "black",
                      ...provided.draggableProps.style,
                    }}
                  >
                    <div className="flex">
                      {card.status == "Due Date" ? (
                        <XIcon className="w-5 h-5 ml-2 mt-[10px] text-red-700"></XIcon>
                      ) : (
                        ""
                      )}
                      {card.status == "Complete" ? (
                        <CheckIcon className="w-5 h-5 ml-2 mt-[10px] text-green-700"></CheckIcon>
                      ) : (
                        ""
                      )}
                      <p className="pt-2 pl-1">{card.name}</p>
                    </div>
                    <p className="pl-2 mb-2 text-xs text-gray-400">
                      {card.description}
                    </p>
                    <div className="flex flex-wrap">
                      {card.label.map((lbl, idx) => {
                        const color = "bg-[" + lbl.color + "] ";
                        return (
                          <div
                            key={idx}
                            className={
                              color + "ml-2 mb-1 mr-1 w-10 h-2 rounded-3xl"
                            }
                          ></div>
                        );
                      })}
                      <div className="w-2 h-2 mb-2"></div>
                    </div>
                  </div>
                );
              }}
            </Draggable>
          </div>
          // <div
          //   onClick={(event) => handleOnClick(event, card)}
          //   key={card.id}
          //   className="mb-2 ml-5 w-4/5 hover:bg-gray-200 cursor-pointer rounded p-1 shadow"
          // >
          //   <p className="text-sm italic">{card.name}</p>
          // </div>
        );
      })}
    </>
  );

  // return (
  //   <>
  //     {trigger ? (
  //       <RenderCard
  //         setTrigger={setTrigger}
  //         cardClicked={cardClicked}
  //       ></RenderCard>
  //     ) : (
  //       <></>
  //     )}
  //     {card.map((card) => {
  //       return (
  //         <div
  //           onClick={(event) => handleOnClick(event, card)}
  //           key={card.id}
  //           className="mb-2 ml-5 w-4/5 hover:bg-gray-200 cursor-pointer rounded p-1 shadow"
  //         >
  //           <p className="text-sm italic">{card.name}</p>
  //         </div>
  //       );
  //     })}
  //   </>
  // );
}
