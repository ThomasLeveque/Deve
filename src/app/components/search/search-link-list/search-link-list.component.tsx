import React, { memo } from 'react';
import { Row, Col } from 'antd';
import { connectHits } from 'react-instantsearch-dom';
import { Hit } from 'react-instantsearch-core';

import SearchLinkPagination from '../search-link-pagination/search-link-pagination.component';
import SearchLinkItem from '../search-link-item/search-link-item.component';

import { SEARCH_ITEMS_PER_LIGNE } from '../../../utils/constants.util';
import { ALgoliaLink } from '../../../models/algolia-link.model';

import './search-link-list.styles.less';

interface IProps {
  hits: Hit<ALgoliaLink>[];
}

const SearchLinkList: React.FC<IProps> = memo(({ hits }) => {
  return (
    <div className="search-link-list">
      <Row gutter={[16, 16]}>
        {hits.map((link: Hit<ALgoliaLink>, index: number) => {
          return (
            <Col key={link.objectID} span={24 / SEARCH_ITEMS_PER_LIGNE}>
              <SearchLinkItem link={link} />
            </Col>
          );
        })}
      </Row>
      <SearchLinkPagination defaultRefinement={1} />
    </div>
  );
});

export default connectHits(SearchLinkList);
