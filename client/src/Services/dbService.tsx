import db from "../Config/firestore";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore/lite";

export async function addWorkout(user: string, workout: any, name: string) {
  try {
    const docRef = await addDoc(collection(db, "workoutsDb"), {
      user: user,
      workout: workout,
      name: name
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.log("Error adding document: ", e);
  }
}

export async function getUserWorkouts(user: string): Promise<any[] | undefined> {
  const q = query(collection(db, "workoutsDb"), where("user", "==", user));

  try {
    const querySnapshot = await getDocs(q);
    const res: any[] = [];
    querySnapshot.forEach((doc) => {
      res.push(doc.data());
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
    return res;
  } catch (error) {
    console.log(error);
    return;
  }
}
