import { Input } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import FriendProfileItem from "../Components/friendProfileItem";
import LoadingContent from "../Components/loadingContent";
import { IUserProfile } from "../interfaces";
import AuthService from "../Services/authService";
import { getAllProfiles, getFriendsProfilesByIds, getUserFriends } from "../Services/friendsService";
import { WorkoutContext } from "../Context/workoutProvider";

const Friends: React.FC = () => {
  const [user] = useAuthState(AuthService.auth);
  const [existingFriends, setExistingFriends] = useState<IUserProfile[] | null>(null);
  const [existingFriendsArray, setExistingFriendsArray] = useState<string[] | null>(null);
  const [allProfiles, setAllProfiles] = useState<IUserProfile[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [filteredProfiles, setfilteredProfiles] = useState<IUserProfile[]>([]);
  const { storeFriendsProfiles } = useContext(WorkoutContext);

  //functions for search
  const setSearchValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const filteredList: IUserProfile[] =
    filteredProfiles &&
    filteredProfiles.filter((profile) => {
      return (
        (profile.name.toLowerCase().includes(searchInput.toLocaleLowerCase()) ||
          profile.surname.toLowerCase().includes(searchInput.toLowerCase())) &&
        existingFriendsArray &&
        !existingFriendsArray.includes(profile.userId)
      );
    });

  //Set existingFriendsArray and allProfiles
  async function setStates(): Promise<void> {
    await setAllProfilesArray();
    await setfriendsIDArray();
  }

  async function setAllProfilesArray(): Promise<void> {
    if (user) {
      const allProfilesArray: IUserProfile[] | null = await getAllProfiles();
      if (allProfilesArray) {
        setAllProfiles(allProfilesArray);
        setfilteredProfiles(
          allProfilesArray.filter((profile) => {
            return profile.userId !== user.uid;
          })
        );
      }
    }
  }

  async function setfriendsIDArray(): Promise<void> {
    if (user) {
      const friendsIDArray: string[] | null = await getUserFriends(user.uid);
      if (friendsIDArray) {
        setExistingFriendsArray(friendsIDArray);
      }
    }
  }

  //updates exisitingFriends when existtingFriendsArray changes
  useEffect(() => {
    if (existingFriendsArray && existingFriendsArray.length > 0) {
      const friendsArray: IUserProfile[] = allProfiles.filter((profile) => {
        return existingFriendsArray.includes(profile.userId);
      });
      setExistingFriends(friendsArray);
    } else {
      setExistingFriends([]);
    }
    return () => {
      async function updateFriendsProfiles() {
        console.log("yooo", existingFriendsArray);
        if (existingFriendsArray) {
          const profiles = await getFriendsProfilesByIds(existingFriendsArray);
          profiles && storeFriendsProfiles(profiles);
        }
      }
      updateFriendsProfiles();
    };
  }, [existingFriendsArray]);

  useEffect(() => {
    let mounted: boolean = true;
    if (user && mounted) {
      setStates();
    }
    return () => {
      mounted = false;
    };
  }, [user]);

  return (
    <div className="pages-Div">
      <div className="list_title">
        <h2>Your friends</h2>
      </div>
      <div
        style={{ minHeight: "180px", width: "100%", display: "flex", flexDirection: "column", marginBottom: "1rem" }}>
        {!existingFriendsArray || !existingFriends ? <LoadingContent /> : null}
        {existingFriends && existingFriends.length > 0
          ? existingFriends.map((profile) => {
              return (
                <FriendProfileItem
                  key={existingFriends.indexOf(profile)}
                  profile={profile}
                  list="friends"
                  setExistingFriendsArray={setExistingFriendsArray}
                />
              );
            })
          : null}
        {existingFriendsArray && existingFriendsArray.length === 0 ? <p>No friends yet</p> : null}
      </div>

      <div className="list_title">
        <h2>Add new friends</h2>
      </div>
      <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
        <Input
          placeholder="Search..."
          allowClear
          onChange={setSearchValue}
          style={{ width: "90vw", marginBottom: "1em" }}
        />
      </div>
      <div style={{ marginBottom: "1em", width: "100%" }}>
        {filteredProfiles.length > 0 ? (
          filteredList.map((profile) => {
            return (
              <FriendProfileItem
                key={allProfiles.indexOf(profile)}
                profile={profile}
                list="add"
                setExistingFriendsArray={setExistingFriendsArray}
              />
            );
          })
        ) : (
          <LoadingContent />
        )}
      </div>
    </div>
  );
};

export default Friends;
