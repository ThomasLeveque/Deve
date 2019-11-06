import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Header from './components/header/header';
import AppRoutes from './app.routes';
import useAuth from './shared/use-auth.service';
import loadCategories from './shared/load-categories.service';
import firebase, { FirebaseContext } from './firebase';
import { ICategory } from './interfaces/link.interface';
import Layout from './components/layout/layout';

function App() {
  const user = useAuth();
  const categories: ICategory[] = loadCategories();

  return (
    <BrowserRouter>
      <FirebaseContext.Provider value={{ user, firebase, categories }}>
        <Header />
        <Layout>{categories.length ? <AppRoutes /> : <p>LOADING...</p>}</Layout>
      </FirebaseContext.Provider>
    </BrowserRouter>
  );
}

export default App;
