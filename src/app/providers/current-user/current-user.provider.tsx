import React, { createContext, useState, useEffect } from 'react';

import { IUser } from '../../interfaces/user.interface';
import { auth, createUserProfileDocument } from '../../firebase/firebase.service';

interface ICurrentUserContext {
  currentUser: IUser | null;
  currentUserError: string | null;
  currentUserLoaded: boolean;
}

export const CurrentUserContext = createContext<ICurrentUserContext>({
  currentUser: null,
  currentUserError: null,
  currentUserLoaded: false
});

const CurrentUserProvider: React.FC = ({ children }) => {
  const [currentUser, setCurrentUser] = React.useState<IUser | null>(null);
  const [currentUserError, setCurrentUserError] = React.useState<string | null>(null);
  const [currentUserLoaded, setCurrentUserLoaded] = React.useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      async (userAuth: firebase.User | null) => {
        if (userAuth) {
          try {
            const userRef = await createUserProfileDocument(userAuth);
            userRef.onSnapshot(
              (snapshot: firebase.firestore.DocumentSnapshot) => {
                const { displayName, email, createdAt, updatedAt } = snapshot.data();
                setCurrentUser({
                  id: snapshot.id,
                  displayName,
                  email,
                  createdAt,
                  updatedAt
                });
                setCurrentUserLoaded(true);
              },
              (err: any) => {
                setCurrentUserError(err.message || err.toString());
                setCurrentUserLoaded(true);
              }
            );
          } catch (err) {
            setCurrentUserError(err.message || err.toString());
            setCurrentUserLoaded(true);
          }
        } else {
          setCurrentUser(null);
          setCurrentUserLoaded(true);
        }
      },
      (err: firebase.auth.Error) => {
        setCurrentUserError(err.message);
        setCurrentUserLoaded(true);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        currentUserError,
        currentUserLoaded
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

export default CurrentUserProvider;
