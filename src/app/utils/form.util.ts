import { FormikErrors, FormikTouched } from 'formik';

export const isError = (errors: FormikErrors<any>, touched: FormikTouched<any>, name: string): boolean => {
  return !!(errors[name] && touched[name]);
};

export const isValid = (errors: FormikErrors<any>, touched: FormikTouched<any>, name: string): boolean => {
  return !!(!errors[name] && touched[name]);
};
