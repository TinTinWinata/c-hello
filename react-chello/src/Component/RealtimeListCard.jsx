import React, { useEffect, useState } from "react";
import { doc, onSnapshot, query, where } from "firebase/firestore";
import {
  cardCollectionRef,
  listCollectionRef,
} from "../Library/firebase.collections";
import { Link, useLocation } from "react-router-dom";
import { getWebId } from "../Script/Util";
import CreateCard from "./CreateCard";
import RealtimeCard from "./RealtimeCard";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { updateCard, updateCardWithId } from "../Script/Card";
import { updateList, updateListById, updateListNameById } from "../Script/List";

export default function Realtimelist() {
  const location = useLocation();
  const [list, setList] = useState([]);
  const [card, setCard] = useState([]);
  const [refresh, setRefresh] = useState(true);

  function refreshPage() {
    if (refresh) {
      setRefresh(false);
    } else {
      setRefresh(true);
    }
  }

  const handleKeyDown = (e, listId) => {
    if (e.key === "Enter") {
      const val = e.target.value;
      const changes = {
        name: val,
      };
      updateListById(listId, changes)
        .then(() => {
          console.log("success update to doc");
        })
        .catch((error) => {
          console.log("error update to doc : ", error);
        });
    }
  };

  function onDragEnd(result, columns, setColumns) {
    if (!result.destination) return;

    const { draggableId, source, destination } = result;

    const cardId = draggableId;
    const changes = {
      listId: destination.droppableId,
    };

    updateCardWithId(cardId, changes)
      .then(() => {
        refreshPage();
      })
      .catch(() => {
        console.log("error moving card :", error);
      });
  }

  useEffect(() => {
    const id = getWebId();
    const q = query(listCollectionRef, where("boardId", "==", id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setList(snapshot.docs.map((docs) => ({ ...docs.data(), id: docs.id })));
    });
    console.log("changing list...");
    return () => {
      unsubscribe();
    };
  }, [location, refresh]);

  useEffect(() => {
    const id = getWebId();
    const q = query(cardCollectionRef, where("boardId", "==", id));

    console.log("changing card...");
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCard(snapshot.docs.map((docs) => ({ ...docs.data(), id: docs.id })));
    });

    return () => {
      unsubscribe();
    };
  }, [refresh]);

  return (
    <>
      <DragDropContext
        onDragEnd={(result) => {
          onDragEnd(result, list, setList);
        }}
      >
        {list.map((card) => {
          const link = "/list/" + card.id;
          const tag = "#" + card.tag;
          return (
            <div className="flex flex-col" key={card.id}>
              <input
                key={card.id}
                onKeyDown={(e) => {
                  handleKeyDown(e, card.id);
                }}
                className="rounded bg-transparent mx-auto font-bold text-gray-800"
                defaultValue={card.name}
              ></input>
              <Droppable droppableId={card.id}>
                {(provided, snapshot) => {
                  return (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        background: snapshot.isDraggingOver ? "lightblue" : "",
                        padding: 4,
                        width: 250,
                        minHeight: 500,
                        margin: 4,
                      }}
                    >
                      <RealtimeCard listId={card.id}></RealtimeCard>
                      <CreateCard listId={card.id}></CreateCard>
                    </div>
                  );
                }}
              </Droppable>
            </div>
          );
        })}
      </DragDropContext>
    </>
  );
}
