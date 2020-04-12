import React from 'react';

import AppRoutes from './app.routes';

import Header from './components/header/header.component';
import ProgressBar from './components/progress-bar/progress-bar.component';
import SearchLayout from './components/search-layout/search-layout.component';

import { useCurrentUser } from './providers/current-user/current-user.provider';
import { useCategories } from './providers/categories/categories.provider';
import { useSearch } from './providers/search/search.provider';

import './app.styles.less';

const App = () => {
  const { currentUserError, currentUserLoaded } = useCurrentUser();
  const { categoriesError, categoriesLoaded } = useCategories();
  const { firstSearchOpen } = useSearch();

  const renderRoutes = () => {
    if (currentUserError) {
      return <h2 className="error-text text-align-center">{currentUserError}</h2>;
    }

    if (categoriesError) {
      return <h2 className="error-text text-align-center">{categoriesError}</h2>;
    }

    if (categoriesLoaded && currentUserLoaded) {
      return <AppRoutes />;
    }

    return null;
  };

  return (
    <div className="app">
      <Header />
      <ProgressBar isAnimating={!categoriesLoaded || !currentUserLoaded} />
      <main>{renderRoutes()}</main>
      {firstSearchOpen && <SearchLayout />}
    </div>
  );
};

export default App;
