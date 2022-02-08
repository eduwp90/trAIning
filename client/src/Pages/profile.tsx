import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { IDatesResponse } from "../interfaces";
import AuthService from "../Services/authService";
import { getUserProfile } from "../Services/dbService";

const Profile: React.FC = () => {
  const [user] = useAuthState(AuthService.auth);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    let mounted = true;
    let userProfile:IDatesResponse | undefined;
    const getUserInfo = async () => {
      if (user && mounted) {
        userProfile = await getUserProfile(user.uid);
      }
      if (userProfile && mounted) {
        setProfile(userProfile);
      }
    };
    getUserInfo();
    return () => {
      mounted = false;
    };
  });

  return ({profile && profile.name && <div>{profile.name}</div>});
};

export default Profile;
