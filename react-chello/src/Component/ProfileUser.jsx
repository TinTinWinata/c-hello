import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUserAuth } from "../Library/UserAuthContext";
import { getUser } from "../Model/User";
import { LoadingScreen } from "./LoadingScreen";
import Navbar from "./Navbar";
import ProfileContent from "./ProfileContent";
import ProfileContentUser from "./ProfileContentUser";
import ProfileHeader from "./ProfileHeader";
import ProfileHeaderUser from "./ProfileHeaderUser";

export default function ProfileUser() {
  const [user, setUser] = useState();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    getUser(id).then((doc) => {
      const user = { ...doc.docs[0].data(), id: doc.docs[0].id };
      setUser(user);
    });
  }, []);

  return (
    <>
      <Navbar></Navbar>
      {loading ? (
        <LoadingScreen></LoadingScreen>
      ) : (
        <>
          <ProfileHeaderUser user={user} />
          <ProfileContentUser user={user} />
        </>
      )}
    </>
  );
}
