import React, { createContext, useState, useEffect, memo, useContext } from 'react';
import { useQueryParam, StringParam, ArrayParam } from 'use-query-params';

import firebaseApp, { firestore } from '../../firebase/firebase.service';
import { LINKS_PER_PAGE } from '../../utils/constants.util';
import { Link } from '../../models/link.model';
import { ICreateLinkInitialState } from '../../interfaces/initial-states.type';
import Category from '../../models/category.model';
import CurrentUser from '../../models/current-user.model';
import { IVote } from '../../interfaces/vote.interface';
import NotifContext from '../../contexts/notif/notif.context';
import { Comment } from '../../models/comment.model';

interface LinksMap {
  [id: string]: Link;
}

type UpdateVoteLinksType = 'add' | 'remove';

interface ILinksContext {
  loadMoreLinks: () => Promise<any>;
  addLink: (values: ICreateLinkInitialState, categories: Category[], currentUser: CurrentUser) => Promise<void>;
  updateVoteLinks: (linkId: string, currentUser: CurrentUser, type: UpdateVoteLinksType) => Promise<void>;
  addCommentLink: (commentText: string, linkId: string, currentUser: CurrentUser) => Promise<void>;
  links: LinksMap;
  linksLoaded: boolean;
  loadingMoreLinks: boolean;
  hasMoreLinks: boolean;
}

export const LinksContext = createContext<ILinksContext>({
  loadMoreLinks: null,
  addLink: null,
  updateVoteLinks: null,
  addCommentLink: null,
  links: {},
  linksLoaded: false,
  loadingMoreLinks: false,
  hasMoreLinks: true
});

export const useLinks = () => useContext(LinksContext);

