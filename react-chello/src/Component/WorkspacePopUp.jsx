import React, { useEffect, useState } from "react";
import { useUserAuth } from "../Library/UserAuthContext";
import { toastSuccess } from "../Model/Toast";
import { insertWorkspace } from "../Model/Workspace";
import CreateWorkspaceInviteMember from "./CreateWorkspaceInviteMember";
import InviteWorkspaceMember from "./InviteWorkspaceMember";
import "./WorkspacePopUp.css";

function WorkspacePopUp(props) {
  const { userDb } = useUserAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [showAfter, setShowAfter] = useState(false);
  const [docId, setDocId] = useState();

  function createWorkspace(e) {
    e.preventDefault();
    const name = e.target.name.value;
    const detail = e.target.detail.value;
    const languange = e.target.languange.value;
    const country = e.target.country.value;

    if (name == "" || detail == "" || languange == "") {
      setErrorMessage("please input all fields!");
    } else if (name.length > 20) {
      setErrorMessage("name length can't more than 20");
    } else {
      insertWorkspace(name, detail, languange, country, userDb).then((doc) => {
        toastSuccess("Succesfully insert workspace : ", doc);
        setDocId(doc);
        setShowAfter(true);
      });
    }
  }

  function exitPopup() {
    props.setTrigger(false);
    setErrorMessage("");
  }

  return props.trigger ? (
    <React.Fragment>
      <div className="z-20 fixed w-screen h-screen bg-black opacity-70"></div>
      <div className="z-20 fixed overflow-y-auto w-screen h-screen">
        <div className="z-100 overflow-y-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-10">
          {showAfter ? (
            <CreateWorkspaceInviteMember
              setShowAfter={setShowAfter}
              setTrigger={props.setTrigger}
              id={docId}
            ></CreateWorkspaceInviteMember>
          ) : (
            <>
              <svg
                onClick={exitPopup}
                className="cursor-pointer opacity-80 exit-popup absolute close transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <form className="w-full max-w-lg " onSubmit={createWorkspace}>
                <div className="font-bold text-3xl ">
                  {" "}
                  Let's build a Workspace
                </div>
                <div className="text-label mb-10 mt-2">
                  Boost your productivity by making it easier for everyone to
                  access boards in one location.
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-first-name"
                    >
                      Workspace Name
                    </label>
                    <input
                      name="name"
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                      id="grid-first-name"
                      type="text"
                      placeholder=""
                    />
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                  <div className="w-full px-3">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-password"
                    >
                      Workspace Detail
                    </label>
                    <input
                      name="detail"
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-password"
                      placeholder=""
                    />
                    <p className="text-gray-600 text-xs italic">
                      Make it as long and as crazy as you'd like
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-2">
                  <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-city"
                    >
                      Languange
                    </label>
                    <input
                      name="languange"
                      className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                      id="grid-city"
                      type="text"
                      placeholder=""
                    />
                  </div>
                  <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                    <label
                      className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                      htmlFor="grid-state"
                    >
                      Country
                    </label>
                    <div className="relative">
                      <select
                        name="country"
                        className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                        id="grid-state"
                      >
                        <option>Asia</option>
                        <option>Africa</option>
                        <option>North America</option>
                        <option>South America</option>
                        <option>Europe</option>
                        <option>Australia</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg
                          className="fill-current h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-red-500 text-xs italic">{errorMessage}</p>
                <button
                  type="submit"
                  className="mt-10 w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                >
                  Create Workspace
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </React.Fragment>
  ) : (
    ""
  );
}

export default WorkspacePopUp;
