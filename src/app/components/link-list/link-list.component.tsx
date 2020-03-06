import React, { useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { useQueryParam, StringParam } from 'use-query-params';

import LinkItem from '../link-item/link-item.component';
import { ITEMS_PER_LIGNE } from '../../utils';
import { Link } from '../../models/link.model';
import { firestore } from '../../firebase/firebase.service';
import Loading from '../loading/loading.component';
import CustomButton from '../custom-button/custom-button.component';
import { LINKS_PER_PAGE } from '../../utils/index';

import './link-list.styles.less';

interface IProps {}

const LinkList: React.FC<IProps> = () => {
  const [links, setLinks] = useState<Link[]>([]);
  const [cursor, setCursor] = React.useState<firebase.firestore.DocumentSnapshot>(null);
  const [totalLinks, setTotalLinks] = React.useState<number>();

  const [qsSortby] = useQueryParam('sortby', StringParam);
  const [qsCategory] = useQueryParam('category', StringParam);

  const isLastPage = (): boolean => {
    return totalLinks === links.length;
  };

  const getQuery = (): firebase.firestore.Query => {
    let linkRef: firebase.firestore.Query = firestore.collection('links');

    if (qsCategory) {
      linkRef = linkRef.where('category', '==', qsCategory);
    }

    if (!qsSortby || qsSortby === 'recent') {
      linkRef = linkRef.orderBy('createdAt', 'desc');
    } else if (qsSortby === 'liked') {
      linkRef = linkRef.orderBy('voteCount', 'desc');
    } else {
      linkRef = linkRef.orderBy('createdAt', 'asc');
    }

    return linkRef;
  };

  const loadMoreLinks = async (): Promise<any> => {
    if (cursor) {
      const snapshot: firebase.firestore.QuerySnapshot = await getQuery()
        .startAfter(cursor)
        .limit(LINKS_PER_PAGE)
        .get();

      const links: Link[] = snapshot.docs.map((doc: firebase.firestore.DocumentSnapshot) => new Link(doc));
      const _cursor = snapshot.docs[snapshot.docs.length - 1];

      setLinks(prevLinks => [...prevLinks, ...links]);
      setCursor(_cursor);
    }
  };

  useEffect(() => {
    const asyncEffect = async () => {
      const snapshot: firebase.firestore.QuerySnapshot = await getQuery()
        .limit(LINKS_PER_PAGE)
        .get();
      const links: Link[] = snapshot.docs.map((doc: firebase.firestore.DocumentSnapshot) => new Link(doc));
      const _cursor = snapshot.docs[snapshot.docs.length - 1];

      setCursor(_cursor);
      setLinks(links);
    };
    asyncEffect();
  }, [qsCategory, qsSortby]);

  if (links.length === 0) {
    return <Loading />;
  }

  return (
    <>
      <Row className="link-list" type="flex" gutter={[16, 16]}>
        {links.map((link: Link, index: number) => (
          <Col key={link.id} span={24 / ITEMS_PER_LIGNE}>
            <LinkItem link={link} index={index} />
          </Col>
        ))}
      </Row>
      <CustomButton buttonType="secondary" text="Load more" onClick={loadMoreLinks} style={{ marginTop: 20 }} hasIcon iconType="reload" />
    </>
  );
};

export default LinkList;
