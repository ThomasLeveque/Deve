import React from 'react';

import SearchInput from '../search-input/search-input.component';
import RefinementCategories from '../refinement-categories/refinement-categories.component';
import ClearRefinementCategories from '../clear-refinement-categories/clear-refinement-categories.component';

import './filter-bar.styles.less';

const FilterBar: React.FC = () => {


  return (
    <div className="filter-bar">
      <h4>Filter by search :</h4>
      <SearchInput />
      <h4>Filter by categories :</h4>
      <ClearRefinementCategories />
      <RefinementCategories attribute="category" />
    </div>
  );
};

export default FilterBar;
