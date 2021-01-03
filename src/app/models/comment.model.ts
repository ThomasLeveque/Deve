import CurrentUser from './current-user.model';
import { DocumentSnapshot } from '@firebase/firestore-types';

export class Comment {
  id?: string;
  postedBy: CurrentUser;
  createdAt: number;
  updatedAt: number;
  text: string;

  constructor(json: DocumentSnapshot) {
    const jsonData = json.data();

    this.id = json.id;
    this.postedBy = jsonData?.postedBy;
    this.createdAt = jsonData?.createdAt;
    this.updatedAt = jsonData?.updatedAt;
    this.text = jsonData?.text;
  }
}
