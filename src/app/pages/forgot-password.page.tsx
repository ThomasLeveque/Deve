import React from 'react';
import { FirebaseContext } from '../firebase';
import { IResetInitialState } from '../interfaces/initial-states.type';
import { Formik, FormikHelpers, FormikProps, Form, Field } from 'formik';
import { resetSchema } from '../schemas/user.schema';
import { FormInput } from '../shared/components/input/input';
import Button from '../shared/components/button/button';

const INITIAL_RESET_STATE: IResetInitialState = {
  email: ''
};

const ForgotPasswordPage: React.FC = () => {
  const { firebase, openNotification } = React.useContext(FirebaseContext);

  const [passwordResetError, setPasswordResetError] = React.useState<string | null>(null);

  const handleResetPassword = async (values: IResetInitialState): Promise<void> => {
    const { email }: IResetInitialState = values;
    try {
      await firebase.resetPassword(email);
      openNotification('Email send', `to ${email}`, 'success');
      setPasswordResetError(null);
    } catch (err) {
      openNotification('Error sending email', err.message, 'error');
      console.error(err);
      setPasswordResetError(err.message);
    }
  };

  return (
    <div className="reset-page">
      <h1 className="text-align-center">Reset password</h1>
      <Formik
        initialValues={INITIAL_RESET_STATE}
        validationSchema={resetSchema}
        onSubmit={async (values: IResetInitialState, { setSubmitting }: FormikHelpers<IResetInitialState>) => {
          await handleResetPassword(values);
          setSubmitting(false);
        }}
        enableReinitialize
      >
        {({ isSubmitting, isValid }: FormikProps<IResetInitialState>) => (
          <Form className="flex column align-items-center">
            <Field name="email" autoComplete="on" placeholder="Your email" type="text" hasLabel label="Email" component={FormInput} />
            {passwordResetError && <p className="error-text text-align-center">{passwordResetError}</p>}
            <Button text="Reset password" buttonType="primary" type="submit" disabled={isSubmitting || !isValid} loading={isSubmitting}>
              Reset password
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ForgotPasswordPage;
