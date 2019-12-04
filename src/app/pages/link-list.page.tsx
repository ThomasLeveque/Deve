import React from 'react';
import { RouteComponentProps, match } from 'react-router-dom';
import useAsyncEffect from 'use-async-effect';

import FirebaseContext from '../firebase/firebase.context';
import LinkItem from '../components/link-item/link-item';
import { LINKS_PER_PAGE } from '../utils/index';
import { ILink } from '../interfaces/link.interface';

type Params = { page: string };

interface IProps extends RouteComponentProps<{}> {
  match: match<Params>;
}

const LinkListPage: React.FC<IProps> = ({ match, history, location }) => {
  const { firebase, _window } = React.useContext(FirebaseContext);

  const [links, setLinks] = React.useState<ILink[]>([]);
  const [error, setError] = React.useState<string>('');
  const [cursor, setCursor] = React.useState<ILink | null>(null);
  const [totalLinks, setTotalLinks] = React.useState<number>();
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
  const [loadingButton, setLoadingButton] = React.useState<boolean>(false);

  const isTopPage: any = location.pathname.includes('top');
  const isNewPage: any = location.pathname.includes('new');
  const linkRef: firebase.firestore.CollectionReference = firebase.db.collection('links');

  useAsyncEffect(
    async isMounted => {
      // _window.flash('Salut mon gars', 'error');
      if (!isMounted()) return;
      getLinks();
    },
    [isTopPage, isNewPage]
  );

  const getTotalLinks = async () => {
    const snap: firebase.firestore.QuerySnapshot = await linkRef.get();
    setTotalLinks(snap.size);
  };

  const isLastPage = (): boolean => {
    return totalLinks === links.length;
  };

  const getLinks = async () => {
    try {
      await getTotalLinks();

      if (isTopPage) {
        return linkRef
          .orderBy('voteCount', 'desc')
          .onSnapshot((snapshot: firebase.firestore.QuerySnapshot) => handleSnapshot(snapshot, true), handleError);
      } else if (isNewPage) {
        return linkRef
          .orderBy('created', 'desc')
          .limit(LINKS_PER_PAGE)
          .onSnapshot((snapshot: firebase.firestore.QuerySnapshot) => handleSnapshot(snapshot, true), handleError);
      }
    } catch (err) {
      setError(err.message || err.toString());
    }
  };

  const handleSnapshot = (snapshot: firebase.firestore.QuerySnapshot, isSwitchRoute = false) => {
    const links: ILink[] | any = snapshot.docs.map((doc: firebase.firestore.DocumentSnapshot) => {
      return {
        id: doc.id,
        ...doc.data()
      };
    });

    const cursor = links[links.length - 1];
    isSwitchRoute ? setLinks(links) : setLinks(prevLinks => [...prevLinks, ...links]);
    setCursor(cursor);
    setIsLoaded(true);
    setLoadingButton(false);
  };

  const handleError = (err: any) => {
    setError(err.message || err.toString());
    setIsLoaded(true);
    setLoadingButton(false);
  };

  const loadMoreLinks = async (): Promise<void> => {
    try {
      setLoadingButton(true);
      await getTotalLinks();

      linkRef
        .orderBy('created', 'desc')
        .startAfter(cursor.created)
        .limit(LINKS_PER_PAGE)
        .onSnapshot(handleSnapshot);
    } catch (err) {
      setError(err.message);
    }
  };

  let linkList: JSX.Element[] | JSX.Element = links.map((link: ILink, index: number) => (
    <LinkItem key={link.id} showCount={true} link={link} index={index + 1} />
  ));

  let loadMoreButton: JSX.Element = (
    <button
      type="button"
      disabled={loadingButton || isLastPage()}
      className={isLastPage() ? 'button disabled' : 'button pointer'}
      onClick={loadMoreLinks}
    >
      {isLastPage() ? 'No more links' : loadingButton ? 'Loading...' : 'Load more'}
    </button>
  );

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  return (
    <div>
      {linkList}
      {isNewPage && loadMoreButton}
    </div>
  );
};

export default LinkListPage;
