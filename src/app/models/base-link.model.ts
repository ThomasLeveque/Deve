import CurrentUser from './current-user.model';
import { IVote } from '../interfaces/vote.interface';

export class BaseLink {
  url: string;
  description: string;
  categories: string[];
  postedBy: CurrentUser;
  voteCount: number;
  commentCount: number;
  votes: IVote[];
  createdAt: number;
  updatedAt: number;

  constructor(json: any) {
    this.url = json?.url;
    this.description = json?.description;
    this.categories = json?.categories || [];
    this.postedBy = json?.postedBy;
    this.voteCount = json?.voteCount || 0;
    this.commentCount = json?.commentCount || 0;
    this.votes = json?.votes || [];
    this.createdAt = json?.createdAt;
    this.updatedAt = json?.updatedAt;
  }
}
