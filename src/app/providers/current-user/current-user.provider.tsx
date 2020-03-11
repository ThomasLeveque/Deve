import React, { createContext, useEffect, memo } from 'react';

import { auth, createUserProfileDocument } from '../../firebase/firebase.service';
import CurrentUser from '../../models/current-user.model';

interface ICurrentUserContext {
  currentUser: CurrentUser;
  currentUserError: string | null;
  currentUserLoaded: boolean;
}

export const CurrentUserContext = createContext<ICurrentUserContext>({
  currentUser: null,
  currentUserError: null,
  currentUserLoaded: false
});

const CurrentUserProvider: React.FC = memo(({ children }) => {
  const [currentUser, setCurrentUser] = React.useState<CurrentUser>(null);
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
                setCurrentUser(new CurrentUser(snapshot));
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
});

export default CurrentUserProvider;
