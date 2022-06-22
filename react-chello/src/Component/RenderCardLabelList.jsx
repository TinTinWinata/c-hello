import React, { useState } from "react";
import { updateCard } from "../Script/Card";
import { toastError, toastSuccess } from "../Script/Toast";
import { removeArrayByIndex } from "../Script/Util";

export default function RenderLabelList({ label, cardClicked }) {
  const color = "bg-[" + label.color + "] ";
  const [remove, setRemove] = useState(false);

  function setTrueRemove() {
    setRemove(true);
  }
  function setFalseRemove() {
    setRemove(false);
  }

  function handleClick() {
    const cardLabel = cardClicked.label;
    let idx = 0;
    cardLabel.map((lbl) => {
      if (lbl.id == label.id) {
        return;
      }
      idx += 1;
    });
    removeArrayByIndex(cardLabel, idx);
    cardClicked.label = cardLabel;
    updateCard(cardClicked)
      .then(() => {
        toastSuccess("Succesfully to delete label!");
      })
      .catch((e) => {
        toastError("Failed to delete label! ", e.message);
      });
  }

  return (
    <div
      onMouseLeave={setFalseRemove}
      onMouseEnter={setTrueRemove}
      onClick={handleClick}
      className="cursor-pointer flex ml-2 mt-2"
    >
      <div className={color + " w-5 h-5"}></div>
      <p className="text-sm font-normal ml-2">{label.text}</p>
      {remove ? (
        <p className="text-xs font-normal ml-5 mt-[2px] text-red-500">Remove</p>
      ) : (
        ""
      )}
    </div>
  );
}
