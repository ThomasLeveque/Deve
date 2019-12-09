import React from 'react';
import { FirebaseContext } from '../firebase';
import { IResetInitialState } from '../interfaces/initial-states.type';
import { Formik, FormikActions, FormikProps, Form, Field } from 'formik';
import { resetSchema } from '../schemas/user.schema';
import { FormInput } from '../shared/components/input/input';
import Button from '../shared/components/button/button';

const INITIAL_RESET_STATE: IResetInitialState = {
  email: ''
};

const ForgotPasswordPage: React.FC = () => {
  const { firebase, _window } = React.useContext(FirebaseContext);

  const [passwordResetError, setPasswordResetError] = React.useState<string | null>(null);

  const handleResetPassword = async (values: IResetInitialState): Promise<void> => {
    const { email }: IResetInitialState = values;
    try {
      await firebase.resetPassword(email);
      _window.flash('Check email to reset password !', 'success');
      setPasswordResetError(null);
    } catch (err) {
      console.error('Error sending email', err);
      setPasswordResetError(err.message);
    }
  };

  return (
    <div className="reset-page">
      <h1 className="text-align-center">Reset password</h1>
      <Formik
        initialValues={INITIAL_RESET_STATE}
        validationSchema={resetSchema}
        onSubmit={async (values: IResetInitialState, { setSubmitting }: FormikActions<IResetInitialState>) => {
          await handleResetPassword(values);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, isValid }: FormikProps<IResetInitialState>) => (
          <Form autoComplete="off" className="flex column align-items-center">
            <Field name="email" placeholder="Provide your account email" autoComplete="off" type="text" component={FormInput} />
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
