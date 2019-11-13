import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Header from './components/header/header';
import AppRoutes from './app.routes';
import useAuth from './shared/use-auth.service';
import loadCategories from './shared/load-categories.service';
import firebase, { FirebaseContext } from './firebase';
import { ICategory } from './interfaces/link.interface';
import Layout from './components/layout/layout';
import Flash, { FlashType } from './components/flash/flash';
import Bus from './utils/bus';

declare global {
  interface MyWindow extends Window {
    flash: any;
  }
}

function App() {
  const user = useAuth();
  const categories: ICategory[] = loadCategories();

  const _window = window as MyWindow & typeof globalThis;

  _window.flash = (message: string, type: FlashType = 'success') =>
    Bus.emit('flash', { message, type });

  return (
    <BrowserRouter>
      <Flash />
      <FirebaseContext.Provider value={{ user, firebase, categories, _window }}>
        <Header />
        <Layout>{categories.length ? <AppRoutes /> : <p>LOADING...</p>}</Layout>
      </FirebaseContext.Provider>
    </BrowserRouter>
  );
}

export default App;
