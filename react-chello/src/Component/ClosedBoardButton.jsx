import { MailIcon } from "@heroicons/react/outline";
import React from "react";

export default function ClosedBoardButton({ setShowCloseBoard }) {
  return (
    <div className="fixed bottom-3 right-3">
      <button
        onClick={() => {
          setShowCloseBoard(true);
        }}
        type="button"
        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <MailIcon className="-ml-1 mr-3 h-5 w-5" aria-hidden="true" />
        Closed Board
      </button>
    </div>
  );
}
