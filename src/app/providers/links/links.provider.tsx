import React, { createContext, useState, useEffect, memo } from 'react';
import { useQueryParam, StringParam } from 'use-query-params';

import { firestore } from '../../firebase/firebase.service';
import { LINKS_PER_PAGE } from '../../utils';
import { Link } from '../../models/link.model';

interface ILinks {
  [id: string]: Link;
}

interface ILinksContext {
  loadMoreLinks: () => void;
  links: ILinks;
  linksLoaded: boolean;
  loadingMoreLinks: boolean;
}

export const LinksContext = createContext<ILinksContext>({
  loadMoreLinks: null,
  links: {},
  linksLoaded: false,
  loadingMoreLinks: false
});

const LinksProvider: React.FC = memo(({ children }) => {
  const [links, setLinks] = useState<ILinks>({});
  const [linksLoaded, setLinksLoaded] = useState<boolean>(false);
  const [loadingMoreLinks, setLoadingMoreLinks] = useState<boolean>(false);
  const [cursor, setCursor] = React.useState<firebase.firestore.DocumentSnapshot>(null);

  const [qsSortby] = useQueryParam('sortby', StringParam);
  const [qsCategory] = useQueryParam('category', StringParam);

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
      setLoadingMoreLinks(true);
      const snapshot: firebase.firestore.QuerySnapshot = await getQuery()
        .startAfter(cursor)
        .limit(LINKS_PER_PAGE)
        .get();
      let links: { [id: string]: Link } = {};
      snapshot.docs.map((doc: firebase.firestore.DocumentSnapshot) => (links[doc.id] = new Link(doc)));
      const _cursor = snapshot.docs[snapshot.docs.length - 1];
      setLoadingMoreLinks(false);
      setLinks(prevLinks => ({ ...prevLinks, ...links }));
      setCursor(_cursor);
    }
  };

  useEffect(() => {
    const asyncEffect = async () => {
      setLinksLoaded(false);
      const snapshot: firebase.firestore.QuerySnapshot = await getQuery()
        .limit(LINKS_PER_PAGE)
        .get();
      let links: { [id: string]: Link } = {};
      snapshot.docs.map((doc: firebase.firestore.DocumentSnapshot) => (links[doc.id] = new Link(doc)));

      const _cursor = snapshot.docs[snapshot.docs.length - 1];
      setLinksLoaded(true);
      setCursor(_cursor);
      setLinks(links);
    };
    asyncEffect();
  }, [qsCategory, qsSortby]);

  return <LinksContext.Provider value={{ loadMoreLinks, links, linksLoaded, loadingMoreLinks }}>{children}</LinksContext.Provider>;
});

export default LinksProvider;
