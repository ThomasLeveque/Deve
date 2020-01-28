import React from 'react';
import { RouteComponentProps, Link, withRouter } from 'react-router-dom';
import { Row, Menu, Dropdown, Icon, Button, Col } from 'antd';
import { useQueryParam, StringParam } from 'use-query-params';

import LinkItem from '../link-item/link-item.component';
import CustomButton from '../custom-button/custom-button.component';

import { firestore } from '../../firebase/firebase.service';
import { LINKS_PER_PAGE } from '../../utils/index';
import { ILink } from '../../interfaces/link.interface';

import './link-list.styles.less';

interface IProps extends RouteComponentProps<{}> {}

const LinkList: React.FC<IProps> = ({ history, location, match }) => {
  const [links, setLinks] = React.useState<ILink[]>([]);
  const [error, setError] = React.useState<string>('');
  const [cursor, setCursor] = React.useState<ILink | null>(null);
  const [totalLinks, setTotalLinks] = React.useState<number>();
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
  const [loadingButton, setLoadingButton] = React.useState<boolean>(false);

  const sortByMapping: any = {
    recent: {
      text: 'Most recent'
    },
    liked: {
      text: 'Most liked'
    },
    oldest: {
      text: 'Oldest'
    }
  };

  const [qsSortby, setQsSortby] = useQueryParam('sortby', StringParam);
  const [qsSearch] = useQueryParam('q', StringParam);
  const [qsCategory] = useQueryParam('category', StringParam);

  React.useEffect(() => {
    const unsubscribe = getQuery().onSnapshot(handleSnapshot, handleError);
    return () => unsubscribe();
  }, [location.search]);

  const menu = () => (
    <Menu>
      {Object.keys(sortByMapping).map((sortby: string, index: number) => {
        return (
          <Menu.Item key={`${index}`} onClick={() => setQsSortby(sortby)}>
            {sortByMapping[sortby].text}
          </Menu.Item>
        );
      })}
    </Menu>
  );

  const isLastPage = (): boolean => {
    return totalLinks === links.length;
  };

  const getQuery = (): firebase.firestore.Query => {
    let linkRef: firebase.firestore.Query = firestore.collection('links');

    if (qsSearch) {
      linkRef = linkRef.where('description', '==', qsSearch);
    }

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

  const handleSnapshot = async (snapshot: firebase.firestore.QuerySnapshot) => {
    setData(snapshot);
  };

  const setData = (snapshot: firebase.firestore.QuerySnapshot, isLoadMore = false): void => {
    setTotalLinks(snapshot.size);
    const links: ILink[] | any = snapshot.docs.map((doc: firebase.firestore.DocumentSnapshot) => {
      return {
        id: doc.id,
        ...doc.data()
      };
    });
    const cursor = links[links.length - 1];
    isLoadMore ? setLinks(prevLinks => [...prevLinks, ...links]) : setLinks(links);
    setCursor(cursor);
    setIsLoaded(true);
    setLoadingButton(false);
  };

  const handleError = (err: any) => {
    console.log(err.message || err.toString());
    setError(err.message || err.toString());
    setIsLoaded(true);
    setLoadingButton(false);
  };

  const loadMoreLinks = async (): Promise<any> => {
    if (cursor) {
      setLoadingButton(true);
      const snapshot: firebase.firestore.QuerySnapshot = await getQuery()
        .startAfter(cursor.createdAt)
        .limit(LINKS_PER_PAGE)
        .get();

      setData(snapshot, true);
    }
  };

  let linkListContent: JSX.Element;

  if (!isLoaded) {
    linkListContent = <div>Loading...</div>;
  } else if (error) {
    linkListContent = <p className="error-text">{error}</p>;
  } else {
    linkListContent = (
      <>
        <Row type="flex" gutter={[16, 16]}>
          {links.map((link: ILink, index: number) => (
            <Col key={link.id} span={8}>
              <LinkItem showCount={true} link={link} />
            </Col>
          ))}
        </Row>
        <CustomButton
          buttonType="secondary"
          text={isLastPage() ? 'No more links' : 'Load more'}
          loading={loadingButton}
          disabled={loadingButton || isLastPage()}
          onClick={loadMoreLinks}
          style={{ marginTop: 20 }}
          hasIcon
          iconType="reload"
        />
      </>
    );
  }

  return (
    <div className="link-list">
      <div className="link-list-top">
        <Dropdown overlay={menu} trigger={['click']}>
          <Button type="link">
            Sort by{qsSortby && <span className="selected-filter">{`: ${sortByMapping[qsSortby].text}`}</span>}
            <Icon type="down" />
          </Button>
        </Dropdown>
        <CustomButton text="Add a link" buttonType="primary" hasIcon iconType="plus" onClick={() => history.push('add')} />
      </div>
      {linkListContent}
    </div>
  );
};

export default withRouter(LinkList);
