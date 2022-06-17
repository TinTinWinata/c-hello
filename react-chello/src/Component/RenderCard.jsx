import { onSnapshot, query, where } from "firebase/firestore";
import { createRef, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useLocation } from "react-router-dom";
import { checklistCollectionRef } from "../Library/firebase.collections";
import { deleteCard, updateCard } from "../Script/Card";
import { insertChecklist } from "../Script/Checklist";
import CheckListCard from "./CheckListCard";

export function RenderCard(props) {
  const [checklist, setChecklist] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  var cardClicked = props.cardClicked;
  var titleInput = createRef();
  var descriptionInput = createRef();
  var newChecklist = createRef();
  const location = useLocation();

  useEffect(() => {
    const q = query(
      checklistCollectionRef,
      where("cardId", "==", cardClicked.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setChecklist(
        snapshot.docs.map((docs) => ({ ...docs.data(), id: docs.id }))
      );
    });
    return () => {
      unsubscribe();
    };
  }, [location]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      cardClicked.name = titleInput.current.value;
      cardClicked.description = descriptionInput.current.value;
      updateCard(cardClicked);
    }
  };

  const handleOnChange = (e) => {
    cardClicked.description = descriptionInput.current.value;
    updateCard(cardClicked);
  };

  const handleDelete = () => {
    deleteCard(cardClicked);
    props.setTrigger(false);
  };

  function handleOffClick() {
    props.setTrigger(false);
  }

  const handleAddChecklist = () => {
    const checklistName = newChecklist.current.value;

    const checklist = {
      value: false,
      name: checklistName,
    };
    newChecklist.current.value = "";
    insertChecklist(cardClicked.id, checklist);
  };

  const handleDateOnChange = (date) => {
    cardClicked.date = date;
    updateCard(cardClicked);
  };

  return (
    <>
      <div className="z-10 black-background left-0 top-0 fixed bg-black opacity-70"></div>
      <div className="z-10 w-2/4 h-fit absolute bg-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <svg
          onClick={handleOffClick}
          className="right-5 top-5 absolute h-8 w-8 text-gray-500 cursor-pointer"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {" "}
          <path stroke="none" d="M0 0h24v24H0z" />{" "}
          <line x1="18" y1="6" x2="6" y2="18" />{" "}
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        <div className="z-20 ml-5 mt-5 text-2xl font-bold flex flex-col">
          <input
            ref={titleInput}
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            onKeyDown={handleKeyDown}
            defaultValue={cardClicked.name}
            aria-label="Full name"
          />
          <div className="pt-4 mt-4 w-5/6 space-y-2 border-t border-gray-200 dark:border-gray-700"></div>
          <p
            className="text-lg appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            aria-label="Full name"
          >
            Description
          </p>
          <textarea
            ref={descriptionInput}
            onChange={handleOnChange}
            aria-label="Description"
            className="ml-2 mt-1 bg-gray-300 rounded w-2/3 h-24 text-sm font-normal appearance-none bg-transparent border-none text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            defaultValue={cardClicked.description}
          />
          <p
            className="mt-2 text-lg appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            aria-label="Full name"
          >
            Check List
          </p>
          {checklist.map((card) => {
            return (
              <CheckListCard key={card.id} checklist={card}></CheckListCard>
            );
          })}
          <div className="flex">
            <input
              ref={newChecklist}
              type="text"
              id="email"
              className="font-normal ml-2 w-1/4 text-xs bg-gray-50 border border-gray-300 text-gray-600 rounded-lg focus:ring-gray-500 focus:border-gray-500 block p-1.5 dark:bg-gray-300 dark:border-gray-300 dark:placeholder-gray-400 dark:text-black dark:focus:ring-white-500 dark:focus:border-gray-500"
              placeholder="New Checklist..."
            />

            <svg
              onClick={handleAddChecklist}
              className="cursor-pointer ml-2 h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p
            className="mt-2 text-lg appearance-none bg-transparent border-none w-full text-gray-700 px-2 leading-tight focus:outline-none"
            type="text"
            aria-label="Full name"
          >
            Due Date
          </p>
          <DatePicker
            className="ml-2 text-sm font-normal"
            selected={startDate}
            onChange={handleDateOnChange}
          />
          <p
            className="mt-2 text-lg appearance-none bg-transparent border-none w-full text-gray-700 px-2 leading-tight focus:outline-none"
            type="text"
            aria-label="Full name"
          >
            Location
          </p>

          <div className="flex">
            <button
              onClick={handleDelete}
              className="w-1/6 mt-5 appearance-none bg-transparent border-mt-2 mb-5 bg-red-500 hover:bg-red-700 text-white text-sm font-bold py-2 px-4  rounded"
            >
              Delete
            </button>
            <label
              htmlFor="file-upload"
              className="ml-3 w-1/6 mt-5 appearance-none bg-transparent border-mt-2 mb-5 bg-sky-500 hover:bg-sky-700 text-white text-sm font-bold py-2 px-4  rounded"
            >
              <div className="ml-5 text">Attach</div>
            </label>
            <input id="file-upload" type="file" className="hidden" />
          </div>
        </div>
      </div>
    </>
  );
}
