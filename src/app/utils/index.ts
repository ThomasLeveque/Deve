import { FormikErrors, FormikTouched } from 'formik';

export const LINKS_PER_PAGE = 8;

export function getDomain(url: string) {
  return url.replace(/^https?:\/\//i, '').split('/')[0];
}

/* EMAIL REGEX: !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email) */
/* URL REGEX: !/^(ftp|http|https):\/\/[^ "]+$/.test(values.url) */

export const isError = (errors: FormikErrors<any>, touched: FormikTouched<any>, name: string): boolean => {
  return !!(errors[name] && touched[name]);
};

export const isValid = (errors: FormikErrors<any>, touched: FormikTouched<any>, name: string): boolean => {
  return !!(!errors[name] && touched[name]);
};
