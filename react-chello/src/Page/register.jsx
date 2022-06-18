import React from "react";
import Navbar from "../Component/Navbar";
import RegisterForm from "../Component/RegisterForm";

function Register() {
  return (
    <>
      {/* <Navbar></Navbar> */}
      <div className="relative border border-sky-500 w-50 h-screen">
        <RegisterForm></RegisterForm>
      </div>
    </>
  );
}

export default Register;
