import CurrentUser from '../models/current-user.model';

export interface IComment {
  postedBy: CurrentUser;
  created: Date;
  text: string;
}
