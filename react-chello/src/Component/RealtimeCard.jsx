import React, { createRef, useEffect, useState } from "react";
import { doc, onSnapshot, query, where } from "firebase/firestore";
import {
  cardCollectionRef,
  listCollectionRef,
} from "../Library/firebase.collections";
import { Link, useLocation } from "react-router-dom";
import { getWebId } from "../Script/Util";
import "./RealtimeCard.css";
import { appendChecklistCard, deleteCard, updateCard } from "../Script/Card";
import userEvent from "@testing-library/user-event";
import CheckListCard from "./CheckListCard";
import { RenderCard } from "./RenderCard";

export default function RealtimeCard(props) {
  const location = useLocation();
  const [card, setCard] = useState([]);
  const [trigger, setTrigger] = useState(false);
  const [cardClicked, setClickedCard] = useState();

  useEffect(() => {
    const id = getWebId();
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

  function handleOnClick(e, card) {
    setTrigger(true);
    setClickedCard(card);
  }

  function handleOffClick() {
    setTrigger(false);
  }

  return (
    <>
      {trigger ? (
        <RenderCard
          setTrigger={setTrigger}
          cardClicked={cardClicked}
        ></RenderCard>
      ) : (
        <></>
      )}
      {card.map((card) => {
        return (
          <div
            onClick={(event) => handleOnClick(event, card)}
            key={card.id}
            className="mb-2 ml-5 w-4/5 hover:bg-gray-200 cursor-pointer rounded p-1 shadow"
          >
            <p className="text-sm italic">{card.name}</p>
          </div>
        );
      })}
    </>
  );
}
  