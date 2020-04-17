import React, { createContext, useState, useEffect, memo, useContext } from 'react';

import { firestore } from '../../firebase/firebase.service';
import Category from '../../models/category.model';
import { formatError } from '../../utils/format-string.util';
import NotifContext from '../../contexts/notif/notif.context';

interface ICategoriesContext {
  categories: Category[];
  usedCategories: Category[];
  categoriesError: string | null;
  categoriesLoaded: boolean;
}

export const CategoriesContext = createContext<ICategoriesContext>({
  categories: [],
  usedCategories: [],
  categoriesError: null,
  categoriesLoaded: false
});

export const useCategories = () => useContext(CategoriesContext);

const CategoriesProvider: React.FC = memo(({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [usedCategories, setUsedCategories] = useState<Category[]>([]);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [categoriesLoaded, setCategoriesLoaded] = useState<boolean>(false);

  const { openNotification } = useContext(NotifContext);

  const handleSnapshot = (snapshot: firebase.firestore.QuerySnapshot) => {
    const categories: Category[] = snapshot.docs.map((doc: firebase.firestore.DocumentSnapshot) => new Category(doc));
    setCategories(categories);
    setUsedCategories(categories.filter((category: Category) => category.count !== 0));
    setCategoriesLoaded(true);
  };

  const handleError = (err: any) => {
    setCategoriesError(formatError(err));
    console.error(err);
    openNotification('Cannot get categories', 'Try to reload', 'error');
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
        usedCategories,
        categoriesError,
        categoriesLoaded
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
});

export default CategoriesProvider;
