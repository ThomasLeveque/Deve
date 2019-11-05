import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import firebaseConfig from './firebase.config';

class Firebase {
  auth: app.auth.Auth;
  db: app.firestore.Firestore;
  
  constructor() {
    app.initializeApp(firebaseConfig);
    this.auth = app.auth();
    this.db = app.firestore();
  }

  register = async (name: string, email: string, password: string): Promise<void> => {
    const newUser: app.auth.UserCredential = await this.auth.createUserWithEmailAndPassword(
      email,
      password
    );

    return await newUser.user.updateProfile({
      displayName: name
    });
  };

  login = async (email: string, password: string): Promise<app.auth.UserCredential> => {
    return await this.auth.signInWithEmailAndPassword(email, password);
  };

  logout = async (): Promise<void> => {
    await this.auth.signOut();
  };

  resetPassword = async (email: string): Promise<void> => {
    await this.auth.sendPasswordResetEmail(email);
  };
}

const firebase = new Firebase();
export default firebase;
