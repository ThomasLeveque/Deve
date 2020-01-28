import * as functions from 'firebase-functions';
import * as algoliasearch from 'algoliasearch';

const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;

const client = algoliasearch(APP_ID, ADMIN_KEY);
const index = client.initIndex('dev_links');

export const addToIndex = functions.firestore.document('links/{link}').onCreate((snapshot: functions.firestore.DocumentSnapshot) => {
  const data = snapshot.data();
  const objectID = snapshot.id;

  return index.addObject({ ...data, objectID });
});

export const updateToIndex = functions.firestore.document('links/{link}').onUpdate(change => {
  const newdata = change.after.data();
  const objectID = change.after.id;

  return index.addObject({ ...newdata, objectID });
});

export const removeToIndex = functions.firestore
  .document('links/{link}')
  .onCreate((snapshot: functions.firestore.DocumentSnapshot) => index.deleteObject(snapshot.id));
