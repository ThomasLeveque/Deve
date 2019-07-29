import React from 'react';
import { RouteComponentProps, match } from 'react-router-dom';
import axios from 'axios';

import FirebaseContext from '../../firebase/context';
import LinkItem from './LinkItem';
import { LINKS_PER_PAGE } from '../../utils/index';
import { ILink } from '../../interfaces/link';

type Params = { page: string };

interface IProps extends RouteComponentProps<{}> {
  match: match<Params>;
}

const LinkList: React.FC<IProps> = ({ match, history, location }) => {
  const { firebase } = React.useContext(FirebaseContext);

  const [links, setLinks] = React.useState<ILink[]>([]);
  const [firstLink, setFirstLink] = React.useState<ILink | null>(null);
  const [cursor, setCursor] = React.useState<ILink | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [totalLinks, setTotalLinks] = React.useState<number>();

  const isTopPage: any = location.pathname.includes('top');
  const isNewPage: any = location.pathname.includes('new');
  const page: number = Number(match.params.page);
  const linkRef: firebase.firestore.CollectionReference = firebase.db.collection('links');

  React.useEffect(() => {
    const unsubscribe = getLinks();
    return () => unsubscribe();
  }, [isTopPage, page]);

  const getLinks = () => {
    setLoading(true);
    console.log('getlinks', page);
    linkRef.get().then((snap: any) => {
      setTotalLinks(snap.size);
    });
    console.log(totalLinks);
    const hasCursor = Boolean(cursor);
    if (isTopPage) {
      return linkRef.orderBy('voteCount', 'desc').onSnapshot(handleSnapshot);
    } else if (page === 1) {
      console.log('page1');
      return linkRef
        .orderBy('created', 'desc')
        .limit(LINKS_PER_PAGE)
        .onSnapshot(handleSnapshot);
    } else if (hasCursor) {
      console.log('cursor');
      return linkRef
        .orderBy('created', 'desc')
        .startAfter(cursor.created)
        .limit(LINKS_PER_PAGE)
        .onSnapshot(handleSnapshot);
    } else if (totalLinks <= LINKS_PER_PAGE * page) {
      console.log('before', totalLinks);
      return linkRef
        .orderBy('created', 'desc')
        .limit(LINKS_PER_PAGE)
        .onSnapshot(handleSnapshot);
    } else {
      console.log('else');
      const offset = page * LINKS_PER_PAGE - LINKS_PER_PAGE;
      axios
        .get(
          `https://us-central1-hooks-news-9c4b2.cloudfunctions.net/linksPagination?offset=${offset}`
        )
        .then((response: any) => {
          const links = response.data;
          const lastLinks = links[links.length - 1];
          const firstLink = links[0];
          setFirstLink(firstLink);
          setLinks(links);
          setCursor(lastLinks);
          setLoading(false);
        });
      return () => {};
    }
  };

  const handleSnapshot = (snapshot: firebase.firestore.QuerySnapshot) => {
    const links: ILink[] = snapshot.docs.map((doc: any) => {
      return {
        id: doc.id,
        ...doc.data()
      };
    });
    console.log(page);
    const lastLink = links[links.length - 1];
    const firstLink = links[0];
    setFirstLink(firstLink);
    setLinks(links);
    setCursor(lastLink);
    setLoading(false);
  };

  const visitePreviousPage = (): void => {
    if (page > 1) {
      history.push(`/new/${page - 1}`);
    }
  };

  const visiteNextPage = (): void => {
    if (page < totalLinks / LINKS_PER_PAGE) {
      history.push(`/new/${page + 1}`);
    }
  };

  const pageIndex: number = page ? (page - 1) * LINKS_PER_PAGE + 1 : 1;

  let content: JSX.Element[] | JSX.Element = links.map(
    (link: ILink, index: number) => (
      <LinkItem
        key={link.id}
        showCount={true}
        link={link}
        index={index + pageIndex}
      />
    )
  );

  if (loading) {
    content = <p>Loading...</p>;
  }

  return (
    <div>
      {content}
      {isNewPage && (
        <div className="pagination">
          <div className="pointer mr2" onClick={visitePreviousPage}>
            Previous
          </div>
          <div className="pointer" onClick={visiteNextPage}>
            Next
          </div>
        </div>
      )}
    </div>
  );
};

export default LinkList;
