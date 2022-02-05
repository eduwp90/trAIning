import { DocumentData } from "firebase/firestore/lite";

export interface ISet {
  exer: string;
  reps: number;
  rest: number;
}

export interface IWorkout {
  user: string;
  name: string;
  time: number;
  calories: number;
  workout: ISet[];
}

export interface IWorkoutContext {
  workout: ISet[];
  storeWorkout: (sets: ISet[]) => void;
  clearWorkout: () => void;
}
export interface IWorkoutResponse extends IWorkout, DocumentData {
  id: string;
}
