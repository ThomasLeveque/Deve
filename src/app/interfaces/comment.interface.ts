import { IUser } from './user.interface';

export interface IComment {
  postedBy: IUser;
  created: Date;
  text: string;
}
