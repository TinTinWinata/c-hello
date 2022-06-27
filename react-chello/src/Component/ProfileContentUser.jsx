import React, { createRef, useEffect, useState } from "react";
import Select from "react-select";
import SwitchToggle from "../Layout/Switch";
import { useUserAuth } from "../Library/UserAuthContext";
import { toastError, toastSuccess } from "../Model/Toast";
import { updateUser, updateUserDb, updateUserOnDatabase } from "../Model/User";

const option = [
  {
    value: "Instanly",
    label: "Instanly",
  },
  {
    value: "Periodically",
    label: "Periodicaly",
  },
  {
    value: "Never",
    label: "Never",
  },
];

export default function ProfileContentUser({ user }) {
  const userDb = user;

  return (
    // <!-- This example requires Tailwind CSS v2.0+ -->
    <>
      <div className="mt-20 border-t border-gray-200 w-4/6 mx-auto">
        <dl className="divide-y divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Full name</dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div
                className="flex-grow"
                defaultValue={user ? user.displayName : ""}
              ></div>
              <span className="ml-4 flex-shrink-0"></span>
            </dd>
          </div>
          <div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <p className="flex-grow">{user.email}</p>
              <span className="ml-4 flex-shrink-0"></span>
            </dd>
          </div>
          <div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Age</dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div
                className="flex-grow"
                defaultValue={userDb ? userDb.age : ""}
              ></div>
              <span className="ml-4 flex-shrink-0"></span>
            </dd>
          </div>
          <div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Education</dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div
                className="flex-grow"
                defaultValue={userDb ? userDb.education : ""}
              ></div>
              <span className="ml-4 flex-shrink-0"></span>
            </dd>
          </div>
          <div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">About</dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div
                defaultValue={userDb ? userDb.about : ""}
                className="flex-grow"
              ></div>
            </dd>
          </div>
          <div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Notification</dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div className="flex-grow"></div>
              <span className="ml-4 flex-shrink-0"></span>
            </dd>
          </div>
          <div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">
              Notification Privacy
            </dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div className="flex-grow">
                {userDb ? userDb.notificationFrequency : ""}
              </div>
            </dd>
          </div>
        </dl>
      </div>
    </>
  );
}
