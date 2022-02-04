import React, { createContext } from "react";
import { useStateWithLocalStorageForArray } from "../Services/customHookService";
import { ISet, IWorkoutContext } from "../interfaces";

const contextDefaultValues: IWorkoutContext = { workout: [], storeWorkout: () => {}, clearWorkout: () => {} };

export const WorkoutContext = createContext<IWorkoutContext>(contextDefaultValues);

const WorkoutProvider: React.FC = ({ children }) => {
  const [workout, setWorkout] = useStateWithLocalStorageForArray("storedWorkout");
  //useState<ISet[]>([]);

  const storeWorkout = (sets: ISet[]): void => {
    setWorkout(sets);
  };

  const clearWorkout = (): void => {
    setWorkout([]);
  };

  return <WorkoutContext.Provider value={{ workout, storeWorkout, clearWorkout }}>{children}</WorkoutContext.Provider>;
};

export default WorkoutProvider;
