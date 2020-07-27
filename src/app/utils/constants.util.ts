export const GLOBAL_GRID_SIZE: number = 24;
export const LINKS_PER_PAGE: number = 50;
export const SEARCH_ITEMS_PER_LIGNE: number = 1;
export const LINKS_TRANSITION_DElAY: number = 0.1;

// Routes animation
export const SLIDE_ROUTE = -30;
export const SLIDE_UP_ROUTE = 30;

// Media Queries
const MAX_MOBILE = 575;
const MAX_LARGE_MOBILE = 767;
const MAX_TABLET = 1023;
const MAX_DESKTOP = 1449;


export const IS_MOBILE = `(max-width: ${MAX_MOBILE}px)`;
export const IS_LARGE_MOBILE = `(min-width: ${MAX_MOBILE + 1}px) and (max-width: ${MAX_LARGE_MOBILE}px)`;
export const IS_TABLET = `(min-width: ${MAX_LARGE_MOBILE + 1}px) and (max-width: ${MAX_TABLET}px)`;
export const IS_DESKTOP = `(min-width: ${MAX_TABLET + 1}px) and (max-width: ${MAX_DESKTOP}px)`;
export const IS_LARGE_DESKTOP = `(min-width: ${MAX_DESKTOP + 1}px)`;

export const IS_RESPONSIVE = `(max-width: ${MAX_TABLET}px)`
