import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../Config/firebase-config";
import { Link } from "react-router-dom";

const auth = getAuth();

function WorkspaceComponent(props) {
  const [workspaceAdminList, setWorkspaceAdmin] = useState([]);
  const [workspaceMemberList, setWorkspaceMember] = useState([]);

  const workspaceRef = collection(db, "workspace");

  async function get(id) {
    const q = query(workspaceRef, where("adminId", "array-contains", id));

    onSnapshot(q, (doc) => {
      setWorkspaceAdmin(
        doc.docs.map((docs) => ({ ...docs.data(), id: docs.id }))
      );
    });

    const q2 = query(workspaceRef, where("memberId", "array-contains", id));

    onSnapshot(q2, (doc) => {
      console.log("doc : ", doc);
      setWorkspaceMember(
        doc.docs.map((docs) => ({ ...docs.data(), id: docs.id }))
      );
    });
  }

  useEffect(() => {
    const getWorkspace = async () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in
          get(user.uid);
        } else {
          // User is signed out
        }
      });
    };
    getWorkspace();
  }, []);

  const renderAdminCard = (card) => {
    const link = "/workspace/" + card.id;
    return (
      <li key={card.id}>
        <Link
          to={link}
          replace
          className="flex items-center p-2 text-base font-normal text-grey-500 rounded-lg dark:text-black hover:bg-gray-100 dark:hover:bg-gray-200"
        >
          <div className="w-3 h-3 rounded-lg mr-2 bg-red-400"></div>
          <span className="mr-3">{card.name}</span>
        </Link>
      </li>
    );
  };

  const renderMemberCard = (card) => {
    const link = "/workspace/" + card.id;
    return (
      <li key={card.id}>
        <Link
          to={link}
          replace
          className="flex items-center p-2 text-base font-normal text-grey-500 rounded-lg dark:text-black hover:bg-gray-100 dark:hover:bg-gray-200"
        >
          <div className="w-3 h-3 rounded-lg mr-2 bg-black"></div>
          <span className="mr-3">{card.name}</span>
        </Link>
      </li>
    );
  };

  return (
    <>
      {workspaceAdminList.map(renderAdminCard)}
      {workspaceMemberList.map(renderMemberCard)}
    </>
  );
}

export default WorkspaceComponent;
