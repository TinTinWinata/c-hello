import React from "react";
import JoinWorkspaceForm from "./JoinWorkspaceForm";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function JoinWorkspace() {
  return (
    <>
      <Navbar></Navbar>
      <Sidebar></Sidebar>
      <JoinWorkspaceForm></JoinWorkspaceForm>
    </>
  );
}
