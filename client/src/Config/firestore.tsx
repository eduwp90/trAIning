import { Firestore, getFirestore } from 'firebase/firestore/lite';
import firebase from './firebase';

const db: Firestore = getFirestore(firebase);

export default db;
