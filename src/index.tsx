import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './app/app';
import CategoriesProvider from './app/providers/categories/categories.provider';
import CurrentUserProvider from './app/providers/current-user/current-user.provider';
import SearchProvider from './app/providers/search/search.provider';

import './index.less';

ReactDOM.render(
  <CategoriesProvider>
    <CurrentUserProvider>
      <SearchProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SearchProvider>
    </CurrentUserProvider>
  </CategoriesProvider>,
  document.getElementById('root')
);
