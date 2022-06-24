import React, { useEffect, useState } from "react";
import { getUser, updateUserDb } from "../Model/User";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import { deleteNotificationWithId } from "../Model/Notification";
import { useUserAuth } from "../Library/UserAuthContext";

function classNames(...classes) {
  return classes.filter(Boolean).join("");
}

export default function NotificationList({ notification }) {
  const { userDb } = useUserAuth();
  const navigate = useNavigate();

  function handleOnClick(currSn) {
    const notificationId = currSn.id;
    navigate(currSn.link);
    const tempNotif = userDb.notificationList;

    let idx = 0;
    let deletedNotif = [];
    tempNotif.map((notif) => {
      if (notif.id == currSn.id) {
        return;
      }
      deletedNotif.push(notif);
    });
    console.log("deleted notif : ", deletedNotif);
    userDb.notificationList = deletedNotif;
    updateUserDb(userDb);
  }

  const [user, setUser] = useState("User");
  useEffect(() => {
    getUser(notification.senderId).then((snap) => {
      setUser(snap.docs[0].data());
    });
  }, []);

  return (
    <React.Fragment>
      <Menu.Item>
        {({ active }) => (
          <div
            onClick={() => {
              handleOnClick(notification);
            }}
            className={
              (active ? "bg-gray-800" : "",
              "block px-4 py-2 text-sm text-gray-700 cursor-pointer")
            }
          >
            <h1 className="font-bold mb-2">{user ? user.displayName : ""}</h1>
            <p> {notification.value}</p>
          </div>
        )}
      </Menu.Item>
    </React.Fragment>
  );
}
