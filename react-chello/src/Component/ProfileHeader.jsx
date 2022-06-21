import { LockClosedIcon } from "@heroicons/react/solid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { createRef, useState } from "react";
import { storage } from "../Config/firebase-config";
import { useUserAuth } from "../Library/UserAuthContext";
import { updateUserOnDatabase } from "../Script/User";
import ChangePassword from "./ChangePassword";
import "react-toastify/dist/ReactToastify.css";

export default function ProfileHeader(props) {
  const user = props.user;
  const refreshPage = props.refreshPage;
  const userDb = props.userDb;
  const changePassword = props.changePassword;
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  // const [show, setShow] = useState(true);

  const password = createRef();

  function handleChangePassword() {
    setOpen(true);
  }

  function handleChangePasswordConfirmation() {
    console.log("passwowrd : ", password.current.value);
    const currPw = password.current.value;
    changePassword(currPw)
      .then(() => {
        console.log("succesfully change password : ", currPw);
        toast.success("Succesfully change password!", {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      })
      .catch((error) => {
        toast.error(error.message, {
          position: toast.POSITION.BOTTOM_LEFT,
        });
      });
  }

  const uploadImage = (img) => {
    if (img == null) {
      console.log("image is null!");
      return;
    }

    const link = user.uid + "/" + img.name;
    const imageRef = ref(storage, link);
    uploadBytes(imageRef, img)
      .then(() => {
        getDownloadURL(ref(storage, link)).then((url) => {
          const changes = { photoUrl: url };
          updateUserOnDatabase(user.uid, changes).then(() => {
            refreshPage();
            console.log("succed upload save image");
          });
        });
      })
      .catch((e) => {
        console.log("error uploading image: " + e.message);
      });
  };

  function handleOnChange(e) {
    const img = e.target.files[0];
    uploadImage(img);
  }

  return (
    <>
      <ChangePassword
        handleChangePasswordConfirmation={handleChangePasswordConfirmation}
        open={open}
        setOpen={setOpen}
      ></ChangePassword>
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
              <input
                className="hidden"
                id="file-input"
                type="file"
                name="myImage"
                accept="image/png, image/gif, image/jpeg"
                onChange={handleOnChange}
              ></input>
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
                  {user.displayName}
                </h1>
              </div>
              <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                <input
                  ref={password}
                  className="pl-3 text-gray-500 rounded-3xl border-2 "
                  type="password"
                />
                <button
                  onClick={handleChangePassword}
                  type="button"
                  className="inline-flex justify-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  {/* <!-- Heroicon name: solid/mail --> */}
                  {/* <svg
                  className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                  >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg> */}
                  <LockClosedIcon className="w-5 h-5 mr-2"></LockClosedIcon>
                  <span>Change Password</span>
                </button>
              </div>
            </div>
          </div>
          <div className="hidden sm:block 2xl:hidden mt-6 min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-gray-900 truncate">
              {user.displayName}
            </h1>
          </div>
        </div>
      </div>
    </>
  );
}
