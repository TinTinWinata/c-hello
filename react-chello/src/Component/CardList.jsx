import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../Config/firebase-config";
import { cardCollectionRef } from "../Library/firebase.collections";
import moment from "moment";

export default function CardList(props) {
  const board = props.board;
  const boardId = board.id;
  const [cards, setCard] = useState([]);
  const [date, setDate] = useState("");

  useEffect(() => {
    const q = query(cardCollectionRef, where("boardId", "==", boardId));

    const unsubscribe = onSnapshot(q, (doc) => {
      setCard(doc.docs.map((docs) => ({ ...docs.data(), id: docs.id })));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  function getDate(card) {
    if (card) return moment(card.date).format("MMM do YY");
    else return "";
  }

  return (
    <>
      {cards.length > 0 ? (
        <div className="ml-10 mt-10 mb-10 flex flex-col w-full">
          <div className="ml-3 mt-3 mb-3 font-bold text-gray-800">
            {board.name} Board Card
          </div>
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className=" py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200 w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Description
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Comment
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {cards.map((card) => {
                      var length = 0;
                      if (card.commentList) {
                        length = card.commentList.length;
                      }
                      return (
                        <tr key={card.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {card.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {card.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getDate(card)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {length}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <a
                              href="#"
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
