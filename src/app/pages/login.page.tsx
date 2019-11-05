import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FormikActions } from 'formik';

import firebase from '../firebase';
import {
  IRegisterInitialState,
  ILoginInitialState
} from '../interfaces/initial-states.type';
import { loginSchema, registerSchema } from '../schemas/user.schema';

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
    <div>
      <h2>{login ? 'Login' : 'Create account'}</h2>
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
        {({ isSubmitting, isValid, errors, touched }: any) => (
          <Form className="flex flex-column">
            {!login && (
              <>
                <Field
                  name="name"
                  placeholder="Your name"
                  autoComplete="off"
                  className={errors.name && touched.name && 'error-input'}
                />
                <ErrorMessage
                  component="span"
                  name="name"
                  className="error-text"
                />
              </>
            )}
            <Field
              name="email"
              placeholder="Your email"
              autoComplete="off"
              className={errors.email && touched.email && 'error-input'}
            />
            <ErrorMessage
              component="span"
              name="email"
              className="error-text"
            />

            <Field
              name="password"
              type="password"
              className={errors.password && touched.password && 'error-input'}
              placeholder="Choose a secure password"
            />
            <ErrorMessage
              component="span"
              name="password"
              className="error-text"
            />

            {firebaseError && <p className="error-text">{firebaseError}</p>}
            <div className="flex mt3">
              <button
                type="submit"
                className="button pointer mr2"
                disabled={isSubmitting || !isValid}
                style={{
                  backgroundColor: isSubmitting || !isValid ? 'grey' : 'orange'
                }}
              >
                Submit
              </button>
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
