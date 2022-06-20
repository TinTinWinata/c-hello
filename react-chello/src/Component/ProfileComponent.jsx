import React from "react";
import { useUserAuth } from "../Library/UserAuthContext";
import ProfileContent from "./ProfileContent";
import ProfileHeader from "./ProfileHeader";

export default function ProfileComponent() {
  const { userDb, user, refreshPage, changePassword } = useUserAuth();

  return (
    <>
      <ProfileHeader
        user={user}
        changePassword={changePassword}
        refreshPage={refreshPage}
        userDb={userDb}
      />
      <ProfileContent user={user} refreshPage={refreshPage} />
    </>
  );
}
