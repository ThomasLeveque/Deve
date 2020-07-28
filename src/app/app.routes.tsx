import React, { Suspense, lazy } from 'react';
import { Route, Redirect } from 'react-router-dom';

const HomePage = lazy(() => import('./pages/home/home.page'));
const AddLinkPage = lazy(() => import('./pages/add-link/add-link.page'));
const SignInAndSignUpPage = lazy(() => import('./pages/sign-in-and-sign-up/sign-in-and-sign-up.page'));
const ForgotPasswordPage = lazy(() => import('./pages/forgot-password/forgot-password.page'));
const LinkDetailPage = lazy(() => import('./pages/link-detail/link-detail.page'));

import Loading from './components/loading/loading.component';
import NotFound from './pages/not-found/not-found.page';

import { AnimatedRoutes, RouteTransition } from './components/animated-routes/animated-routes.component';
import { SLIDE_ROUTE, SLIDE_UP_ROUTE } from './utils/constants.util';
import { useCurrentUser } from './providers/current-user/current-user.provider';

const AppRoutes = () => {
  const { currentUser } = useCurrentUser();

  return (
    <Suspense fallback={<Loading />}>
      <AnimatedRoutes initial>
        <RouteTransition path="/links" exact>
          <Redirect to="/" />
        </RouteTransition>
        <RouteTransition path="/" exact>
          <HomePage />
        </RouteTransition>
        <RouteTransition exact path="/add" slide={SLIDE_ROUTE}>
          {currentUser ? <AddLinkPage /> : <Redirect to="/signin" />}
        </RouteTransition>
        <RouteTransition exact path="/signin" slideUp={SLIDE_UP_ROUTE}>
          {currentUser ? <Redirect to="/" /> : <SignInAndSignUpPage />}
        </RouteTransition>
        <RouteTransition exact path="/forgot" slideUp={SLIDE_UP_ROUTE}>
          {currentUser ? <Redirect to="/" /> : <ForgotPasswordPage />}
        </RouteTransition>
        <RouteTransition path="/links/:linkId" fadeIn={false} slide={SLIDE_ROUTE}>
          <LinkDetailPage />
        </RouteTransition>
        <RouteTransition path="*">
          <NotFound />
        </RouteTransition>
      </AnimatedRoutes>
    </Suspense>
  );
};

export default AppRoutes;
