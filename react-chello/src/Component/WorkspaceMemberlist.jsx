import { getAuth } from "firebase/auth";
import {
  documentId,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Avatar from "../Layout/Avatar";
import {
  userCollectionRef,
  workspaceCollectionRef,
} from "../Library/firebase.collections";
import { useUserAuth } from "../Library/UserAuthContext";

export default function WorkspaceMemberlist({ role }) {
  const location = useLocation();
  const [member, setMember] = useState([]);
  const [admin, setAdmin] = useState([]);
  const { id } = useParams();
  // const [refresh, setRefresh] = useState([]);

  const addMember = (newMember) => {
    setMember((oldArray) => [...oldArray, newMember]);
  };

  const addAdmin = (newMember) => {
    setAdmin((oldArray) => [...oldArray, newMember]);
  };

  useEffect(() => {
    const q = query(workspaceCollectionRef, where(documentId(), "==", id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.docs[0]) {
        snapshot.docs[0].data().memberId.map((memberId) => {
          const q2 = query(userCollectionRef, where("userId", "==", memberId));
          setMember([]);
          getDocs(q2).then((snapshot2) => {
            const currentUser = snapshot2.docs[0].data();
            addMember(currentUser);
          });
        });
        snapshot.docs[0].data().adminId.map((memberId) => {
          const q2 = query(userCollectionRef, where("userId", "==", memberId));
          setAdmin([]);
          getDocs(q2).then((snapshot2) => {
            const currentUser = snapshot2.docs[0].data();
            addAdmin(currentUser);
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
      {member.length > 0 ? (
        <div className="font-bold text-2xl mb-5 mt-10">Member List</div>
      ) : (
        ""
      )}

      <ul>
        {member.map((member, index) => {
          return (
            <li className="mb-5" key={index}>
              <Avatar
                url={"/profile/" + member.userId}
                link={member.photoUrl}
                name={member.displayName}
              ></Avatar>
            </li>
          );
        })}
      </ul>
      <ul>
        {admin.length > 0 ? (
          <div className="font-bold text-2xl mb-5 mt-10">Admin List</div>
        ) : (
          ""
        )}
        {admin.map((member, index) => {
          return (
            <li className="mb-5" key={index}>
              <Avatar
                url={"/profile/" + member.userId}
                link={member.photoUrl}
                name={member.displayName}
              ></Avatar>
            </li>
          );
        })}
      </ul>
    </>
  );
}
