import React, { createContext, useState, useEffect, memo, useContext } from 'react';
import { QuerySnapshot } from '@firebase/firestore-types';

import { firestore } from '../../firebase/firebase.service';
import Category from '../../models/category.model';
import NotifContext from '../../contexts/notif/notif.context';
import { CategoryMapping } from '../../interfaces/category-mapping.interface';

interface ICategoriesContext {
  categories: Category[];
  usedCategories: CategoryMapping;
  categoriesLoaded: boolean;
}

export const CategoriesContext = createContext<ICategoriesContext>({
  categories: [],
  usedCategories: {},
  categoriesLoaded: false
});

export const useCategories = () => useContext(CategoriesContext);

const CategoriesProvider: React.FC = memo(({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [usedCategories, setUsedCategories] = useState<CategoryMapping>({});
  const [categoriesLoaded, setCategoriesLoaded] = useState<boolean>(false);

  const { openNotification } = useContext(NotifContext);

  const handleSnapshot = (snapshot: QuerySnapshot) => {
    const usedCategories = snapshot.docs
      // Sort all categoriesNames by name
      .sort((a, b) => a.data().name.localeCompare(b.data().name))
      .reduce((acc, doc) => {
        const categoryData = doc.data() as Category;
        if (categoryData.count > 0) {
          acc[categoryData.name] = new Category(doc);
        }
        return acc;
      }, {} as CategoryMapping);

    const allCategories: Category[] = snapshot.docs.map(doc => new Category(doc));

    setCategories(allCategories);
    setUsedCategories(usedCategories);
    setCategoriesLoaded(true);
  };

  const handleError = (err: any) => {
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
        categoriesLoaded
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
});

export default CategoriesProvider;
