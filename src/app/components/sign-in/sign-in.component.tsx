import React from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Form, Field, FormikHelpers, FormikProps } from 'formik';
import { GoogleOutlined } from '@ant-design/icons';
import { Divider } from 'antd';

// Components
import { FormInput } from '../../components/form-input/form-input.component';
import CustomButton from '../../components/custom-button/custom-button.component';
import UnderlineLink from '../../components/underline-link/underline-link.component';

// Others
import { ILoginInitialState } from '../../interfaces/initial-states.type';
import { loginSchema } from '../../schemas/user.schema';
import { formatError } from '../../utils/format-string.util';
import { useNotification } from '../../contexts/notif/notif.context';
import { useCurrentUser } from '../../providers/current-user/current-user.provider';

const INITIAL_LOGIN_STATE: ILoginInitialState = {
  email: '',
  password: ''
};

const SignIn: React.FC = () => {
  const [firebaseError, setFirebaseError] = React.useState<string | null>(null);
  const [withGoogleLoading, setWithGoogleLoading] = React.useState<boolean>(false);
  const history = useHistory();
  const { openNotification } = useNotification();
  const { handleLoginWithGoogle, handleLogin } = useCurrentUser();

  const authenticateUserWithGoogle = async (): Promise<void> => {
    try {
      setWithGoogleLoading(true);
      await handleLoginWithGoogle();
      // not setting withGoogleLoading to false because this component will unmount
      history.push('/');
    } catch (err) {
      console.error(err);
      setFirebaseError(formatError(err));
      openNotification('Cannot login with google', 'Try again', 'error');
      setWithGoogleLoading(false);
    }
  };

  return (
    <Formik
      initialValues={INITIAL_LOGIN_STATE}
      validationSchema={loginSchema}
      onSubmit={async (values: ILoginInitialState, { setSubmitting }: FormikHelpers<ILoginInitialState>) => {
        try {
          await handleLogin(values);
          // not setting submitting to false because this component will unmount
          history.push('/');
        } catch (err) {
          console.error(err);
          setFirebaseError(formatError(err));
          openNotification('Cannot login with email and password', 'Try again', 'error');
          setSubmitting(false);
        }
      }}
      enableReinitialize
    >
      {({ isSubmitting, isValid }: FormikProps<ILoginInitialState>) => (
        <Form autoComplete="on" className="sign-in flex column align-items-center">
          <Field name="email" autoComplete="email" placeholder="Your email" type="text" hasLabel label="Email" component={FormInput} />
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
          <CustomButton text="Sign in" buttonType="primary" type="submit" disabled={isSubmitting || !isValid} loading={isSubmitting} />
          <UnderlineLink type="insider" to="/forgot">
            Forgot password ?
          </UnderlineLink>
          <Divider />
          <CustomButton
            text="Sign in with"
            type="button"
            buttonType="with-google"
            hasIcon
            Icon={GoogleOutlined}
            loading={withGoogleLoading}
            disabled={withGoogleLoading}
            onClick={authenticateUserWithGoogle}
          />
        </Form>
      )}
    </Formik>
  );
};

export default SignIn;
