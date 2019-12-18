import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { notification } from 'antd';

import Header from './components/header/header';
import AppRoutes from './app.routes';
import { getAuthUser } from './shared/use-auth.service';
import { getCategories } from './shared/categories.service';
import firebase, { FirebaseContext } from './firebase';
import Layout from './components/layout/layout';
import ProgressBar from './components/bar/progress-bar';
import { NotifType } from './utils/index';

function App() {
  const { user, userError, userLoaded } = getAuthUser();
  const { categories, catError, catLoaded } = getCategories();

  const openNotification = (message: string, description: string, type: NotifType) => {
    notification[type]({
      message,
      description,
      duration: 4,
      className: `ant-notification-${type}`
    });
  };

  const renderContent = () => {
    if (userError) {
      return <p className="error-text">{userError}</p>;
    }

    if (catError) {
      return <p className="error-text">{catError}</p>;
    }

    if (catLoaded && userLoaded) {
      return <AppRoutes />;
    }
  };

  return (
    <BrowserRouter>
      <FirebaseContext.Provider value={{ user, firebase, categories, userLoaded, openNotification }}>
        <Header />
        <ProgressBar isAnimating={!catLoaded || !userLoaded} />
        <Layout>{renderContent()}</Layout>
      </FirebaseContext.Provider>
    </BrowserRouter>
  );
}

export default App;
