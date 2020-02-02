import React from 'react';
import { connectRefinementList } from 'react-instantsearch-dom';
import { RefinementListProvided, Hit } from 'react-instantsearch-core';

import './refinement-categories.styles.less';
import Tag from '../tag/tag.component';

const RefinementCategories: React.FC<RefinementListProvided> = ({ items, currentRefinement, refine, createURL }) => {
  return (
    <>
      {items.map((item: Hit<{ count: number; isRefined: boolean; label: string; value: string[] }>) => (
        <Tag
          isButton
          key={item.label}
          text={`${item.label} (${item.count})`}
          color={item.isRefined ? 'green' : 'black'}
          onClick={() => {
            refine(item.value);
          }}
        />
      ))}
    </>
  );
};

export default connectRefinementList(RefinementCategories);
