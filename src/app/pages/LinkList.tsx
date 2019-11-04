import React from 'react';
import { RouteComponentProps, match } from 'react-router-dom';

import FirebaseContext from '../firebase/context';
import LinkItem from '../components/Link/LinkItem';
import { LINKS_PER_PAGE } from '../utils/index';
import { ILink } from '../interfaces/link';

type Params = { page: string };

interface IProps extends RouteComponentProps<{}> {
  match: match<Params>;
}

const LinkList: React.FC<IProps> = ({ match, history, location }) => {
  const { firebase } = React.useContext(FirebaseContext);

  const [links, setLinks] = React.useState<ILink[]>([]);
  const [cursor, setCursor] = React.useState<ILink | null>(null);
  const [totalLinks, setTotalLinks] = React.useState<number>();
  const [loadingPage, setLoadingPage] = React.useState<boolean>(false);
  const [loadingLinks, setLoadingLinks] = React.useState<boolean>(false);

  const isTopPage: any = location.pathname.includes('top');
  const isNewPage: any = location.pathname.includes('new');
  const linkRef: firebase.firestore.CollectionReference = firebase.db.collection(
    'links'
  );

  React.useEffect(() => {
    getLinks();
  }, [isTopPage, isNewPage]);

  const getTotalLinks = async () => {
    const snap: firebase.firestore.QuerySnapshot = await linkRef.get();
    setTotalLinks(snap.size);
  };

  const isLastPage = (): boolean => {
    return totalLinks === links.length;
  };

  const getLinks = async () => {
    setLoadingPage(true);
    try {
      await getTotalLinks();

      if (isTopPage) {
        return linkRef
          .orderBy('voteCount', 'desc')
          .onSnapshot(snapshot => handleSnapshot(snapshot, true));
      } else if (isNewPage) {
        return linkRef
          .orderBy('created', 'desc')
          .limit(LINKS_PER_PAGE)
          .onSnapshot(snapshot => handleSnapshot(snapshot, true));
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  const handleSnapshot = (
    snapshot: firebase.firestore.QuerySnapshot,
    isSwitchRoute = false
  ) => {
    const links: ILink[] = snapshot.docs.map((doc: any) => {
      return {
        id: doc.id,
        ...doc.data()
      };
    });

    const cursor = links[links.length - 1];
    isSwitchRoute
      ? setLinks(links)
      : setLinks(prevLinks => [...prevLinks, ...links]);
    setCursor(cursor);
    setLoadingPage(false);
    setLoadingLinks(false);
  };

  const loadMoreLinks = async (): Promise<void> => {
    try {
      setLoadingLinks(true);
      await getTotalLinks();

      linkRef
        .orderBy('created', 'desc')
        .startAfter(cursor.created)
        .limit(LINKS_PER_PAGE)
        .onSnapshot(handleSnapshot);
    } catch (err) {
      throw new Error(err);
    }
  };

  let linkList: JSX.Element[] | JSX.Element = links.map(
    (link: ILink, index: number) => (
      <LinkItem key={link.id} showCount={true} link={link} index={index + 1} />
    )
  );

  let loadMoreButton: JSX.Element = (
    <button
      type="button"
      disabled={loadingLinks || isLastPage()}
      className={isLastPage() ? 'button disabled' : 'button pointer'}
      onClick={loadMoreLinks}
    >
      {isLastPage()
        ? 'No more links'
        : loadingLinks
        ? 'Loading...'
        : 'Load more'}
    </button>
  );

  if (loadingPage) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {linkList}
      {isNewPage && loadMoreButton}
    </div>
  );
};

export default LinkList;
