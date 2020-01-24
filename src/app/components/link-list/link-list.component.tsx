import React from 'react';
import { RouteComponentProps, Link, withRouter } from 'react-router-dom';
import { Row, Menu, Dropdown, Icon, Button, Col } from 'antd';
import qs from 'qs';

import LinkItem from '../link-item/link-item.component';
import CustomButton from '../custom-button/custom-button.component';

import { firestore } from '../../firebase/firebase.service';
import { LINKS_PER_PAGE } from '../../utils/index';
import { ILink } from '../../interfaces/link.interface';
import { IQueryString, SortByType } from '../../interfaces/quert-string.interface';

import './link-list.styles.less';

// type Params = { page: string };

interface IProps extends RouteComponentProps<{}> {}

const LinkList: React.FC<IProps> = ({ history, location, match }) => {
  const [links, setLinks] = React.useState<ILink[]>([]);
  const [error, setError] = React.useState<string>('');
  const [cursor, setCursor] = React.useState<ILink | null>(null);
  const [totalLinks, setTotalLinks] = React.useState<number>();
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
  const [loadingButton, setLoadingButton] = React.useState<boolean>(false);

  const linkRef: firebase.firestore.CollectionReference = firestore.collection('links');

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

  let search: IQueryString = qs.parse(location.search, { ignoreQueryPrefix: true });

  React.useEffect(() => {
    const unsubscribe = getLinks().onSnapshot(handleSnapshot, handleError);
    return () => unsubscribe();
  }, [location.search]);

  const menu = () => (
    <Menu>
      {Object.keys(sortByMapping).map((sortby: any, index: number) => {
        return (
          <Menu.Item key={`${index}`}>
            <Link to={`${match.path}?sortby=${sortby}`} className="header-link">
              {sortByMapping[sortby].text}
            </Link>
          </Menu.Item>
        );
      })}
    </Menu>
  );

  const getTotalLinks = async () => {
    const snap: firebase.firestore.QuerySnapshot = await linkRef.get();
    setTotalLinks(snap.size);
  };

  const isLastPage = (): boolean => {
    return totalLinks === links.length;
  };

  const getLinks = () => {
    if (!search.sortby || search.sortby === 'recent') {
      return linkRef.orderBy('createdAt', 'desc');
    } else if (search.sortby === 'liked') {
      return linkRef.orderBy('voteCount', 'desc');
    } else {
      return linkRef.orderBy('createdAt', 'asc');
    }
  };

  const handleSnapshot = async (snapshot: firebase.firestore.QuerySnapshot) => {
    await getTotalLinks();
    setData(snapshot);
  };

  const setData = (snapshot: firebase.firestore.QuerySnapshot, isLoadMore = false): void => {
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
    setError(err.message || err.toString());
    setIsLoaded(true);
    setLoadingButton(false);
  };

  const loadMoreLinks = async (): Promise<any> => {
    if (cursor) {
      setLoadingButton(true);
      const snapshot: firebase.firestore.QuerySnapshot = await linkRef
        .orderBy('created', 'desc')
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
            Sort by{search.sortby && <span className="selected-filter">{`: ${sortByMapping[search.sortby].text}`}</span>}
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
