import { DocumentSnapshot } from '@firebase/firestore-types';

export default class CurrentUser {
  id: string;
  displayName: string | null;
  email?: string | null;
  photoURL?: string | null;
  isAdmin?: boolean;
  createdAt?: number;
  updatedAt?: number;

  constructor(json: DocumentSnapshot) {
    const jsonData = json.data();

    this.id = json.id;
    this.displayName = jsonData?.displayName;
    this.email = jsonData?.email;
    this.photoURL = jsonData?.photoURL;
    this.isAdmin = jsonData?.isAdmin || false;
    this.createdAt = jsonData?.createdAt;
    this.updatedAt = jsonData?.updatedAt;
  }
}
