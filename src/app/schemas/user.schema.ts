import * as yup from 'yup';

const nameMax = 255;
const emailMax = 255;
const passwordMin = 6;
const passwordMax = 64;

const emailSchema = {
  email: yup
    .string()
    .email('Invalid email address')
    .max(emailMax, `Email must be shorter than ${emailMax} characters`)
    .required('Email required')
};

const emailPasswordSchema = {
  ...emailSchema,
  password: yup
    .string()
    .min(passwordMin, `Password must be at least ${passwordMin} characters`)
    .max(passwordMax, `Password must be shorter than ${passwordMax} characters`)
    .required('Password required')
};

const registerSchema = yup.object().shape({
  displayName: yup
    .string()
    .max(nameMax, `Name must be shorter than ${nameMax} characters`)
    .required('Name required'),
  ...emailPasswordSchema
});

const loginSchema = yup.object().shape(emailPasswordSchema);

const resetSchema = yup.object().shape(emailSchema);

export { registerSchema, loginSchema, resetSchema };
