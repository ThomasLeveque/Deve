import React from 'react';
import { FirebaseContext } from '../firebase';
import { IResetInitialState } from '../interfaces/initial-states.type';
import { Formik, FormikActions, FormikProps, Form, Field } from 'formik';
import { resetSchema } from '../schemas/user.schema';
import { FormInput } from '../shared/components/input/input';

const INITIAL_RESET_STATE: IResetInitialState = {
  email: ''
};

const ForgotPasswordPage: React.FC = () => {
  const { firebase } = React.useContext(FirebaseContext);

  const [isPasswordReset, setIsPasswordReset] = React.useState<boolean>(false);
  const [passwordResetError, setPasswordResetError] = React.useState<
    string | null
  >(null);

  const handleResetPassword = async (
    values: IResetInitialState
  ): Promise<void> => {
    const { email }: IResetInitialState = values;
    try {
      await firebase.resetPassword(email);
      setIsPasswordReset(true);
      setPasswordResetError(null);
    } catch (err) {
      console.error('Error sending email', err);
      setPasswordResetError(err.message);
      setIsPasswordReset(false);
    }
  };

  return (
    <div className="reset-page">
      <h1 className="text-align-center">Reset password</h1>
      <Formik
        initialValues={INITIAL_RESET_STATE}
        validationSchema={resetSchema}
        onSubmit={async (
          values: IResetInitialState,
          { setSubmitting }: FormikActions<IResetInitialState>
        ) => {
          await handleResetPassword(values);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, isValid }: FormikProps<IResetInitialState>) => (
          <Form autoComplete="off">
            <Field
              name="email"
              placeholder="Provide your account email"
              autoComplete="off"
              type="text"
              component={FormInput}
            />
            <button
              type="submit"
              className="button pointer"
              disabled={isSubmitting || !isValid}
              style={{
                backgroundColor: isSubmitting || !isValid ? 'grey' : 'orange'
              }}
            >
              Reset password
            </button>
          </Form>
        )}
      </Formik>
      {isPasswordReset && <p>Check email to reset password !</p>}
      {passwordResetError && <p className="error-text">{passwordResetError}</p>}
    </div>
  );
};

export default ForgotPasswordPage;
