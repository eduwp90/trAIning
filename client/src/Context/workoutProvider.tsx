import React, { createContext, useState, useEffect, Dispatch, SetStateAction } from "react";
import { ISet, IWorkoutContext } from "../interfaces";

const contextDefaultValues: IWorkoutContext = { workout: [], storeWorkout: () => {}, clearWorkout: () => {} };

export const WorkoutContext = createContext<IWorkoutContext>(contextDefaultValues);

const WorkoutProvider: React.FC = ({ children }) => {
  const [workout, setWorkout] = useStateWithLocalStorageForArray("storedWorkout");
  //useState<ISet[]>([]);

  const storeWorkout = (sets: ISet[]): void => {
    setWorkout(JSON.stringify(sets));
  };

  const clearWorkout = (): void => {
    setWorkout([]);
  };

  return <WorkoutContext.Provider value={{ workout, storeWorkout, clearWorkout }}>{children}</WorkoutContext.Provider>;
};

export default WorkoutProvider;

const useStateWithLocalStorageForArray = (localStorageKey: string): [string, Dispatch<SetStateAction<string>>] => {
  let savedArray = localStorage.getItem(localStorageKey) || [];
  if (typeof savedArray === 'string')
    savedArray = JSON.parse(savedArray);
  } 
  const [value, setValue] = useState(savedArray);

  useEffect(() => {
    localStorage.setItem(localStorageKey, JSON.stringify(value));
  }, [value, localStorageKey]);

  return [value, setValue];
};
