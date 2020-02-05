import React from 'react';
import { connectPagination } from 'react-instantsearch-dom';
import { Pagination } from 'antd';

import './link-pagination.styles.less';

interface IProps {
  currentRefinement: number;
  nbPages: number;
  refine: (page: number) => void;
}

const PAGE_SIZE: number = 20;

const LinkPagination: React.FC<IProps> = ({ currentRefinement, nbPages, refine }) => {
  return (
    <div className="link-pagination">
      <Pagination
        current={currentRefinement}
        defaultCurrent={currentRefinement}
        defaultPageSize={PAGE_SIZE}
        total={nbPages * PAGE_SIZE}
        // hideOnSinglePage
        onChange={(page: number) => refine(page)}
      />
    </div>
  );
};

export default connectPagination(LinkPagination);
