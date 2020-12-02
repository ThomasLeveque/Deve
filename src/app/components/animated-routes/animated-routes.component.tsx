import React from 'react';
import { useLocation, Switch, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { PAGE_EASING } from '../../utils/constants.util';

const transition = { duration: 0.4, ease: PAGE_EASING };

interface RoutesProps {
  exitBeforeEnter?: boolean;
  initial?: boolean;
}

export const AnimatedRoutes: React.FC<RoutesProps> = ({ children, exitBeforeEnter = true, initial = false }) => {
  const location = useLocation();
  return (
    <AnimatePresence exitBeforeEnter={exitBeforeEnter} initial={initial}>
      <Switch location={location} key={location.pathname}>
        {children}
      </Switch>
    </AnimatePresence>
  );
};

interface RouteTransitionProps {
  exact?: boolean;
  path: string;
  slide?: number;
  slideUp?: number;
  fadeIn?: boolean;
  fadeOut?: boolean;
}

export const RouteTransition: React.FC<RouteTransitionProps> = ({
  children,
  exact = false,
  path,
  slide = 0,
  slideUp = 0,
  fadeIn = true,
  fadeOut = true,
  ...rest
}) => (
  <Route exact={exact} path={path} {...rest}>
    <MountTransition slide={slide} slideUp={slideUp} fadeIn={fadeIn} fadeOut={fadeOut}>
      {children}
    </MountTransition>
  </Route>
);

interface MountTransitionProps {
  slide?: number;
  slideUp?: number;
  fadeIn?: boolean;
  fadeOut?: boolean;
}

export const MountTransition: React.FC<MountTransitionProps> = ({ children, slide = 0, slideUp = 0, fadeIn = true, fadeOut = true }) => (
  <motion.div
    exit={{ opacity: fadeOut ? 0 : 1, x: fadeOut ? slide : 0, y: fadeOut ? slideUp : 0 }}
    initial={{ opacity: fadeIn ? 0 : 1, x: fadeIn ? slide : 0, y: fadeIn ? slideUp : 0 }}
    animate={{ opacity: 1, x: 0, y: 0 }}
    transition={transition}
  >
    {children}
  </motion.div>
);
