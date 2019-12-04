import React from 'react';
import { ICategory } from '../interfaces/link.interface';
import { IUser } from '../interfaces/user.interface';

interface IfirebaseContext {
  user: IUser;
  firebase: any; // firebase.app.App
  categories: ICategory[]; // firebase.app.App
  _window: MyWindow & typeof globalThis;
  userLoaded: boolean;
}

const FirebaseContext = React.createContext<Partial<IfirebaseContext>>({});

export default FirebaseContext;
