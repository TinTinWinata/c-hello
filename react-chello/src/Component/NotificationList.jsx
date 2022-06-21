import React, { useEffect, useState } from "react";
import { getUser } from "../Script/User";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Link, useNavigate } from "react-router-dom";
import { deleteNotificationWithId } from "../Script/Notification";

function classNames(...classes) {
  return classes.filter(Boolean).join("");
}

export default function NotificationList({ notification }) {
  const navigate = useNavigate();

  function handleOnClick(currSn) {
    const notificationId = currSn.id;
    navigate(currSn.link);
    deleteNotificationWithId(notificationId);
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
