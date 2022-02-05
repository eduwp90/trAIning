import {
  getAuth,
  createUserWithEmailAndPassword,
  Auth,
  UserCredential,
  signInWithEmailAndPassword,
  UserInfo,
  signOut,
  signInWithPopup
} from "firebase/auth";
import initFirebase from "../Config/firebase";
import { GoogleAuthProvider } from "firebase/auth";

const provider: GoogleAuthProvider = new GoogleAuthProvider();

initFirebase();

const auth: Auth = getAuth();

const signupUser = async (email: string, password: string): Promise<UserInfo | string> => {
  try {
    const result: UserCredential = await createUserWithEmailAndPassword(auth, email, password);

    return result.user;
  } catch (e: unknown) {
    let message = "Unknown Error";
    if (e instanceof Error) {
      message = e.message.replace("Firebase: ", "");
    }
    return message;
  }
};

const loginUser = async (email: string, password: string): Promise<UserInfo | string> => {
  try {
    const result: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (e: unknown) {
    let message = "Unknown Error";
    if (e instanceof Error) {
      message = e.message.replace("Firebase: ", "");
    }
    return message;
  }
};

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, provider);
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};

const logoutUser = () => {
  signOut(auth);
};

const AuthService = {
  auth,
  signupUser,
  loginUser,
  logoutUser,
  signInWithGoogle
};

export default AuthService;
