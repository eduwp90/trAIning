import { Firestore, getFirestore } from 'firebase/firestore/lite';
import initFirebase from './firebase';

const db: Firestore = getFirestore(initFirebase());

export default db;
