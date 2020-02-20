import React, { createContext, useState, useEffect } from 'react';

import { firestore } from '../../firebase/firebase.service';
import { ICategory } from '../../interfaces/category.interface';

interface ICategoriesContext {
  categories: ICategory[];
  categoriesError: string | null;
  categoriesLoaded: boolean;
}

export const CategoriesContext = createContext<ICategoriesContext>({
  categories: [],
  categoriesError: null,
  categoriesLoaded: false
});

const CategoriesProvider: React.FC = ({ children }) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [categoriesLoaded, setCategoriesLoaded] = useState<boolean>(false);

  const handleSnapshot = (snapshot: firebase.firestore.QuerySnapshot) => {
    const categories: ICategory[] | any = snapshot.docs.map((doc: firebase.firestore.DocumentSnapshot) => {
      return {
        id: doc.id,
        ...doc.data()
      };
    });
    setCategories(categories);
    setCategoriesLoaded(true);
  };

  const handleError = (err: any) => {
    setCategoriesError(err.message || err.toString());
    setCategoriesLoaded(true);
  };

  useEffect(() => {
    const unsubcribe = firestore.collection('categories').onSnapshot(handleSnapshot, handleError);
    return () => unsubcribe();
  }, []);

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        categoriesError,
        categoriesLoaded
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export default CategoriesProvider;
