import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useUserAuth } from "../Library/UserAuthContext";

function profilePitcure(userDb) {
  const photoUrl = userDb
    ? userDb.photoUrl
    : "https://i.picsum.photos/id/66/200/200.jpg?hmac=gaKXe-rWmo5fSEm79TTkW_yFJLECw3FdRCh6Dm7jp4g";

  return (
    <>
      <Link to="/profile">
        <img
          className="ml-3 w-9 h-9 rounded-full cursor-pointer"
          src={photoUrl}
          alt="User"
        />
      </Link>
    </>
  );
}

function loginButton() {
  return (
    <>
      <a href="/login">
        <button className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded ml-3">
          Login
        </button>
      </a>
    </>
  );
}

export default function Profile({ userDb }) {
  const [profile, setProfile] = useState(loginButton);

  const { user } = useUserAuth();

  if (user) {
    return profilePitcure(userDb);
  } else {
    return loginButton();
  }
}
