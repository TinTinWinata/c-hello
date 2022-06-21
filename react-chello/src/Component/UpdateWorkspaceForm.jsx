import React, { createRef, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getWorkspaceById,
  updateWorkspace,
  updateWorkspaceById,
} from "../Script/Workspace";
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { toastError, toastSuccess } from "../Script/Toast";
import WorkspaceMemberlist from "./WorkspaceMemberlist";
import UpdateWorkspaceMemberList from "./UpdateWorkspaceMemberList";

const visibility = [
  { id: 1, name: "Public" },
  { id: 2, name: "Private" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function UpdateWorkspaceForm() {
  const [ws, setWs] = useState();
  const [selected, setSelected] = useState(visibility[1]);
  const { id } = useParams();
  const desc = createRef();
  const name = createRef();

  function handleOnUpdate() {
    const iDesc = desc.current.value;
    const iName = name.current.value;

    if (iDesc == "" || iName == "") {
      toastError("Please input all fields!");
    }

    ws.name = iName;
    ws.detail = iDesc;
    ws.visibility = selected.name;

    updateWorkspaceById(id, ws)
      .then(() => {
        toastSuccess("Success update a workspace");
      })
      .catch((e) => {
        toastError("Error updating a workspace " + e.message);
      });
  }

  useEffect(() => {
    getWorkspaceById(id).then((ws, id) => {
      if (ws.visibility == "Public") setSelected(visibility[0]);
      else if (ws.visibility == "Private") setSelected(visibility[1]);

      setWs(ws);
    });
    return () => {};
  }, []);

  return (
    <>
      <h3 className="mb-4 text-xl font-medium text-gray-900">
        Update Workspace
      </h3>
      <div className="addWorkspace space-y-6">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900">
            Workspace Name
          </label>
          <input
            ref={name}
            type="text"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5  "
            placeholder="New Name"
            name="workspaceName"
            required
          ></input>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 ">
            Workspace Description
          </label>
          <textarea
            ref={desc}
            type="text"
            placeholder="New Description"
            className="border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5  min-h-[200px] max-h-[300px]"
            name="workspaceDescription"
            required
          ></textarea>
        </div>
        <div>
          <Listbox value={selected} onChange={setSelected}>
            {({ open }) => (
              <>
                <Listbox.Label className="block text-sm font-medium text-gray-700">
                  Assigned to
                </Listbox.Label>
                <div className="mt-1 relative">
                  <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <span className="block truncate">{selected.name}</span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <SelectorIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>

                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options
                      static
                      className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
                    >
                      {visibility.map((person) => (
                        <Listbox.Option
                          key={person.id}
                          className={({ active }) =>
                            classNames(
                              active
                                ? "text-white bg-indigo-600"
                                : "text-gray-900",
                              "cursor-default select-none relative py-2 pl-3 pr-9"
                            )
                          }
                          value={person}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={classNames(
                                  selected ? "font-semibold" : "font-normal",
                                  "block truncate"
                                )}
                              >
                                {person.name}
                              </span>

                              {selected ? (
                                <span
                                  className={classNames(
                                    active ? "text-white" : "text-indigo-600",
                                    "absolute inset-y-0 right-0 flex items-center pr-4"
                                  )}
                                >
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </>
            )}
          </Listbox>
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 ">
            Member List
          </label>
          <UpdateWorkspaceMemberList ws={ws}></UpdateWorkspaceMemberList>
        </div>

        <button
          onClick={handleOnUpdate}
          className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center"
        >
          Update
        </button>
      </div>
    </>
  );
}
