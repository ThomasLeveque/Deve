import React from 'react';

import LinkList from '../../components/link-list/link-list.component';
import FilterBar from '../../components/filter-bar/filter-bar.component';

import './home.styles.less';

const HomePage = () => {
  return (
    <div className="home-page">
      <FilterBar />
      <LinkList />
    </div>
  );
};

export default HomePage;
