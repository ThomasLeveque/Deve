import React from 'react';
import { RouteComponentProps, match } from 'react-router-dom';

import FirebaseContext from '../../firebase/context';
import LinkItem from './LinkItem';
import { LINKS_PER_PAGE } from '../../utils/index';
import { ILink } from '../../interfaces/link';
import { firebaseSnapshot } from '../../interfaces/firebase';

type Params = { page: string };

interface IProps extends RouteComponentProps<{}> {
  match: match<Params>;
}

const LinkList: React.FC<IProps> = ({ match, history, location }) => {
  const { firebase } = React.useContext(FirebaseContext);

  const [links, setLinks] = React.useState<ILink[]>([]);
  const [cursor, setCursor] = React.useState<ILink | null>(null);
  
  const isTopPage: any = location.pathname.includes('top');
  const isNewPage: any = location.pathname.includes('new');
  const page: number = Number(match.params.page);

  React.useEffect(() => {
    const unsubscribe = getLinks();
    return () => unsubscribe();
  }, [isTopPage, page]);

  const getLinks = (): any => {
    const hasCursor = Boolean(cursor);
    if (isTopPage) {
      return firebase.db
        .collection('links')
        .orderBy('voteCount', 'desc')
        .onSnapshot(handleSnapshot);
    } else if (page === 1) {
      return firebase.db
        .collection('links')
        .orderBy('created', 'desc')
        .limit(LINKS_PER_PAGE)
        .onSnapshot(handleSnapshot);
    } else if (hasCursor) {
      return firebase.db
        .collection('links')
        .orderBy('created', 'desc')
        .startAfter(cursor.created)
        .limit(LINKS_PER_PAGE)
        .onSnapshot(handleSnapshot);
    }
  };

  const handleSnapshot = (snapshot: firebaseSnapshot) => {
    const links: ILink[] = snapshot.docs.map((doc: any) => {
      return {
        id: doc.id,
        ...doc.data()
      };
    });
    const lastLink = links[links.length - 1];
    setLinks(links);
    setCursor(lastLink);
  };

  const visitePreviousPage = (): void => {
    if (page > 1) {
      history.push(`/new/${page - 1}`);
    }
  };

  const visiteNextPage = (): void => {
    if (page <= links.length / LINKS_PER_PAGE) {
      history.push(`/new/${page + 1}`);
    }
  };

  const pageIndex: number = page ? (page - 1) * LINKS_PER_PAGE + 1 : 1;

  return (
    <div>
      {links.map((link: ILink, index: number) => (
        <LinkItem
          key={link.id}
          showCount={true}
          link={link}
          index={index + pageIndex}
        />
      ))}
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
}

export default LinkList;
