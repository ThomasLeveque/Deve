import React from 'react';
import firebase from '../firebase';
import { IUser } from '../interfaces/user.interface';

const getAuthUser = (): { user: IUser; userError: string; userLoaded: boolean } => {
  const [user, setUser] = React.useState<IUser | null>(null);
  const [userError, setUserError] = React.useState<string>('');
  const [userLoaded, setUserLoaded] = React.useState<boolean>(false);

  React.useEffect(() => {
    const unsubscribe = firebase.auth.onAuthStateChanged(
      (user: firebase.User | null) => {
        if (user) {
          console.log('user', user.displayName);
          const formatedUser: IUser = {
            id: user.uid,
            name: user.displayName,
            email: user.email
          };
          console.log('formatedUser', formatedUser)
          setUser(formatedUser);
          setUserLoaded(true);
        } else {
          setUser(null);
          setUserLoaded(true);
        }
      },
      (err: firebase.auth.Error) => {
        setUserError(err.message);
        setUserLoaded(true);
      }
    );

    return () => unsubscribe();
  }, []);

  return { user, userError, userLoaded };
};

export { getAuthUser };
