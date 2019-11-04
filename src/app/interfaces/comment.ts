import { IUser } from './user';

export interface IComment {
  postedBy: IUser;
  created: Date;
  text: string;
}
