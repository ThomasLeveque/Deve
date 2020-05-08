export default class CurrentUser {
  id: string;
  displayName: string | null;
  email?: string | null;
  createdAt?: number;
  updatedAt?: number;

  constructor(json: firebase.firestore.DocumentSnapshot) {
    const jsonData = json.data();

    this.id = json.id;
    this.displayName = jsonData?.displayName;
    this.email = jsonData?.email;
    this.createdAt = jsonData?.createdAt;
    this.updatedAt = jsonData?.updatedAt;
  }
}
