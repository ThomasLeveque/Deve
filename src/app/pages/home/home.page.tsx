import React from 'react';
import { InstantSearch } from 'react-instantsearch-dom';
import { RouteComponentProps } from 'react-router-dom';

import { searchClient, indexName } from '../../algolia/algolia.config';
import LinkList from '../../components/link-list/link-list.component';
import FilterBar from '../../components/filter-bar/filter-bar.component';
import CustomButton from '../../components/custom-button/custom-button.component';
import SortBy from '../../components/sort-by/sort-by.component';
import LinkPagination from '../../components/link-pagination/link-pagination.component';

import './home.styles.less';

const HomePage: React.FC<RouteComponentProps> = ({ history }) => {
  return (
    <div className="home-page">
      <InstantSearch searchClient={searchClient} indexName={indexName}>
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
        <LinkPagination defaultRefinement={1} />
      </InstantSearch>
    </div>
  );
};

export default HomePage;
