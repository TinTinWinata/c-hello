import React from "react";
import Navbar from "../Component/Navbar";
import RegisterForm from "../Component/RegisterForm";


function Register() {return (
  <React.Fragment>
      <Navbar></Navbar>
      <div class="relative border border-sky-500 w-50 h-screen">
      <RegisterForm></RegisterForm>
      </div>
  </React.Fragment>
  );
}

export default Register;
