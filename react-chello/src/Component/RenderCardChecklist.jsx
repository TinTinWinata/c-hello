import React from "react";
import CheckListCard from "./CheckListCard";

export default function RenderCardChecklist({
  checklist,
  newChecklist,
  handleAddChecklist,
}) {
  return (
    <div className="mt-4">
      <p
        className="mt-3 text-lg appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
        type="text"
        aria-label="Full name"
      >
        Check List
      </p>
      {checklist.map((card) => {
        return <CheckListCard key={card.id} checklist={card}></CheckListCard>;
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
    </div>
  );
}
