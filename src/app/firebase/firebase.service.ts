import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { User as AuthUser, UserCredential } from '@firebase/auth-types';

import { firebaseRoutes, firebaseConfigProd } from './firebase.config';
import { IfirebaseConfig } from './firebase.interface';
import CurrentUser from '../models/current-user.model';

const firebaseConfig = ((domain: string): IfirebaseConfig => firebaseRoutes[domain] || firebaseConfigProd)(window.document.domain);
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const register = async (email: string, password: string): Promise<UserCredential> => {
  return auth.createUserWithEmailAndPassword(email, password);
};

export const login = async (email: string, password: string): Promise<UserCredential> => {
  return auth.signInWithEmailAndPassword(email, password);
};

export const logout = async (): Promise<void> => {
  return auth.signOut();
};

export const resetPassword = async (email: string): Promise<void> => {
  return auth.sendPasswordResetEmail(email);
};

export const signInWithGoogle = async (): Promise<UserCredential> => {
  return auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
};

export const createUserProfileDocument = async (userAuth: AuthUser, additionalData?: any): Promise<CurrentUser> => {
  if (!userAuth) return;
  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const { displayName, email, photoURL } = userAuth;
    const createdAt: number = Date.now();
    const updatedAt: number = Date.now();

    await userRef.set({
      displayName,
      email,
      photoURL,
      isAdmin: false,
      createdAt,
      updatedAt,
      ...additionalData
    });
    const snapshot = await userRef.get();
    return new CurrentUser(snapshot);
  }

  return new CurrentUser(snapshot);
};

export default firebase;
