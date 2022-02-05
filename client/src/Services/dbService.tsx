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
  setDoc
} from "firebase/firestore";
import { ISet, IWorkout, IWorkoutResponse } from "../interfaces";

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

export async function addNewProfile(
  user: string,
  name: string,
  surname: string,
  height: number,
  weight: number,
  bmi: number
): Promise<void> {
  try {
    await setDoc(doc(db, "profiles", user), {
      name: name,
      surname: surname,
      height: height,
      weight: weight,
      bmi: bmi,
      dates: []
    });

    console.log("Saved profile");
  } catch (e) {
    console.log(e);
  }
}
