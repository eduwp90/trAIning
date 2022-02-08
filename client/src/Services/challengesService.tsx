import db from "../Config/firestore";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { IChallenge, ISet } from "../interfaces";

export async function getChallengesByUserId(userId: string): Promise<IChallenge[] | null> {
  const challengesRef = collection(db, "challenges");

  const q = query(challengesRef, where("receiving_userid", "==", userId));

  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const res: IChallenge = {
        from: doc.data().from,
        message: doc.data().message,
        receiving_userid: doc.data().receiving_userid,
        workout_id: doc.data().workout_id
      };
      return res;
    });
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function saveChallenge(
  receiving_userid: string,
  message: string,
  from: string,
  workout: ISet[]
): Promise<boolean> {
  try {
    const docRef = await addDoc(collection(db, "challenges"), {
      from: from,
      message: message,
      receiving_userid: receiving_userid,
      workout_id: workout
    });

    return docRef ? true : false;
  } catch (error) {
    console.log(error);
    return false;
  }
}
