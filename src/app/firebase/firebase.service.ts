import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import { firebaseRoutes, firebaseConfigProd } from './firebase.config';
import { IfirebaseConfig } from './firebase.interface';
import CurrentUser from '../models/current-user.model';

const firebaseConfig = ((domain: string): IfirebaseConfig => firebaseRoutes[domain] || firebaseConfigProd)(window.document.domain);
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const register = async (email: string, password: string): Promise<firebase.auth.UserCredential> => {
  return auth.createUserWithEmailAndPassword(email, password);
};

export const login = async (email: string, password: string): Promise<firebase.auth.UserCredential> => {
  return auth.signInWithEmailAndPassword(email, password);
};

export const logout = async (): Promise<void> => {
  return auth.signOut();
};

export const resetPassword = async (email: string): Promise<void> => {
  return auth.sendPasswordResetEmail(email);
};

export const createUserProfileDocument = async (userAuth: firebase.User, additionalData?: any): Promise<CurrentUser> => {
  if (!userAuth) return;
  const userRef: firebase.firestore.DocumentReference = firestore.doc(`users/${userAuth.uid}`);

  const snapshot: firebase.firestore.DocumentSnapshot = await userRef.get();

  if (!snapshot.exists) {
    const { displayName, email }: firebase.User = userAuth;
    const createdAt: number = Date.now();
    const updatedAt: number = Date.now();

    await userRef.set({
      displayName,
      email,
      isAdmin: false,
      createdAt,
      updatedAt,
      ...additionalData
    });
    const snapshot: firebase.firestore.DocumentSnapshot = await userRef.get();
    return new CurrentUser(snapshot);
  }

  return new CurrentUser(snapshot);
};

export const googleProvider: firebase.auth.GoogleAuthProvider_Instance = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
export const signInWithGoogle = async (): Promise<firebase.auth.UserCredential> => auth.signInWithPopup(googleProvider);

export default firebase;
