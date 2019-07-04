export interface firebaseSnapshot extends firebase.database.DataSnapshot {
  docs: any;
}

export interface FirebaseRef extends firebase.database.Reference {
  get(): any;
  delete(): any;
}
