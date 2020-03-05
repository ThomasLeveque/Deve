import React, { useContext } from 'react';

import AppRoutes from './app.routes';
import Header from './components/header/header.component';
import ProgressBar from './components/progress-bar/progress-bar.component';
import { CurrentUserContext } from './providers/current-user/current-user.provider';
import { CategoriesContext } from './providers/categories/categories.provider';
import SearchLayout from './components/search-layout/search-layout.component';
import { SearchContext } from './providers/search/search.provider';

import './app.styles.less';

const App = () => {
  const { currentUserError, currentUserLoaded } = useContext(CurrentUserContext);
  const { categoriesError, categoriesLoaded } = useContext(CategoriesContext);
  const { firstSearchOpen } = useContext(SearchContext);

  const renderRoutes = () => {
    if (currentUserError) {
      return <p className="error-text">{currentUserError}</p>;
    }

    if (categoriesError) {
      return <p className="error-text">{categoriesError}</p>;
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
