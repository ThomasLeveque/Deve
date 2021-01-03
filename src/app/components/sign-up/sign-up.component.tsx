import React from 'react';
import { useHistory } from 'react-router-dom';
import { Formik, Form, Field, FormikHelpers, FormikProps } from 'formik';

// Components
import { FormInput } from '../../components/form-input/form-input.component';
import CustomButton from '../../components/custom-button/custom-button.component';

// Others
import { IRegisterInitialState } from '../../interfaces/initial-states.type';
import { registerSchema } from '../../schemas/user.schema';
import { formatError } from '../../utils/format-string.util';
import { useNotification } from '../../contexts/notif/notif.context';
import { useCurrentUser } from '../../providers/current-user/current-user.provider';

const INITIAL_REGISTER_STATE: IRegisterInitialState = {
  displayName: '',
  email: '',
  password: ''
};

const SignUp: React.FC = () => {
  const [firebaseError, setFirebaseError] = React.useState<string | null>(null);
  const history = useHistory();
  const { openNotification } = useNotification();
  const { handleRegister } = useCurrentUser();

  return (
    <Formik
      initialValues={INITIAL_REGISTER_STATE}
      validationSchema={registerSchema}
      onSubmit={async (values: IRegisterInitialState, { setSubmitting }: FormikHelpers<IRegisterInitialState>) => {
        try {
          await handleRegister(values);
          // not setting submitting to false because this component will unmount
          history.push('/');
        } catch (err) {
          console.error(err);
          openNotification('Cannot register you', 'Try again', 'error');
          setFirebaseError(formatError(err));
          setSubmitting(false);
        }
      }}
      enableReinitialize
    >
      {({ isSubmitting, isValid }: FormikProps<IRegisterInitialState>) => (
        <Form autoComplete="on" className="sign-up flex column align-items-center">
          <Field
            autoComplete="username"
            name="displayName"
            placeholder="Your name"
            type="text"
            hasLabel
            label="Name"
            component={FormInput}
          />
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
          <CustomButton text="Sign up" buttonType="primary" type="submit" disabled={isSubmitting || !isValid} loading={isSubmitting} />
        </Form>
      )}
    </Formik>
  );
};

export default SignUp;
