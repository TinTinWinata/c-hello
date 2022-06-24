import React, { createRef, useEffect, useState } from "react";
import { doc, documentId, onSnapshot, query, where } from "firebase/firestore";
import { cardCollectionRef } from "../Library/firebase.collections";
import { Link, useLocation, useParams } from "react-router-dom";
import { getWebId } from "../Model/Util";
import { appendChecklistCard, deleteCard, updateCard } from "../Model/Card";
import userEvent from "@testing-library/user-event";
import CheckListCard from "./CheckListCard";
import { RenderCard } from "./RenderCard";
import { Draggable } from "react-beautiful-dnd";

export default function RealtimeCard(props) {
  const location = useLocation();
  const [card, setCard] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [cardClicked, setClickedCard] = useState();

  const { id } = useParams();

  useEffect(() => {
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
  }, [location]);

  useEffect(() => {
    if (cardClicked) {
      setTrigger(true);
    }
  }, [cardClicked]);

  function handleOnClick(e, card) {
    setClickedCard(card);
  }

  function handleOffClick() {
    setTrigger(false);
  }

  return (
    <>
      {trigger ? (
        <RenderCard
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
            key={card.id}
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
                    <p className="pl-2 pt-2">{card.name}</p>
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
