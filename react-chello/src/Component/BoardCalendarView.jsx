import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { onSnapshot, query, where } from "firebase/firestore";
import { useParams } from "react-router-dom";
import {
  cardCollectionRef,
  listCollectionRef,
} from "../Library/firebase.collections";
import BoardCalenderPopUp from "./BoardCalenderPopUp";

export default function BoardCalendarView({ role }) {
  const [eventList, setEventList] = useState([]);
  const [card, setCard] = useState();
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [link, setLink] = useState();
  // Get event data

  // Debugging get event
  // useEffect(() => {
  //   console.log("event : ", eventList);
  // }, [eventList]);

  function handleClick() {
    setOpen(true);
  }

  useEffect(() => {
    const q = query(cardCollectionRef, where("boardId", "==", id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const card = snapshot.docs.map((docs) => ({
        ...docs.data(),
        id: docs.id,
      }));
      setCard(card);

      setEventList([]);

      card.map((card) => {
        const event = {
          title: card.name,
          allDay: true,
          start: card.date.toDate(),
          end: card.date.toDate(),
        };
        setEventList((prev) => [...prev, event]);
      });
    });
    return () => {
      setEventList([]);
      unsubscribe();
    };
  }, []);
  const localizer = momentLocalizer(moment);

  return (
    <>
      <BoardCalenderPopUp setOpen={setOpen} open={open}></BoardCalenderPopUp>
      <div className="m-10 pr-20 w-full h-full">
        <Calendar
          localizer={localizer}
          events={eventList}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
        {role ? (
          <button
            onClick={handleClick}
            type="button"
            className="inline-flex items-center px-3 py-3 border border-transparent text-xl mt-5 font-medium rounded-full shadow-sm text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
          >
            Create Card
          </button>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
