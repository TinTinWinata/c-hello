import { LockClosedIcon } from "@heroicons/react/solid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { createRef, useState } from "react";
import { storage } from "../Config/firebase-config";
import { useUserAuth } from "../Library/UserAuthContext";
import { updateUserOnDatabase } from "../Model/User";
import ChangePassword from "./ChangePassword";
import "react-toastify/dist/ReactToastify.css";

export default function ProfileHeaderUser({ user }) {
  const userDb = user;
  return (
    <>
      <div>
        <div>
          <img
            className="cursor-pointer h-32 w-full object-cover lg:h-48"
            src="https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt=""
          />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:justify-between  sm:space-x-5">
            <div className="flex">
              <label htmlFor="file-input">
                <img
                  className="cursor-pointer h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
                  src={userDb.photoUrl}
                  alt=""
                />
              </label>
            </div>
            <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
              <div className="sm:hidden 2xl:block mt-6 min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-gray-900 truncate">
                  {userDb.displayName}
                </h1>
              </div>
            </div>
          </div>
          <div className="hidden sm:block 2xl:hidden mt-6 min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-gray-900 truncate">
              {userDb.displayName}
            </h1>
          </div>
        </div>
      </div>
    </>
  );
}
