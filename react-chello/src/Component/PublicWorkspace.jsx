import { EyeIcon } from "@heroicons/react/outline";
import { onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { workspaceCollectionRef } from "../Library/firebase.collections";

export default function PublicWorkspace() {
  const [workspace, setWorkspace] = useState([]);

  useEffect(() => {
    const q = query(
      workspaceCollectionRef,
      where("visibility", "==", "Public")
    );
    const unsub = onSnapshot(q, (doc) => {
      setWorkspace(doc.docs.map((docs) => ({ ...docs.data(), id: docs.id })));
    });
    return () => {
      unsub();
    };
  }, []);

  return (
    <div className="ml-10 mt-10 flex flex-col w-full">
      <div className="ml-3 mt-3 mb-3 font-bold text-gray-800">
        Public Workspace
      </div>
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className=" py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Role
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workspace.map((ws) => (
                  <tr key={ws.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {ws.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ws.detail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ws.languange}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ws.country}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={"/workspace/" + ws.id}
                        replace
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <EyeIcon className="w-5 h-5"></EyeIcon>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
