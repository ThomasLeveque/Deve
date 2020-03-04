import React, { createContext, useState, useEffect } from 'react';

import { firestore } from '../../firebase/firebase.service';
import Category from '../../models/category.model';

interface ICategoriesContext {
  categories: Category[];
  usedCategories: Category[];
  totalUsedCategories: number;
  categoriesError: string | null;
  categoriesLoaded: boolean;
}

export const CategoriesContext = createContext<ICategoriesContext>({
  categories: [],
  usedCategories: [],
  totalUsedCategories: 0,
  categoriesError: null,
  categoriesLoaded: false
});

const CategoriesProvider: React.FC = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [usedCategories, setUsedCategories] = useState<Category[]>([]);
  const [totalUsedCategories, setTotalUsedCategories] = useState<number>(0);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [categoriesLoaded, setCategoriesLoaded] = useState<boolean>(false);

  const handleSnapshot = (snapshot: firebase.firestore.QuerySnapshot) => {
    const categories: Category[] = snapshot.docs.map((doc: firebase.firestore.DocumentSnapshot) => new Category(doc));
    setCategories(categories);
    setUsedCategories(categories.filter((category: Category) => category.count !== 0));
    setCategoriesLoaded(true);
  };

  const handleError = (err: any) => {
    setCategoriesError(err.message || err.toString());
    setCategoriesLoaded(true);
  };

  useEffect(() => {
    setTotalUsedCategories(
      usedCategories.reduce((acc: number, usedCategory: Category) => {
        acc += usedCategory.count;
        return acc;
      }, 0)
    );
  }, [usedCategories]);

  useEffect(() => {
    const unsubcribe = firestore.collection('categories').onSnapshot(handleSnapshot, handleError);
    return () => unsubcribe();
  }, []);

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        usedCategories,
        totalUsedCategories,
        categoriesError,
        categoriesLoaded
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export default CategoriesProvider;
