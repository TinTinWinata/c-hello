import { onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../Config/firebase-config";

export default function WorkspaceList() {
  const [workspaceAdminList, setWorkspaceAdmin] = useState([]);
  const [workspaceMemberList, setWorkspaceMember] = useState([]);

  const workspaceRef = collection(db, "workspace");

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
    const getWorkspace = async () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in
          get(user.uid);
        } else {
          // User is signed out
        }
      });
    };
    getWorkspace();
  }, []);

  return (
    <>
      {workspaceAdminList.length + workspaceMemberList.length != 0 ? (
        <div className="ml-10 mt-10 flex flex-col w-full">
          <div className="ml-3 mt-3 mb-3 font-bold text-gray-800">
            My Workspace
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
                        Country
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Nation
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {workspaceAdminList.map((ws) => (
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
                          <a
                            href="#"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </a>
                        </td>
                      </tr>
                    ))}
                    {workspaceMemberList.map((ws) => (
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
                            to="#"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
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
      ) : (
        ""
      )}
    </>
  );
}
