import * as yup from 'yup';
import { linkSchema } from '../schemas/link.schema';
import { registerSchema, loginSchema } from '../schemas/user.schema';

export type ICreateLinkInitialState = yup.InferType<typeof linkSchema>;

export type IRegisterInitialState = yup.InferType<typeof registerSchema>;

export type ILoginInitialState = yup.InferType<typeof loginSchema>;
