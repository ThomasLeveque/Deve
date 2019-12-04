import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Header from './components/header/header';
import AppRoutes from './app.routes';
import { getAuthUser } from './shared/use-auth.service';
import { getCategories } from './shared/categories.service';
import firebase, { FirebaseContext } from './firebase';
import Layout from './components/layout/layout';
import Flash, { FlashType } from './components/flash/flash';
import Bus from './utils/bus';

declare global {
  interface MyWindow extends Window {
    flash: any;
  }
}

function App() {
  const { user, userError, userLoaded } = getAuthUser();
  const { categories, catError, catLoaded } = getCategories();

  const _window = window as MyWindow & typeof globalThis;

  _window.flash = (message: string, type: FlashType = 'success') => Bus.emit('flash', { message, type });

  const renderContent = () => {
    if (!catLoaded) {
      return <p>LOADING...</p>;
    }

    if (userError) {
      return <p className="error-text">{userError}</p>;
    }

    if (catError) {
      return <p className="error-text">{catError}</p>;
    }

    return <AppRoutes />;
  };

  return (
    <BrowserRouter>
      <Flash />
      <FirebaseContext.Provider value={{ user, firebase, categories, _window, userLoaded }}>
        <Header />
        <Layout>{renderContent()}</Layout>
      </FirebaseContext.Provider>
    </BrowserRouter>
  );
}

export default App;
