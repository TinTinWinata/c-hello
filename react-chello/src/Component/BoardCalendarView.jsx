import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

export default function BoardCalendarView() {
  const localizer = momentLocalizer(moment);
  const myEvent = [
    {
      title: "Big Meeting",
      allDay: true,
      start: new Date(),
      end: new Date(),
    },
    {
      title: "Vacation",
      start: new Date(2022, 6, 7),
      end: new Date(2022, 6, 10),
    },
    {
      title: "Conference",
      start: new Date(2022, 6, 20),
      end: new Date(2022, 6, 23),
    },
  ];

  return (
    <>
      <div className="w-full h-full">
        <Calendar
          localizer={localizer}
          events={myEvent}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
        />
      </div>
    </>
  );
}
