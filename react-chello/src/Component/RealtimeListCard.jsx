import React, { useCallback, useEffect, useRef, useState } from "react";
import { doc, limit, onSnapshot, query, where } from "firebase/firestore";
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
import { updateList, updateListById, updateListNameById } from "../Model/List";
import SearchingUI from "./SearchingUI";

const PAGE_DEFAULT_VALUE = 3;

export default function Realtimelist({ role, refreshRole }) {
  const location = useLocation();

  // Option Data
  const [option, setOption] = useState([]);
  const [selectedOption, setSelectedOption] = useState();

  function addOption(n) {
    option.map((optionList) => {
      if (optionList.text == n.text) {
        return;
      }
    });
    setOption((prev) => [...prev, n]);
  }

  function isOptionExists(arr1, text) {
    if (arr1.length == 0) return false;
    console.log("arr : ", arr1);
    arr1.map((opt) => {
      console.log("opt : ", opt.text);
      console.log("text : ", text);
      if (opt.text == text) {
        console.log("returning true!");
        return true;
      }
    });
    return false;
  }

  // Get Unique Option Name
  // useEffect(() => {
  //   let uniqueOption = [];
  //   option.map((opt) => {
  //     if (isOptionExists(uniqueOption, opt.text)) {
  //       console.log("not pushing ", opt.text);
  //       return;
  //     } else {
  //       console.log("pushing ", opt.text);
  //       uniqueOption.push(opt);
  //     }
  //   });
  //   console.log("uniqueOption ", uniqueOption);
  // }, [option]);

  // Infinity Scrooling Data

  const { id } = useParams();
  const [name, setName] = useState("");
  const [page, setPageNumber] = useState(PAGE_DEFAULT_VALUE);
  const [queriedList, setQueriedList] = useState([]);
  const [searching, setSearching] = useState(false);
  const [docsLength, setDocsLength] = useState(0);

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
    if (selectedOption || name != "") setPageNumber(999);
    // console.log(name, page, searching, selectedOption, "affected");
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
          let isPush = false;

          // Kondisi ada card dan didalam card ada yang sama
          currList.label.map((lbl) => {
            if (selectedOption && selectedOption.text == lbl.text) {
              isPush = true;
            }
          });

          // Kondisi gak ada selected option
          if (!selectedOption) isPush = true;

          if (isPush) filteredList.push(currList);
          // Push filtered list
        }
      });
      setQueriedList(filteredList);
      setSearching(false);
    });
    return () => {
      unsubscribe();
    };
  }, [name, page, searching, selectedOption, location]);

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

  //

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
      <SearchingUI
        role={role}
        options={option}
        searchChange={searchChange}
        setSelectedOption={setSelectedOption}
      ></SearchingUI>
      <div className="w-full flex flex-wrap">
        <DragDropContext
          onDragEnd={(result) => {
            onDragEnd(result, queriedList, setQueriedList);
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
                            <RealtimeCard
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
