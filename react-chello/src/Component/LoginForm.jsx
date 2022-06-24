import "./LoginForm.css";
import { useState } from "react";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useUserAuth } from "../Library/UserAuthContext";
import { Link, useNavigate } from "react-router-dom";

const auth = getAuth();

function LoginForm() {
  const [errorMessage, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useUserAuth();

  async function loginHandle(e) {
    e.preventDefault();

    let email = e.target.email.value;
    let password = e.target.password.value;

    try {
      console.log("login");
      await login(email, password);
      navigate("/home");
    } catch (e) {
      setError(e.message);
    }

    //   signInWithEmailAndPassword(auth, email, password)
    // .then((userCredential) => {
    //   const user = userCredential.user;
    //   window.location.replace('/')
    // })
    // .catch((error) => {
    //   const errorCode = error.code;
    //   const errorMessage = error.message;
    //   setError(errorMessage)
    // });
  }

  return (
    <div className="w-full max-w-xs" id="registerForm">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={loginHandle}
      >
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <input
            name="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            type="text"
            placeholder="example@gmail.com"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Password
          </label>
          <input
            name="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            type="password"
            placeholder="******************"
          />
          <p className="text-red-500 text-xs italic">{errorMessage}</p>
        </div>
        <div className="flex flex-col items-center justify-between">
          <button
            type="submit"
            className="mb-1 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sign In
          </button>
          <div className="flex">
            <Link
              className="mr-1 inline-block align-baseline font-bold text-xs text-blue-500 hover:text-blue-800"
              to="/register"
            >
              Register
            </Link>
            <Link
              className="inline-block align-baseline font-bold text-xs text-blue-500 hover:text-blue-800"
              to="/home"
            >
              | Or Login with Guest
            </Link>
          </div>
        </div>
      </form>
      <p className="text-center text-gray-500 text-xs">
        &copy;2020 Acme Corp. All rights reserved.
      </p>
    </div>
  );
}

export default LoginForm;
