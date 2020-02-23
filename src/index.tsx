import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './app/app';
import CategoriesProvider from './app/providers/categories/categories.provider';
import CurrentUserProvider from './app/providers/current-user/current-user.provider';

import './index.less';

ReactDOM.render(
  <CategoriesProvider>
    <CurrentUserProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </CurrentUserProvider>
  </CategoriesProvider>,
  document.getElementById('root')
);
