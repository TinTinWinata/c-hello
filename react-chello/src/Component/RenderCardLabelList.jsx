import { AdjustmentsIcon, XIcon } from "@heroicons/react/solid";
import React, { useState } from "react";
import { getBoardById, updateBoard } from "../Model/Board";
import { updateCard } from "../Model/Card";
import { getListWithListId, updateList } from "../Model/List";
import { toastError, toastSuccess } from "../Model/Toast";
import { removeArrayByIndex } from "../Model/Util";

export default function RenderLabelList({ label, cardClicked, listId }) {
  const color = "bg-[" + label.color + "] ";
  const [remove, setRemove] = useState(false);

  function setTrueRemove() {
    setRemove(true);
  }
  function setFalseRemove() {
    setRemove(false);
  }

  function handleDettachment() {
    // 1. Remove label from card clicked
    let idx = 0;
    cardClicked.label.map((lbl) => {
      if (lbl.id == label.id) {
        return;
      }
      idx += 1;
    });

    removeArrayByIndex(cardClicked.label, idx);
    updateCard(cardClicked).then(() => {
      // 2. Add label to list
      getBoardById(cardClicked.boardId).then((doc) => {
        const board = { ...doc.data(), id: doc.id };
        board.label = [...board.label, label];
        updateBoard(board);
      });
    });
  }

  function handleClick() {
    const cardLabel = cardClicked.label;
    let idx = 0;

    getListWithListId(listId).then((doc) => {
      const list = { ...doc.data(), id: doc.id };

      let listLabel = list.label;

      let idx = 0;
      listLabel.map((lbl) => {
        if (lbl.id == label.id) {
          return;
        }
        idx++;
      });
      removeArrayByIndex(listLabel, idx);
      list.label = listLabel;

      updateList(list)
        .then(() => {
          idx = 0;
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
        })
        .catch((e) => {
          toastError(e.message);
        });
    });
  }

  return (
    <div
      onMouseLeave={setFalseRemove}
      onMouseEnter={setTrueRemove}
      className="cursor-pointer flex ml-2 mt-2"
    >
      <div className={color + " w-5 h-5"}></div>
      <p className="text-sm font-normal ml-2">{label.text}</p>
      {remove ? (
        <>
          <div className="flex">
            <AdjustmentsIcon
              onClick={handleDettachment}
              className="w-5 h-5 ml-2 hover:text-gray-500 text-gray-700"
            ></AdjustmentsIcon>

            <XIcon
              onClick={handleClick}
              className="w-5 h-5 hover:text-gray-500 text-gray-700"
            ></XIcon>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
