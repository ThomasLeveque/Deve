import React, { Suspense, lazy } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

const HomePage = lazy(() => import('./pages/home/home.page'));
const AddLinkPage = lazy(() => import('./pages/add-link/add-link.page'));
const SignInAndSignUpPage = lazy(() => import('./pages/sign-in-and-sign-up/sign-in-and-sign-up.page'));
const ForgotPasswordPage = lazy(() => import('./pages/forgot-password/forgot-password.page'));
const LinkDetailPage = lazy(() => import('./pages/link-detail/link-detail.page'));

import Loading from './components/loading/loading.component';

import { useCurrentUser } from './providers/current-user/current-user.provider';

const AppRoutes = () => {
  const { currentUser } = useCurrentUser();

  return (
    <Switch>
      <Route path="/" exact render={() => <Redirect to="/links" />} />
      <Suspense fallback={<Loading />}>
        <Route exact path="/add" render={() => (currentUser ? <AddLinkPage /> : <Redirect to="/signin" />)} />
        <Route exact path="/signin" render={() => (currentUser ? <Redirect to="/" /> : <SignInAndSignUpPage />)} />
        <Route exact path="/forgot" render={() => (currentUser ? <Redirect to="/" /> : <ForgotPasswordPage />)} />
        <Route exact path="/links" component={HomePage} />
        <Route path="/links/:linkId" component={LinkDetailPage} />
      </Suspense>
    </Switch>
  );
};

export default AppRoutes;
