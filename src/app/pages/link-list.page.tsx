import React from 'react';
import { RouteComponentProps, match, NavLink } from 'react-router-dom';
import { Row, Menu, Dropdown, Icon, Button as AntdButton } from 'antd';

import FirebaseContext from '../firebase/firebase.context';
import LinkItem from '../components/link-item/link-item';
import { LINKS_PER_PAGE } from '../utils/index';
import { ILink } from '../interfaces/link.interface';
import Placeholder from '../components/placeholder/placeholder';
import Button from '../shared/components/button/button';

type Params = { page: string };

interface IProps extends RouteComponentProps<{}> {
  match: match<Params>;
}

const LinkListPage: React.FC<IProps> = ({ match, history, location }) => {
  const { firebase } = React.useContext(FirebaseContext);

  const [links, setLinks] = React.useState<ILink[]>([]);
  const [error, setError] = React.useState<string>('');
  const [cursor, setCursor] = React.useState<ILink | null>(null);
  const [totalLinks, setTotalLinks] = React.useState<number>();
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
  const [loadingButton, setLoadingButton] = React.useState<boolean>(false);

  const isTopPage: any = location.pathname.includes('top');
  const isNewPage: any = location.pathname.includes('new');
  const linkRef: firebase.firestore.CollectionReference = firebase.db.collection('links');

  React.useEffect(() => {
    const unsubscribe = getLinks().onSnapshot(handleSnapshot, handleError);
    return () => unsubscribe();
  }, [isTopPage, isNewPage]);

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <NavLink to="/new" className="header-link">
          Most recent
        </NavLink>
      </Menu.Item>
      <Menu.Item key="1">
        <NavLink to="/top" className="header-link">
          Most liked
        </NavLink>
      </Menu.Item>
      <Menu.Item key="3">
        <NavLink to="/last" className="header-link">
          Oldest
        </NavLink>
      </Menu.Item>
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
    if (isTopPage) {
      return linkRef.orderBy('voteCount', 'desc');
    } else if (isNewPage) {
      return linkRef.orderBy('created', 'desc').limit(LINKS_PER_PAGE);
    } else {
      return linkRef;
    }
  };

  const handleSnapshot = async (snapshot: firebase.firestore.QuerySnapshot) => {
    console.log('WTF SNAPSHOT');
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
        .startAfter(cursor.created)
        .limit(LINKS_PER_PAGE)
        .get();

      setData(snapshot, true);
    }
  };

  let linkList: JSX.Element[] | JSX.Element = links.map((link: ILink, index: number) => (
    <LinkItem key={link.id} showCount={true} link={link} />
  ));

  let linkListContent: JSX.Element;

  if (!isLoaded) {
    linkListContent = <div className="placeholder-page">Loading...</div>;
  } else if (error) {
    linkListContent = <p className="error-text">{error}</p>;
  } else {
    linkListContent = (
      <>
        <Row type="flex" gutter={[16, 16]}>
          {linkList}
        </Row>
        <Button
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
    <>
      <div className="top-link-list">
        <Dropdown overlay={menu} trigger={['click']}>
          <AntdButton type="link">
            Sort by <Icon type="down" />
          </AntdButton>
        </Dropdown>
        <Button text="Add a link" buttonType="primary" hasIcon iconType="plus" onClick={() => history.push('create')} />
      </div>
      {linkListContent}
    </>
  );
};

export default LinkListPage;
