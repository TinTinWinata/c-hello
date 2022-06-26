import React, { createRef, useEffect, useState } from "react";
import { getWorkspaceById, insertWorkspace } from "../Model/Workspace";
import "./WorkspacePopUp.css";
import "./CreateBoardPopUp.css";
import { insertBoard } from "../Model/Board";
import { getWebId } from "../Model/Util";
import { useUserAuth } from "../Library/UserAuthContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Select from "react-select";
import { db } from "../Config/firebase-config";

function HomeBoardPopUp(props) {
  const [errorMessage, setErrorMessage] = useState("");
  const { userDb } = useUserAuth();

  const [workspaceAdminList, setWorkspaceAdmin] = useState([]);
  const [workspaceMemberList, setWorkspaceMember] = useState([]);
  const [option, setOption] = useState([]);
  const [workspace, setWorkspace] = useState([]);

  const newWs = createRef();

  const workspaceRef = collection(db, "workspace");

  useEffect(() => {
    if (workspace) {
      setOption(
        workspace.map((ws) => {
          const option = {
            value: ws.id,
            label: ws.name,
          };
          return option;
        })
      );
    }
  }, [workspace]);

  useEffect(() => {
    if (workspaceAdminList && workspaceMemberList) {
      setWorkspace([...workspaceMemberList, ...workspaceAdminList]);
    }
  }, [workspaceAdminList, workspaceMemberList]);

  async function get(id) {
    const q = query(workspaceRef, where("adminId", "array-contains", id));

    onSnapshot(q, (doc) => {
      setWorkspaceAdmin(
        doc.docs.map((docs) => ({ ...docs.data(), id: docs.id }))
      );
    });

    const q2 = query(workspaceRef, where("memberId", "array-contains", id));

    onSnapshot(q2, (doc) => {
      setWorkspaceMember(
        doc.docs.map((docs) => ({ ...docs.data(), id: docs.id }))
      );
    });
  }

  useEffect(() => {
    get(userDb.userId);
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const name = e.target.name.value;
    const tag = e.target.tag.value;
    const visibility = e.target.visibility.value;
    const tempRef = newWs.current.getValue();

    if (tempRef.length == 0) {
      setErrorMessage("You must select the workspace!");
      return;
    }

    const workspaceId = tempRef[0].value;

    if (name == "" || tag == "" || visibility == "" || workspaceId == "") {
      setErrorMessage("please input all fields!");
    } else if (workspaceId == "workspace") {
      setErrorMessage("please select at least one workspace");
    } else {
      insertBoard(name, tag, visibility, userDb, workspaceId);
      exitPopup();
    }
  }

  function exitPopup() {
    props.setTrigger(false);
  }

  return props.trigger ? (
    <React.Fragment>
      <div className="fixed w-screen h-screen bg-black opacity-50"></div>
      <div className="w-96 form-container top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 shadow-2xl fixed transform bg-white p-10">
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
        <form className="w-full form-popup" onSubmit={handleSubmit}>
          <div className="text-label mb-3 mt-2 italic">Create Board</div>
          <div className="flex flex-wrap -mx-3 mb-6">
            <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
              <label
                className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-first-name"
              >
                Board Name
              </label>
              <input
                name="name"
                className="appearance-none block w-max bg-gray-200 text-gray-700 border rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
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
                Board Tag
              </label>
              <input
                name="tag"
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
                htmlFor="grid-state"
              >
                Visibility
              </label>
              <div className="relative">
                <select
                  name="visibility"
                  className="block appearance-none w-max bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  id="grid-state"
                >
                  <option>Private</option>
                  <option>Workspace</option>
                  <option>Public</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 left-24 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
              <label
                className="mt-5 block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
                htmlFor="grid-state"
              >
                Workspace
              </label>
              <Select
                className="basic-single w-max"
                classNamePrefix="select"
                ref={newWs}
                name="color"
                options={option}
              ></Select>
            </div>
          </div>
          <p className="text-red-500 text-xs italic">{errorMessage}</p>
          <button
            type="submit"
            className="mt-10 w-full bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
          >
            Create Board
          </button>
        </form>
      </div>
    </React.Fragment>
  ) : (
    ""
  );
}

export default HomeBoardPopUp;
