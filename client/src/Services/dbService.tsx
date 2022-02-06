import db from "../Config/firestore";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  DocumentReference,
  DocumentData,
  Query,
  doc,
  updateDoc,
  arrayUnion,
  getDoc,
  Timestamp
} from "firebase/firestore/lite";
import { ISet, IWorkout, IWorkoutResponse, IDatesResponse } from "../interfaces";
import dayjs, { Dayjs } from "dayjs";

export async function addWorkout(user: string, workout: ISet[], name: string): Promise<void> {
  try {
    const docRef: DocumentReference<DocumentData> = await addDoc(collection(db, "workoutsDb"), {
      user: user,
      workout: workout,
      name: name
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.log("Error adding document: ", e);
  }
}

export async function updateWorkout(id: string, workout: ISet[], name: string): Promise<void> {
  try {
    const docRef: DocumentReference<DocumentData> = doc(db, "workoutsDb", id);
    await updateDoc(docRef, {
      name: name,
      workout: workout
    });
    console.log("Document updated with ID: ", docRef.id);
  } catch (e) {
    console.log("Error adding document: ", e);
  }
}

export async function getUserWorkouts(user: string): Promise<IWorkout[] | undefined> {
  const q: Query<DocumentData> = query(collection(db, "workoutsDb"), where("user", "==", user));

  try {
    const querySnapshot: DocumentData = await getDocs(q);
    const res: IWorkoutResponse[] = [];
    querySnapshot.forEach((doc: IWorkoutResponse) => {
      const obj: IWorkoutResponse = doc.data();
      obj.id = doc.id;
      res.push(obj);
      // doc.data() is never undefined for query doc snapshots
      //console.log(obj);
    });
    return res;
  } catch (e) {
    console.log(e);
    return;
  }
}

// Active Dates array

export async function addDate(user: string, date: Dayjs): Promise<void> {
  const jsDate: Date = date.toDate();
  try {
    const docRef: DocumentReference<DocumentData> = doc(db, "profiles", user);
    await updateDoc(docRef, {
      dates: arrayUnion(jsDate)
    });
    console.log("Document updated with ID: ", docRef.id);
  } catch (e) {
    console.log("Error adding document: ", e);
  }
}

export async function getUserActiveDates(user: string): Promise<Dayjs[] | undefined> {
  const userRef: DocumentReference<DocumentData> = doc(db, "profiles", user);
  const userProfile: DocumentData = await getDoc(userRef);
  let userActiveDates: Dayjs[] = [];
  try {
    if (userProfile.exists()) {
      const info: IDatesResponse = userProfile.data();
      userActiveDates = info.dates.map((date: Timestamp) => {
        return dayjs(date.toDate());
      });
    }
    return userActiveDates;
  } catch (error) {
    console.log("error fetching active dates list", error);
  }
}

// Users Database

export async function createUserProfile(user: string): Promise<void> {
  try {
    const docRef: DocumentReference<DocumentData> = await addDoc(collection(db, "profiles"), {
      user: user,
      dates: [],
      name: "",
      surname: "",
      weight: 0,
      height: 0,
      bmi: 0
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.log("Error adding document: ", e);
  }
}
