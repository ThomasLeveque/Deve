import * as yup from 'yup';
import { linkSchema, commentSchema } from '../schemas/link.schema';
import { registerSchema, loginSchema, resetSchema } from '../schemas/user.schema';

export type IAddCommentInitialState = yup.InferType<typeof commentSchema>;

export type ICreateLinkInitialState = yup.InferType<typeof linkSchema>;

export type IRegisterInitialState = yup.InferType<typeof registerSchema>;

export type ILoginInitialState = yup.InferType<typeof loginSchema>;

export type IResetInitialState = yup.InferType<typeof resetSchema>;
