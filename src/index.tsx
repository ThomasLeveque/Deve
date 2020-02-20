import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from './app/app';
import CategoriesProvider from './app/providers/categories/categories.provider';
import CurrentUserProvider from './app/providers/current-user/current-user.provider';

import './index.less';

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./firebase-messaging-sw.js')
    .then(function(registration) {
      console.log('Registration successful, scope is:', registration.scope);
    })
    .catch(function(err) {
      console.log('Service worker registration failed, error:', err);
    });
}

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
