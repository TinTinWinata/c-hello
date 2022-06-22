import { CheckIcon, PencilIcon, XIcon } from "@heroicons/react/solid";
import React, { useRef } from "react";

const colorList = [
  { value: "#f8d404", clsName: "bg-[#f8d404] w-full rounded-sm" },
  { value: "#ff9c1c", clsName: "bg-[#ff9c1c] w-full rounded-sm" },
  { value: "#f05c44", clsName: "bg-[#f05c44] w-full rounded-sm" },
  { value: "#c874e4", clsName: "bg-[#c874e4] w-full rounded-sm" },
  { value: "#087cbc", clsName: "bg-[#087cbc] w-full rounded-sm" },
  { value: "#08c4e4", clsName: "bg-[#08c4e4] w-full rounded-sm" },
];

export default function RenderCardLabelForm({ handle, handleInsertLabelCard }) {
  return (
    <div className="absolute w-fit h-fit px-3 -mt-2 -ml-2 bg-white drop-shadow-xl z-30">
      <div className="flex flex-col items-center content-center gap-1">
        <p className="w-full text-center">Labels</p>
        <hr className="w-60" />
        <button onClick={handle}>
          <XIcon className="absolute scale-[.4] -top-[.7rem] left-[13rem] hover:bg-gray-200 rounded-md"></XIcon>
        </button>
      </div>
      <div className="my-1 flex flex-col items-center">
        {colorList.map((color, idx) => {
          const text = useRef();
          return (
            <div key={idx} className="cursor-pointer flex w-60 h-6 gap-2 my-1">
              <div className={color.clsName}></div>
              <input
                ref={text}
                className="pl-2 w-32 text-sm text-gray-600"
                type="text"
              />
              <CheckIcon
                onClick={() => {
                  handleInsertLabelCard(color, text);
                }}
                className=" w-16 stroke-slate-500 fill-slate-500 hover:fill-slate-900 scale-75"
              ></CheckIcon>
            </div>
          );
        })}
      </div>
    </div>
  );
}
