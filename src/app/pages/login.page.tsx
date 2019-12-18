import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Formik, Form, Field, FormikActions, FormikProps } from 'formik';
import { Tabs } from 'antd';

import firebase from '../firebase';
import { IRegisterInitialState, ILoginInitialState } from '../interfaces/initial-states.type';
import { loginSchema, registerSchema } from '../schemas/user.schema';
import { FormInput } from '../shared/components/input/input';
import Button from '../shared/components/button/button';
import UnderlineLink from '../components/underline-link/underline-link';

const INITIAL_LOGIN_STATE: ILoginInitialState = {
  email: '',
  password: ''
};

const INITIAL_REGISTER_STATE: IRegisterInitialState = {
  name: '',
  ...INITIAL_LOGIN_STATE
};

const LoginPage: React.FC<RouteComponentProps> = ({ history }) => {
  const [login, setLogin] = React.useState<number>(0);
  const [firebaseError, setFirebaseError] = React.useState<string | null>(null);
  const { TabPane } = Tabs;

  const authenticateUser = async (values: IRegisterInitialState | ILoginInitialState): Promise<void> => {
    const { name, email, password }: IRegisterInitialState = values;
    try {
      login === 0 ? await firebase.login(email, password) : await firebase.register(name, email, password);
      history.push('/');
    } catch (err) {
      setFirebaseError(err.message);
    }
  };

  return (
    <div className="login-page">
      <Formik
        initialValues={login === 0 ? INITIAL_LOGIN_STATE : INITIAL_REGISTER_STATE}
        validationSchema={login === 0 ? loginSchema : registerSchema}
        onSubmit={async (
          values: IRegisterInitialState | ILoginInitialState,
          { setSubmitting }: FormikActions<IRegisterInitialState | ILoginInitialState>
        ) => {
          await authenticateUser(values);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, isValid, setFieldValue }: FormikProps<IRegisterInitialState | ILoginInitialState>) => (
          <>
            <Tabs
              size="large"
              defaultActiveKey="0"
              onChange={(key: string) => {
                setLogin(+key);
                setFieldValue('name', '');
              }}
            >
              <TabPane tab="Sign in" key="0" />
              <TabPane tab="Sign up" key="1" />
            </Tabs>
            <Form autoComplete="off" className="flex column align-items-center">
              {login !== 0 && (
                <>
                  <label htmlFor="name">Name</label>
                  <Field name="name" placeholder="Your name" autoComplete="off" type="text" component={FormInput} />
                </>
              )}
              <label htmlFor="email">Email</label>
              <Field name="email" placeholder="Your email" autoComplete="off" type="text" component={FormInput} />
              <label htmlFor="password">Password (at least 6 characters)</label>
              <Field
                name="password"
                placeholder="Choose a secure password"
                autoComplete="current-password"
                type="password"
                component={FormInput}
              />
              {firebaseError && <p className="error-text text-align-center">{firebaseError}</p>}
              <Button
                text={login === 0 ? 'Sign in' : 'Sign up'}
                buttonType="primary"
                type="submit"
                disabled={isSubmitting || !isValid}
                loading={isSubmitting}
              />
              <UnderlineLink type="insider" to="/forgot">
                Forgot password ?
              </UnderlineLink>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;
