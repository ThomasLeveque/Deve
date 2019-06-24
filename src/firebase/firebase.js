import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import firebaseConfig from './config';

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);
    this.auth = app.auth();
    this.db = app.firestore();
  }

  register = async (name, email, password) => {
    const newUser = await this.auth.createUserWithEmailAndPassword(
      email, password
    );

    return await newUser.user.updateProfile({
      displayName: name
    })
  }

  login = async (email, password) => {
    return await this.auth.signInWithEmailAndPassword(email, password)
  }

  logout = async () => {
    await this.auth.signOut();
  }

  resetPassword = async email => {
    await this.auth.sendPasswordResetEmail(email);
  }
}

const firebase = new Firebase();
export default firebase;