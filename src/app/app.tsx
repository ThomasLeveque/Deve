import React from 'react';

import AppRoutes from './app.routes';

import Header from './components/header/header.component';
import ProgressBar from './components/progress-bar/progress-bar.component';
import SearchLayout from './components/search-layout/search-layout.component';
import FirstLoading from './components/first-loading/first-loading.component';

import { useCurrentUser } from './providers/current-user/current-user.provider';
import { useCategories } from './providers/categories/categories.provider';
import { useSearch } from './providers/search/search.provider';

import './app.styles.less';

const App = () => {
  const { currentUserLoaded } = useCurrentUser();
  const { categoriesLoaded } = useCategories();
  const { firstSearchOpen } = useSearch();

  return (
    <div className="app">
      <Header />
      <ProgressBar isAnimating={!categoriesLoaded || !currentUserLoaded} />
      {(!categoriesLoaded || !currentUserLoaded) && <FirstLoading />}
      <main>{categoriesLoaded && currentUserLoaded && <AppRoutes />}</main>
      {firstSearchOpen && <SearchLayout />}
    </div>
  );
};

export default App;
