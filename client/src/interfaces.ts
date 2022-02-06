import { User } from "firebase/auth";
import { DocumentData } from "firebase/firestore/lite";

export interface ISet {
  exer: string;
  reps: number;
  rest: number;
}

export interface IWorkout {
  id: string;
  user: string;
  name: string;
  time: number;
  calories: number;
  workout: ISet[];
}

export interface IWorkoutContext {
  existingWorkout: IWorkout | null;
  storeExistingWorkout: (exisitingWorkout: IWorkout) => void;
  clearExistingWorkout: () => void;
  workout: ISet[];
  storeWorkout: (sets: ISet[]) => void;
  clearWorkout: () => void;
}

export interface IWorkoutResponse extends IWorkout, DocumentData {
  id: string;
}

export interface IGoogleUserResponse {
  user: User;
  isNewUser: boolean | null;
}

export interface IGoogleDataRouter {
  googleUserId: string;
  photoURL: string;
}
