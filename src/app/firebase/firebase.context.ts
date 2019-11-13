import React from 'react';
import { ICategory } from '../interfaces/link.interface';

interface IfirebaseContext {
  user: any;
  firebase: any; // firebase.app.App
  categories: ICategory[]; // firebase.app.App
  _window: MyWindow & typeof globalThis;
}

const FirebaseContext = React.createContext<Partial<IfirebaseContext>>({});

export default FirebaseContext;
