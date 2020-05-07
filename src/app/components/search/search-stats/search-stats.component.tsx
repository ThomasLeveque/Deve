import React from 'react';
import { connectStats } from 'react-instantsearch-dom';

interface ISearchStats {
  nbHits: number;
  processingTimeMS: number;
}

const SearchStats: React.FC<ISearchStats> = ({ processingTimeMS, nbHits }) => {
  return (
    <h2>
      {Math.floor(nbHits)} results found in {processingTimeMS}ms.
    </h2>
  );
};

export default connectStats(SearchStats);
