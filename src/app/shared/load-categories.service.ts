import React from 'react';
import firebase from '../firebase';
import { ICategory } from '../interfaces/link.interface';

const loadCategoriesService = () => {
  const [categories, setCategories] = React.useState<ICategory[]>([]);

  const handleSnapshot = (snapshot: firebase.firestore.QuerySnapshot) => {
    const categories: ICategory[] = snapshot.docs.map((doc: any) => {
      return {
        id: doc.id,
        ...doc.data()
      };
    });
    setCategories(categories);
  };

  React.useEffect(() => {
    const unsubcribe = firebase.db
      .collection('categories')
      .onSnapshot(handleSnapshot);
    return () => unsubcribe();
  }, []);

  return categories;
}

export default loadCategoriesService;
