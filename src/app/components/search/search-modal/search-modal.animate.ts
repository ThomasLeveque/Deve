import { PAGE_EASING } from '../../../utils/constants.util';

export const animateModal = {
  animate: {
    opacity: 1,
    transition: { duration: 0.6, ease: PAGE_EASING }
  },
  initial: {
    opacity: 0
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.6, ease: PAGE_EASING }
  }
};

export const animateModalContainer = {
  animate: {
    y: 0,
    transition: { delay: 0.1, duration: 0.3, ease: PAGE_EASING }
  },
  initial: {
    y: 60
  }
};
