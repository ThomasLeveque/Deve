import React from 'react';
import { Row, Col } from 'antd';

import LinkItem from '../link-item/link-item.component';
import Loading from '../loading/loading.component';
import CustomButton from '../custom-button/custom-button.component';

import { ITEMS_PER_LIGNE } from '../../utils';
import { Link } from '../../models/link.model';
import { useLinks } from '../../providers/links/links.provider';

import './link-list.styles.less';

const LinkList: React.FC = () => {
  const { links, linksLoaded, loadMoreLinks, loadingMoreLinks, hasMoreLinks } = useLinks();
  if (!linksLoaded) {
    return <Loading />;
  }

  return (
    <div className="link-list">
      <Row type="flex" gutter={[16, 16]}>
        {Object.keys(links).map((linkId: string, index: number) => {
          const link: Link = links[linkId];
          return (
            <Col key={link.id} span={24 / ITEMS_PER_LIGNE}>
              <LinkItem link={link} index={index} />
            </Col>
          );
        })}
      </Row>
      <div className="load-more">
        <CustomButton
          buttonType="secondary"
          disabled={!hasMoreLinks}
          text={hasMoreLinks ? 'Load more' : 'No more links'}
          loading={loadingMoreLinks}
          onClick={loadMoreLinks}
          hasIcon
          iconType={hasMoreLinks ? 'reload' : 'close-circle'}
        />
      </div>
    </div>
  );
};

export default LinkList;
