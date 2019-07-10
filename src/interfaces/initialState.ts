import * as yup from 'yup';
import { linkSchema } from '../validationSchema/linkSchema';
import { registerSchema, loginSchema } from '../validationSchema/userSchema';

export type ICreateLinkInitialState = yup.InferType<typeof linkSchema>;

export type IRegisterInitialState = yup.InferType<typeof registerSchema>;

export type ILoginInitialState = yup.InferType<typeof loginSchema>;
