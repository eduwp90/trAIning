import {
  getAuth,
  createUserWithEmailAndPassword,
  Auth,
  UserCredential,
  signInWithEmailAndPassword,
  UserInfo,
} from 'firebase/auth';
import initFirebase from '../Config/firebase';

initFirebase();

const auth: Auth = getAuth();

const signupUser = async (
  email: string,
  password: string
): Promise<UserInfo | null> => {
  try {
    const result: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return result.user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const isAuthenticated = (): boolean => {
  const user = auth.currentUser;
  return user ? true : false;
};

const loginUser = async (
  email: string,
  password: string
): Promise<UserInfo | null> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const AuthService = { signupUser, isAuthenticated, loginUser };

export default AuthService;
