import React from "react";
import { Link } from "react-router-dom";

import useFormValidation from './useFormValidation';
import validateLogin from "./validateLogin";
import firebase from '../../firebase';

const INITIAL_STATE = {
  name: "",
  email: "",
  password: "",
}

const Login = (props) => {
  const [login, setLogin] = React.useState(true);
  const [firebaseError, setFirebaseError] = React.useState(null);

  const authenticateUser = async () => {
    const { name, email, password } = values
    try {
      login
      ? await firebase.login(email, password)
      : await firebase.register(name, email, password);
      props.history.push('/');
    } catch(err) {
      console.log('auth error', err);
      setFirebaseError(err.message);
    }
  }

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    errors,
    isSubmitting 
  } = useFormValidation(INITIAL_STATE, validateLogin, authenticateUser);

  return (
    <div>
      <h2>{login ? 'Login' : 'Create account'}</h2>
      <form onSubmit={handleSubmit} className="flex flex-column">
        {!login && <input 
          type="text"
          name="name"
          value={values.name}
          placeholder="Your name"
          autoComplete="off"
          onChange={handleChange}
        />}
        <input 
          type="email"
          name="email"
          value={values.email}
          placeholder="Your email"
          autoComplete="off"
          className={errors.email && 'error-input'}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
        <input 
          type="password"
          name="password"
          value={values.password}
          className={errors.password && 'error-input'}
          placeholder="Choose a secure password"
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}
        {firebaseError && <p className="error-text">{firebaseError}</p>}
        <div className="flex mt3">
          <button type="submit" className="button pointer mr2" disabled={isSubmitting}
          style={{backgroundColor: isSubmitting ? 'grey' : 'orange'}}>
            Submit
          </button>
          <button type="button" className="pointer button" onClick={() => setLogin(prevLogin => !prevLogin)}>
            {login ?  'Need to create an account ?' : 'Already have an account ?'}
          </button>
        </div>
      </form>
      <div className="forgot-password">
        <Link to="/forgot">Forgot password ?</Link>
      </div>
    </div>
  );
}

export default Login;
