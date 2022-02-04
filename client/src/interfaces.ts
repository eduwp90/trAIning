import { DocumentData } from "firebase/firestore/lite";

export interface ISet {
  exer: string;
  reps: number;
  rest: number;
}

export interface IWorkout {
  user: string;
  name: string;
  workout: ISet[];
}

export interface IWorkoutContext{
  savedWorkout: IWorkout | null,
  storeSavedWorkout: (exisitingWorkout: IWorkout) => void,
  clearSavedWorkout: ()=> void,
  workout: ISet[],
  storeWorkout: (sets: ISet[]) => void,
  clearWorkout: ()=> void
}

export interface IWorkoutResponse extends IWorkout, DocumentData {
  id: string;
}
