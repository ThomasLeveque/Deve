import React from 'react';

import firebase from '../firebase';
import { ICategory } from '../interfaces/link.interface';

const getCategories = (): { categories: ICategory[]; catError: string; catLoaded: boolean } => {
  const [categories, setCategories] = React.useState<ICategory[]>([]);
  const [catError, setCatError] = React.useState<string>('');
  const [catLoaded, setCatLoaded] = React.useState<boolean>(false);

  const handleSnapshot = (snapshot: firebase.firestore.QuerySnapshot) => {
    const categories: ICategory[] | any = snapshot.docs.map((doc: firebase.firestore.DocumentSnapshot) => {
      return {
        id: doc.id,
        ...doc.data()
      };
    });
    setCategories(categories);
    setCatLoaded(true);
  };

  const handleError = (err: any) => {
    setCatError(err.message || err.toString());
    setCatLoaded(true);
  };

  React.useEffect(() => {
    const unsubcribe = firebase.db.collection('categories').onSnapshot(handleSnapshot, handleError);
    return () => unsubcribe();
  }, []);

  return { categories, catError, catLoaded };
};

export { getCategories };
