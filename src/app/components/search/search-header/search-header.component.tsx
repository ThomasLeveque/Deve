import React from 'react';

import SearchInput from '../search-input/search-input.component';
import SearchStats from '../search-stats/search-stats.component';

import { ReactComponent as AlgoliaLogo } from '../../../../assets/images/algolia-logo.svg';

import './search-header.styles.less';

const SearchHeader: React.FC = () => {
  return (
    <div className="search-header">
      <SearchStats />
      <AlgoliaLogo />
      <SearchInput />
    </div>
  );
};

export default SearchHeader;
