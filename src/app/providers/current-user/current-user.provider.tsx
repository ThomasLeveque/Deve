import React, { createContext, useEffect, memo, useContext } from 'react';

import { auth, createUserProfileDocument, logout, login, register, signInWithGoogle } from '../../firebase/firebase.service';
import CurrentUser from '../../models/current-user.model';
import NotifContext from '../../contexts/notif/notif.context';
import { ILoginInitialState, IRegisterInitialState } from '../../interfaces/initial-states.type';

interface ICurrentUserContext {
  currentUser: CurrentUser;
  currentUserLoaded: boolean;
  handleRegister: ({ displayName, email, password }: IRegisterInitialState) => Promise<void>;
  handleLogin: ({ email, password }: ILoginInitialState) => Promise<void>;
  handleLogout: () => Promise<void>;
  handleLoginWithGoogle: () => Promise<void>;
}

export const CurrentUserContext = createContext<ICurrentUserContext>({
  currentUser: null,
  currentUserLoaded: false,
  handleRegister: null,
  handleLogin: null,
  handleLogout: null,
  handleLoginWithGoogle: null
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
            const currentUser = await createUserProfileDocument(userAuth);
            setCurrentUser(currentUser);
            setCurrentUserLoaded(true);
          } catch (err) {
            console.error(err);
            openNotification('Cannot create/get user profil', 'Try to reload', 'error');
            setCurrentUserLoaded(true);
          }
        } else {
          setCurrentUser(null);
          setCurrentUserLoaded(true);
        }
        // unsubscribe to prevent onAuthStateChanged when signin or signup method are fired
        unsubscribe();
      },
      (err: firebase.auth.Error) => {
        openNotification('Cannot check for user auth', 'Try to reload', 'error');
        console.error(err);
        setCurrentUserLoaded(true);
        // unsubscribe to prevent onAuthStateChanged when signin or signup method are fired
        unsubscribe();
      }
    );

    return () => unsubscribe();
  }, []);

  const handleLoginWithGoogle = async (): Promise<void> => {
    const { user } = await signInWithGoogle();
    const currentUser: CurrentUser = await createUserProfileDocument(user);
    setCurrentUser(currentUser);
  };

  const handleRegister = async ({ displayName, email, password }: IRegisterInitialState): Promise<void> => {
    const { user } = await register(email, password);
    const currentUser: CurrentUser = await createUserProfileDocument(user, { displayName });
    setCurrentUser(currentUser);
  };

  const handleLogin = async ({ email, password }: ILoginInitialState): Promise<void> => {
    const { user } = await login(email, password);
    const currentUser: CurrentUser = await createUserProfileDocument(user);
    setCurrentUser(currentUser);
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      setCurrentUser(null);
    } catch (err) {
      console.error(err);
      openNotification('Cannot logout', 'Try again', 'error');
    }
  };

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        currentUserLoaded,
        handleRegister,
        handleLogin,
        handleLogout,
        handleLoginWithGoogle
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
});

export default CurrentUserProvider;
