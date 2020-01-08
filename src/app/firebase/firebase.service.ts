import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { firebaseRoutes, firebaseConfigDev } from './firebase.config';
import { IfirebaseConfig } from '../interfaces/firebase-config.interface';

const firebaseConfig = ((domain: string): IfirebaseConfig => firebaseRoutes[domain] || firebaseConfigDev)(window.document.domain);
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const register = async (email: string, password: string): Promise<firebase.auth.UserCredential> => {
  return await auth.createUserWithEmailAndPassword(email, password);
};

export const login = async (email: string, password: string): Promise<firebase.auth.UserCredential> => {
  return await auth.signInWithEmailAndPassword(email, password);
};

export const logout = async (): Promise<void> => {
  await auth.signOut();
};

export const resetPassword = async (email: string): Promise<void> => {
  await auth.sendPasswordResetEmail(email);
};

export const createUserProfileDocument = async (
  userAuth: firebase.User,
  additionalData?: any
): Promise<firebase.firestore.DocumentReference> => {
  if (!userAuth) return;
  const userRef: firebase.firestore.DocumentReference = firestore.doc(`users/${userAuth.uid}`);

  try {
    const snapShot: firebase.firestore.DocumentSnapshot = await userRef.get();

    if (!snapShot.exists) {
      const { displayName, email }: firebase.User = userAuth;
      const createdAt: Date | number = Date.now();
      const updatedAt: Date | number = Date.now();

      await userRef.set({
        displayName,
        email,
        createdAt,
        updatedAt,
        ...additionalData
      });
    }
  } catch (err) {
    throw new Error(err);
  }

  return userRef;
};

export const googleProvider: firebase.auth.GoogleAuthProvider_Instance = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoole = async (): Promise<firebase.auth.UserCredential> => auth.signInWithPopup(googleProvider);

export default firebase;
