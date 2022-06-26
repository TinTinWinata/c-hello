import {
  ChatAltIcon,
  SortAscendingIcon,
  UsersIcon,
} from "@heroicons/react/solid";
import { getDoc, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Mention, MentionsInput } from "react-mentions";
import { userCollectionRef } from "../Library/firebase.collections";
import { getBoardById } from "../Model/Board";
import { getUser } from "../Model/User";
import DefaultStyle from "../Library/DefaultStyle";
import DefaultMentionStyle from "../Library/DefaultMentionStyle";
import { getWorkspaceById } from "../Model/Workspace";

export default function InputComment(props) {
  const handle = props.handle;
  const commentInput = props.commentInput;
  const cardClicked = props.cardClicked;
  const value = props.value;
  const setValue = props.setValue;

  const [data, setData] = useState([]);
  const [board, setBoard] = useState();
  const [workspace, setWorkspace] = useState();

  useEffect(() => {
    let unsub;
    let unsub2;

    if (workspace && board.visibility == "Workspace") {
      // Map member
      workspace.memberId.map((member) => {
        const q = query(userCollectionRef, where("userId", "==", member));
        unsub = onSnapshot(q, (doc) => {
          doc.docs.map((docs) => {
            const userDoc = { ...docs.data(), id: docs.id };
            const option = {
              id: userDoc.userId,
              display: userDoc.displayName,
            };

            setData((prev) => [...prev, option]);
          });
        });
      });

      // Map admin
      workspace.adminId.map((member) => {
        const q = query(userCollectionRef, where("userId", "==", member));
        unsub2 = onSnapshot(q, (doc) => {
          doc.docs.map((docs) => {
            const userDoc = { ...docs.data(), id: docs.id };
            const option = {
              id: userDoc.userId,
              display: userDoc.displayName,
            };
            setData((prev) => [...prev, option]);
          });
        });
      });
    }

    return () => {
      if (unsub) {
        unsub();
      }
      if (unsub2) {
        unsub2();
      }
    };
  }, [workspace]);


  useEffect(() => {
    if (board) {
      const wsId = board.workspaceId;
      getWorkspaceById(wsId).then((doc) => {
        setWorkspace(doc);
      });
    }

    return () => {};
  }, [board]);

  useEffect(() => {
    let unsub;
    let unsub2;
    if (cardClicked) {
      getBoardById(cardClicked.boardId).then((doc) => {
        const board = { ...doc.data(), id: doc.id };
        setBoard(board);

        // Map member
        board.memberId.map((member) => {
          const q = query(userCollectionRef, where("userId", "==", member));
          unsub = onSnapshot(q, (doc) => {
            doc.docs.map((docs) => {
              const userDoc = { ...docs.data(), id: docs.id };
              const option = {
                id: userDoc.userId,
                display: userDoc.displayName,
              };

              setData((prev) => [...prev, option]);
            });
          });
        });

        // Map admin
        board.adminId.map((member) => {
          const q = query(userCollectionRef, where("userId", "==", member));
          unsub2 = onSnapshot(q, (doc) => {
            doc.docs.map((docs) => {
              const userDoc = { ...docs.data(), id: docs.id };

              const option = {
                id: userDoc.userId,
                display: userDoc.displayName,
              };
              setData((prev) => [...prev, option]);
            });
          });
        });
      });
    }

    return () => {
      setData([]);
      if (unsub !== undefined) unsub();
      if (unsub2 !== undefined) unsub2();
    };
  }, [cardClicked]);


  // useEffect(() => {
  //   getBoardById(cardClicked.boardId).then((doc) => {
  //     setBoard({ ...doc.data(), id: doc.id });
  //   });
  // }, []);

  return (
    <div>
      <label
        htmlFor="email"
        className="block text-sm font-medium text-gray-700"
      ></label>
      <div className="mt-1 flex rounded-md shadow-sm">
        <div className="relative flex items-stretch flex-grow focus-within:z-10">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UsersIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>

          <MentionsInput
            style={DefaultStyle}
            onChange={(e) => {
              setValue(e.target.value);
            }}
            value={value}
            className="focus:ring-indigo-500
            block focus:border-indigo-500 ml-10  w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
            placeholder="Add a comment..."
          >
            <Mention
              style={DefaultMentionStyle}
              trigger="@"
              data={data}
            ></Mention>
          </MentionsInput>
        </div>
        <button
          onClick={() => {
            handle(value);
          }}
          className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <ChatAltIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          <span>Send</span>
        </button>
      </div>
    </div>
  );
}
