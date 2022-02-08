import React, { createContext, useState } from "react";
import { IDatesResponse, ISet, IUserProfile, IWorkout, IWorkoutContext } from "../interfaces";
import { useStateWithLocalStorageForArray } from "../Services/customHookService";
const contextDefaultValues: IWorkoutContext = {
  existingWorkout: null,
  storeExistingWorkout: () => {},
  clearExistingWorkout: () => {},
  workout: [],
  storeWorkout: () => {},
  clearWorkout: () => {},
  userProfile: null,
  storeUserProfile: () => {},
  friendsProfiles: null,
  storeFriendsProfiles: () => {}
};

export const WorkoutContext = createContext<IWorkoutContext>(contextDefaultValues);

const WorkoutProvider: React.FC = ({ children }) => {
  const [existingWorkout, setExistingWorkout] = useState<IWorkout | null>(null);
  const [workout, setWorkout] = useStateWithLocalStorageForArray("storedWorkout");

  const [userProfile, setUserProfile] = useState<IDatesResponse | null>(null);
  const [friendsProfiles, setFriendsProfiles] = useState<IUserProfile[] | null>(null);

  const storeWorkout = (sets: ISet[]): void => {
    setWorkout(sets);
  };
  const clearExistingWorkout = (): void => {
    setExistingWorkout(contextDefaultValues.existingWorkout);
  };

  const clearWorkout = (): void => {
    setWorkout([]);
  };

  const storeExistingWorkout = async (exisitingWorkout: IWorkout): Promise<void> => {
    await setExistingWorkout(exisitingWorkout);
  };

  const storeUserProfile = (profile: IDatesResponse): void => {
    setUserProfile(profile);
  };

  const storeFriendsProfiles = (profiles: IUserProfile[]): void => {
    setFriendsProfiles(profiles);
  };

  return (
    <WorkoutContext.Provider
      value={{
        existingWorkout,
        storeExistingWorkout,
        clearExistingWorkout,
        workout,
        storeWorkout,
        clearWorkout,
        userProfile,
        storeUserProfile,
        friendsProfiles,
        storeFriendsProfiles
      }}>
      {children}
    </WorkoutContext.Provider>
  );
};

export default WorkoutProvider;
