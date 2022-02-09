import db from "../Config/firestore";
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { IChallenge, ISet } from "../interfaces";

export async function getChallengesByUserId(userId: string): Promise<IChallenge[] | null> {
  const challengesRef = collection(db, "challenges");

  const q = query(challengesRef, where("receiving_userid", "==", userId));

  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const res: IChallenge = {
        id: doc.id,
        from: doc.data().from,
        from_photo: doc.data().from_photo,
        message: doc.data().message,
        receiving_userid: doc.data().receiving_userid,
        workout: doc.data().workout
      };
      return res;
    });
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function getChallengeId(user:string, id: string): Promise<IChallenge[] | null> {
  try {
    const results = await getChallengesByUserId(user);

    return results && results.filter((profile) => profile.id === id);
  } catch (error) {
    console.log(error);
    return null;
  }

}



export async function saveChallenge(
  receiving_userid: string,
  message: string,
  from: string,
  workout: ISet[],
  from_photo: string
): Promise<boolean> {
  try {
    const docRef = await addDoc(collection(db, "challenges"), {
      from: from,
      from_photo: from_photo,
      message: message,
      receiving_userid: receiving_userid,
      workout: workout
    });

    return docRef ? true : false;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function challengeComplete(id:string): Promise<boolean> {
  try{
    await deleteDoc(doc(db, "challenges", id));
    return true
  }catch{
    return false
  }
}