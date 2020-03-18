import React from 'react';
import { connectCurrentRefinements } from 'react-instantsearch-dom';

import '../tag/tag.styles.less';

const ClearRefinementsCategories: React.FC<any> = ({ items, refine }) => {
  const handleClear = () => {
    if (!items.length) return;
    refine(items);
  };

  return (
    <span onClick={handleClear} className={`tag tag-${!items.length ? 'green' : 'black'} ${items.length ? 'pointer' : ''}`}>
      All
    </span>
  );
};

export default connectCurrentRefinements(ClearRefinementsCategories);
