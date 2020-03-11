import React, { useContext } from 'react';
import { Row, Col } from 'antd';

import LinkItem from '../link-item/link-item.component';
import { ITEMS_PER_LIGNE } from '../../utils';
import { Link } from '../../models/link.model';
import Loading from '../loading/loading.component';
import CustomButton from '../custom-button/custom-button.component';
import { LinksContext } from '../../providers/links/links.provider';

import './link-list.styles.less';

interface IProps {}

const LinkList: React.FC<IProps> = () => {
  const { links, linksLoaded, loadMoreLinks, loadingMoreLinks } = useContext(LinksContext)

  if (!linksLoaded) {
    return <Loading />;
  }

  return (
    <>
      <Row className="link-list" type="flex" gutter={[16, 16]}>
        {Object.keys(links).map((linkId: string, index: number) => {
          const link: Link = links[linkId];
          return (
            <Col key={link.id} span={24 / ITEMS_PER_LIGNE}>
              <LinkItem link={link} index={index} />
            </Col>
          );
        })}
      </Row>
      <CustomButton buttonType="secondary" text="Load more" loading={loadingMoreLinks} onClick={loadMoreLinks} style={{ marginTop: 20 }} hasIcon iconType="reload" />
    </>
  );
};

export default LinkList;
