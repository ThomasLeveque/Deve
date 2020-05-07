import React from 'react';

import AppRoutes from './app.routes';
import { AnimatePresence } from 'framer-motion';

import Header from './components/header/header.component';
import ProgressBar from './components/progress-bar/progress-bar.component';
import SearchModal from './components/search/search-modal/search-modal.component';
import FirstLoading from './components/first-loading/first-loading.component';

import { useCurrentUser } from './providers/current-user/current-user.provider';
import { useCategories } from './providers/categories/categories.provider';

import './app.styles.less';

const App = () => {
  const { currentUserLoaded } = useCurrentUser();
  const { categoriesLoaded } = useCategories();

  return (
    <div className="app">
      <Header />
      <ProgressBar isAnimating={!categoriesLoaded || !currentUserLoaded} />
      {(!categoriesLoaded || !currentUserLoaded) && <FirstLoading />}

      <main>{categoriesLoaded && currentUserLoaded && <AppRoutes />}</main>
      <SearchModal />
    </div>
  );
};

export default App;
