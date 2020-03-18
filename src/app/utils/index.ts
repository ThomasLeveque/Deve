import { FormikErrors, FormikTouched } from 'formik';

export const LINKS_PER_PAGE: number = 20;

export const ITEMS_PER_LIGNE: number = 3;
export const SEARCH_ITEMS_PER_LIGNE: number = 1;
export const LINKS_TRANSITION_DElAY: number = 140;

export function getDomain(url: string): string {
  return url.replace(/^https?:\/\//i, '').split('/')[0];
}

export const isError = (errors: FormikErrors<any>, touched: FormikTouched<any>, name: string): boolean => {
  return !!(errors[name] && touched[name]);
};

export const isValid = (errors: FormikErrors<any>, touched: FormikTouched<any>, name: string): boolean => {
  return !!(!errors[name] && touched[name]);
};

export const formatError = (err: any): string => {
  return err.message || err.toString();
};
