import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { Formik, Form, Field, FormikHelpers, FormikProps } from 'formik';
import { Tabs } from 'antd';

import { FormInput } from '../../components/form-input/form-input.component';
import Button from '../../components/custom-button/custom-button.component';
import UnderlineLink from '../../components/underline-link/underline-link.component';

import { login, register, createUserProfileDocument, signInWithGoole } from '../../firebase/firebase.service';
import { IRegisterInitialState, ILoginInitialState } from '../../interfaces/initial-states.type';
import { loginSchema, registerSchema } from '../../schemas/user.schema';

import './sign-in-and-sign-up.styles.less';

const INITIAL_LOGIN_STATE: ILoginInitialState = {
  email: '',
  password: ''
};

const INITIAL_REGISTER_STATE: IRegisterInitialState = {
  displayName: '',
  ...INITIAL_LOGIN_STATE
};

const SignInAndSignUpPage: React.FC<RouteComponentProps<{}>> = ({ history }) => {
  const [tabStatus, setTabStatus] = React.useState<number>(1);
  const [firebaseError, setFirebaseError] = React.useState<string | null>(null);
  const [withGoogleLoading, setWithGoogleLoading] = React.useState<boolean>(false);
  const { TabPane } = Tabs;

  const authenticateUser = async (values: IRegisterInitialState | ILoginInitialState): Promise<void> => {
    const { displayName, email, password }: IRegisterInitialState = values;
    try {
      if (isLogin()) {
        await login(email, password);
      } else {
        const { user } = await register(email, password);
        await createUserProfileDocument(user, { displayName });
      }
      history.push('/');
    } catch (err) {
      setFirebaseError(err.message || err.toString());
    }
  };

  const authenticateUserWithGoogle = async (): Promise<void> => {
    try {
      setWithGoogleLoading(true);
      await signInWithGoole();
      setWithGoogleLoading(false);
    } catch (err) {
      setFirebaseError(err.message);
      setWithGoogleLoading(false);
    }
  };

  const isLogin = (): boolean => !!tabStatus;

  return (
    <div className="sign-in-and-sign-up-page">
      <Formik
        initialValues={isLogin() ? INITIAL_LOGIN_STATE : INITIAL_REGISTER_STATE}
        validationSchema={isLogin() ? loginSchema : registerSchema}
        onSubmit={async (
          values: IRegisterInitialState | ILoginInitialState,
          { setSubmitting }: FormikHelpers<IRegisterInitialState | ILoginInitialState>
        ) => {
          await authenticateUser(values);
          setSubmitting(false);
        }}
        enableReinitialize
      >
        {({ isSubmitting, isValid }: FormikProps<IRegisterInitialState | ILoginInitialState>) => (
          <>
            <Tabs
              size="large"
              defaultActiveKey="1"
              onChange={(key: string) => {
                setTabStatus(+key);
              }}
            >
              <TabPane tab="Sign in" key="1" />
              <TabPane tab="Sign up" key="0" />
            </Tabs>
            <Form autoComplete="on" className="flex column align-items-center">
              {!isLogin() && (
                <Field
                  autoComplete="on"
                  name="displayName"
                  placeholder="Your name"
                  type="text"
                  hasLabel
                  label="Name"
                  component={FormInput}
                />
              )}
              <Field name="email" autoComplete="on" placeholder="Your email" type="text" hasLabel label="Email" component={FormInput} />
              <Field
                name="password"
                placeholder="Choose a secure password"
                autoComplete="current-password"
                type="password"
                hasLabel
                label="Password (at least 6 characters)"
                component={FormInput}
              />
              {firebaseError && <p className="error-text text-align-center">{firebaseError}</p>}
              <Button
                text={isLogin() ? 'Sign in' : 'Sign up'}
                buttonType="primary"
                type="submit"
                disabled={isSubmitting || !isValid}
                loading={isSubmitting}
              />
              <UnderlineLink type="insider" to="/forgot">
                Forgot password ?
              </UnderlineLink>
              {isLogin() && (
                <Button
                  text="Sign in with"
                  type="button"
                  buttonType="with-google"
                  hasIcon
                  iconType="google"
                  loading={withGoogleLoading}
                  disabled={withGoogleLoading}
                  onClick={authenticateUserWithGoogle}
                />
              )}
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
};

export default withRouter(SignInAndSignUpPage);
