import React from 'react';
import { FirebaseContext } from '../../firebase';

const ForgotPassword: React.FC = () => {
  const { firebase } = React.useContext(FirebaseContext);

  const [resetPasswordEmail, setResetPasswordEmail] = React.useState<string>('');
  const [isPasswordReset, setIsPasswordReset] = React.useState<boolean>(false);
  const [passwordResetError, setPasswordResetError] = React.useState<string | null>(null);

  const handleResetPassword = async (): Promise<void> => {
    try {
      await firebase.resetPassword(resetPasswordEmail);
      setIsPasswordReset(true);
      setPasswordResetError(null);
    } catch (err) {
      console.error('Error sending email', err);
      setPasswordResetError(err.message);
      setIsPasswordReset(false);
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder="Provide your account email"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => setResetPasswordEmail(event.target.value)}
      />
      <div>
        <button className="button" onClick={handleResetPassword}>
          Reset password
        </button>
      </div>
      {isPasswordReset && <p>Check email to reset password !</p>}
      {passwordResetError && <p className="error-text">{passwordResetError}</p>}
    </div>
  );
}

export default ForgotPassword;
