import { onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { userCollectionRef } from "../Library/firebase.collections";

export default function WatcherList({ cardClicked }) {
  const [watcher, setWatcher] = useState([]);

  useEffect(() => {
    console.log("watch : ", watcher);
  }, [watcher]);

  useEffect(() => {
    let unsub;
    cardClicked.watcher.map((watcher) => {
      const q = query(userCollectionRef, where("userId", "==", watcher));
      setWatcher([]);
      unsub = onSnapshot(q, (doc) => {
        doc.docs.map((doc) => {
          const temp = { ...doc.data(), id: doc.id };
          setWatcher((prev) => [...prev, temp]);
        });
      });
    });
    return () => {
      if (unsub !== undefined) {
        unsub();
      }
    };
  }, [cardClicked]);

  return (
    <div className="flex flex-col">
      {watcher.map((watcher) => (
        <div
          key={watcher.id}
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
            <a href="#" className="focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="text-xs font-medium text-gray-900">
                {watcher.displayName}
              </p>
              <p className="text-xs text-gray-500 truncate">{watcher.email}</p>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
