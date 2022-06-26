import { onSnapshot } from "firebase/firestore";
import React, { createRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import uuid from "react-uuid";
import { userCollectionRef } from "../Library/firebase.collections";
import { useUserAuth } from "../Library/UserAuthContext";
import { insertNotification } from "../Model/Notification";
import { toastError, toastSuccess } from "../Model/Toast";
import { getUserByEmail, updateUserDb } from "../Model/User";
import { getWebId } from "../Model/Util";
import { addWorkspaceIL, getWorkspaceById } from "../Model/Workspace";

export default function CreateWorkspaceInviteMember({
  id,
  setTrigger,
  setShowAfter,
}) {
  const [link, setLink] = useState("");
  const [workspace, setWorkspace] = useState();
  const { user } = useUserAuth();
  const emailRef = createRef();

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

  function handleSkip() {
    setShowAfter(false);
    setTrigger(false);
  }

  function handleButton() {
    addWorkspaceIL(id).then((docRef) => {
      const link = "/invite-link/" + docRef.id;
      toastSuccess("Coppied to clipboard!");
      navigator.clipboard.writeText(link);
      setShowAfter(false);
      setTrigger(false);
    });
  }

  function checkAlreadyInWorkspace(user) {
    let returnValue = false;
    if (workspace) {
      workspace.memberId.map((memberId) => {
        if (memberId == user.userId) {
          returnValue = true;
          return;
        }
      });
      workspace.adminId.map((adminId) => {
        if (adminId == user.userId) {
          returnValue = true;
          return;
        }
      });
    } else {
      toastError("Too fast darling!");
      returnValue = true;
    }
    return returnValue;
  }

  function checkAlreadyInvite(user, notification) {
    let returnValue = false;
    user.notificationList.map((notif) => {
      if (notif.wsId === undefined) return;
      if (notif.wsId == notification.wsId) {
        returnValue = true;
        return;
      }
    });
    return returnValue;
  }

  function handleByEmail() {
    const selectedEmail = emailRef.current.getValue();
    const userEmail = selectedEmail[0].value;

    if (!userEmail || userEmail == "") {
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

        if (!checkAlreadyInWorkspace(recipient)) {
          addWorkspaceIL(id).then((docRef) => {
            const link = "/invite-link/" + docRef.id;
            const notification = {
              senderId: user.uid,
              value:
                "I invite you to join this " + workspace.name + " workspace",
              userId: recipient.userId,
              type: "invite-worksace",
              link: link,
              id: uuid(),
              wsId: id,
            };
            if (checkAlreadyInvite(recipient, notification)) {
              toastError("User already invited!");
              return;
            } else {
              let userNotif = recipient.notificationList;
              if (!userNotif) userNotif = [];
              userNotif = [...userNotif, notification];
              recipient.notificationList = userNotif;
              console.log("recipient : ", recipient);
              updateUserDb(recipient).then(() => {
                toastSuccess("Succesfully invited user!");
                setTrigger(false);
                setShowAfter(false);
              });
            }
          });
        } else {
          toastError("User already in the workspace!");
          return;
        }
      })
      .catch((err) => {
        toastError("error getting email : ", err.message);
      });
  }

  return (
    <>
      <div className="px-10 py-20">
        <h1 className="font-bold text-gray-700 text-3xl">
          Invite to Workspace
        </h1>
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
        <p className="text-gray-500 mt-1 text-sm text-">
          You can generate link below
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
        <p
          onClick={handleSkip}
          className="cursor-pointer text-gray-500 text-sm mt-1"
        >
          Or you can skip this process
        </p>
      </div>
    </>
  );
}
