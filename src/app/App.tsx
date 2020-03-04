import React, { useContext, useState, useEffect } from 'react';

import AppRoutes from './app.routes';
import Header from './components/header/header.component';
import ProgressBar from './components/progress-bar/progress-bar.component';
import { CurrentUserContext } from './providers/current-user/current-user.provider';
import { CategoriesContext } from './providers/categories/categories.provider';
import SearchLayout from './components/search-layout/search-layout.component';

import './app.styles.less';

const App = () => {
  const { currentUserError, currentUserLoaded } = useContext(CurrentUserContext);
  const { categoriesError, categoriesLoaded } = useContext(CategoriesContext);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [firstSearchOpen, setFirstSearchOpen] = useState<boolean>(false);

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

  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.removeAttribute('style');
    }
  }, [searchOpen]);

  const handleSearchClicked = () => {
    setSearchOpen(prev => !prev);
    setFirstSearchOpen(true);
  };

  return (
    <div className="app">
      <Header searchOpen={searchOpen} searchClicked={handleSearchClicked} />
      <ProgressBar isAnimating={!categoriesLoaded || !currentUserLoaded} />
      <main>{renderRoutes()}</main>
      {firstSearchOpen && <SearchLayout searchOpen={searchOpen} searchClicked={handleSearchClicked} />}
    </div>
  );
};

export default App;