const LinksProvider: React.FC = memo(({ children }) => {
  const [links, setLinks] = useState<LinksMap>({});
  const [linksLoaded, setLinksLoaded] = useState<boolean>(false);
  const [loadingMoreLinks, setLoadingMoreLinks] = useState<boolean>(false);
  const [hasMoreLinks, setHasMoreLinks] = useState<boolean>(true);
  const [cursor, setCursor] = React.useState<firebase.firestore.DocumentSnapshot>(null);

  const [qsSortby] = useQueryParam<string>('sortby', StringParam);
  const [qsCategories] = useQueryParam<string[]>('categories', ArrayParam);

  const { openNotification } = useContext(NotifContext);

  const getQuery = (): firebase.firestore.Query => {
    let linkRef: any = firestore.collection('links');

    if (qsCategories?.length) {
      linkRef = linkRef.where('categories', 'array-contains-any', qsCategories);
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
    try {
      if (cursor) {
        setLoadingMoreLinks(true);
        const snapshot: firebase.firestore.QuerySnapshot = await getQuery()
          .startAfter(cursor)
          .limit(LINKS_PER_PAGE)
          .get();
        let links: { [id: string]: Link } = {};
        snapshot.docs.map((doc: firebase.firestore.DocumentSnapshot) => (links[doc.id] = new Link(doc)));
        const _cursor = snapshot.docs[snapshot.docs.length - 1];
        setHasMoreLinks(!snapshot.empty);
        setLoadingMoreLinks(false);
        setLinks(prevLinks => ({ ...prevLinks, ...links }));
        setCursor(_cursor);
      }
    } catch (err) {
      openNotification('Cannot load more links', 'Try to reload', 'error');
      console.error(err);
    }
  };

  const addLink = async (
    { url, description, categories }: ICreateLinkInitialState,
    allCategories: Category[],
    currentUser: CurrentUser
  ): Promise<void> => {
    try {
      const { id, displayName } = currentUser;
      const newLink: Link = {
        url,
        description,
        categories,
        postedBy: {
          id,
          displayName
        },
        voteCount: 0,
        commentCount: 0,
        votes: [],
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      // update count of every categories used for this link
      for (const category of categories) {
        const selectedCategory = allCategories.find((_category: Category) => _category.name === category);
        selectedCategory.count++;
        const categoryRef: firebase.firestore.DocumentReference = firestore.doc(`categories/${selectedCategory.id}`);
        await categoryRef.update('count', selectedCategory.count);
      }
      const linksRef: firebase.firestore.CollectionReference = firestore.collection('links');
      const linkRef = await linksRef.add(newLink);

      const linkSnapshot: firebase.firestore.DocumentSnapshot = await linkRef.get();
      const newLinkFromFirestore = new Link(linkSnapshot);
      setLinks(prevLinks => ({ [linkSnapshot.id]: newLinkFromFirestore, ...prevLinks }));
      openNotification(`Link have been added`, '', 'success');
    } catch (err) {
      openNotification('Cannot add this link', '', 'error');
      console.error(err);
    }
  };

  const addCommentLink = async (commentText: string, linkId: string, currentUser: CurrentUser) => {
    const linkRef: firebase.firestore.DocumentReference = firestore.collection('links').doc(linkId);
    const commentsRef: firebase.firestore.CollectionReference = linkRef.collection('comments');

    const increment = 1;
    const newComment: Comment = {
      postedBy: { id: currentUser.id, displayName: currentUser.displayName },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      text: commentText
    };
    await commentsRef.add(newComment);
    const incrementCommentCount = firebaseApp.firestore.FieldValue.increment(increment);

    if (links[linkId]) {
      links[linkId].commentCount += increment;
      setLinks({ ...links });
    }

    try {
      linkRef.update({ commentCount: incrementCommentCount });
    } catch (err) {
      if (links[linkId]) {
        links[linkId].commentCount -= increment;
        setLinks({ ...links });
      }
      openNotification(`Cannot add comment for this link`, '', 'error');
      console.error(err);
    }
  };

  const updateVoteLinks = async (linkId: string, currentUser: CurrentUser, type: UpdateVoteLinksType) => {
    const voteRef: firebase.firestore.DocumentReference = firestore.collection('links').doc(linkId);
    const doc: firebase.firestore.DocumentSnapshot = await voteRef.get();
    const previousVotes: IVote[] = doc.data().votes;
    const { id, displayName } = currentUser;
    const vote: IVote = {
      voteBy: { id, displayName }
    };
    let updatedVotes: IVote[];
    if (type === 'add') {
      updatedVotes = [...previousVotes, vote];
    } else {
      updatedVotes = previousVotes.filter((vote: IVote) => vote.voteBy.id !== currentUser.id);
    }
    const voteCount = updatedVotes.length;

    if (links[linkId]) {
      links[linkId].votes = updatedVotes;
      links[linkId].voteCount = voteCount;
      setLinks({ ...links });
    }
    try {
      voteRef.update({ votes: updatedVotes, voteCount });
    } catch (err) {
      if (links[linkId]) {
        links[linkId].votes = previousVotes;
        links[linkId].voteCount = previousVotes.length;
        setLinks({ ...links });
      }
      openNotification(`Cannot add vote for this link`, '', 'error');
      console.error(err);
    }
  };

  useEffect(() => {
    const asyncEffect = async () => {
      try {
        setLinksLoaded(false);
        const snapshot: firebase.firestore.QuerySnapshot = await getQuery()
          .limit(LINKS_PER_PAGE)
          .get();
        let links: LinksMap = {};
        snapshot.docs.map((doc: firebase.firestore.DocumentSnapshot) => (links[doc.id] = new Link(doc)));
        const _cursor = snapshot.docs[snapshot.docs.length - 1];
        setHasMoreLinks(!snapshot.empty);
        setLinksLoaded(true);
        setCursor(_cursor);
        setLinks(links);
      } catch (err) {
        openNotification('Cannot load links', 'Try to reload', 'error');
        console.error(err);
      }
    };
    asyncEffect();
  }, [qsCategories, qsSortby]);

  return (
    <LinksContext.Provider
      value={{ loadMoreLinks, links, linksLoaded, loadingMoreLinks, hasMoreLinks, addLink, updateVoteLinks, addCommentLink }}
    >
      {children}
    </LinksContext.Provider>
  );
});

export default LinksProvider;
