import React from 'react';
import firebase from '../../firebase';
import { IUser } from '../../interfaces/user';

function useAuth() {
  const [authUser, setAuthUser] = React.useState<IUser | null>(null);

  React.useEffect(() => {
    const unsubcribe = firebase.auth.onAuthStateChanged(user => {
      if (user) {
        const formatedUser: IUser = {
          id: user.uid,
          name: user.displayName,
          email: user.email
        }
        setAuthUser(formatedUser);
      } else {
        setAuthUser(null);
      }
    });

    return () => unsubcribe();
  }, []);

  return authUser;
}

export default useAuth;
