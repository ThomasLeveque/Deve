import React from 'react';
import { Row, Col } from 'antd';
import { connectHits } from 'react-instantsearch-dom';
import { Hit } from 'react-instantsearch-core';

import LinkItem from '../link-item/link-item.component';
import { ILink } from '../../interfaces/link.interface';

import './link-list.styles.less';

interface IProps {
  hits: Hit<ILink>[];
}

const LinkList: React.FC<IProps> = ({ hits }) => {
  return (
    <Row className="link-list" type="flex" gutter={[16, 16]}>
      {hits.map((link: ILink, index: number) => (
        <Col key={link.objectID} span={8}>
          <LinkItem showCount={true} link={link} animationDelay={index} />
        </Col>
      ))}
    </Row>
  );
};

export default connectHits(LinkList);
