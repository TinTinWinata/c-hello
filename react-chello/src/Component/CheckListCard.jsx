import { PlusCircleIcon, PlusIcon, XIcon } from "@heroicons/react/solid";
import React, { useEffect, useState } from "react";
import { updateChecklist } from "../Model/Checklist";
import { removeArrayByIndex } from "../Model/Util";
import ProgressBar from "@ramonak/react-progress-bar";

export default function CheckListCard(props) {
  const checklist = props.checklist;

  const [percentage, setPercentage] = useState();

  function calculatePercentage() {
    let totalData = checklist.data.length;
    let checkedData = 0;
    checklist.data.map((check) => {
      if (check.value) {
        checkedData += 1;
      }
    });

    let percent;
    if (checkedData == 0) {
      percent = 0;
    } else {
      percent = (checkedData / totalData) * 100;
    }
    setPercentage(percent);
  }

  useEffect(() => {
    calculatePercentage();
  }, [checklist]);

  function clickNewData() {
    const newData = {
      value: false,
      name: "New Checklist",
    };
    checklist.data = [...checklist.data, newData];
    updateChecklist(checklist);
  }

  return (
    <>
      <div className="flex">
        <h3 className="ml-2 mt-2 text-sm text-gray-800">{checklist.name}</h3>
        <PlusIcon
          onClick={clickNewData}
          className="w-4 h-5 mt-2 ml-1 hover:text-gray-900 text-gray-500 cursor-pointer"
        ></PlusIcon>
      </div>
      {checklist.data.map((check, idx) => {
        function handleOnChange(e) {
          check.value = e.target.checked;
          updateChecklist(checklist);
        }
        const checked = check.value == true ? "checked" : "";

        function handleNameChange(e) {
          const currName = e.target.value;
          check.name = currName;
          updateChecklist(checklist);
        }

        function handleRemove() {
          let idx = 0;
          checklist.data.map((data) => {
            if (data == check) {
              return;
            }
            idx += 1;
          });
          removeArrayByIndex(checklist.data, idx);
          updateChecklist(checklist);
        }

        return (
          <div className="flex" key={idx}>
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

              <input
                onChange={handleNameChange}
                defaultValue={check.name}
                id="message-type"
                name="message-type"
                className="-ml-px block w-fit pl-2 pr-9 py-2 rounded-l-none rounded-r-md  border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              ></input>
            </span>
            <XIcon
              onClick={handleRemove}
              className="w-4 h-5 mt-2 ml-1 hover:text-red-900 text-red-500 cursor-pointer"
            ></XIcon>
          </div>
        );
      })}
      <ProgressBar
        width="70%"
        bgColor="#22c55e"
        completed={percentage}
      ></ProgressBar>
    </>
  );
}
