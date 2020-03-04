import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';

import LinkItem from '../link-item/link-item.component';
import { ITEMS_PER_LIGNE } from '../../utils';

import './link-list.styles.less';
import { Link } from '../../models/link.model';
import { firestore } from '../../firebase/firebase.service';
import Loading from '../loading/loading.component';

interface IProps {}

const LinkList: React.FC<IProps> = () => {
  const [links, setLinks] = useState<Link[]>([]);

  useEffect(() => {
    const asyncEffect = async () => {
      const snapshot: firebase.firestore.QuerySnapshot = await firestore.collection('links').get();
      const links: Link[] = snapshot.docs.map((doc: firebase.firestore.DocumentSnapshot) => new Link(doc));
      setLinks(links);
    };
    asyncEffect();
  }, []);

  if (links.length === 0) {
    return <Loading />;
  }

  return (
    <Row className="link-list" type="flex" gutter={[16, 16]}>
      {links.map((link: Link, index: number) => (
        <Col key={link.id} span={24 / ITEMS_PER_LIGNE}>
          <LinkItem link={link} index={index} />
        </Col>
      ))}
    </Row>
  );
};

export default LinkList;
