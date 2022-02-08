import { DocumentData, Timestamp } from "firebase/firestore/lite";
import { User } from "firebase/auth";

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
  userProfile: IDatesResponse | null;
  storeUserProfile: (profile: IDatesResponse) => void;
  friendsProfiles: IUserProfile[] | null;
  storeFriendsProfiles: (profiles: IUserProfile[]) => void;
}

export interface IWorkoutResponse extends IWorkout, DocumentData {
  id: string;
}

export interface IDatesResponse extends DocumentData {
  dates: Timestamp[];
  friendsId: string[];
  photoURL: string;
  bmi: number;
  height: number;
  weight: number;
  name: string;
  surname: string;
  activities: tActivities[];
}

export interface tActivities {
  count: number;
  date: Timestamp;
  type: string;
}

export interface IUserProfile extends IDatesResponse {
  userId: string;
}

export interface IGoogleUserResponse {
  user: User;
  isNewUser: boolean | null;
}

export interface IGoogleDataRouter {
  googleUserId: string;
  photoURL: string;
}

export type tRepCounts = {
  "push-ups": number;
  squats: number;
  lunges: number;
  "jumping-jacks": number;
  "side-squats": number;
};

export interface IChallenge {
  from: string;
  message: string;
  receiving_userid: string;
  workout_id: ISet[];
}
