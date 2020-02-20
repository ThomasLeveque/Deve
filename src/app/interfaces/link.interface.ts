import { IUser } from './user.interface';
import { IVote } from './vote.interface';
import { IComment } from './comment.interface';

export interface ILink {
  objectID?: string;
  id?: string;
  url: string;
  description: string;
  category: string;
  postedBy: IUser;
  voteCount: number;
  votes: IVote[];
  comments: IComment[];
  createdAt: Date | number;
  updatedAt: Date | number;
}
