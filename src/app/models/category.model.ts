import { DocumentSnapshot } from '@firebase/firestore-types';

export default class Category {
  id?: string;
  name: string;
  count: number;

  constructor(json: DocumentSnapshot) {
    const jsonData = json.data();

    this.id = json.id;
    this.name = jsonData.name;
    this.count = jsonData.count || 0;
  }
}
