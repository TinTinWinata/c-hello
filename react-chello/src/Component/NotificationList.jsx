import React, { useEffect, useState } from "react";
import { getUser } from "../Script/User";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";

function classNames(...classes) {
  return classes.filter(Boolean).join("");
}

export default function NotificationList({ notification }) {
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
          <Link
            to={notification.link}
            className={
              (active ? "bg-gray-800" : "",
              "block px-4 py-2 text-sm text-gray-700")
            }
          >
            <h1 className="font-bold mb-2">{user ? user.displayName : ""}</h1>
            <p> {notification.value}</p>
          </Link>
        )}
      </Menu.Item>
    </React.Fragment>
  );
}
