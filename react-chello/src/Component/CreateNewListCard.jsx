import React, { createRef, useState } from "react";
import { insertList } from "../Script/List";
import { getWebId } from "../Script/Util";

export default function CreateNewListCard() {
  const name = createRef();

  function handleClick(e) {
    if (name.current.value == null) return;
    else {
      const id = getWebId();
      insertList(name.current.value, id);
      name.current.value = "";
    }
  }

  return (
    <>
      <div className="right-10 bottom-10 fixed">
        <div className="flex">
          <input
            ref={name}
            className="ml-2 pl-2 h-12 w-52 border-rius rounded  text-xs shadow bg-gray-100  appearance-none text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Insert New List"
          />
          <svg
            onClick={handleClick}
            className="ml-1 cursor-pointer h-12 w-11 text-gray-500"
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
            <line x1="10" y1="14" x2="21" y2="3" />{" "}
            <path d="M21 3L14.5 21a.55 .55 0 0 1 -1 0L10 14L3 10.5a.55 .55 0 0 1 0 -1L21 3" />
          </svg>

        </div>
      </div>
    </>
  );
}
