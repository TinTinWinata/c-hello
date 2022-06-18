import { getAuth } from "firebase/auth";
import { documentId, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Avatar from "../Layout/Avatar";
import {
  userCollectionRef,
  workspaceCollectionRef,
} from "../Library/firebase.collections";
import { useUserAuth } from "../Library/UserAuthContext";
import { getWebId } from "../Script/Util";

export default function WorkspaceMemberlist() {
  const location = useLocation();
  const [member, setMember] = useState([]);
  const { user } = useUserAuth();

  const addMember = (newMember) => {
    setMember((oldArray) => [...oldArray, newMember]);
  };

  useEffect(() => {
    const id = getWebId();
    const q = query(workspaceCollectionRef, where(documentId(), "==", id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.docs[0]) {
        snapshot.docs[0].data().memberId.map((memberId) => {
          const q2 = query(userCollectionRef, where("userId", "==", memberId));
          onSnapshot(q2, (snapshot2) => {
            const currentUser = snapshot2.docs[0].data();
            addMember(currentUser);
          });
        });
      }
    });
    return () => {
      setMember([]);
      unsubscribe();
    };
  }, [location]);

  return (
    <>
      <ul>
        {member.map((member, index) => {
          return (
            <li className="mb-5" key={index}>
              <Avatar name={member.displayName}></Avatar>
            </li>
          );
        })}
      </ul>
    </>
  );
}
