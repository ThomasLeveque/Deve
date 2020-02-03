import React, { useState } from 'react';
import { InstantSearch } from 'react-instantsearch-dom';
import { RouteComponentProps } from 'react-router-dom';

import { urlToSearchState, searchStateToUrl, searchClient, indexName, createURL } from '../../algolia/algolia.service';
import LinkList from '../../components/link-list/link-list.component';
import FilterBar from '../../components/filter-bar/filter-bar.component';
import CustomButton from '../../components/custom-button/custom-button.component';
import SortBy from '../../components/sort-by/sort-by.component';

import './home.styles.less';

const HomePage: React.FC<RouteComponentProps> = ({ history, location }) => {
  const [searchState, setSearchState] = useState(urlToSearchState(location));

  const onSearchStateChange = (updatedSearchState: any) => {
    history.push(searchStateToUrl(updatedSearchState), updatedSearchState);

    setSearchState(updatedSearchState);
  };

  return (
    <div className="home-page">
      <InstantSearch
        searchClient={searchClient}
        indexName={indexName}
        searchState={searchState}
        onSearchStateChange={onSearchStateChange}
        createURL={createURL}
      >
        <FilterBar />
        <div className="home-page-top">
          <SortBy
            items={[
              { value: indexName, label: 'Most recent' },
              { value: `${indexName}_voteCount_desc`, label: 'Most liked' },
              { value: `${indexName}_createAt_asc`, label: 'Oldest' }
            ]}
            defaultRefinement={indexName}
          />
          <CustomButton text="Add a link" buttonType="primary" hasIcon iconType="plus" onClick={() => history.push('add')} />
        </div>
        <LinkList />
      </InstantSearch>
    </div>
  );
};

export default HomePage;
