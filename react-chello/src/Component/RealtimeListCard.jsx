import React, { useCallback, useEffect, useRef, useState } from "react";
import { doc, limit, onSnapshot, query, where } from "firebase/firestore";
import {
  cardCollectionRef,
  listCollectionRef,
} from "../Library/firebase.collections";
import { Link, useLocation, useParams } from "react-router-dom";
import { getWebId } from "../Script/Util";
import CreateCard from "./CreateCard";
import RealtimeCard from "./RealtimeCard";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { updateCard, updateCardWithId } from "../Script/Card";
import { updateList, updateListById, updateListNameById } from "../Script/List";
import SearchingUI from "./SearchingUI";
import listSearch from "./SearchingCard";

const PAGE_DEFAULT_VALUE = 3;

export default function Realtimelist() {
  // Infinity Scrooling Data

  const { id } = useParams();
  const [name, setName] = useState("");
  const [page, setPageNumber] = useState(PAGE_DEFAULT_VALUE);
  const [queriedList, setQueriedList] = useState([]);
  const [searching, setSearching] = useState(false);
  const [docsLength, setDocsLength] = useState(0);

  // Check if the last node is seen

  const observer = useRef();
  const lastListRef = useCallback((node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entry) => {
      if (
        !searching &&
        entry[0].isIntersecting &&
        queriedList.length != docsLength
      ) {
        setPageNumber((prev) => {
          return prev + 3;
        });
        setSearching(true);
      }
    });
    if (node) observer.current.observe(node);
  });

  // --------------------------------------------

  // Searching queried list
  useEffect(() => {
    const q = query(listCollectionRef, where("boardId", "==", id), limit(page));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((docs) => ({
        ...docs.data(),
        id: docs.id,
      }));
      let filteredList = [];
      list.map((currList) => {
        const lowerCurrListName = currList.name.toLowerCase();
        const lowerName = name.toLowerCase();
        if (lowerCurrListName.includes(lowerName)) {
          filteredList.push(currList);
        }
      });
      setQueriedList(filteredList);
      setSearching(false);
    });
    return () => {
      unsubscribe();
    };
  }, [name, page, searching]);

  function searchChange(e) {
    setPageNumber(PAGE_DEFAULT_VALUE);
    setName(e.target.value);
  }

  // --------------------------------

  // Get data length

  useEffect(() => {
    const q = query(listCollectionRef, where("boardId", "==", id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((docs) => ({
        ...docs.data(),
        id: docs.id,
      }));

      setDocsLength(list.length);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  //

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

  function onDragEnd(result) {
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

  return (
    <>
      <SearchingUI searchChange={searchChange}></SearchingUI>
      <div className="w-full flex flex-wrap">
        <DragDropContext
          onDragEnd={(result) => {
            onDragEnd(result, list, setList);
          }}
        >
          {queriedList.map((card, idx) => {
            const link = "/list/" + card.id;
            const tag = "#" + card.tag;
            if (queriedList.length == idx + 1) {
              return (
                <div
                  ref={lastListRef}
                  className="w-fit rounded-3xl ml-4 "
                  key={card.id}
                >
                  <input
                    key={card.id}
                    onKeyDown={(e) => {
                      handleKeyDown(e, card.id);
                    }}
                    className="ml-3 rounded bg-transparent font-bold text-gray-800"
                    defaultValue={card.name}
                  ></input>

                  <div className="">
                    <Droppable droppableId={card.id}>
                      {(provided, snapshot) => {
                        return (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                              background: snapshot.isDraggingOver
                                ? "lightblue"
                                : "",
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
                </div>
              );
            } else {
              return (
                <div className="w-fit rounded-3xl ml-4 " key={card.id}>
                  <input
                    key={card.id}
                    onKeyDown={(e) => {
                      handleKeyDown(e, card.id);
                    }}
                    className="ml-3 rounded bg-transparent font-bold text-gray-800"
                    defaultValue={card.name}
                  ></input>

                  <div className="">
                    <Droppable droppableId={card.id}>
                      {(provided, snapshot) => {
                        return (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                              background: snapshot.isDraggingOver
                                ? "lightblue"
                                : "",
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
                </div>
              );
            }
          })}
        </DragDropContext>
      </div>
    </>
  );
}
