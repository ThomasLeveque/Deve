import React, { createContext, useState, useEffect, memo, useContext } from 'react';

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

  const handleSnapshot = (snapshot: firebase.firestore.QuerySnapshot) => {
    const categories: CategoryMapping = {};
    snapshot.docs
      // Sort all categoriesNames by name
      .sort((a: firebase.firestore.DocumentSnapshot, b: firebase.firestore.DocumentSnapshot) => a.data().name.localeCompare(b.data().name))
      .map((doc: firebase.firestore.DocumentSnapshot) => {
        const categoryName = doc.data().name;
        categories[categoryName] = new Category(doc);
      });
    const allCategories: Category[] = Object.keys(categories).map((categoryName: string) => {
      // Save the category to send it to allCategories array
      const category = categories[categoryName];

      // Filter Categories object to keep only the usedCategories
      if (categories[categoryName].count === 0) {
        delete categories[categoryName];
      }
      return category;
    });

    setCategories(allCategories);
    setUsedCategories(categories);
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
