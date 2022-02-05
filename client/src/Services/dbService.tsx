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
  getDoc
} from "firebase/firestore/lite";
import { ISet, IWorkout, IWorkoutResponse } from "../interfaces";
import { Dayjs } from "dayjs";

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
  try {
    const docRef: DocumentReference<DocumentData> = doc(db, "profile", user);
    await updateDoc(docRef, {
      dates: arrayUnion(date)
    });
    console.log("Document updated with ID: ", docRef.id);
  } catch (e) {
    console.log("Error adding document: ", e);
  }
}

export async function getUserActiveDates(user: string): Promise<Dayjs[] | undefined> {
  let array;
  try {
    const docRef = doc(db, "profiles", user);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      let obj = docSnap.data();
      array = obj.dates;
    } else {
      array = [];
    }
    return array;
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
