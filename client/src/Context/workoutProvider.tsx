import React, { createContext, useState } from 'react';
import { ISet, IWorkout, IWorkoutContext } from '../interfaces';
import { useStateWithLocalStorageForArray } from "../Services/customHookService";
const contextDefaultValues: IWorkoutContext = {
  existingWorkout: null,
  storeExistingWorkout: () => { },
  clearExistingWorkout: ()=>{},
  workout: [],
  storeWorkout: () => { },
  clearWorkout: () => { }
};

export const WorkoutContext = createContext<IWorkoutContext>(contextDefaultValues);

const WorkoutProvider: React.FC = ({ children }) => {
  //const [workout, setWorkout] = useState<ISet[]>([]);
  const [existingWorkout, setExistingWorkout] = useState < IWorkout | null>(null)
  const [workout, setWorkout] = useStateWithLocalStorageForArray("storedWorkout");

  const storeWorkout = (sets: ISet[]): void => {
  setWorkout(sets)
  }
  const clearExistingWorkout = ():void => {
    setExistingWorkout(contextDefaultValues.existingWorkout)

  }

  const clearWorkout = (): void => {
    setWorkout([]);

  };

  const storeExistingWorkout= (exisitingWorkout: IWorkout):void => {
    setExistingWorkout(exisitingWorkout)
}
  return (
    <WorkoutContext.Provider value={{existingWorkout, storeExistingWorkout, clearExistingWorkout, workout, storeWorkout, clearWorkout}}>
    {children}
    </WorkoutContext.Provider>
  );
}

export default WorkoutProvider;
