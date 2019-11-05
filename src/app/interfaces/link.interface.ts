import { IUser } from './user.interface';
import { IVote } from './vote.interface';
import { IComment } from './comment.interface';

export interface ILink {
  id?: string;
  url: string;
  description: string;
  category: string;
  created: Date | number;
  postedBy: IUser;
  voteCount: number;
  votes: IVote[];
  comments: IComment[];
}

export interface ICategory {
  id?: string;
  name: string;
}
