import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {
  cardCollectionRef,
  listCollectionRef,
} from "../Library/firebase.collections";
import { Link, useLocation, useParams } from "react-router-dom";
import { getWebId } from "../Model/Util";
import CreateCard from "./CreateCard";
import RealtimeCard from "./RealtimeCard";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { updateCard, updateCardWithId } from "../Model/Card";
import {
  changeIndex,
  deleteList,
  updateList,
  updateListById,
  updateListNameById,
} from "../Model/List";
import SearchingUI from "./SearchingUI";
import { XIcon } from "@heroicons/react/solid";
import { toastError, toastSuccess } from "../Model/Toast";

const PAGE_DEFAULT_VALUE = 3;

export default function Realtimelist({
  role,
  refreshRole,
  refresh,
  refreshPage,
}) {
  const location = useLocation();

  // Option Data
  const [option, setOption] = useState([]);
  const [selectedOption, setSelectedOption] = useState();

  function addOption(n) {
    isOptionExists(n).then(
      (value) => {
        setOption(value);
      },
      (error) => {
        console.log("redundanat : ", error);
      }
    );
  }

  function isOptionExists(n) {
    return new Promise((resolve, reject) => {
      option.forEach((opt) => {
        if (opt.text == n.text) {
          reject(opt);
        }
      });
      resolve([...option, n]);
    });
  }

  // Infinity Scrooling Data

  const { id } = useParams();
  const [name, setName] = useState("");
  const [page, setPageNumber] = useState(PAGE_DEFAULT_VALUE);
  const [queriedList, setQueriedList] = useState([]);
  const [searching, setSearching] = useState(false);
  const [docsLength, setDocsLength] = useState(0);

  // Check queried list
  useEffect(() => {
    console.log("queried : : ", queriedList);
  }, [queriedList]);

  // Check if the last node is seen (Observer)

  const observer = useRef();
  const lastListRef = useCallback((node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entry) => {
      if (
        name == "" &&
        !selectedOption &&
        !searching &&
        entry[0].isIntersecting &&
        queriedList.length != docsLength
      ) {
        // console.log("infinity scrooling");
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
    console.log("refreshed : ");
    if (selectedOption || name != "") setPageNumber(999);
    const q = query(
      listCollectionRef,
      where("boardId", "==", id),
      limit(page),
      orderBy("listIndex")
    );
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
          let isPush = false;

          // Kondisi ada card dan didalam card ada yang sama
          currList.label.map((lbl) => {
            if (selectedOption && selectedOption.text == lbl.text) {
              isPush = true;
            }
          });

          if (selectedOption && currList.status == selectedOption.text) {
            isPush = true;
          }

          // Kondisi gak ada selected option
          if (!selectedOption) isPush = true;

          if (isPush) filteredList.push(currList);
          // Push filtered list
        }
      });
      console.log("filtered : ", filteredList);
      setQueriedList(filteredList);
      setSearching(false);
    });
    return () => {
      unsubscribe();
    };
  }, [name, page, searching, selectedOption, location, refresh]);

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
      setOption([]);
      setDocsLength(list.length);
      list.map((currList) => {
        currList.label.map((lbl) => {
          addOption(lbl);
        });
      });
      return () => {
        unsubscribe();
        setOption([]);
      };
    });
  }, [location]);

  const [card, setCard] = useState([]);

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
    if (result.type == "card") {
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
    } else if (result.type == "list") {
      console.log("result : ", result);
      const fromIndex = result.source.index;
      const toIndex = result.destination.index;
      const listId = result.draggableId;

      // List destination index ganti toIndex
      let list = queriedList;

      let temp = list[fromIndex];
      list[fromIndex] = list[toIndex];
      list[toIndex] = temp;

      setQueriedList(list);
      // List source index ganti fromIndex

      changeIndex(listId, toIndex, fromIndex, refreshPage);
      refreshPage();
    }
  }

  return (
    <>
      <SearchingUI
        role={role}
        options={option}
        searchChange={searchChange}
        setSelectedOption={setSelectedOption}
      ></SearchingUI>
      <DragDropContext
        onDragEnd={(result) => {
          onDragEnd(result, queriedList, setQueriedList);
        }}
      >
        <Droppable droppableId="all-list" direction="horizontal" type="list">
          {(provided) => (
            <>
              <div
                className=" ml-10 w-full flex flex-wrap "
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {/* {provided.placeholder} */}
                {queriedList.map((card, idx) => {
                  function handleOnDelete() {
                    deleteList(card)
                      .then(() => {
                        toastSuccess("Succesfully delete list!");
                      })
                      .catch((e) => {
                        toastError("Failed to delete list!");
                      });
                  }

                  const link = "/list/" + card.id;
                  const tag = "#" + card.tag;
                  if (queriedList.length == idx + 1) {
                    return (
                      <>
                        <Draggable draggableId={card.id} index={idx} key={idx}>
                          {(provided) => (
                            <>
                              <div
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                              >
                                {/* {provided.placeholder} */}
                                <div
                                  ref={lastListRef}
                                  className=" w-fit rounded-3xl ml-4 "
                                  key={idx}
                                >
                                  <div className="flex">
                                    <XIcon
                                      onClick={handleOnDelete}
                                      className="w-5 h-5 text-gray-500 opacity-50 cursor-pointer ml-1 mt-1"
                                    ></XIcon>
                                    <input
                                      key={card.id}
                                      onKeyDown={(e) => {
                                        handleKeyDown(e, card.id);
                                      }}
                                      className="ml-3 rounded bg-transparent font-bold text-gray-800"
                                      defaultValue={card.name}
                                    ></input>
                                  </div>
                                  <div className="">
                                    <Droppable
                                      type="card"
                                      droppableId={card.id}
                                    >
                                      {(provided, snapshot) => {
                                        return (
                                          <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            style={{
                                              background:
                                                snapshot.isDraggingOver
                                                  ? "lightblue"
                                                  : "",
                                              padding: 4,
                                              width: 250,
                                              minHeight: 500,
                                              margin: 4,
                                            }}
                                          >
                                            <RealtimeCard
                                              refresh={refresh}
                                              refreshRole={refreshRole}
                                              role={role}
                                              list={card}
                                              listId={card.id}
                                            ></RealtimeCard>
                                            {role ? (
                                              <CreateCard
                                                refreshRole={refreshRole}
                                                listId={card.id}
                                              ></CreateCard>
                                            ) : (
                                              ""
                                            )}
                                          </div>
                                        );
                                      }}
                                    </Droppable>
                                  </div>
                                </div>
                              </div>
                            </>
                          )}
                        </Draggable>
                      </>
                    );
                  } else {
                    return (
                      <>
                        <Draggable draggableId={card.id} index={idx} key={idx}>
                          {(provided) => (
                            <>
                              <div
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                className=" w-fit rounded-3xl ml-4 "
                              >
                                {/* {provided.placeholder} */}
                                <div className="flex">
                                  <XIcon
                                    onClick={handleOnDelete}
                                    className=" w-5 h-5 text-gray-500 opacity-50 cursor-pointer ml-1 mt-1"
                                  ></XIcon>
                                  <input
                                    key={card.id}
                                    onKeyDown={(e) => {
                                      handleKeyDown(e, card.id);
                                    }}
                                    className="ml-3 rounded bg-transparent font-bold text-gray-800"
                                    defaultValue={card.name}
                                  ></input>
                                </div>

                                <div className="">
                                  <Droppable type="card" droppableId={card.id}>
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
                                          {/* {provided.placeholder} */}
                                          <RealtimeCard
                                            listId={card.id}
                                          ></RealtimeCard>
                                          <CreateCard
                                            listId={card.id}
                                          ></CreateCard>
                                        </div>
                                      );
                                    }}
                                  </Droppable>
                                </div>
                              </div>
                            </>
                          )}
                        </Draggable>
                      </>
                    );
                  }
                })}
              </div>
            </>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}
