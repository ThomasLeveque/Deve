import CurrentUser from './current-user.model';
import { IVote } from '../interfaces/vote.interface';
import { IComment } from '../interfaces/comment.interface';

export class BaseLink {
  url: string;
  description: string;
  categories: string[];
  postedBy: CurrentUser;
  voteCount: number;
  votes: IVote[];
  comments: IComment[];
  createdAt: Date | number;
  updatedAt: Date | number;

  constructor(json: any) {
    this.url = json.url;
    this.description = json.description;
    this.categories = json.categories || [];
    this.postedBy = json.postedBy;
    this.voteCount = json.voteCount;
    this.votes = json.votes;
    this.comments = json.comments;
    this.createdAt = json.createdAt;
    this.updatedAt = json.updatedAt;
  }
}
