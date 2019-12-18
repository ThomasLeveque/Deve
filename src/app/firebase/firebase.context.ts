import React from 'react';
import { ICategory } from '../interfaces/link.interface';
import { IUser } from '../interfaces/user.interface';
import { NotifType } from '../utils/index';

interface IfirebaseContext {
  user: IUser;
  firebase: any; // firebase.app.App
  categories: ICategory[]; // firebase.app.App
  userLoaded: boolean;
  openNotification: (message: string, description:string, type: NotifType) => void;
}

const FirebaseContext = React.createContext<Partial<IfirebaseContext>>({});

export default FirebaseContext;
