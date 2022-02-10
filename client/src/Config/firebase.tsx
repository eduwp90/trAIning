import { FirebaseApp, initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,
  authDomain: process.env.REACT_APP_AUTHDOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_SENDERID,
  appId: process.env.REACT_APP_APPID,
};

const initFirebase = (): FirebaseApp => {
  const firebase: FirebaseApp = initializeApp(firebaseConfig);
  return firebase;
};

export default initFirebase;
