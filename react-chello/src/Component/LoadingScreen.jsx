import React from "react";
import ReactLoading from "react-loading";

export function LoadingScreen() {
  return (
    <React.Fragment>
      <div className="fixed w-screen h-screen bg-black opacity-50"></div>
      <ReactLoading
        className="z-10 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        type="bars"
        color="white"
        height={"10%"}
        width={"10%"}
      ></ReactLoading>
    </React.Fragment>
  );
}
