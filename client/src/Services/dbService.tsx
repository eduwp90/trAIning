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
  Timestamp,
  setDoc
} from "firebase/firestore";
import { ISet, IWorkout, IWorkoutResponse, IDatesResponse, tActivities } from "../interfaces";
import dayjs, { Dayjs } from "dayjs";

export async function addWorkout(
  user: string,
  workout: ISet[],
  name: string,
  calories: number,
  time: number
): Promise<void> {
  try {
    const docRef: DocumentReference<DocumentData> = await addDoc(collection(db, "workoutsDb"), {
      user: user,
      workout: workout,
      name: name,
      calories: calories,
      time: time
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.log("Error adding document: ", e);
  }
}

export async function updateWorkout(
  id: string,
  workout: ISet[],
  name: string,
  calories: number,
  time: number
): Promise<void> {
  try {
    const docRef: DocumentReference<DocumentData> = doc(db, "workoutsDb", id);
    await updateDoc(docRef, {
      name: name,
      workout: workout,
      time: time,
      calories: calories
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

export async function getUserActivities(user: string): Promise<tActivities[] | undefined> {
  const userRef: DocumentReference<DocumentData> = doc(db, "profiles", user);
  const userProfile: DocumentData = await getDoc(userRef);
  let userActivities: tActivities[] = [];
  try {
    if (userProfile.exists()) {
      const info: IDatesResponse = userProfile.data();
      userActivities = info.activities;
    }
    return userActivities;
  } catch (error) {
    console.log("error fetching user activites", error);
  }
}

export async function updateUserActivities(user: string, date: Dayjs, workout: ISet[]): Promise<void> {
  const docRef: DocumentReference<DocumentData> = doc(db, "profiles", user);
  const jsDate: Date = date.toDate();
  try {
    workout.forEach(async (set: ISet) => {
      const type: string = set.exer;
      await updateDoc(docRef, {
        activities: arrayUnion({ type: type, count: set.reps, date: jsDate })
      });
    });
  } catch (error) {
    console.log("error adding userActivities", error);
  }
}

// Users Database

export async function addNewProfile(
  user: string,
  name: string,
  surname: string,
  photoURL: string,
  height: number,
  weight: number,
  bmi: number
): Promise<void> {
  try {
    console.log("db  ", db);
    await setDoc(doc(db, "profiles", user), {
      name: name,
      surname: surname,
      photoURL: photoURL,
      height: height,
      weight: weight,
      bmi: bmi,
      dates: [],
      friendsId: [],
      activities: []
    });

    console.log("Saved profile");
  } catch (e) {
    console.log(e);
  }
}

export async function updateUserProfile(user: string,
  height: number,
  weight: number,
  bmi: number
): Promise<IDatesResponse | undefined> {
  const userRef: DocumentReference<DocumentData> = doc(db, "profiles", user);
  try {
    await updateDoc(userRef, {
      height: height,
      weight: weight,
      bmi: bmi
    });
    const update = await getUserProfile(user);  
    return update
  } catch (e) {
    console.log("Error adding document: ", e);
  }
  
}

export async function getUserProfile(user: string): Promise<IDatesResponse | undefined> {
  const userRef: DocumentReference<DocumentData> = doc(db, "profiles", user);
  const userProfile: DocumentData = await getDoc(userRef);
  let profileObj: IDatesResponse;
  try {
    if (userProfile.exists()) {
      const info: IDatesResponse = userProfile.data();
      profileObj = {
        weight: info.weight,
        height: info.height,
        bmi: info.bmi,
        friendsId: info.friendsId,
        name: info.name,
        surname: info.surname,
        photoURL: info.photoURL,
        activities: info.activities,
        dates: info.dates
      };
      return profileObj;
    }
  } catch (error) {
    console.log("error fetching user activites", error);
  }
}
