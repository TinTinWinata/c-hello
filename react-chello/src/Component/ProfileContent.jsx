import React, { createRef, useEffect, useState } from "react";
import SwitchToggle from "../Layout/Switch";
import { useUserAuth } from "../Library/UserAuthContext";
import { toastError, toastSuccess } from "../Script/Toast";
import { updateUser, updateUserOnDatabase } from "../Script/User";

export default function ProfileContent(props) {
  var user = props.user;
  var refreshPage = props.refreshPage;
  const { userDb } = useUserAuth();
  const mottoInput = createRef();
  const nameInput = createRef();
  const emailInput = createRef();
  const aboutInput = createRef();
  const educationInput = createRef();

  function handleUpdate() {
    const age = mottoInput.current.value;
    updateUserOnDatabase(user.uid, { age: age })
      .then(() => {
        toastSuccess("Success Updating Age");
      })
      .catch((e) => {
        toastError("Error Updating User ", e.message);
      });
  }

  function handleUpdateName() {
    user.displayName = nameInput.current.value;
    updateUser(user)
      .then(() => {
        refreshPage();
        const changes = { displayName: nameInput.current.value };
        updateUserOnDatabase(user.uid, changes)
          .then(() => {
            toastSuccess("Success Updating Username");
          })
          .catch((e) => {
            toastError("Error Updating Username ", e.message);
          });
      })
      .catch((e) => {
        console.log("error updating user ", e.message);
      });
  }

  function handleUpdateEducation() {
    const education = educationInput.current.value;
    updateUserOnDatabase(user.uid, { education: education })
      .then(() => {
        toastSuccess("Success Updating Education");
      })
      .catch((e) => {
        toastError("Error Updating Education ", e.message);
      });
  }

  function handleUpdateAbout() {
    const about = aboutInput.current.value;
    updateUserOnDatabase(user.uid, { about: about })
      .then(() => {
        toastSuccess("Success Updating About");
      })
      .catch((e) => {
        toastError("Error Updating About ", e.message);
      });
  }

  return (
    // <!-- This example requires Tailwind CSS v2.0+ -->
    <>
      <div className="mt-20 border-t border-gray-200 w-4/6 mx-auto">
        <dl className="divide-y divide-gray-200">
          <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Full name</dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <input
                ref={nameInput}
                className="flex-grow"
                defaultValue={user ? user.displayName : ""}
              ></input>
              <span className="ml-4 flex-shrink-0">
                <button
                  onClick={handleUpdateName}
                  type="button"
                  className="bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Update
                </button>
              </span>
            </dd>
          </div>
          <div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <p className="flex-grow">{user.email}</p>
              <span className="ml-4 flex-shrink-0">
                {/* <button
                  onClick={handleUpdateEmail}
                  type="button"
                  className="bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Update
                </button> */}
              </span>
            </dd>
          </div>
          <div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Age</dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <input
                ref={mottoInput}
                className="flex-grow"
                defaultValue={userDb ? userDb.age : ""}
              ></input>
              <span className="ml-4 flex-shrink-0">
                <button
                  onClick={handleUpdate}
                  type="button"
                  className="bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Update
                </button>
              </span>
            </dd>
          </div>
          <div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Education</dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <input
                ref={educationInput}
                className="flex-grow"
                defaultValue={userDb ? userDb.education : ""}
              ></input>
              <span className="ml-4 flex-shrink-0">
                <button
                  onClick={handleUpdateEducation}
                  type="button"
                  className="bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Update
                </button>
              </span>
            </dd>
          </div>
          <div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">About</dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <input
                ref={aboutInput}
                defaultValue={userDb ? userDb.about : ""}
                className="flex-grow"
              ></input>
              <span className="ml-4 flex-shrink-0">
                <button
                  onClick={handleUpdateAbout}
                  type="button"
                  className="bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Update
                </button>
              </span>
            </dd>
          </div>
          <div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Notification</dt>
            <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div className="flex-grow"></div>
              <span className="ml-4 flex-shrink-0">
                <SwitchToggle></SwitchToggle>
              </span>
            </dd>
          </div>
          {/* <div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
            <dt className="text-sm font-medium text-gray-500">Attachments</dt>
          </div> */}
        </dl>
      </div>
    </>
  );
}
