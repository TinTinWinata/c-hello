import { XIcon } from "@heroicons/react/solid";
import {
  documentId,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { userCollectionRef } from "../Library/firebase.collections";
import { updateCard } from "../Model/Card";
import { toastError, toastSuccess } from "../Model/Toast";
import { getUser } from "../Model/User";
import { removeArray, removeArrayByIndex } from "../Model/Util";

export default function WatcherList({ cardClicked, role }) {
  const [watcher, setWatcher] = useState([]);
  const [refresh, setRefresh] = useState(false);

  function refreshPage() {
    setRefresh(!refresh);
  }

  useEffect(() => {
    console.log("length : " + cardClicked.watcher.length);
    console.log("watch : ", watcher);
  }, [watcher]);

  function handleRemove(watcher) {
    if (role != "Admin") {
      toastError("You dont have access to delete this watcher");
      return false;
    }

    const temp = cardClicked.watcher;
    let idx = 0;
    temp.map((watcherId) => {
      if (watcherId === watcher.userId) {
        return;
      }
      idx += 1;
    });
    console.log(" idx : ", idx);
    removeArrayByIndex(temp, idx);
    cardClicked.watcher = temp;
    updateCard(cardClicked)
      .then(() => {
        toastSuccess("Succesfully deleted watcher!");
        refreshPage();
      })
      .catch((e) => {
        toastError("Failed to delete watcher: " + e.message);
      });
  }

  function addWatcher(n) {
    const len = watcher.length;
    for (let i = 0; i < len; i++) {
      if (watcher[i] == n.userId) {
        console.log("return!");
        return;
      }
    }
    setWatcher((prev) => [...prev, n]);
    console.log("watcher : ", watcher);
  }

  useEffect(() => {
    let unsub;
    setWatcher([]);
    cardClicked.watcher.map((watcher) => {
      getUser(watcher).then((doc) => {
        const temp = { ...doc.docs[0].data(), id: doc.docs[0].id };
        addWatcher(temp);
      });
    });
    return () => {
      setWatcher([]);
    };
  }, [cardClicked, refresh]);

  return (
    <div className="flex flex-col">
      {watcher.map((watcher, idx) => (
        <div
          key={idx}
          className="mt-1.5 relative rounded-lg border border-gray-300 bg-white px-2 py-1 shadow-sm flex items-center space-x-3 hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
        >
          <div className="flex-shrink-0">
            <img
              className="h-5 w-5 rounded-full"
              src={watcher.photoUrl}
              alt=""
            />
          </div>
          <div className="flex-1 min-w-0">
            <div
              onClick={() => {
                handleRemove(watcher);
              }}
              className="cursor-pointer focus:outline-none"
            >
              <span className="absolute inset-0" aria-hidden="true" />
              <div className="flex">
                <p className="text-xs font-medium text-gray-900">
                  {watcher.displayName}
                </p>
                <XIcon className="text-gray-500 w-3 h-3 mt-[3px]"></XIcon>
              </div>
              <p className="text-xs text-gray-500 truncate">{watcher.email}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
