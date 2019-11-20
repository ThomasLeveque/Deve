import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Formik, Form, Field, FormikActions, FormikProps } from 'formik';

import firebase from '../firebase';
import {
  IRegisterInitialState,
  ILoginInitialState
} from '../interfaces/initial-states.type';
import { loginSchema, registerSchema } from '../schemas/user.schema';
import { FormInput } from '../shared/components/input/input';
import Button from '../shared/components/button/button';

const INITIAL_LOGIN_STATE: ILoginInitialState = {
  email: '',
  password: ''
};

const INITIAL_REGISTER_STATE: IRegisterInitialState = {
  name: '',
  ...INITIAL_LOGIN_STATE
};

const LoginPage: React.FC<RouteComponentProps> = ({ history }) => {
  const [login, setLogin] = React.useState<boolean>(true);
  const [firebaseError, setFirebaseError] = React.useState<string | null>(null);

  const authenticateUser = async (
    values: IRegisterInitialState | ILoginInitialState
  ): Promise<void> => {
    const { name, email, password }: IRegisterInitialState = values;
    try {
      login
        ? await firebase.login(email, password)
        : await firebase.register(name, email, password);
      history.push('/');
    } catch (err) {
      setFirebaseError(err.message);
    }
  };

  return (
    <div className="login-page">
      <h1 className="text-align-center">
        {login ? 'Login' : 'Create account'}
      </h1>
      <Formik
        initialValues={login ? INITIAL_LOGIN_STATE : INITIAL_REGISTER_STATE}
        validationSchema={login ? loginSchema : registerSchema}
        onSubmit={async (
          values: IRegisterInitialState | ILoginInitialState,
          {
            setSubmitting
          }: FormikActions<IRegisterInitialState | ILoginInitialState>
        ) => {
          await authenticateUser(values);
          setSubmitting(false);
        }}
      >
        {({
          isSubmitting,
          isValid
        }: FormikProps<IRegisterInitialState | ILoginInitialState>) => (
          <Form autoComplete="off">
            {!login && (
              <Field
                name="name"
                placeholder="Your name"
                autoComplete="off"
                type="text"
                component={FormInput}
              />
            )}
            <Field
              name="email"
              placeholder="Your email"
              autoComplete="off"
              type="text"
              component={FormInput}
            />

            <Field
              name="password"
              placeholder="Choose a secure password"
              autoComplete="current-password"
              type="password"
              component={FormInput}
            />

            {firebaseError && <p className="error-text">{firebaseError}</p>}
            <div className="flex mt3">
              <Button
                text="Submitttt"
                type="submit"
                className="button pointer mr2"
                disabled={isSubmitting || !isValid}
              />
              <button
                type="button"
                className="pointer button"
                onClick={() => setLogin((prevLogin: boolean) => !prevLogin)}
              >
                {login
                  ? 'Need to create an account ?'
                  : 'Already have an account ?'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
      <div className="forgot-password">
        <Link to="/forgot">Forgot password ?</Link>
      </div>
    </div>
  );
};

export default LoginPage;
