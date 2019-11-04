import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Header from './components/Header';
import Routes from './Routes';
import useAuth from './components/Auth/useAuth';
import loadCategories from './components/Category/loadCategories';
import firebase, { FirebaseContext } from './firebase';
import { ICategory } from './interfaces/link';

function App() {
  const user = useAuth();
  const categories: ICategory[] = loadCategories();

  return (
    <BrowserRouter>
      <FirebaseContext.Provider value={{ user, firebase, categories }}>
        <div className="app-container">
          <Header />
          {categories.length ? <Routes /> : <p>LOADING...</p>}
        </div>
      </FirebaseContext.Provider>
    </BrowserRouter>
  );
}

export default App;
