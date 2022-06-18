import React from "react";
import ListCardGroup from "../Component/ListCardGroup";
import Navbar from "../Component/Navbar";
import Sidebar from "../Component/Sidebar";

export default function Board() {
  return (
    <>
      <Navbar></Navbar>
      <div className="flex overflow-hidden bg-slate-200">
        <Sidebar></Sidebar>
        <ListCardGroup></ListCardGroup>
      </div>
    </>
  );
}
