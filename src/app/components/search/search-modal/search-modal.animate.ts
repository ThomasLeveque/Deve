export const animateModal = {
  animate: {
    opacity: 1,
    transition: { ease: 'easeOut' }
  },
  initial: {
    opacity: 0
  },
  exit: {
    opacity: 0
  }
};

export const animateModalContainer = {
  animate: {
    y: 0,
    transition: { delay: 0.1, ease: 'easeOut' }
  },
  initial: {
    y: 60
  }
};
