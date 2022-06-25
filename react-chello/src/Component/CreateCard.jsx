import React from "react";
import { useUserAuth } from "../Library/UserAuthContext";
import { insertCard } from "../Model/Card";
import { getWebId } from "../Model/Util";

export default function CreateCard({ listId, refreshRole }) {
  const { userDb } = useUserAuth();

  function handleClick() {
    console.log("refresh role :", refreshRole);
    const boardId = getWebId();
    insertCard("New Card", boardId, listId, new Date(), userDb);
    if (refreshRole) {
      console.log("refreshign...");
      refreshRole();
    }
  }

  return (
    <div onClick={handleClick} className="flex opacity-50 cursor-pointer">
      <svg
        className="h-4 w-4 mt-1 text-black"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {" "}
        <circle cx="12" cy="12" r="10" />{" "}
        <line x1="12" y1="8" x2="12" y2="16" />{" "}
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
      <div className="ml-1 text-s ">CreateCard</div>
    </div>
  );
}
