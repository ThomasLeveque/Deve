import { ILoginErrors } from "../../interfaces/errors";

export default function validateLogin(values: any) {
  let errors: ILoginErrors = {
    email: '',
    password: ''
  };

  // Email Erros
  if (!values.email) {
    errors.email = 'Email required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  // Password Erros
  if (!values.password) {
    errors.password = 'Password required';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  return errors;
}
