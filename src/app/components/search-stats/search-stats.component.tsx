import React from 'react';
import { connectStats } from 'react-instantsearch-dom';
import { Spring } from 'react-spring/renderprops';

import './search-stats.styles.less';

interface ISearchStats {
  nbHits: number;
  processingTimeMS: number;
}

const SearchStats: React.FC<ISearchStats> = ({ processingTimeMS, nbHits }) => {
  return (
    <Spring to={{ number: nbHits }}>
      {props => (
        <h2>
          {Math.floor(props.number)} results found in {processingTimeMS}ms.
        </h2>
      )}
    </Spring>
  );
};

export default connectStats(SearchStats);
