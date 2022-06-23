import { onSnapshot } from "firebase/firestore";
import React, { createRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { userCollectionRef } from "../Library/firebase.collections";
import { useUserAuth } from "../Library/UserAuthContext";
import { insertNotification } from "../Script/Notification";
import { toastError, toastSuccess } from "../Script/Toast";
import { getUserByEmail } from "../Script/User";
import { getWebId } from "../Script/Util";
import { addWorkspaceIL, getWorkspaceById } from "../Script/Workspace";

export default function InviteWorkspaceMember() {
  const [link, setLink] = useState("");
  const [workspace, setWorkspace] = useState();
  const { user } = useUserAuth();
  const emailRef = createRef();
  const { id } = useParams();

  const [userList, setUserList] = useState("");
  const selectedList = createRef();

  useEffect(() => {
    const unsub = onSnapshot(userCollectionRef, (snap) => {
      let arrEmail = [];
      snap.docs.map((doc) => {
        const email = doc.data().email;
        const selectObject = { value: email, label: email };
        arrEmail.push(selectObject);
      });
      setUserList(arrEmail);
    });

    const snap = getWorkspaceById(id);
    snap.then((workspace) => {
      setWorkspace(workspace);
    });

    return () => {
      unsub();
    };
  }, []);

  function handleButton() {
    addWorkspaceIL(id).then((docRef) => {
      setLink("/invite-link/" + docRef.id);
    });
  }

  function handleByEmail() {
    const selectedEmail = emailRef.current.getValue();

    const userEmail = selectedEmail[0].value;

    if (!userEmail) {
      toastError("Email cannot be empty");
      return;
    }
    if (!user) {
      toastError("User is not setted");
      return;
    }

    getUserByEmail(userEmail)
      .then((snapshot) => {
        if (snapshot.docs.length == 0) {
          toastError("Cannot found user with that email");
          return;
        }

        const recipient = snapshot.docs[0].data();
        recipient.id = snapshot.docs[0].id;

        if (!workspace) {
          toastError("Your to fast!");
          return;
        }

        addWorkspaceIL(id).then((docRef) => {
          const link = "/invite-link/" + docRef.id;
          const notification = {
            senderId: user.uid,
            value: "I invite you to join this " + workspace.name + "workspace",
            userId: recipient.userId,
            type: "invite-worksace",
            link: link,
          };
          insertNotification(notification)
            .then(() => {
              toastSuccess("Succesfully invite to workspace");
            })
            .catch(() => {
              toastError("Failed to make a notification");
            });
        });
      })
      .catch((err) => {
        toastError("error getting email : ", err.message);
      });
  }

  return (
    <>
      <div className="w-full mt-5 sm:flex sm:items-center">
        <div className="w-full sm:max-w-xs">
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <Select
            className="basic-single"
            classNamePrefix="select"
            ref={emailRef}
            name="color"
            options={userList}
          />

          {/* <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="Email Member"
            ref={emailRef}
          /> */}
        </div>
        <button
          onClick={handleByEmail}
          className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Submit
        </button>
      </div>
      <p className="text-gray-500 mt-5 text-sm text-">
        Or you can generate link below
      </p>
      <label className="mt-1 block text-gray-700 text-sm font-bold mb-2">
        {link}
      </label>

      <button
        onClick={handleButton}
        className="mt-1 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
      >
        Generate Invite Link
      </button>
    </>
  );
}
