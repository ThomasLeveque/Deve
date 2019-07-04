import { IUser } from './user';
import { IVote } from './vote';
import { IComment } from './comment';

export interface ILink {
  id?: string;
  url: string;
  description: string;
  created: Date | number;
  postedBy: IUser;
  voteCount: number;
  votes: IVote[];
  comments: IComment[];
}
