import React, { useContext } from 'react';
import { Formik, FormikHelpers, FormikProps, Form, Field } from 'formik';

import NotifContext from '../../contexts/notif/notif.context';
import { resetPassword } from '../../firebase/firebase.service';

import { FormInput } from '../../components/form-input/form-input.component';
import CustomButton from '../../components/custom-button/custom-button.component';

import { IResetInitialState } from '../../interfaces/initial-states.type';
import { resetSchema } from '../../schemas/user.schema';

import './forgot-password.styles.less';

const INITIAL_RESET_STATE: IResetInitialState = {
  email: ''
};

const ForgotPasswordPage: React.FC = () => {
  const { openNotification } = useContext(NotifContext);

  const [passwordResetError, setPasswordResetError] = React.useState<string | null>(null);

  const handleResetPassword = async (values: IResetInitialState): Promise<void> => {
    const { email }: IResetInitialState = values;
    try {
      await resetPassword(email);
      openNotification('Email send', `to ${email}`, 'success');
      setPasswordResetError(null);
    } catch (err) {
      openNotification('Error sending email', err.message, 'error');
      console.error(err);
      setPasswordResetError(err.message);
    }
  };

  return (
    <div className="forgot-password-page">
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
            <CustomButton
              text="Reset password"
              buttonType="primary"
              type="submit"
              disabled={isSubmitting || !isValid}
              loading={isSubmitting}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ForgotPasswordPage;
