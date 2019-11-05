import * as yup from 'yup';

const emailPasswordSchema = {
  email: yup
    .string()
    .email('Invalid email address')
    .max(255)
    .required('Email required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(64, 'Password must be shorter than 64 characters')
    .required('Password required')
};

const registerSchema = yup.object().shape({
  name: yup
    .string()
    .max(255)
    .required('Name required'),
  ...emailPasswordSchema
});

const loginSchema = yup.object().shape(emailPasswordSchema);

export { registerSchema, loginSchema };
