export interface ICreateLinkInitialState {
  description: string;
  url: string;
}

export interface IRegisterInitialState extends ILoginInitialState {
  name: string;
}

interface ILoginInitialState {
  email: string;
  password: string;
}
