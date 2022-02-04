import React, { createContext, useState } from 'react';
import { ISet, IWorkout, IWorkoutContext } from '../interfaces';

const contextDefaultValues: IWorkoutContext = {
  savedWorkout: null,
  storeSavedWorkout: () => { },
  clearSavedWorkout: ()=>{},
  workout: [],
  storeWorkout: () => { },
  clearWorkout: () => { }
};

export const WorkoutContext = createContext<IWorkoutContext >(contextDefaultValues)

const WorkoutProvider: React.FC = ({ children }) => {
  const [workout, setWorkout] = useState<ISet[]>([]);
  const [savedWorkout, setSavedWorkout] = useState < IWorkout | null>(null)

  const storeWorkout = (sets: ISet[] ): void => {
  setWorkout(sets)
  }
  const clearSavedWorkout = (): void => {
    setSavedWorkout(null)
  }

  const clearWorkout = (): void => {
  setWorkout([])
  }

  const storeSavedWorkout= (exisitingWorkout: IWorkout):void => {
    setSavedWorkout(exisitingWorkout)
}
  return (
    <WorkoutContext.Provider value={{savedWorkout, storeSavedWorkout, clearSavedWorkout, workout, storeWorkout, clearWorkout}}>
    {children}
    </WorkoutContext.Provider>
  );
}

export default WorkoutProvider;
