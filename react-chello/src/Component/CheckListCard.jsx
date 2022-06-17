import React from "react";
import { updateChecklist } from "../Script/Checklist";

export default function CheckListCard(props) {
  const checklist = props.checklist;

  const checked = checklist.value == true ? "checked" : "";

  function handleOnChange(e) {
    checklist.value = e.target.checked;
    updateChecklist(checklist);
  }

  return (
    <span className="relative z-0 inline-flex rounded-md">
      <span className="relative inline-flex items-center px-2 py-2 rounded-l-md  border-gray-300 bg-white">
        <input
          onChange={handleOnChange}
          id="select-all"
          type="checkbox"
          name="select-all"
          className="h-3 w-3 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          value="false"
          defaultChecked={checked}
        />
      </span>

      <label
        id="message-type"
        name="message-type"
        className="-ml-px block w-fit pl-2 pr-9 py-2 rounded-l-none rounded-r-md  border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
      >
        {checklist.name}
      </label>
    </span>
  );
}
