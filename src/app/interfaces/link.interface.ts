import { IVote } from './vote.interface';
import { IComment } from './comment.interface';
import CurrentUser from '../models/current-user.model';

export interface ILink {
  objectID?: string;
  id?: string;
  url: string;
  description: string;
  category: string;
  postedBy: CurrentUser;
  voteCount: number;
  votes: IVote[];
  comments: IComment[];
  createdAt: Date | number;
  updatedAt: Date | number;
}
