export interface ICreateLinkErrors {
  url: string;
  description: string;
}

export interface IRegisterErrors extends ILoginErrors {
  name: string;
}

export interface ILoginErrors {
  email: string;
  password: string;
}


