import React from 'react';

// Components
import RefinementCategories from '../refinement-categories/refinement-categories.component';
import ClearRefinementCategories from '../clear-refinement-categories/clear-refinement-categories.component';

import './search-filter-bar.styles.less';

const SearchFilterBar: React.FC = () => {
  return (
    <div className="search-filter-bar">
      <h4>Search by categories :</h4>
      <ClearRefinementCategories />
      <RefinementCategories attribute="categories" limit={99} />
    </div>
  );
};

export default SearchFilterBar;
