import React from 'react';
import { Stats } from 'react-instantsearch-dom';

import SearchInput from '../search-input/search-input.component';
import { ReactComponent as AlgoliaLogo } from '../../../assets/images/algolia-logo.svg';

import './search-header.styles.less';

const SearchHeader = () => {
  return (
    <div className="search-header">
      <span className="H2">
        <Stats />
      </span>
      <AlgoliaLogo />
      <SearchInput />
    </div>
  );
};

export default SearchHeader;
