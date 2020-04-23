import React, { createContext, useEffect, memo, useContext } from 'react';

import { auth, createUserProfileDocument } from '../../firebase/firebase.service';
import CurrentUser from '../../models/current-user.model';
import NotifContext from '../../contexts/notif/notif.context';
import { formatError } from '../../utils/format-string.util';

interface ICurrentUserContext {
  currentUser: CurrentUser;
  currentUserLoaded: boolean;
}

export const CurrentUserContext = createContext<ICurrentUserContext>({
  currentUser: null,
  currentUserLoaded: false
});

export const useCurrentUser = () => useContext(CurrentUserContext);

const CurrentUserProvider: React.FC = memo(({ children }) => {
  const [currentUser, setCurrentUser] = React.useState<CurrentUser>(null);
  const [currentUserLoaded, setCurrentUserLoaded] = React.useState<boolean>(false);

  const { openNotification } = useContext(NotifContext);

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
                console.error(err);
                setCurrentUserLoaded(true);
                openNotification('Cannot get currentUser from firestore', 'Try to reload', 'error');
              }
            );
          } catch (err) {
            console.error(err);
            openNotification('Cannot create user profil', 'Try to reload', 'error');
            setCurrentUserLoaded(true);
          }
        } else {
          setCurrentUser(null);
          setCurrentUserLoaded(true);
        }
      },
      (err: firebase.auth.Error) => {
        openNotification('Cannot check for user auth', 'Try to reload', 'error');
        console.error(err);
        setCurrentUserLoaded(true);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        currentUserLoaded
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
});

export default CurrentUserProvider;
