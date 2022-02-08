import db from "../Config/firestore";
import { IUserProfile } from "../interfaces";
import {
  collection,
  query,
  getDocs,
  Query,
  DocumentData,
  getDoc,
  doc,
  DocumentReference,
  updateDoc,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";

export async function getAllProfiles(): Promise<IUserProfile[] | null> {
  const q: Query<DocumentData> = query(collection(db, "profiles"));

  try {
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => {
      const profile: IUserProfile = {
        userId: doc.id,
        name: doc.data().name,
        surname: doc.data().surname,
        photoURL: doc.data().photoURL,
        height: doc.data().height,
        weight: doc.data().weight,
        bmi: doc.data().bmi,
        friendsId: doc.data().friendsId,
        dates: doc.data().dates,
        activities: doc.data().activities
      };
      return profile;
    });
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getUserFriends(userId: string): Promise<string[]> {
  const docRef: DocumentReference<DocumentData> = doc(db, "profiles", userId);
  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().friendsId;
    } else {
      console.log("No user found with that Id!");
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function addFriend(userId: string, friendId: string): Promise<boolean> {
  const docRef: DocumentReference<DocumentData> = doc(db, "profiles", userId);

  try {
    await updateDoc(docRef, {
      friendsId: arrayUnion(friendId)
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function removeFriend(userId: string, friendId: string): Promise<boolean> {
  const docRef: DocumentReference<DocumentData> = doc(db, "profiles", userId);

  try {
    await updateDoc(docRef, {
      friendsId: arrayRemove(friendId)
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getFriendsProfilesByIds(ids: string[]): Promise<IUserProfile[] | null> {
  try {
    const results = await getAllProfiles();

    return results && results.filter((profile) => ids.includes(profile.userId));
  } catch (error) {
    console.log(error);
    return null;
  }
}
